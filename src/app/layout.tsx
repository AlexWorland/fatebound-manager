import type { Metadata } from "next";
import Navigation from "@/components/ui/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Fatebound Manager",
  description: "Character manager for The Fatebound homebrew D&D 5e class",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-bg-deep text-text-primary font-body antialiased">
        <Navigation />
        <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
