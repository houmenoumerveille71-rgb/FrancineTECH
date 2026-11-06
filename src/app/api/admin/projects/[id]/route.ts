import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCookieName, verifySessionToken } from "@/lib/auth";

async function isAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  return verifySessionToken(token);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) return NextResponse.json({ error: "Id invalide" }, { status: 400 });
  try {
    const body = await request.json();
    const data: Record<string, string> = {};
    for (const key of ["category", "title", "description", "tech"] as const) {
      if (body?.[key] !== undefined) data[key] = String(body[key]).trim();
    }
    const project = await prisma.project.update({ where: { id: numId }, data });
    return NextResponse.json(project);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const numId = Number(id);
  if (!Number.isInteger(numId)) return NextResponse.json({ error: "Id invalide" }, { status: 400 });
  try {
    await prisma.project.delete({ where: { id: numId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
