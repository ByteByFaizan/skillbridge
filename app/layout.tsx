import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";

export const metadata: Metadata = {
  title: "SkillBridge – AI Career Guidance for Students",
  description:
    "Personalized career guidance, skill gap analysis, and a clear learning roadmap. Discover the right career path — guided by AI.",
  keywords: "career guidance, AI career counselor, skill gap analysis, learning roadmap, career planning, student career, career advice",
  authors: [{ name: "SkillBridge" }],
  openGraph: {
    title: "SkillBridge – AI Career Guidance for Students",
    description: "Personalized career guidance, skill gap analysis, and a clear learning roadmap.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "SkillBridge – AI Career Guidance for Students",
    description: "Personalized career guidance powered by AI",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased flex flex-col font-sans">
        <a
          href="#main-content"
          className="skip-link"
        >
          Skip to content
        </a>
        <ErrorBoundary>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
        </ErrorBoundary>
      </body>
    </html>
  );
}
