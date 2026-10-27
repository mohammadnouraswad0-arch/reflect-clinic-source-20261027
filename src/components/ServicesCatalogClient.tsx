"use client";

import React, { useState, useMemo } from "react";
import { Search, RotateCcw } from "lucide-react";
import { ServiceIconCard } from "./ServiceIconCard";
import { EnrichedServiceItem } from "./InteractiveServicesSection";
import { matchesArabicQuery } from "@/lib/arabic";

interface ServicesCatalogClientProps {
  services: EnrichedServiceItem[];
  departments: Array<{ id: number; slug: string; nameAr: string }>;
}

export function ServicesCatalogClient({
  services,
  departments,
}: ServicesCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptSlug, setSelectedDeptSlug] = useState<string>("all");
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(
    null
  );

  const filteredServices = useMemo(() => {
    return services.filter((srv) => {
      const matchesDept =
        selectedDeptSlug === "all" || srv.department?.slug === selectedDeptSlug;
      if (!matchesDept) return false;
      if (!searchQuery.trim()) return true;

      const searchable = [
        srv.nameAr,
        srv.shortDescription,
        srv.fullDescription,
        srv.specialtyTag,
      ].join(" ");
      return matchesArabicQuery(searchable, searchQuery);
    });
  }, [services, selectedDeptSlug, searchQuery]);

  const handleReset = () => {
    setSearchQuery("");
    setSelectedDeptSlug("all");
  };

  return (
    <div className="space-y-8">
      {/* شريط البحث والتصفية لجميع الخدمات الـ 19 */}
      <div className="bg-white rounded-[1.75rem] p-5 sm:p-7 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-6 relative">
            <label htmlFor="service-search-input" className="sr-only">
              ابحث في الخدمات الـ 19
            </label>
            <Search className="w-5 h-5 text-[#756A71] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="service-search-input"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الخدمة (مثل: جراحة تجميلية، ترميم، ليزر، عيون، فكين...)"
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
                  : "bg-[#F8F4F0] text-[#2B2027] hover:border-[#650D3D] border border-[#E9DFE4]"
              }`}
            >
              جميع الخدمات ({services.length})
            </button>
            {departments.map((dept) => {
              const count = services.filter(
                (s) => s.department?.slug === dept.slug
              ).length;
              return (
                <button
                  key={dept.slug}
                  type="button"
                  onClick={() => setSelectedDeptSlug(dept.slug)}
                  className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    selectedDeptSlug === dept.slug
                      ? "bg-[#650D3D] text-white"
                      : "bg-[#F8F4F0] text-[#2B2027] hover:border-[#650D3D] border border-[#E9DFE4]"
                  }`}
                >
                  {dept.nameAr} ({count})
                </button>
              );
            })}
          </div>
        </div>

        <div className="pt-4 border-t border-[#E9DFE4] flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <span className="font-semibold text-[#2B2027]">
            عرض <strong className="text-[#650D3D]">{filteredServices.length}</strong> من أصل{" "}
            <strong className="text-[#650D3D]">{services.length}</strong> خدمة — اضغط على أي خدمة للانتقال لصفحة شرح الخدمة والأطباء المسؤولين عنها
          </span>
          {(searchQuery.trim() || selectedDeptSlug !== "all") && (
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

      {/* شبكة البطاقات: كل خدمتين جنبًا إلى جنب (grid-cols-2) على الجوال والحاسوب */}
      {filteredServices.length === 0 ? (
        <div className="bg-white rounded-[1.75rem] p-12 text-center border border-[#E9DFE4]">
          <p className="text-lg font-bold text-[#650D3D] mb-3">
            لا توجد خدمات مطابقة لعبارة البحث الحالية
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="bg-[#F04491] text-white font-bold text-sm px-6 py-3 rounded-full cursor-pointer"
          >
            إعادة تعيين البحث
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
          {filteredServices.map((srv) => (
            <ServiceIconCard
              key={srv.slug}
              service={srv}
              isActive={srv.slug === selectedServiceSlug}
              onSelect={(slug) => setSelectedServiceSlug(slug)}
              navigateOnClick={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
