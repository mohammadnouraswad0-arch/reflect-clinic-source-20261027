import React from "react";
import Link from "next/link";
import {
  Phone,
  MessageCircle,
  Calendar,
  ExternalLink,
  MapPin,
  ArrowLeft,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export function ContactSection() {
  return (
    <section className="py-16 lg:py-22 bg-white border-t border-[#E9DFE4]">
      <div className="reflect-container">
        <div className="bg-[#F8F4F0] rounded-[2rem] p-7 sm:p-10 lg:p-12 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-right">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E9DFE4] text-[#650D3D] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-[#C5D6A0]" />
                <span>التواصل المباشر وواتساب</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-bold text-[#650D3D] tracking-tight">
                تواصل مع عيادات ريفلكت
              </h2>

              <p className="text-sm sm:text-base text-[#756A71] leading-relaxed max-w-2xl">
                يسعد فريق تنسيق المواعيد في REFLECT CLINIC بالإجابة عن استفساراتكم ومساعدتكم في اختيار القسم أو الطبيب المناسب عبر قنوات التواصل الرسمية.
              </p>

              {/* أزرار الحجز والاتصال وواتساب وإنستغرام */}
              <div className="pt-3 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/book"
                  className="bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>احجز الآن</span>
                </Link>

                {SITE_CONFIG.contact.phoneAvailable && (
                  <a
                    href={SITE_CONFIG.contact.phoneHref}
                    className="bg-[#650D3D] hover:bg-[#4e092f] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2"
                  >
                    <Phone className="w-4 h-4 text-[#C5D6A0]" />
                    <span dir="ltr">{SITE_CONFIG.contact.phoneDisplay}</span>
                  </a>
                )}

                {SITE_CONFIG.contact.whatsappAvailable && (
                  <a
                    href={SITE_CONFIG.contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white hover:bg-[#650D3D] text-[#650D3D] hover:text-white border-2 border-[#650D3D] font-bold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all inline-flex items-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4 text-[#F04491]" />
                    <span>تواصل عبر واتساب</span>
                  </a>
                )}

                <a
                  href={SITE_CONFIG.contact.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-[#FFF0F6] text-[#650D3D] border border-[#E9DFE4] font-bold text-sm px-6 py-3.5 rounded-full transition-all inline-flex items-center gap-2"
                >
                  <span>إنستغرام الرسمي</span>
                  <ExternalLink className="w-4 h-4 text-[#F04491]" />
                </a>
              </div>
            </div>

            {/* روابط صفحات التواصل والموقع */}
            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              <Link
                href="/contact"
                className="bg-white rounded-2xl p-5 border border-[#E9DFE4] hover:border-[#650D3D] transition-all flex items-center justify-between group"
              >
                <div>
                  <h3 className="font-bold text-base text-[#650D3D] group-hover:text-[#F04491] transition-colors">
                    صفحة تواصل معنا ونموذج المراسلة
                  </h3>
                  <p className="text-xs text-[#756A71] mt-1">
                    أرسل استفسارك مباشرة لفريق خدمة المراجعين
                  </p>
                </div>
                <ArrowLeft className="w-5 h-5 text-[#650D3D] group-hover:text-[#F04491] shrink-0" />
              </Link>

              <Link
                href="/location"
                className="bg-white rounded-2xl p-5 border border-[#E9DFE4] hover:border-[#650D3D] transition-all flex items-center justify-between group"
              >
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#F04491] shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-base text-[#650D3D] group-hover:text-[#F04491] transition-colors">
                      موقع العيادة والعنوان
                    </h3>
                    <p className="text-xs text-[#756A71] mt-1">
                      {SITE_CONFIG.contact.cityAr}
                    </p>
                  </div>
                </div>
                <ArrowLeft className="w-5 h-5 text-[#650D3D] group-hover:text-[#F04491] shrink-0" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
