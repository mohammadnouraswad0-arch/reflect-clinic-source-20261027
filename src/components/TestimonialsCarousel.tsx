"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronRight, ChevronLeft, Quote, Star, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

export interface TestimonialItem {
  id: number | string;
  reviewerName: string;
  rating: number;
  comment: string;
  tagAr?: string;
}

const DEFAULT_EXPERIENCE_SLIDES: TestimonialItem[] = [
  {
    id: "exp-1",
    reviewerName: "مراجعة — قسم الجلد والليزر",
    rating: 5,
    tagAr: "تجربة الاستشارة والعناية بالبشرة",
    comment:
      "رقي واضح في الاستقبال والاهتمام بالتفاصيل منذ لحظة الوصول، وشرح وافٍ وواضح للخطة المناسبة لبشرتي دون أي استعجال.",
  },
  {
    id: "exp-2",
    reviewerName: "مراجعة — قسم الوجه",
    rating: 5,
    tagAr: "سهولة الحجز وتنظيم المواعيد",
    comment:
      "أعجبني وضوح الموقع وسهولة اختيار الخدمة والطبيب المختص مباشرة، وتواصل معي فريق التنسيق باحترافية عالية لتأكيد الموعد.",
  },
  {
    id: "exp-3",
    reviewerName: "مراجعة — قسم الجسم والتأهيل",
    rating: 5,
    tagAr: "الخصوصية والمتابعة الطبية",
    comment:
      "بيئة هادئة ومريحة جدًا تحترم الخصوصية، واهتمام حقيقي بمتابعة المراجعة خطوة بخطوة في كل زيارة.",
  },
];

interface TestimonialsCarouselProps {
  reviews?: TestimonialItem[];
}

export function TestimonialsCarousel({ reviews = [] }: TestimonialsCarouselProps) {
  const slides = reviews.length > 0 ? reviews : DEFAULT_EXPERIENCE_SLIDES;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const timer = window.setInterval(handleNext, 5500);
    return () => window.clearInterval(timer);
  }, [isPaused, slides.length, handleNext]);

  const currentSlide = slides[activeIndex] || slides[0];

  return (
    <section
      aria-label="تجارب وانطباعات المراجعات"
      className="py-16 lg:py-22 bg-white border-t border-[#E8DFD8] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="reflect-container">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 text-right">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EF] border border-[#D8C3A5]/60 text-[#65143D] text-xs font-bold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-[#E94D91]" />
                <span>تجربة المراجعات في ريفلكت</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#65143D] tracking-tight mb-2">
                ثقة نعتز بها في كل خطوة
              </h2>
              <p className="text-sm sm:text-base text-[#756A71]">
                انطباعات حول مستوى الضيافة، وضوح الاستشارة، وسلاسة تجربة الحجز والمتابعة في عيادات ريفلكت.
              </p>
            </div>

            {/* أزرار التنقل بين الشرائح */}
            <div className="flex items-center gap-2.5 self-start md:self-auto">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="الشريحة السابقة"
                className="w-11 h-11 rounded-full bg-[#F7F3EF] hover:bg-[#65143D] text-[#65143D] hover:text-white border border-[#E8DFD8] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="الشريحة التالية"
                className="w-11 h-11 rounded-full bg-[#F7F3EF] hover:bg-[#65143D] text-[#65143D] hover:text-white border border-[#E8DFD8] flex items-center justify-center transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* بطاقة الشريحة النشطة */}
          <div className="relative rounded-[2.25rem] bg-gradient-to-br from-[#65143D] to-[#470C2A] text-white p-7 sm:p-12 lg:p-14 shadow-[0_20px_50px_rgba(101,20,61,0.18)] border border-[#D8C3A5]/30">
            <Quote
              aria-hidden="true"
              className="w-14 h-14 sm:w-20 sm:h-20 text-[#D8C3A5]/15 absolute top-6 left-6 sm:top-8 sm:left-10 pointer-events-none"
            />

            <div
              key={currentSlide.id}
              aria-live="polite"
              className="relative z-10 max-w-3xl text-right space-y-6 transition-all duration-500"
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 text-[#D8C3A5]">
                  {Array.from({
                    length: Math.min(5, Math.max(1, currentSlide.rating || 5)),
                  }).map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                {currentSlide.tagAr && (
                  <span className="px-3 py-1 rounded-full bg-white/12 text-[#D8C3A5] text-xs font-bold border border-[#D8C3A5]/30">
                    {currentSlide.tagAr}
                  </span>
                )}
              </div>

              <blockquote className="text-lg sm:text-2xl lg:text-3xl font-bold leading-relaxed text-[#F7F3EF]">
                «{currentSlide.comment}»
              </blockquote>

              <div className="pt-2 flex items-center justify-between border-t border-white/15">
                <span className="text-sm sm:text-base font-extrabold text-[#D8C3A5]">
                  {currentSlide.reviewerName}
                </span>

                {/* نقاط المؤشر */}
                <div className="flex items-center gap-2">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`الانتقال إلى التقييم رقم ${idx + 1}`}
                      className={`h-2.5 rounded-full transition-all cursor-pointer ${
                        idx === activeIndex
                          ? "w-8 bg-[#E94D91]"
                          : "w-2.5 bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
