import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1),
  level: z.number().int().min(0).max(100).optional(),
  order: z.number().int().optional(),
});

export async function GET() {
  const skills = await prisma.skill.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(skills);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const created = await prisma.skill.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur" }, { status: 400 });
  }
}
