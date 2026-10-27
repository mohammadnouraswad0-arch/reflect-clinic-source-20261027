import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { ServicesCatalogClient } from "@/components/ServicesCatalogClient";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "جميع الخدمات الطبية والتجميلية",
  description:
    "تصفح جميع الخدمات الطبية والتجميلية والجراحية في عيادات ريفلكت Reflect Clinic ضمن أقسام الجسم، الجلد والليزر، والوجه والأنف والعيون والفكين.",
};

export default async function ServicesPage() {
  const catalog = await getClinicPublicCatalog();
  const visibleServices = catalog.services.filter((s) => s.isVisible);
  const visibleDepartments = catalog.departments
    .filter((d) => d.isVisible)
    .map((d) => ({ id: d.id, slug: d.slug, nameAr: d.nameAr }));

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2EF]">
      <Header />

      <main className="flex-1">
        {/* ترويسة صفحة جميع الخدمات */}
        <section className="bg-[#5A103A] text-white py-14 sm:py-18 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#DCA0B2]/15 blur-3xl"
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#DCA0B2] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">جميع الخدمات</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white mb-4">
              دليل الخدمات الطبية والتجميلية الكامل
            </h1>
            <p className="text-base sm:text-lg text-[#F7F2EF]/90 max-w-3xl leading-relaxed">
              استعرض جميع الخدمات المتوفرة في Reflect Clinic مصنفة حسب الأقسام والتخصصات الطبية الدقيقة، وتعرّف على الأطباء المؤهلين فعلياً لتقديم كل خدمة قبل حجز موعدك.
            </p>
          </div>
        </section>

        {/* البحث والتصفية وقائمة جميع الخدمات */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesCatalogClient
            services={visibleServices}
            departments={visibleDepartments}
          />
        </section>

        <FinalBookingBanner />
      </main>

      <Footer />
    </div>
  );
}
