import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Tajawal } from "next/font/google";
import { FloatingContactButtons } from "@/components/FloatingContactButtons";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-arabic",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "REFLECT CLINIC | عيادات ريفلكت — جمالك يبدأ من هنا",
    template: "%s | REFLECT CLINIC — عيادات ريفلكت",
  },
  description:
    "اكتشفي خدماتنا الطبية والتجميلية مع فريق متخصص يهتم بجمالك وراحتك في عيادات ريفلكت بالرياض. أقسام متخصصة للجسم والجلد والوجه ونظام حجز إلكتروني مباشر.",
  openGraph: {
    title: "REFLECT CLINIC | عيادات ريفلكت — جمالك يبدأ من هنا",
    description:
      "اكتشفي خدماتنا الطبية والتجميلية مع فريق متخصص يهتم بجمالك وراحتك.",
    locale: "ar_SA",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="min-h-screen bg-[#F7F3EF] text-[#2B2027] antialiased selection:bg-[#65143D] selection:text-white flex flex-col">
        {children}
        <FloatingContactButtons />
      </body>
    </html>
  );
}
