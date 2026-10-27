import React from "react";
import { Clock, PhoneCall, Calendar } from "lucide-react";
import Link from "next/link";

export interface OpeningHourDay {
  dayAr: string;
  isWorking: boolean;
  shifts: string[];
}

interface OpeningHoursProps {
  verified: boolean;
  schedule: OpeningHourDay[];
  phone?: string;
}

export function OpeningHours({
  verified,
  schedule,
  phone = "+966 11 222 0555",
}: OpeningHoursProps) {
  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E9DDE2] shadow-xs text-right">
      <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-[#E9DDE2]">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F2EF] text-[#5A103A] flex items-center justify-center border border-[#E9DDE2]">
            <Clock className="w-6 h-6 text-[#E94D91]" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-[#5A103A]">
              ساعات العمل واستقبال المراجعين
            </h3>
            <p className="text-xs text-[#756A70]">
              تخضع مواعيد العيادات لجداول الأطباء الاستشاريين
            </p>
          </div>
        </div>
      </div>

      {!verified ? (
        <div className="bg-[#F7F2EF] rounded-2xl p-5 border border-[#DCA0B2]/60 space-y-3">
          <p className="text-base sm:text-lg font-extrabold text-[#5A103A]">
            يرجى التواصل لمعرفة ساعات العمل
          </p>
          <p className="text-xs sm:text-sm text-[#756A70] leading-relaxed">
            تختلف فترات تواجد الأطباء الاستشاريين بحسب القسم والتخصص. يمكنك الاطلاع على الفترات المتاحة لكل طبيب مباشرة عبر نظام الحجز الإلكتروني أو التواصل مع منسق العيادة.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s+/g, "")}`}
              className="inline-flex items-center gap-2 bg-[#5A103A] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full"
            >
              <PhoneCall className="w-4 h-4 text-[#E94D91]" />
              <span dir="ltr">{phone}</span>
            </a>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 bg-[#E94D91] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full"
            >
              <Calendar className="w-4 h-4" />
              <span>استعرض مواعيد الأطباء المتاحة</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {schedule.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 rounded-xl bg-[#F7F2EF]/70 border border-[#E9DDE2]"
            >
              <span className="font-bold text-sm text-[#2B2228]">{item.dayAr}</span>
              {item.isWorking ? (
                <div className="flex flex-wrap gap-2">
                  {item.shifts.map((shift, sIdx) => (
                    <span
                      key={sIdx}
                      className="text-xs sm:text-sm font-semibold text-[#5A103A] bg-white px-3 py-1 rounded-full border border-[#E9DDE2]"
                    >
                      {shift}
                    </span>
                  ))}
                </div>
              ) : (
                <span className="text-xs font-bold text-[#756A70] bg-white px-3 py-1 rounded-full border border-[#E9DDE2]">
                  إجازة
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
