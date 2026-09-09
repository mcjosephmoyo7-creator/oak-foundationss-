import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oak Foundations | Attendee Registration",
  description: "Register an attendee with Oak Foundations.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
