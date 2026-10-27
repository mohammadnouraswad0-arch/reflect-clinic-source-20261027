"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  Stethoscope,
  HelpCircle,
} from "lucide-react";
import { ServiceIconCard } from "./ServiceIconCard";
import { DoctorCard, DoctorCardItem } from "./DoctorCard";
import { MedicalIcon } from "./MedicalIcon";

interface DepartmentServiceItem {
  id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  shortDescription: string;
  fullDescription: string;
  generalMedicalInfo: string;
  specialtyTag: string;
  iconName: string;
  durationMinutes: number;
  doctors: Array<{
    id: number;
    slug: string;
    nameAr: string;
    professionalTitle: string;
  }>;
}

interface DepartmentDetailViewProps {
  department: {
    id: number;
    slug: string;
    nameAr: string;
    nameEn: string;
    titleAr: string;
    shortDescription: string;
    fullDescription: string;
    specialtiesOverview: string;
    iconName: string;
    faqsJson: Array<{ question: string; answer: string }> | null;
    services: DepartmentServiceItem[];
    doctors: DoctorCardItem[];
  };
}

export function DepartmentDetailView({ department }: DepartmentDetailViewProps) {
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string>(
    ""
  );

  const publishedDeptDoctors = department.doctors.filter(
    (d) => d.publishStatus === "published"
  );

  return (
    <div className="space-y-14 lg:space-y-20">
      {/* ترويسة القسم */}
      <section className="relative overflow-hidden bg-[#650D3D] text-white py-12 sm:py-18">
        <div className="reflect-container relative z-10">
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-4">
            <Link href="/" className="hover:text-white transition-colors">
              الرئيسية
            </Link>
            <span>/</span>
            <Link href="/departments" className="hover:text-white transition-colors">
              الأقسام
            </Link>
            <span>/</span>
            <span className="text-white font-bold">{department.nameAr}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-right">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[#C5D6A0] text-xs font-bold">
                <MedicalIcon name={department.iconName} className="w-4 h-4 text-[#F04491]" />
                <span>{department.nameAr}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                {department.titleAr}
              </h1>

              <p className="text-base sm:text-lg text-[#F8F4F0]/90 leading-relaxed max-w-3xl">
                {department.fullDescription}
              </p>

              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <Link
                  href={`/book?department=${department.slug}`}
                  className="bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-lg transition-all inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز موعدك الآن</span>
                </Link>
                <a
                  href="#department-services"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all"
                >
                  خدمات القسم ({department.services.length})
                </a>
                <a
                  href="#department-doctors"
                  className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base px-6 py-3.5 rounded-full transition-all"
                >
                  أطباء القسم ({publishedDeptDoctors.length})
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-[2rem] p-6 sm:p-7 border border-white/20 text-right space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F04491] text-white flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white">
                نبذة عن تخصصات القسم
              </h2>
              <p className="text-xs sm:text-sm text-[#F8F4F0]/90 leading-relaxed">
                {department.specialtiesOverview}
              </p>
              <div className="pt-3 border-t border-white/15 flex items-center justify-between text-xs text-[#C5D6A0] font-bold">
                <span>ربط مركزي بين كل خدمة والأطباء المسؤولين عنها</span>
                <CheckCircle2 className="w-4 h-4 text-[#F04491] shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* خدمات القسم: كل خدمتين جنبًا إلى جنب (grid-cols-2) وعند الضغط يتغير اللون وينتقل لصفحة الخدمة */}
      <section id="department-services" className="reflect-container">
        <div className="text-right max-w-3xl mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E9DFE4] text-[#650D3D] text-xs font-bold mb-3">
            <span className="w-2 h-2 rounded-full bg-[#F04491]" />
            <span>خدمات {department.nameAr} ({department.services.length})</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-[#650D3D] mb-2.5">
            الخدمات التابعة لـ {department.nameAr}
          </h2>
          <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
            اضغط على أي خدمة ليتغير لونها وتنتقل مباشرة إلى صفحتها الخاصة التي تعرض شرح الخدمة الكامل والأطباء المسؤولين عنها.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
          {department.services.map((srv) => (
            <ServiceIconCard
              key={srv.slug}
              service={srv}
              isActive={srv.slug === selectedServiceSlug}
              onSelect={(slug) => setSelectedServiceSlug(slug)}
              navigateOnClick={true}
            />
          ))}
        </div>
      </section>

      {/* أطباء القسم: كل طبيبين جنبًا إلى جنب (grid-cols-2) وعند الضغط ينتقل لصفحة الطبيب */}
      <section
        id="department-doctors"
        className="bg-white py-14 lg:py-20 border-y border-[#E9DFE4]"
      >
        <div className="reflect-container">
          <div className="text-right max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4F0] border border-[#E9DFE4] text-[#650D3D] text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F04491]" />
              <span>أطباء {department.nameAr} ({publishedDeptDoctors.length})</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#650D3D] mb-2.5">
              أطباء ومختصو {department.nameAr}
            </h2>
            <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
              اضغط على بطاقة أي طبيب للانتقال إلى صفحته المستقلة التي تعرض مهارات الطبيب وخدماته وجدول مواعيده.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
            {publishedDeptDoctors.map((doc) => (
              <DoctorCard key={doc.slug} doctor={doc} />
            ))}
          </div>
        </div>
      </section>

      {/* الأسئلة الشائعة للقسم */}
      {department.faqsJson && department.faqsJson.length > 0 && (
        <section className="reflect-container max-w-4xl">
          <div className="text-right mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#650D3D] flex items-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-[#F04491]" />
              <span>الأسئلة الشائعة حول {department.nameAr}</span>
            </h2>
          </div>
          <div className="space-y-4">
            {department.faqsJson.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E9DFE4] text-right"
              >
                <h3 className="text-base sm:text-lg font-bold text-[#650D3D] mb-2">
                  {faq.question}
                </h3>
                <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
