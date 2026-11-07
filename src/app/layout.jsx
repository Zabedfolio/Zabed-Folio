import { GeistMono, GeistSans } from "geist/font";
import { Bricolage_Grotesque, Pacifico } from "next/font/google";
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
  title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
  description:
    "Portfolio of Zabed Mahmud, a frontend developer building Next.js experiences with sharp interaction design and production-ready execution.",
  keywords: ["frontend developer", "react", "nextjs", "portfolio", "bangladesh"],
  openGraph: {
    title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
    description: "Cinematic developer portfolio built with Next.js, Tailwind CSS, Framer Motion, and Radix UI.",
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
    title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
    description: "Cinematic developer portfolio built with Next.js and Framer Motion."
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
        {children}
      </body>
    </html>
  );
}