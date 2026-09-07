import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Yunus Emre Yılmaz — Language Room",
  description:
    "An interactive 3D workspace for English teaching, translation, Squad Index, Reflect & Shoot and media projects.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
