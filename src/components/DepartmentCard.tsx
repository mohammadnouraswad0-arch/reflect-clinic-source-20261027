"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Users, Layers } from "lucide-react";
import { MedicalIcon } from "./MedicalIcon";

export interface DepartmentCardData {
  id: number | string;
  slug: string;
  nameAr: string;
  titleAr: string;
  shortDescription: string;
  iconName: string;
  servicesCount: number;
  doctorsCount: number;
}

interface DepartmentCardProps {
  department: DepartmentCardData;
  isHighlighted?: boolean;
  onActivate?: (slug: string) => void;
}

export function DepartmentCard({
  department,
  isHighlighted = false,
  onActivate,
}: DepartmentCardProps) {
  return (
    <article
      className={[
        "department-card p-7 sm:p-8 text-right flex flex-col justify-between min-h-[320px]",
        isHighlighted ? "is-selected" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      onMouseEnter={() => onActivate?.(department.slug)}
    >
      <div>
        {/* دائرة هادئة خلف الأيقونة الخطية الكبيرة + شارات العدد */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <button
            type="button"
            aria-pressed={isHighlighted}
            onClick={() => onActivate?.(department.slug)}
            className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
              isHighlighted
                ? "bg-[#650D3D] text-white ring-4 ring-[#FFF0F6]"
                : "bg-[#F8F4F0] text-[#650D3D] border border-[#E9DFE4] hover:border-[#F04491]"
            }`}
            aria-label={`تحديد ${department.nameAr}`}
          >
            <MedicalIcon name={department.iconName} className="w-8 h-8" />
          </button>

          <div className="flex flex-col items-end gap-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F8F4F0] text-[#650D3D] border border-[#E9DFE4]">
              <Layers className="w-3.5 h-3.5 text-[#F04491]" />
              <span>{department.servicesCount} خدمات</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white text-[#756A71] border border-[#E9DFE4]">
              <Users className="w-3.5 h-3.5 text-[#C5D6A0]" />
              <span>{department.doctorsCount} أطباء ومختصين</span>
            </span>
          </div>
        </div>

        {/* عنوان القسم ووصفه الموجز */}
        <h3 className="text-2xl font-bold text-[#650D3D] mb-2.5">
          <Link
            href={`/departments/${department.slug}`}
            className="hover:text-[#F04491] transition-colors"
          >
            {department.nameAr}
          </Link>
        </h3>

        <p className="text-sm sm:text-base text-[#756A71] leading-relaxed mb-6">
          {department.shortDescription}
        </p>
      </div>

      {/* زر «تصفح القسم» */}
      <div className="pt-5 mt-auto border-t border-[#E9DFE4] flex items-center justify-between">
        <Link
          href={`/departments/${department.slug}`}
          className={`inline-flex items-center gap-2 font-bold text-sm sm:text-base px-5 py-2.5 rounded-full transition-all ${
            isHighlighted
              ? "bg-[#650D3D] text-white hover:bg-[#4e092f]"
              : "bg-[#F8F4F0] text-[#650D3D] hover:bg-[#650D3D] hover:text-white border border-[#E9DFE4]"
          }`}
        >
          <span>تصفح القسم</span>
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <span className="w-2.5 h-2.5 rounded-full bg-[#C5D6A0]" aria-hidden="true" />
      </div>
    </article>
  );
}
