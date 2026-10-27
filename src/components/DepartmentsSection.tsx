"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DepartmentCard, DepartmentCardData } from "./DepartmentCard";
import { ScrollReveal } from "./ScrollReveal";

interface DepartmentsSectionProps {
  departments: DepartmentCardData[];
}

export function DepartmentsSection({ departments }: DepartmentsSectionProps) {
  const [activeDeptSlug, setActiveDeptSlug] = useState<string>("body");

  return (
    <section className="py-16 lg:py-22 bg-white border-t border-[#E8DFD8]">
      <div className="reflect-container">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 text-right">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EF] border border-[#D8C3A5]/60 text-[#65143D] text-xs font-bold mb-3">
                <span className="w-2 h-2 rounded-full bg-[#D8C3A5]" />
                <span>الأقسام الطبية الثلاثة</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#65143D] tracking-tight mb-2.5">
                أقسام عيادات ريفلكت التخصصية
              </h2>
              <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                تتوزع الرعاية في العيادة على ثلاثة أقسام رئيسية: قسم الجسم، قسم الجلد، وقسم الوجه. تصفحي كل قسم للاطلاع على خدماته وأطبائه المرتبطين به.
              </p>
            </div>

            <Link
              href="/departments"
              className="self-start md:self-auto inline-flex items-center gap-2 bg-[#F7F3EF] hover:bg-[#65143D] text-[#65143D] hover:text-white border border-[#E8DFD8] font-bold text-sm px-6 py-3 rounded-full transition-all"
            >
              <span>جميع الأقسام</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {departments.map((dept, idx) => (
            <ScrollReveal key={dept.slug} delayMs={idx * 100} className="h-full">
              <DepartmentCard
                department={dept}
                isHighlighted={activeDeptSlug === dept.slug}
                onActivate={(slug) => setActiveDeptSlug(slug)}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
