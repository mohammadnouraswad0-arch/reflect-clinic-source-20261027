import React, { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { BookingWizard } from "@/components/BookingWizard";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "احجز موعدًا — طلب حجز متعدد الخطوات",
  description:
    "اطلب موعدك في عيادات ريفلكت REFLECT CLINIC عبر 5 خطوات واضحة: اختيار الخدمة، اختيار الطبيب، تحديد الموعد المطلوب، إدخال بيانات التواصل، ومراجعة الطلب.",
};

export default async function BookPage() {
  const catalog = await getClinicPublicCatalog();
  const visibleDepartments = catalog.departments
    .filter((d) => d.isVisible)
    .map((d) => ({ id: d.id, slug: d.slug, nameAr: d.nameAr }));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 pb-16">
        <section className="bg-[#650D3D] text-white py-12 sm:py-16">
          <div className="reflect-container text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-3">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">احجز موعدًا</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-3">
              احجز موعدًا في عيادات ريفلكت
            </h1>
            <p className="text-sm sm:text-lg text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              اختر الخدمة والطبيب المرتبط بها وحدد الموعد المطلوب في 5 خطوات واضحة، وسيتم إصدار رقم مرجعي لمتابعة طلبك لحين تأكيد العيادة.
            </p>
          </div>
        </section>

        <section className="reflect-container py-10 sm:py-12">
          <Suspense
            fallback={
              <div className="bg-white rounded-3xl p-12 text-center text-[#650D3D] font-bold">
                جاري تحميل نموذج طلب الموعد...
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
