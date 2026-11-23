import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { FilterProvider } from "@/context/FilterContext";
import Footer from "@/components/Footer";
import DemoBanner from "@/components/DemoBanner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hållbarhet",
  description: "Dashboard för hållbarhetsdata",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className={inter.className}>
      <body className="min-h-screen" style={{ background: "var(--color-bg)" }}>
        <DemoBanner />
        <FilterProvider>
          {children}
          <Footer />
        </FilterProvider>
      </body>
    </html>
  );
}
