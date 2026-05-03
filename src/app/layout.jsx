import { GeistMono, GeistSans } from "geist/font";
import CustomCursor from "@/components/CustomCursor";
import "./globals.css";

export const metadata = {
  title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
  description:
    "Portfolio of Zabed Mahmud, a frontend developer building cinematic Next.js experiences with sharp interaction design and production-ready execution.",
  keywords: ["frontend developer", "react", "nextjs", "portfolio", "bangladesh"],
  openGraph: {
    title: "Zabed Mahmud — Frontend Developer & Creative Engineer",
    description: "Cinematic developer portfolio built with Next.js, Tailwind CSS, Framer Motion, and Radix UI.",
    images: [
      {
        url: "https://i.ibb.co/JRzktzRs/avtr.png",
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
  robots: "index, follow"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}