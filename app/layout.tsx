import type { Metadata } from "next";
import { Playfair_Display, Dancing_Script, Outfit } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dancing = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-dancing",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Desert Glow Medical Aesthetics & Wellness | Palm Desert, CA",
  description:
    "Premium medical aesthetics and wellness services in Palm Desert, CA. Botox, dermal fillers, microneedling, laser treatments, and more. Schedule your free consultation today.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${dancing.variable} ${outfit.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">{children}</body>
    </html>
  );
}
