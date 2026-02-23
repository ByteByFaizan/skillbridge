import type { Metadata } from "next";
import { Instrument_Serif, Geist } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  weight: "400",
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
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
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${geistSans.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
