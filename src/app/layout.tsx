import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { DemoToggle } from "@/components/lifelens/demo-toggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeLens AI — See Your Health Before You Feel It",
  description:
    "LifeLens AI is an educational wellness assistant that uses multi-modal AI to provide personalized lifestyle insights from face, voice, wearable data, and lifestyle habits. Not a medical diagnostic system.",
  keywords: [
    "LifeLens AI", "wellness", "health", "AI", "preventive health",
    "face analysis", "voice analysis", "wearable", "lifestyle",
  ],
  authors: [{ name: "LifeLens AI Team" }],
  openGraph: {
    title: "LifeLens AI — See Your Health Before You Feel It",
    description: "Your personal AI wellness twin. Multi-modal health insights powered by AI.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        {children}
        <DemoToggle />
      </body>
    </html>
  );
}
