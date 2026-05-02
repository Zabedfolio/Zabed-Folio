import type { Metadata } from "next";
import { GeistMono, GeistSans } from "geist/font";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zabed Hossain — Frontend Developer & Creative Engineer",
  description:
    "Portfolio of Zabed Hossain, a frontend developer building cinematic Next.js experiences with sharp interaction design and production-ready execution.",
  keywords: ["frontend developer", "react", "nextjs", "portfolio", "bangladesh"],
  openGraph: {
    title: "Zabed Hossain — Frontend Developer & Creative Engineer",
    description: "Cinematic developer portfolio built with Next.js, Tailwind CSS, Framer Motion, and Radix UI.",
    images: [
      {
        url: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 630
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Zabed Hossain — Frontend Developer & Creative Engineer",
    description: "Cinematic developer portfolio built with Next.js and Framer Motion."
  },
  robots: "index, follow"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
