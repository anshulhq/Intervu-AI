import type { Metadata } from "next";
import { Sora, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Intervu AI | AI-Powered Mock Interviews",
  description:
    "Simulate real technical interviews with adaptive AI. Practice voice-based mock interviews, live coding, and get precision feedback.",
  openGraph: {
    title: "Intervu AI | AI-Powered Mock Interviews",
    description:
      "Simulate real technical interviews with adaptive AI. Practice voice-based mock interviews, live coding, and get precision feedback.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sora.variable} ${jakarta.variable}`}>
      <body className="antialiased font-body selection:bg-emerald-500/20 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
