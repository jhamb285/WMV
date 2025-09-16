import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "NIGHTP - Dubai Event Discovery",
  description: "Discover the hottest events, venues, and nightlife in Dubai through real-time Instagram stories and venue data.",
  keywords: ["Dubai events", "Dubai nightlife", "Dubai venues", "Dubai clubs", "Dubai restaurants", "Dubai entertainment", "Where's My Vibe"],
  authors: [{ name: "Where's My Vibe Team" }],
  creator: "Where's My Vibe",
  publisher: "Where's My Vibe",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "NIGHTP - Dubai Event Discovery",
    description: "Discover the hottest events, venues, and nightlife in Dubai through real-time Instagram stories and venue data.",
    url: "https://wheresmyvibe.com",
    siteName: "Where's My Vibe",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NIGHTP - Dubai Event Discovery",
    description: "Discover the hottest events, venues, and nightlife in Dubai through real-time Instagram stories and venue data.",
    creator: "@wheresmyvibe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
