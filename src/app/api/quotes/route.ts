import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { rateLimit } from "@/lib/rateLimit";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  fullName: z.string().min(1),
  company: z.string().optional().nullable(),
  email: z.string().email(),
  phone: z.string().optional().nullable(),
  projectType: z.string().min(1),
  budget: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  description: z.string().min(1),
  website: z.string().optional(), // honeypot
});

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const quotes = await prisma.quoteRequest.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(quotes);
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`quote:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }
  try {
    const body = await request.json();
    const data = schema.parse(body);
    if (data.website) {
      // honeypot triggered
      return NextResponse.json({ success: true });
    }
    const created = await prisma.quoteRequest.create({
      data: {
        fullName: data.fullName,
        company: data.company || null,
        email: data.email,
        phone: data.phone || null,
        projectType: data.projectType,
        budget: data.budget || null,
        deadline: data.deadline || null,
        description: data.description,
      },
    });

    // notification email to admin
    await sendEmail(
      process.env.EMAIL_FROM || "francinehoumenou@gmail.com",
      "Nouvelle demande de devis",
      `<p><strong>${data.fullName}</strong> (${data.email}) a envoyé une demande de devis.</p><p>${data.description}</p>`
    );
    // ack to client
    await sendEmail(
      data.email,
      "Accusé de réception - Françine Tech",
      `<p>Bonjour ${data.fullName},</p><p>Nous avons bien reçu votre demande. Nous vous répondrons rapidement.</p>`
    );

    return NextResponse.json({ success: true, id: created.id }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur" }, { status: 400 });
  }
}
