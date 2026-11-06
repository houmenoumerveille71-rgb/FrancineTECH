import type { Metadata } from "next";
import "./globals.css";
import ShootingStarBorder from "@/components/ShootingStarBorder";

export const metadata: Metadata = {
  title: "Françine Tech — Développeuse Web & Mobile",
  description:
    "Portfolio de Françine Houmenou, développeuse web et mobile. Création de sites web, boutiques e-commerce et applications mobiles.",
  keywords: ["développeuse web", "développeuse mobile", "Next.js", "React", "Françine Tech"],
  openGraph: {
    title: "Françine Tech — Développeuse Web & Mobile",
    description: "Portfolio de Françine Houmenou, développeuse web et mobile.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ShootingStarBorder />
        {children}
      </body>
    </html>
  );
}