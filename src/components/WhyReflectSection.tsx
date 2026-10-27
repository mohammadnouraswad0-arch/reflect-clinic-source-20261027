"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Info, Calendar } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export function WhyReflectSection() {
  const aboutMedia = SITE_CONFIG.media.aboutPrimaryPhoto;
  const [imgSrc, setImgSrc] = useState(aboutMedia.url);
  const [showSource, setShowSource] = useState(false);

  const pillars = [
    "تنظيم الخدمات الطبية والتجميلية ضمن ثلاثة أقسام واضحة: الجسم، الجلد، والوجه.",
    "ربط كل خدمة بالأطباء المسجلين لتقديمها مع عرض تفاصيل كل خدمة في صفحة مستقلة.",
    "وضوح خطوات طلب الموعد والشفافية بشأن تأكيد الحجز من منسق العيادة.",
    "احترام خصوصية المراجعين وجمع الحد الأدنى الضروري فقط من بيانات التواصل.",
  ];

  return (
    <section className="py-16 lg:py-22 bg-[#F8F4F0] border-t border-[#E9DFE4]">
      <div className="reflect-container">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* الصورة الفوتوغرافية المرخصة مع Lazy Loading ومعالجة الخطأ */}
          <div className="lg:col-span-6 relative order-2 lg:order-1">
            <div
              aria-hidden="true"
              className="absolute -inset-3 rounded-[2rem] bg-white/70 border border-[#E9DFE4]"
            />
            <div className="relative rounded-[1.75rem] overflow-hidden bg-[#650D3D] border border-[#E9DFE4] shadow-md aspect-[4/3]">
              <img
                src={imgSrc}
                alt={aboutMedia.altAr}
                loading="lazy"
                onError={() => {
                  if (imgSrc !== aboutMedia.fallbackUrl) {
                    setImgSrc(aboutMedia.fallbackUrl);
                  }
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#650D3D]/60 via-transparent to-transparent" />

              <div className="absolute bottom-4 right-4 left-4 bg-white/95 backdrop-blur-md rounded-2xl px-4 py-3 border border-[#E9DFE4] flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-[#650D3D]">
                  بيئة رعاية طبية وتجميلية هادئة ومعاصرة
                </span>
                <button
                  type="button"
                  onClick={() => setShowSource((v) => !v)}
                  className="w-7 h-7 rounded-full bg-[#F8F4F0] hover:bg-[#650D3D] text-[#650D3D] hover:text-white flex items-center justify-center transition-colors"
                  aria-label="عرض معلومات مصدر الصورة"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
              </div>

              {showSource && (
                <div className="absolute top-4 right-4 left-4 bg-[#2B2027]/95 text-white rounded-2xl p-3 text-xs leading-relaxed border border-white/15">
                  <p>{aboutMedia.credit}</p>
                </div>
              )}
            </div>
          </div>

          {/* المحتوى التحريري لقسم من نحن */}
          <div className="lg:col-span-6 text-right space-y-5 order-1 lg:order-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E9DFE4] text-[#650D3D] text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-[#C5D6A0]" />
              <span>من نحن · رؤيتنا في العناية</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-bold text-[#650D3D] tracking-tight">
              تعرّف على قصتنا ورؤيتنا في العناية
            </h2>

            <p className="text-base sm:text-lg text-[#2B2027] leading-relaxed">
              في عيادات «ريفلكت» (REFLECT CLINIC)، نؤمن أن الرعاية الطبية والتجميلية تبدأ من الإصغاء الدقيق لاحتياجات المراجع، وتوفير بيئة تحترم الخصوصية وتضع السلامة والوضوح في المقام الأول.
            </p>

            <ul className="space-y-3 pt-1">
              {pillars.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm sm:text-base text-[#756A71]"
                >
                  <CheckCircle2 className="w-5 h-5 text-[#F04491] shrink-0 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className="pt-3 flex flex-wrap items-center gap-3.5">
              <Link
                href="/about"
                className="inline-flex items-center gap-2.5 bg-[#650D3D] hover:bg-[#4e092f] text-white font-bold text-base px-8 py-3.5 rounded-full shadow-sm transition-all"
              >
                <span>تعرّف على قصتنا</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>

              <Link
                href="/book"
                className="inline-flex items-center gap-2 bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-base px-7 py-3.5 rounded-full shadow-sm transition-all"
              >
                <Calendar className="w-4 h-4" />
                <span>احجز موعدًا</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
