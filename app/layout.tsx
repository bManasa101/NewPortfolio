import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Manasa Basavaraju · CFA – Equity Analyst",
  description: "Portfolio of Manasa Basavaraju, CFA Charterholder and Senior Equity Analyst covering Technology and Consumer sectors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}