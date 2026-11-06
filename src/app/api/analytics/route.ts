import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";
import { z } from "zod";

const schema = z.object({
  type: z.string().min(1),
  path: z.string().optional(),
  meta: z.string().optional(),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`analytics:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Trop de requêtes" }, { status: 429 });
  }
  try {
    const body = await request.json();
    const data = schema.parse(body);
    await prisma.analyticsEvent.create({ data });
    return NextResponse.json({ success: true });
  } catch (e: unknown) {
    return NextResponse.json({ error: (e as { message?: string })?.message || "Erreur" }, { status: 400 });
  }
}
