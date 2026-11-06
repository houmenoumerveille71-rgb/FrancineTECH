import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

export async function GET() {
  let settings = await prisma.siteSettings.findFirst();
  if (!settings) {
    settings = await prisma.siteSettings.create({ data: {} });
  }
  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    let settings = await prisma.siteSettings.findFirst();
    if (!settings) {
      settings = await prisma.siteSettings.create({ data: body });
    } else {
      settings = await prisma.siteSettings.update({ where: { id: settings.id }, data: body });
    }
    return NextResponse.json(settings);
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur" }, { status: 400 });
  }
}
