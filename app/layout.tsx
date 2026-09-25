import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import Providers from "@/components/Providers";
import FullscreenButton from "@/components/FullscreenButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "LifeOS",
  description: "LifeOS — Your personal life operating system.",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="es" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
      <Providers>
        {children}
      </Providers>

      <FullscreenButton />

      <Toaster position="top-center" />
      </body>
      </html>
  );
}