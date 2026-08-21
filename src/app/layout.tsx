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

export const metadata: Metadata = {
  metadataBase: new URL("https://louinaquines.online"),
  title: {
    default: "Loui Naquines | Full-Stack Developer",
    template: "%s | Loui Naquines",
  },
  description: "Loui Naquines, also known as Loui Jay Naquines, is a Cebu-based full-stack developer building dependable websites, mobile apps, APIs, and digital products.",
  applicationName: "Loui Naquines Portfolio",
  keywords: [
    "Loui Naquines",
    "Loui Jay Naquines",
    "louinaquines",
    "full-stack developer",
    "web developer Cebu",
    "mobile app developer Philippines",
  ],
  authors: [{ name: "Loui Naquines", url: "https://louinaquines.online" }],
  creator: "Loui Naquines",
  publisher: "Loui Naquines",
  alternates: {
    canonical: "https://louinaquines.online",
  },
  openGraph: {
    type: "website",
    url: "https://louinaquines.online",
    siteName: "Loui Naquines Portfolio",
    title: "Loui Naquines | Full-Stack Developer",
    description: "Portfolio of Loui Naquines, a Cebu-based full-stack developer building websites, mobile apps, APIs, and dependable digital products.",
    images: [{ url: "/images/hero-person-cutout.png", width: 900, height: 1200, alt: "Loui Naquines, full-stack developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Loui Naquines | Full-Stack Developer",
    description: "Portfolio of Loui Naquines, a Cebu-based full-stack developer.",
    images: ["/images/hero-person-cutout.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/images/lj-doclogo.jpg",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
