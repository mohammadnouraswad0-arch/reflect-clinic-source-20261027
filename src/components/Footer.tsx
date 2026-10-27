import React from "react";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Clock, ExternalLink, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export function Footer() {
  return (
    <footer className="bg-[#650D3D] text-[#F8F4F0] pt-16 pb-10 border-t border-white/15 mt-auto">
      <div className="reflect-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/15 text-right">
          {/* العمود الأول: الهوية ونبذة */}
          <div className="lg:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-11 h-11 rounded-full border-2 border-[#C5D6A0] bg-white flex items-center justify-center">
                <span className="text-[#650D3D] font-bold text-lg">R</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-white font-bold text-xl tracking-tight">
                  {SITE_CONFIG.nameEn}
                </span>
                <span className="text-[#C5D6A0] font-semibold text-xs mt-0.5">
                  {SITE_CONFIG.nameAr}
                </span>
              </div>
            </Link>

            <p className="text-sm text-[#F8F4F0]/85 leading-relaxed max-w-sm">
              {SITE_CONFIG.heroSubtitleAr} نقدم خدماتنا ضمن ثلاثة أقسام رئيسية: قسم الجسم، قسم الجلد، وقسم الوجه، مع التزام تام بالوضوح والخصوصية.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <a
                href={SITE_CONFIG.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#F04491] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
              >
                <span>إنستغرام الرسمي</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              {SITE_CONFIG.contact.whatsappAvailable && (
                <a
                  href={SITE_CONFIG.contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#F04491] text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <span>واتساب</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* العمود الثاني: روابط الصفحات الأساسية */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-base font-bold text-[#C5D6A0]">صفحات الموقع</h3>
            <ul className="grid grid-cols-2 gap-2.5 text-sm text-[#F8F4F0]/85">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  الرئيسية
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  الخدمات
                </Link>
              </li>
              <li>
                <Link href="/departments" className="hover:text-white transition-colors">
                  الأقسام
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  من نحن
                </Link>
              </li>
              <li>
                <Link href="/doctors" className="hover:text-white transition-colors">
                  الأطباء
                </Link>
              </li>
              <li>
                <Link href="/book" className="hover:text-[#F04491] font-bold transition-colors">
                  احجز موعدًا
                </Link>
              </li>
              <li>
                <Link href="/how-to-book" className="hover:text-white transition-colors">
                  كيف تحجز
                </Link>
              </li>
              <li>
                <Link href="/working-hours" className="hover:text-white transition-colors">
                  ساعات العمل
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link href="/location" className="hover:text-white transition-colors">
                  موقع العيادة
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود الثالث: الأقسام الطبية الثلاثة */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-base font-bold text-[#C5D6A0]">الأقسام</h3>
            <ul className="space-y-2.5 text-sm text-[#F8F4F0]/85">
              <li>
                <Link href="/departments/body" className="hover:text-white transition-colors">
                  قسم الجسم
                </Link>
              </li>
              <li>
                <Link href="/departments/skin" className="hover:text-white transition-colors">
                  قسم الجلد
                </Link>
              </li>
              <li>
                <Link href="/departments/face" className="hover:text-white transition-colors">
                  قسم الوجه
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-[#C5D6A0] hover:text-white"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>لوحة الإدارة</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* العمود الرابع: التواصل وساعات العمل */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-base font-bold text-[#C5D6A0]">التواصل والموقع</h3>
            <div className="space-y-2.5 text-xs sm:text-sm text-[#F8F4F0]/90">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#F04491] shrink-0 mt-1" />
                <span>{SITE_CONFIG.contact.addressAr}</span>
              </p>
              {SITE_CONFIG.contact.phoneAvailable && (
                <p className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#F04491] shrink-0" />
                  <a
                    href={SITE_CONFIG.contact.phoneHref}
                    dir="ltr"
                    className="hover:text-white font-bold"
                  >
                    {SITE_CONFIG.contact.phoneDisplay}
                  </a>
                </p>
              )}
              {SITE_CONFIG.contact.whatsappAvailable && (
                <p className="flex items-center gap-2.5">
                  <MessageCircle className="w-4 h-4 text-[#F04491] shrink-0" />
                  <a
                    href={SITE_CONFIG.contact.whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white font-bold"
                  >
                    تواصل عبر واتساب
                  </a>
                </p>
              )}
              <p className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#C5D6A0] shrink-0 mt-1" />
                <span>السبت – الخميس: 10:00 صباحًا – 9:00 مساءً · الجمعة: عطلة</span>
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F8F4F0]/75">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.nameEn} — {SITE_CONFIG.nameAr}. جميع الحقوق محفوظة.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
