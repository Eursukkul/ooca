import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food Store Calculator",
  description: "Calculate food store bill with menu discount rules"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
