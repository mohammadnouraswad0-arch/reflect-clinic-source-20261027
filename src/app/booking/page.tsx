import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { BookingWizard } from "@/components/BookingWizard";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "حجز موعد إلكتروني",
  description:
    "احجز موعدك إلكترونياً في عيادات ريفلكت Reflect Clinic. اختر الخدمة، والطبيب المختص المؤهل، والتاريخ والوقت المتاحين وفق الجدول الفعلي للعيادة.",
};

export default async function BookingPage() {
  const catalog = await getClinicPublicCatalog();
  const visibleDepartments = catalog.departments
    .filter((d) => d.isVisible)
    .map((d) => ({ id: d.id, slug: d.slug, nameAr: d.nameAr }));

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2EF]">
      <Header />

      <main className="flex-1 pb-16">
        <section className="bg-[#5A103A] text-white py-12 sm:py-16 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#DCA0B2]/15 blur-3xl"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#DCA0B2] mb-3">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">نظام الحجز الإلكتروني</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-3">
              احجز موعدك في Reflect Clinic
            </h1>
            <p className="text-sm sm:text-lg text-[#F7F2EF]/90 max-w-3xl leading-relaxed">
              خطوات منظمة ومباشرة لاختيار الخدمة الطبية أو التجميلية، وتحديد الطبيب المؤهل فعلياً لتقديمها، واختيار الموعد المناسب من جدوله الفعلي.
            </p>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
          <Suspense
            fallback={
              <div className="bg-white rounded-3xl p-12 text-center text-[#5A103A] font-bold">
                جاري تحميل نظام الحجز...
              </div>
            }
          >
            <BookingWizard
              services={catalog.services}
              doctors={catalog.publishedDoctors}
              departments={visibleDepartments}
            />
          </Suspense>
        </section>
      </main>

      <Footer />
    </div>
  );
}
