"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { MedicalIcon } from "./MedicalIcon";

export interface ServiceIconCardData {
  id: number | string;
  slug: string;
  nameAr: string;
  shortDescription: string;
  iconName: string;
  specialtyTag?: string;
}

interface ServiceIconCardProps {
  service: ServiceIconCardData;
  isActive: boolean;
  onSelect: (serviceSlug: string) => void;
  navigateOnClick?: boolean;
}

export function ServiceIconCard({
  service,
  isActive,
  onSelect,
  navigateOnClick = true,
}: ServiceIconCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    onSelect(service.slug);
    if (navigateOnClick) {
      // يظهر تأثير تغير اللون الفوري إلى العنابي ثم ينتقل المستخدم إلى صفحة تفاصيل الخدمة والأطباء
      window.setTimeout(() => {
        router.push(`/services/${service.slug}`);
      }, 170);
    }
  };

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={handleCardClick}
      className={[
        "service-card w-full p-4 sm:p-7 text-right flex flex-col justify-between cursor-pointer group",
        isActive ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="w-full">
        {/* صندوق الأيقونة في أعلى يمين البطاقة مطابقًا للصورة المرجعية */}
        <div className="flex justify-start mb-4 sm:mb-5">
          <div
            className={`w-13 h-13 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center transition-colors ${
              isActive
                ? "bg-white/14 text-[#D97724]"
                : "bg-[#F6F1EC] text-[#7D1048] group-hover:bg-[#EFE6EE]"
            }`}
          >
            <MedicalIcon
              name={service.iconName}
              className="w-6 h-6 sm:w-8 sm:h-8"
              strokeWidth={1.8}
            />
          </div>
        </div>

        {/* اسم الخدمة */}
        <h3
          className={`text-base sm:text-2xl font-bold leading-snug mb-2 sm:mb-3 transition-colors ${
            isActive ? "text-white" : "text-[#1F171C]"
          }`}
        >
          {service.nameAr}
        </h3>

        {/* الوصف القصير للخدمة */}
        <p
          className={`text-xs sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-4 transition-colors ${
            isActive ? "text-white/90" : "text-[#6E6269]"
          }`}
        >
          {service.shortDescription}
        </p>
      </div>

      {/* مؤشر «اعرف المزيد ←» في أسفل البطاقة كما في الصورة المرجعية */}
      <div className="w-full pt-2 mt-auto flex items-center justify-start">
        <span
          className={`inline-flex items-center gap-1.5 text-xs sm:text-base font-bold transition-colors ${
            isActive ? "text-[#D97724]" : "text-[#7D1048]"
          }`}
        >
          <span>اعرف المزيد</span>
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        </span>
      </div>
    </button>
  );
}
