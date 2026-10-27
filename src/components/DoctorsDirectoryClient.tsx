"use client";

import React, { useState, useMemo } from "react";
import { Search, RotateCcw, Users, Info } from "lucide-react";
import { DoctorCard, DoctorCardItem } from "./DoctorCard";
import { matchesArabicQuery } from "@/lib/arabic";

interface DoctorsDirectoryClientProps {
  allDoctors: DoctorCardItem[];
  departments: Array<{ id: number; slug: string; nameAr: string }>;
}

export function DoctorsDirectoryClient({
  allDoctors,
  departments,
}: DoctorsDirectoryClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptSlug, setSelectedDeptSlug] = useState<string>("all");

  const filteredDoctors = useMemo(() => {
    return allDoctors.filter((doc) => {
      const matchesDept =
        selectedDeptSlug === "all" || doc.department?.slug === selectedDeptSlug;
      if (!matchesDept) return false;

      if (!searchQuery.trim()) return true;

      const searchableText = [
        doc.nameAr,
        doc.professionalTitle,
        doc.primarySpecialty,
        doc.department?.nameAr || "",
        ...(doc.services?.map((s) => s.nameAr) || []),
      ].join(" ");

      return matchesArabicQuery(searchableText, searchQuery);
    });
  }, [allDoctors, selectedDeptSlug, searchQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDeptSlug("all");
  };

  const hasActiveFilters = Boolean(searchQuery.trim() || selectedDeptSlug !== "all");

  return (
    <div className="space-y-8">
      {/* شريط البحث العربي المُطبَّع وفلاتر الأقسام وزر إعادة التعيين */}
      <div className="bg-white rounded-[1.75rem] p-5 sm:p-7 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 relative">
            <label htmlFor="doctor-search-input" className="sr-only">
              ابحث باسم الطبيب أو القسم أو الخدمة
            </label>
            <Search className="w-5 h-5 text-[#756A71] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="doctor-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الطبيب (يدعم البحث بدون همزات أو تشكيل، مثل: عبدالعزيز، ابراهيم، العرفج...)"
              className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-full pr-12 pl-4 py-3.5 text-sm text-[#2B2027] placeholder:text-[#756A71]"
            />
          </div>

          <div className="lg:col-span-6 flex flex-wrap items-center gap-2 justify-start lg:justify-end">
            <button
              type="button"
              onClick={() => setSelectedDeptSlug("all")}
              className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDeptSlug === "all"
                  ? "bg-[#650D3D] text-white"
                  : "bg-[#F8F4F0] text-[#2B2027] border border-[#E9DFE4] hover:border-[#650D3D]"
              }`}
            >
              جميع الأقسام ({allDoctors.length})
            </button>

            {departments.map((dept) => {
              const count = allDoctors.filter(
                (d) => d.department?.slug === dept.slug
              ).length;
              return (
                <button
                  key={dept.slug}
                  type="button"
                  onClick={() => setSelectedDeptSlug(dept.slug)}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedDeptSlug === dept.slug
                      ? "bg-[#650D3D] text-white"
                      : "bg-[#F8F4F0] text-[#2B2027] border border-[#E9DFE4] hover:border-[#650D3D]"
                  }`}
                >
                  {dept.nameAr} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* شريط عدد النتائج وزر إعادة التعيين */}
        <div className="pt-4 border-t border-[#E9DFE4] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-[#2B2027] font-semibold">
            <Users className="w-4 h-4 text-[#F04491]" />
            <span aria-live="polite">
              عدد النتائج المعروضة:{" "}
              <strong className="text-[#650D3D]">{filteredDoctors.length}</strong> من أصل{" "}
              <strong className="text-[#650D3D]">{allDoctors.length}</strong> طبيبًا ومختصًا — اضغط على أي طبيب لعرض مهاراته وخدماته وجدول مواعيده
            </span>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#FFF0F6] hover:bg-[#F04491] text-[#650D3D] hover:text-white border border-[#F04491]/40 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>إعادة التعيين</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E9DFE4] flex items-start gap-3 text-xs sm:text-sm text-[#756A71] text-right">
        <Info className="w-5 h-5 text-[#650D3D] shrink-0 mt-0.5" />
        <span>
          يضم الدليل جميع الأسماء الـ 24 الواردة في قوائم الأقسام الثلاثة (9 في قسم الجسم، 7 في قسم الجلد، و8 في قسم الوجه). اضغط على بطاقة الطبيب للانتقال إلى صفحته التفصيلية.
        </span>
      </div>

      {/* شبكة البطاقات: كل طبيبين جنبًا إلى جنب (grid-cols-2) كما في الصورة المرجعية الأولى */}
      {filteredDoctors.length === 0 ? (
        <div className="bg-white rounded-[1.75rem] p-12 text-center border border-[#E9DFE4] space-y-4">
          <p className="text-lg font-bold text-[#650D3D]">
            لا توجد نتائج مطابقة لعبارة البحث «{searchQuery}»
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="bg-[#F04491] text-white font-bold text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>إعادة تعيين البحث والفلاتر</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
          {filteredDoctors.map((doc) => (
            <DoctorCard key={doc.slug} doctor={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
