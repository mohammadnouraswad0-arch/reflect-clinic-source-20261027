"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  ArrowLeft,
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Sparkles,
  Phone,
  MessageCircle,
  MapPin,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";
import { ScrollReveal } from "./ScrollReveal";

interface HeroSectionProps {
  customHeroImageUrl?: string;
}

export function HeroSection({ customHeroImageUrl }: HeroSectionProps) {
  const defaultHeroUrl = customHeroImageUrl || SITE_CONFIG.media.heroPhoto.url;
  const [imgSrc, setImgSrc] = useState(defaultHeroUrl);

  const welcomeFeatures = [
    {
      icon: Sparkles,
      title: "عناية طبية وتجميلية متكاملة",
      description:
        "نجمع بين أحدث تقنيات الجلدية والليزر والحقن التجميلي والجراحات التجميلية والترميمية.",
    },
    {
      icon: Stethoscope,
      title: "24 طبيبًا ومختصًا في 3 أقسام",
      description:
        "فريق متخصص في أقسام الجسم، الجلد، والوجه والأنف والعيون والفكين.",
    },
    {
      icon: HeartPulse,
      title: "خطة رعاية مصممة لاحتياجكِ",
      description:
        "استشارة طبية دقيقة تضع راحتكِ وجمالكِ الطبيعي وسلامتكِ في المقام الأول.",
    },
    {
      icon: ShieldCheck,
      title: "خصوصية وتجربة حجز سلسة",
      description:
        "بيئة راقية تحترم خصوصيتكِ مع إمكانية اختيار الخدمة والطبيب والموعد إلكترونيًا.",
    },
  ];

  return (
    <>
      {/* 2. Full-Width Luxury Hero Section (VetHelpClinic & Florya Inspired) */}
      <section
        aria-label="الواجهة الرئيسية — عيادات ريفلكت"
        className="relative w-full overflow-hidden bg-[#3B0822]"
      >
        <div className="relative w-full min-h-[580px] sm:min-h-[660px] lg:min-h-[760px] flex flex-col justify-end">
          {/* الصورة الفوتوغرافية الحقيقية للعيادة مع حركة الظهور السينمائية وضبط القص المتجاوب */}
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={imgSrc}
              alt={SITE_CONFIG.media.heroPhoto.altAr}
              onError={() => {
                if (imgSrc !== SITE_CONFIG.media.heroPhoto.fallbackUrl) {
                  setImgSrc(SITE_CONFIG.media.heroPhoto.fallbackUrl);
                }
              }}
              className="w-full h-full object-cover object-[28%_center] sm:object-[center_25%] lg:object-[center_22%] animate-hero-image select-none"
            />

            {/* تدرج عنابي دافئ ومدروس يبرز تفاصيل الاستشارة الطبية والتجميلية ويضمن وضوح النص العربي على اليمين والأسفل */}
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-[#2D061B]/95 via-[#520D31]/55 to-black/10 sm:via-[#520D31]/45 lg:bg-gradient-to-l lg:from-[#380820]/90 lg:via-[#580E35]/52 lg:to-transparent"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-60 bg-gradient-to-t from-[#2A0518]/90 via-[#2A0518]/55 to-transparent"
            />
          </div>

          {/* محتوى الـ Hero العربي (RTL) */}
          <div className="reflect-container relative z-10 w-full pt-36 pb-10 sm:pt-44 sm:pb-14 lg:py-20">
            <div className="max-w-2xl text-right space-y-4 sm:space-y-6">
              {/* شارة الموقع والهوية */}
              <div className="animate-fade-up-1 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/14 backdrop-blur-md border border-[#D8C3A5]/45 text-white shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#D8C3A5]" />
                <span className="text-xs sm:text-sm font-bold tracking-wide text-[#F7F3EF]">
                  REFLECT CLINIC · الرياض — حي المحمدية
                </span>
              </div>

              {/* العنوان العربي الرئيسي الفاخر */}
              <h1 className="animate-fade-up-2 text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.2] tracking-tight drop-shadow-sm">
                جمالك يبدأ من هنا
              </h1>

              {/* النص الداعم */}
              <p className="animate-fade-up-3 text-base sm:text-xl lg:text-2xl text-[#F7F3EF]/95 leading-relaxed font-medium max-w-xl drop-shadow-xs">
                اكتشفي خدماتنا الطبية والتجميلية مع فريق متخصص يهتم بجمالك وراحتك.
              </p>

              {/* شريط التخصصات المختصر على غرار الموقع المرجعي */}
              <p className="animate-fade-up-3 text-xs sm:text-sm text-[#D8C3A5] font-bold tracking-wide">
                جراحة تجميلية · جلدية وليزر · حقن تجميلي · تجميل الوجه والأنف · تجميل النساء · تأهيل لمفاوي
              </p>

              {/* أزرار الدعوة للإجراء (Primary & Secondary CTAs) */}
              <div className="animate-fade-up-4 pt-2 flex flex-wrap items-center gap-3.5 sm:gap-4">
                <Link
                  href="/book"
                  className="bg-[#E94D91] hover:bg-[#d43b7e] text-white font-extrabold text-sm sm:text-lg px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-[0_12px_28px_rgba(233,77,145,0.38)] hover:shadow-[0_16px_34px_rgba(233,77,145,0.5)] hover:-translate-y-0.5 transition-all inline-flex items-center gap-2.5"
                >
                  <Calendar className="w-5 h-5" />
                  <span>احجزي موعدك الآن</span>
                </Link>

                <a
                  href="#interactive-services"
                  className="bg-white/15 hover:bg-white text-white hover:text-[#65143D] backdrop-blur-md border border-[#D8C3A5]/60 font-extrabold text-sm sm:text-lg px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-sm hover:-translate-y-0.5 transition-all inline-flex items-center gap-2"
                >
                  <span>اكتشفي خدماتنا</span>
                  <ArrowLeft className="w-5 h-5" />
                </a>
              </div>

              {/* روابط سريعة للهاتف وواتساب والموقع أسفل أزرار الـ Hero */}
              <div className="animate-fade-up-4 pt-3 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#F7F3EF]/90">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#D8C3A5]" />
                  <span>طريق الأمير تركي الأول، حي المحمدية، الرياض</span>
                </span>
                {SITE_CONFIG.contact.phoneAvailable && (
                  <a
                    href={SITE_CONFIG.contact.phoneHref}
                    className="inline-flex items-center gap-1.5 font-bold text-[#D8C3A5] hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span dir="ltr">{SITE_CONFIG.contact.phoneDisplay}</span>
                  </a>
                )}
                {SITE_CONFIG.contact.whatsappAvailable && (
                  <a
                    href={SITE_CONFIG.contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-[#C5D6A0] hover:text-white transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>واتساب مباشر</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Clinic Introduction and Welcome Message */}
      <section
        aria-label="ترحيب وتعريف بعيادات ريفلكت"
        className="py-14 sm:py-18 lg:py-22 bg-[#F7F3EF] relative"
      >
        <div className="reflect-container">
          <ScrollReveal>
            <div className="bg-white rounded-[2.25rem] p-7 sm:p-10 lg:p-12 border border-[#E8DFD8] shadow-[0_12px_36px_rgb(101_20_61/6%)]">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-right">
                <div className="lg:col-span-5 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F3EF] border border-[#D8C3A5]/60 text-[#65143D] text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#E94D91]" />
                    <span>مرحبًا بكِ في عيادات ريفلكت</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#65143D] leading-snug">
                    حيث تلتقي الخبرة الطبية بالفخامة والاهتمام بالتفاصيل
                  </h2>

                  <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                    في <strong className="text-[#65143D]">Reflect Clinic</strong>، نصمم كل تفصيلة في رحلتكِ العلاجية والتجميلية لتمنحكِ الطمأنينة والوضوح، بدءًا من الاستشارة المتخصصة مع نخبة الأطباء وحتى المتابعة الدقيقة.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <Link
                      href="/about"
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#65143D] hover:text-[#E94D91] transition-colors"
                    >
                      <span>تعرّفي أكثر على رؤيتنا</span>
                      <ArrowLeft className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {welcomeFeatures.map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-[#F7F3EF]/85 hover:bg-[#F7F3EF] rounded-2xl p-5 border border-[#E8DFD8] hover:border-[#D8C3A5] transition-all text-right flex flex-col items-start"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white border border-[#E8DFD8] text-[#65143D] flex items-center justify-center mb-3 shadow-2xs">
                          <Icon className="w-5 h-5 text-[#E94D91]" strokeWidth={1.85} />
                        </div>
                        <h3 className="text-base font-bold text-[#65143D] mb-1">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-[#756A71] leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
