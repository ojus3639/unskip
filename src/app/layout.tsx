import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "Unskip Breakfast Club | High-Protein Packaged Breakfast",
  description:
    "Unskip Breakfast Club makes quick, no-prep, high-protein packaged breakfast. Based in Faridabad, Haryana. Egg Bites — Tandoori Paneer, Peri Peri & Spinach & Cheese.",
  openGraph: {
    title: "Unskip Breakfast Club",
    description:
      "High-protein, no-prep packaged breakfast. Fuel your mornings without the hassle.",
    images: ["/images/image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geist.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
