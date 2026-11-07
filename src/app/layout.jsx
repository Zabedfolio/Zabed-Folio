import { GeistMono, GeistSans } from "geist/font";
import { Bricolage_Grotesque, Pacifico } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import "./globals.css";

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico"
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://zabedmahmud.com"),
  title: "Zabed Mahmud — Full Stack Developer | Building SaaS, E-Commerce & AI-Powered Web Apps",
  description:
    "Portfolio of Zabed Mahmud, a full-stack developer engineering high-performance Next.js applications, custom e-commerce stores, SaaS architectures, and AI-powered web solutions.",
  keywords: [
    "full stack developer",
    "nextjs",
    "react",
    "postgresql",
    "mongodb",
    "saas",
    "ecommerce",
    "bangladesh",
    "web developer",
    "zabed mahmud"
  ],
  openGraph: {
    title: "Zabed Mahmud — Full Stack Developer | Building SaaS, E-Commerce & AI Web Apps",
    description:
      "Full-stack developer building high-speed Next.js web apps, e-commerce platforms, and scalable digital solutions.",
    images: [
      {
        url: "/main-pic.jpg",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Zabed Mahmud — Full Stack Developer | Building SaaS, E-Commerce & AI Web Apps",
    description:
      "Full-stack developer building high-speed Next.js web apps, e-commerce platforms, and scalable digital solutions."
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logo.png",
  },
  robots: "index, follow"
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} ${pacifico.variable} ${bricolage.variable}`}
    >
      <body>
        <AnalyticsTracker />
        {children}
        <Analytics />
      </body>
    </html>
  );
}