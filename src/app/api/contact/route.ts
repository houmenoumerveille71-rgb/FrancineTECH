import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { sendEmail } from "@/lib/email";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`contact:${ip}`, 10, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }
  try {
    const body = await request.json();
    const data = schema.parse(body);
    if (data.website) return NextResponse.json({ success: true });
    const saved = await prisma.contactMessage.create({
      data: { name: data.name, email: data.email, message: data.message },
    });
    await sendEmail(
      process.env.EMAIL_FROM || "francinehoumenou@gmail.com",
      "Nouveau message de contact",
      `<p><strong>${data.name}</strong> (${data.email})</p><p>${data.message}</p>`
    );
    await sendEmail(
      data.email,
      "Accusé de réception - Françine Tech",
      `<p>Bonjour ${data.name},</p><p>Nous avons bien reçu votre message.</p>`
    );
    return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur serveur" }, { status: 400 });
  }
}
