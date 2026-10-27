"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Clock, Phone, MessageCircle, Calendar } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";
import { computeClinicWorkingStatus, ClinicHoursStatus } from "@/lib/workingHours";

export function WorkingHoursTable() {
  const [status, setStatus] = useState<ClinicHoursStatus>(() =>
    computeClinicWorkingStatus(new Date())
  );

  useEffect(() => {
    const updateStatus = () => {
      setStatus(computeClinicWorkingStatus(new Date()));
    };
    updateStatus();
    const intervalId = window.setInterval(updateStatus, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const badgeColors =
    status.statusCode === "open"
      ? "bg-[#C5D6A0]/40 text-[#2B2027] border-[#650D3D]/20"
      : status.statusCode === "holiday"
      ? "bg-[#FFF0F6] text-[#650D3D] border-[#F04491]/40"
      : "bg-[#F8F4F0] text-[#650D3D] border-[#E9DFE4]";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* البطاقة البيضاء لمواعيد العمل مطابقة للصورة المرجعية الثانية */}
      <div className="bg-white rounded-[2rem] p-6 sm:p-9 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] text-right">
        {/* رأس الجدول: أيقونة الساعة على اليمين وعنوان مواعيد العمل + حالة الدوام */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#F3E6EC] text-[#7D1048] flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#1F171C]">
                مواعيد العمل
              </h2>
              <p className="text-xs text-[#756A71] mt-0.5">
                {status.detailTextAr}
              </p>
            </div>
          </div>

          <div
            aria-live="polite"
            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold border ${badgeColors}`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                status.statusCode === "open" ? "bg-[#198754]" : "bg-[#7D1048]"
              }`}
            />
            <span>{status.statusLabel}</span>
          </div>
        </div>

        {/* صفوف أيام الأسبوع: اليوم على اليمين والساعات على اليسار كما في الصورة المرجعية */}
        <div className="divide-y divide-[#EFE8EC]">
          {SITE_CONFIG.workingHours.map((item) => {
            const isToday = item.dayIndex === status.currentDayIndex;
            return (
              <div
                key={item.dayIndex}
                data-today={isToday ? "true" : "false"}
                className={`py-4 px-2 sm:px-3 flex items-center justify-between gap-4 rounded-xl transition-colors ${
                  isToday ? "bg-[#FFF0F6]/80 font-bold" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`text-base sm:text-xl ${
                      isToday
                        ? "font-bold text-[#7D1048]"
                        : "font-medium text-[#1F171C]"
                    }`}
                  >
                    {item.dayNameAr}
                  </span>
                  {isToday && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#7D1048] text-white text-[11px] font-bold">
                      اليوم
                    </span>
                  )}
                </div>

                <span
                  dir="ltr"
                  className={`text-sm sm:text-lg ${
                    item.isHoliday
                      ? "font-bold text-[#7D1048]"
                      : isToday
                      ? "font-bold text-[#7D1048]"
                      : "font-normal text-[#5A5056]"
                  }`}
                >
                  {item.isHoliday ? "عطلة" : "10:00 – 21:00"}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-[11px] sm:text-xs text-[#756A71] mt-4 pt-3 border-t border-[#EFE8EC]">
          * الدوام من السبت إلى الخميس (10:00 صباحًا – 9:00 مساءً)، والجمعة عطلة أسبوعية (جدول أولي يخضع للاعتماد النهائي).
        </p>
      </div>

      {/* الأزرار أسفل جدول مواعيد العمل مباشرة مطابقة للصورة المرجعية الثانية */}
      <div className="space-y-3.5">
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
          {SITE_CONFIG.contact.directionsAvailable && (
            <a
              href={SITE_CONFIG.contact.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="border-2 border-[#7D1048] bg-white hover:bg-[#7D1048] text-[#7D1048] hover:text-white font-bold text-sm sm:text-lg py-3.5 sm:py-4 px-4 rounded-full text-center transition-all flex items-center justify-center"
            >
              احصل على الاتجاهات
            </a>
          )}

          {SITE_CONFIG.contact.phoneAvailable && (
            <a
              href={SITE_CONFIG.contact.phoneHref}
              className="bg-[#B84A14] hover:bg-[#9E3E10] text-white font-bold text-sm sm:text-lg py-3.5 sm:py-4 px-4 rounded-full text-center shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <Phone className="w-5 h-5" />
              <span>اتصل الآن</span>
            </a>
          )}
        </div>

        {SITE_CONFIG.contact.whatsappAvailable && (
          <a
            href={SITE_CONFIG.contact.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#198754] hover:bg-[#146c43] text-white font-bold text-base sm:text-lg py-4 px-6 rounded-full text-center shadow-sm transition-all flex items-center justify-center gap-2.5"
          >
            <MessageCircle className="w-5 h-5" />
            <span>راسلنا على واتساب</span>
          </a>
        )}

        <Link
          href="/book"
          className="w-full bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-base sm:text-lg py-4 px-6 rounded-full text-center shadow-sm transition-all flex items-center justify-center gap-2.5"
        >
          <Calendar className="w-5 h-5" />
          <span>احجز الآن</span>
        </Link>
      </div>
    </div>
  );
}
