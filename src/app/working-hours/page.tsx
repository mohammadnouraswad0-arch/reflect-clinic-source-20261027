import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { WorkingHoursTable } from "@/components/WorkingHoursTable";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "ساعات العمل — مواعيد دوام العيادة",
  description:
    "تعرّف على جدول ساعات عمل عيادات ريفلكت REFLECT CLINIC في الرياض وحالة الدوام الحالية وأيام العمل من السبت إلى الخميس.",
};

export default function WorkingHoursPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 space-y-12 pb-10">
        <section className="bg-[#650D3D] text-white py-14 sm:py-18">
          <div className="reflect-container text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">ساعات العمل</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              ساعات عمل عيادات ريفلكت
            </h1>
            <p className="text-base sm:text-lg text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              جدول تفاعلي يوضح أوقات العمل اليومية وحالة الدوام الحالية وفق توقيت مدينة الرياض، مع إمكانية الحجز أو التواصل المباشر.
            </p>
          </div>
        </section>

        <section className="reflect-container">
          <WorkingHoursTable />
        </section>

        <FinalBookingBanner />
      </main>

      <Footer />
    </div>
  );
}
