import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/authGuard";

export async function GET() {
  if (!(await requireAdmin())) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const [projects, publishedProjects, messages, unreadMessages, quotes, newQuotes, visits] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.quoteRequest.count(),
    prisma.quoteRequest.count({ where: { status: "Nouveau" } }),
    prisma.analyticsEvent.count({ where: { type: "page_view" } }),
  ]);
  return NextResponse.json({
    projects,
    publishedProjects,
    messages,
    unreadMessages,
    quotes,
    newQuotes,
    visits,
  });
}
