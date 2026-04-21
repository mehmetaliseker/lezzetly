import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteHeader } from "@/components/layout/site-header";

import { AppProviders } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lezzetly",
  description: "Restoran rezervasyonu",
  icons: {
    icon: "/restaurant-icon.png",
    shortcut: "/restaurant-icon.png",
    apple: "/restaurant-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders>
          <SiteHeader />
          <div className="flex min-h-svh flex-1 flex-col pt-[var(--header-height)]">
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
