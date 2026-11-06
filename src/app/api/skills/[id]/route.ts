import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1).optional(),
  level: z.number().int().min(0).max(100).optional(),
  order: z.number().int().optional(),
});

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) return NextResponse.json({ error: "Id invalide" }, { status: 400 });
  try {
    const body = await request.json();
    const data = schema.parse(body);
    const updated = await prisma.skill.update({ where: { id: numId }, data });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) return NextResponse.json({ error: "Id invalide" }, { status: 400 });
  try {
    await prisma.skill.delete({ where: { id: numId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}
