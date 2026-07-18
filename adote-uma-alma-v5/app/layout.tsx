import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Adote uma Alma | Igreja Internacional Geração Profética",
    template: "%s | Adote uma Alma",
  },
  description:
    "Ajude alguém a participar do Encontro com Deus Redenção. Apadrinhe uma alma através de oração, recursos e amor.",
  keywords: [
    "Adote uma Alma",
    "Encontro com Deus Redenção",
    "Igreja Internacional Geração Profética",
    "apadrinhamento espiritual",
  ],
  openGraph: {
    title: "Adote uma Alma",
    description: "Ajude alguém a participar do Encontro com Deus Redenção.",
    url: siteUrl,
    siteName: "Adote uma Alma",
    locale: "pt_PT",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Adote uma Alma",
    description: "Ajude alguém a participar do Encontro com Deus Redenção.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" className={inter.variable}>
      <body className="flex min-h-screen flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-brand-700 focus:px-4 focus:py-2 focus:text-white"
        >
          Saltar para o conteúdo principal
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
