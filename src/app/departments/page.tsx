import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { DepartmentsSection } from "@/components/DepartmentsSection";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "الأقسام الطبية — الجسم والجلد والوجه",
  description:
    "استعرض الأقسام الثلاثة في عيادات ريفلكت REFLECT CLINIC: قسم الجسم، قسم الجلد، وقسم الوجه، والخدمات والأطباء المرتبطين بكل قسم.",
};

export default async function DepartmentsIndexPage() {
  const catalog = await getClinicPublicCatalog();
  const departmentCards = catalog.departments
    .filter((d) => d.isVisible)
    .map((d) => ({
      id: d.id,
      slug: d.slug,
      nameAr: d.nameAr,
      titleAr: d.titleAr,
      shortDescription: d.shortDescription,
      iconName: d.iconName,
      servicesCount: d.services.length,
      doctorsCount: d.doctors.length,
    }));

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />
      <main className="flex-1">
        <section className="bg-[#650D3D] text-white py-14 sm:py-18">
          <div className="reflect-container text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">الأقسام</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              الأقسام الطبية في عيادات ريفلكت
            </h1>
            <p className="text-base sm:text-lg text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              تعتمد عيادات ريفلكت تقسيمًا واضحًا يضم ثلاثة أقسام رئيسية: قسم الجسم، قسم الجلد، وقسم الوجه، بحيث يضم كل قسم خدماته وأطباءه المرتبطين به وفق السجلات المركزية.
            </p>
          </div>
        </section>

        <DepartmentsSection departments={departmentCards} />
        <FinalBookingBanner />
      </main>
      <Footer />
    </div>
  );
}
