import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOCINE TECH+ | الخدمات الإلكترونية",
  description: "منصة احترافية لإدارة الخدمات والتسجيلات الإلكترونية",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
