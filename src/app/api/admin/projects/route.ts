import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getCookieName, verifySessionToken } from "@/lib/auth";

async function isAuthed() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  return verifySessionToken(token);
}

export async function GET() {
  if (!(await isAuthed())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  if (!(await isAuthed())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const category = String(body?.category ?? "").trim();
    const title = String(body?.title ?? "").trim();
    const description = String(body?.description ?? "").trim();
    const tech = String(body?.tech ?? "").trim();
    if (!category || !title || !description || !tech) {
      return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
    }
    const project = await prisma.project.create({ data: { category, title, description, tech } });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
