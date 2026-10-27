import React from "react";
import Link from "next/link";
import { Calendar, Sparkles } from "lucide-react";

export function FinalBookingBanner() {
  return (
    <section className="py-12 sm:py-16 bg-[#F8F4F0]">
      <div className="reflect-container">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#650D3D] px-6 py-12 sm:px-12 sm:py-16 text-white shadow-xl border border-white/15">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/5"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-[#F04491]/15"
          />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 text-right">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#C5D6A0] text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-[#F04491]" />
                <span>REFLECT CLINIC · عيادات ريفلكت</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">
                موعدك القادم يبدأ بخطوة
              </h2>

              <p className="text-base sm:text-lg text-[#F8F4F0]/90 leading-relaxed">
                اختر الخدمة والطبيب المناسبين، وحدد الموعد المطلوب ليقوم فريق العيادة بالتواصل معك وتأكيده.
              </p>
            </div>

            <div className="shrink-0">
              <Link
                href="/book"
                className="inline-flex items-center gap-3 bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-base sm:text-lg px-9 py-4 rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <Calendar className="w-5 h-5" />
                <span>احجز الآن</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
