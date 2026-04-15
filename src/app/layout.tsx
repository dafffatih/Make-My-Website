import type { Metadata } from "next";
import { Inter, Manrope, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/Providers";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Make My Website | The Digital Architect",
  description: "Crafting Your Digital Masterpiece",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", "h-full", "antialiased", inter.variable, manrope.variable, "font-sans", geist.variable)}
    >
      <head>
      </head>
      <body className="min-h-full flex flex-col font-body bg-background text-on-background selection:bg-primary selection:text-on-primary">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
