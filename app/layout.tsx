import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sprout-scribble",
  description: "A full-stack e-commerice application built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} px-6 md:px-12 max-w-7xl mx-auto antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
