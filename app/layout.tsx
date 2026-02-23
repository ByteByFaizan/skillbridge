import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SkillBridge — AI Career Guidance for Students",
  description:
    "Get personalized career paths, skill-gap analysis, and a 6-month learning roadmap. Built for students and early-career learners.",
  openGraph: {
    title: "SkillBridge — AI Career Guidance for Students",
    description:
      "Get personalized career paths, skill-gap analysis, and a 6-month learning roadmap.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
