"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, ChevronLeft } from "lucide-react";

export interface DoctorCardItem {
  id: number;
  slug: string;
  nameAr: string;
  nameEn?: string;
  professionalTitle: string;
  primarySpecialty: string;
  qualifications?: string[] | null;
  bioAr?: string;
  officialImageUrl?: string | null;
  publishStatus?: string;
  verificationStatus?: string;
  verificationNotes?: string | null;
  department?: {
    id: number;
    slug: string;
    nameAr: string;
  } | null;
  services?: Array<{
    id: number;
    slug: string;
    nameAr: string;
  }>;
}

interface DoctorCardProps {
  doctor: DoctorCardItem;
}

export function DoctorCard({ doctor }: DoctorCardProps) {
  const router = useRouter();
  const [imageError, setImageError] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const hasVerifiedPhoto = Boolean(doctor.officialImageUrl && !imageError);

  const displayDoctorName =
    doctor.nameAr.startsWith("د.") || doctor.nameAr.includes("البندري")
      ? doctor.nameAr
      : `د. ${doctor.nameAr}`;

  const handleNavigateToProfile = () => {
    setIsPressed(true);
    window.setTimeout(() => {
      router.push(`/doctors/${doctor.slug}`);
    }, 150);
  };

  return (
    <article
      onClick={handleNavigateToProfile}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleNavigateToProfile();
        }
      }}
      aria-label={`الانتقال إلى صفحة ${displayDoctorName} — ${doctor.professionalTitle}`}
      className={`rounded-[1.65rem] overflow-hidden border transition-all duration-200 flex flex-col h-full cursor-pointer select-none ${
        isPressed
          ? "bg-[#FFF0F6] border-2 border-[#F04491] shadow-[0_14px_34px_rgb(240_68_145/22%)] -translate-y-1"
          : "bg-white border-[#E9DFE4] shadow-[0_8px_28px_rgb(101_13_61/6%)] hover:shadow-[0_14px_36px_rgb(101_13_61/12%)] hover:border-[#650D3D]"
      }`}
    >
      {/* الجزء العلوي المطابق للصورة المرجعية الأولى */}
      <div className="relative bg-[#5A103A] h-44 sm:h-60 w-full overflow-hidden flex flex-col items-center justify-center p-3 sm:p-5 group">
        {hasVerifiedPhoto ? (
          <img
            src={doctor.officialImageUrl!}
            alt={`صورة ${displayDoctorName}`}
            loading="lazy"
            onError={() => setImageError(true)}
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
        ) : (
          <>
            {/* الدوائر المتداخلة الشفافة كما في الصورة المرجعية */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-10 -right-8 w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-[#DCA0B2]/16"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-12 -left-10 w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-white/7"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-3 left-1/2 -translate-x-1/2 w-32 h-32 sm:w-44 sm:h-44 rounded-full bg-[#DCA0B2]/14"
            />

            {/* الدائرة الوسطى مع أيقونة الطبيب */}
            <div className="relative z-10 w-22 h-22 sm:w-32 sm:h-32 rounded-full bg-white/12 border border-white/15 flex items-center justify-center">
              <User
                className="w-10 h-10 sm:w-14 sm:h-14 text-white/85"
                strokeWidth={1.5}
              />
            </div>

            {/* شارة «الصورة الرسمية للطبيب قريباً» */}
            <div className="relative z-20 -mt-2.5 bg-[#350821]/80 backdrop-blur-xs border border-white/10 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full">
              <span className="text-white/95 text-[10px] sm:text-xs font-medium whitespace-nowrap block">
                الصورة الرسمية للطبيب قريباً
              </span>
            </div>
          </>
        )}
      </div>

      {/* الجزء السفلي للمعلومات والأزرار مطابقًا للصورة المرجعية الأولى */}
      <div className="p-3.5 sm:p-6 flex flex-col flex-1 text-right">
        <h3 className="text-[#2B2027] font-bold text-sm sm:text-xl leading-snug mb-1">
          {displayDoctorName}
        </h3>

        <p className="text-[#9E2A63] font-medium text-xs sm:text-sm leading-relaxed mb-3 sm:mb-4 flex-1">
          {doctor.professionalTitle}
        </p>

        {/* عرض الملف الشخصي مع السهم < */}
        <div className="flex items-center justify-between text-[#2B2027] font-bold text-xs sm:text-sm py-1.5 sm:py-2 mb-2.5 sm:mb-3">
          <span className="leading-snug">عرض الملف الشخصي</span>
          <ChevronLeft className="w-4 h-4 text-[#2B2027] shrink-0" />
        </div>

        {/* زر احجز مع الطبيب باللون الوردي */}
        <Link
          href={`/book?doctor=${doctor.slug}`}
          onClick={(e) => e.stopPropagation()}
          className="w-full bg-[#E94D91] hover:bg-[#d8357f] text-white font-bold py-2.5 sm:py-3 px-3 sm:px-4 rounded-full text-xs sm:text-sm text-center shadow-2xs hover:shadow-md transition-all block"
        >
          احجز مع الطبيب
        </Link>
      </div>
    </article>
  );
}
