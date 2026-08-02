import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { DemoToggle } from "@/components/lifelens/demo-toggle";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "LifeDrishti AI — See Your Health Before You Feel It",
  description:
    "LifeDrishti AI is an educational wellness assistant that uses multi-modal AI to provide personalized lifestyle insights from face, voice, wearable data, and lifestyle habits. Not a medical diagnostic system.",
  keywords: [
    "LifeDrishti AI", "wellness", "health", "AI", "preventive health",
    "face analysis", "voice analysis", "wearable", "lifestyle",
  ],
  authors: [{ name: "LifeDrishti AI Team" }],
  openGraph: {
    title: "LifeDrishti AI — See Your Health Before You Feel It",
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
        <Toaster
          theme="dark"
          position="top-right"
          richColors
          toastOptions={{
            style: {
              background: "rgba(0, 0, 0, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(12px)",
            },
          }}
        />
      </body>
    </html>
  );
}
