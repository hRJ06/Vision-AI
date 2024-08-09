import type { Metadata } from "next";
import { Dosis } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Providers from "@/components/providers/provider";
const dosis = Dosis({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Vision AI",
  description:
    "Vision AI is a user-friendly platform empowering analysts with non-tech backgrounds to seamlessly interact with internal databases using LLM models. It supports generating sequence and ER diagrams, and provides a CSV chat feature for discussing specific data points. Effortless data insights at your fingertips!",
  icons: {
    icon: "/icon/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={dosis.className}>
        <Providers>{children}</Providers>
        <Analytics />
        <SpeedInsights />
        <Toaster />
      </body>
    </html>
  );
}
