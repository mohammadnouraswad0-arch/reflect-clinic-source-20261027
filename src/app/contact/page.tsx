import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { ContactSection } from "@/components/ContactSection";
import { ContactForm } from "@/components/ContactForm";
import { WorkingHoursTable } from "@/components/WorkingHoursTable";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "تواصل معنا — قنوات الاتصال الرسمية ونموذج المراسلة",
  description:
    "تواصل مع عيادات ريفلكت REFLECT CLINIC في الرياض عبر الهاتف الرسمي أو واتساب أو نموذج الاستفسارات.",
};

export default function ContactPage() {
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
              <span className="text-white font-bold">تواصل معنا</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              تواصل مع عيادات ريفلكت
            </h1>
            <p className="text-base sm:text-lg text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              تواصل مباشرة مع فريق تنسيق المواعيد عبر الهاتف أو واتساب، أو أرسل استفسارك عبر النموذج أدناه.
            </p>
          </div>
        </section>

        <ContactSection />

        <section className="reflect-container grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <WorkingHoursTable />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
