import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { z } from "zod";

const schema = z.object({
  number: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: z.string().optional().nullable(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(services);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const created = await prisma.service.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur" }, { status: 400 });
  }
}
