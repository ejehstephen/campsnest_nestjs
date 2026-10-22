import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { AuthProvider } from "@/lib/auth/auth-provider";
import { Analytics } from "@vercel/analytics/react";
import { NotificationManager } from "@/components/layout/notification-manager";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CampsNest 2.0 — Your Campus. Your Space. Your People.",
    template: "%s | CampsNest"
  },
  description: "The modern student living, marketplace, and social connection superapp for Nigerian Universities. Discover verified housing, buy/sell student gadgets, and match with compatible roommates.",
  keywords: [
    "student housing",
    "campus marketplace",
    "roommate finder",
    "FUWukari hostel",
    "student accommodation",
    "buy used gadgets",
    "campsnest"
  ],
  authors: [{ name: "CampsNest Team" }],
  creator: "CampsNest",
  metadataBase: new URL("https://campsnest.com"),
  icons: {
    icon: [
      { url: "/campsnest-logo.png", sizes: "512x512", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/campsnest-logo.png",
    shortcut: "/campsnest-logo.png",
  },

  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://campsnest.com",
    title: "CampsNest 2.0 — Your Campus. Your Space. Your People.",
    description: "The modern student living, marketplace, and social connection superapp for Nigerian Universities. Discover verified housing, buy/sell student gadgets, and match with compatible roommates.",
    siteName: "CampsNest",
    images: [
      {
        url: "https://campsnest.com/campsnest-logo.png",
        width: 1200,
        height: 630,
        alt: "CampsNest — Campus SuperApp Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CampsNest 2.0 — Your Campus. Your Space. Your People.",
    description: "Discover verified student housing, buy & sell campus gear safely, and match with compatible roommates.",
    images: ["https://campsnest.com/campsnest-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${inter.variable} dark`} suppressHydrationWarning>
      <body className="bg-canvas-midnight text-white antialiased min-h-screen selection:bg-brand-magenta/30 selection:text-white overflow-x-hidden" suppressHydrationWarning>
        <AuthProvider>
          {children}
          <Analytics />
          <NotificationManager />
        </AuthProvider>
      </body>
    </html>
  );
}
