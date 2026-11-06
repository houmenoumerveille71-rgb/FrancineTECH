import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCookieName, verifySessionToken } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get(getCookieName())?.value;
  if (!verifySessionToken(token)) {
    redirect("/login");
  }
  return <>{children}</>;
}
