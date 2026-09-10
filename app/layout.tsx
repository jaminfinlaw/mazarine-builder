import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MAZARINE | Custom Dock Box Builder",
  description: "Interactive custom dock box configurator for MAZARINE product design exploration.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full bg-[#071726] text-slate-100">{children}</body>
    </html>
  );
}
