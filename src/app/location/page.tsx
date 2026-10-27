import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { LocationSection } from "@/components/LocationSection";
import { WorkingHoursTable } from "@/components/WorkingHoursTable";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "موقع العيادة — العنوان والاتجاهات في الرياض",
  description:
    "تعرّف على موقع عيادات ريفلكت REFLECT CLINIC في الرياض، حي المحمدية، طريق الأمير تركي بن عبدالعزيز الأول، وساعات العمل والاتجاهات.",
};

export default function LocationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 space-y-12 pb-12">
        <section className="bg-[#650D3D] text-white py-14 sm:py-18">
          <div className="reflect-container text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">موقع العيادة</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              موقعنا في الرياض
            </h1>
            <p className="text-base sm:text-lg text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              العنوان الموثق، روابط الاتجاهات، وساعات العمل في عيادات ريفلكت بحي المحمدية.
            </p>
          </div>
        </section>

        <LocationSection />

        <section className="reflect-container">
          <WorkingHoursTable />
        </section>
      </main>

      <Footer />
    </div>
  );
}
