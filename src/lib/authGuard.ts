import { cookies } from "next/headers";
import { getCookieName, verifySessionToken } from "@/lib/auth";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (!verifySessionToken(token)) {
    return false;
  }
  return true;
}
