import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.AUTH_SECRET || "dev-secret-change-me";
const COOKIE_NAME = "ft_admin_session";

export function getCookieName() {
  return COOKIE_NAME;
}

export function createSessionToken(): string {
  const payload = `${Date.now()}.${Math.random().toString(36).slice(2)}`;
  const sig = createHmac("sha256", SECRET).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [ts, rnd, sig] = parts;
  const expected = createHmac("sha256", SECRET).update(`${ts}.${rnd}`).digest("hex");
  try {
    if (!timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"))) return false;
  } catch {
    return false;
  }
  const age = Date.now() - Number(ts);
  if (!Number.isFinite(age) || age < 0 || age > 7 * 24 * 60 * 60 * 1000) return false;
  return true;
}

export function checkPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
