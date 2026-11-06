import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { checkPassword, createSessionToken, getCookieName } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = String(body?.password ?? "");
    if (!checkPassword(password)) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 });
    }
    const token = createSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(getCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }
}
