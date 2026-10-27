"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LayoutGrid } from "lucide-react";
import { ServiceIconCard } from "./ServiceIconCard";
import { ScrollReveal } from "./ScrollReveal";

export interface EnrichedServiceItem {
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
  priceNote: string;
  department: {
    id: number;
    slug: string;
    nameAr: string;
  } | null;
  doctors: Array<{
    id: number;
    slug: string;
    nameAr: string;
    professionalTitle: string;
  }>;
}

interface InteractiveServicesSectionProps {
  services: EnrichedServiceItem[];
}

export function InteractiveServicesSection({
  services,
}: InteractiveServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<string | null>(null);

  return (
    <section
      id="interactive-services"
      className="py-14 lg:py-22 bg-[#F7F3EF] border-t border-[#E8DFD8]"
    >
      <div className="reflect-container">
        {/* رأس قسم الخدمات */}
        <ScrollReveal>
          <div className="text-right max-w-3xl mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D8C3A5]/60 text-[#65143D] text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#E94D91]" />
              <span>خدماتنا المختارة (12 خدمة متنوعة)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#65143D] tracking-tight mb-3">
              اكتشفي خدمات عيادات ريفلكت
            </h2>
            <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
              اضغطي على أي خدمة ليتغير لون البطاقة وتنتقلي مباشرة إلى صفحة الخدمة المستقلة التي تعرض شرح الخدمة الكامل وكل تفاصيلها والأطباء المسؤولين عن تقديمها.
            </p>
          </div>
        </ScrollReveal>

        {/* كل خدمتين جنبًا إلى جنب (grid-cols-2) مع حركة ظهور متدرجة Staggered Entrance */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
          {services.map((srv, idx) => (
            <ScrollReveal key={srv.slug} delayMs={(idx % 4) * 70} className="h-full">
              <ServiceIconCard
                service={srv}
                isActive={selectedService === srv.slug}
                onSelect={(slug) => setSelectedService(slug)}
                navigateOnClick={true}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* زر تصفح كل الخدمات (ينقل إلى /services التي تعرض الـ 19 خدمة كاملة) */}
        <ScrollReveal delayMs={150}>
          <div className="mt-10 sm:mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex items-center gap-3 bg-white hover:bg-[#65143D] text-[#65143D] hover:text-white border-2 border-[#65143D] font-extrabold text-base sm:text-lg px-8 sm:px-10 py-4 rounded-full shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <LayoutGrid className="w-5 h-5 text-[#E94D91]" />
              <span>تصفح كل الخدمات (19 خدمة)</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
