"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, Calendar, Phone, ShieldCheck } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const primaryNav = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "الخدمات" },
    {
      href: "/departments",
      label: "الأقسام",
      subItems: [
        { href: "/departments", label: "جميع الأقسام الثلاثة" },
        { href: "/departments/body", label: "قسم الجسم" },
        { href: "/departments/skin", label: "قسم الجلد" },
        { href: "/departments/face", label: "قسم الوجه" },
      ],
    },
    { href: "/about", label: "من نحن" },
    { href: "/doctors", label: "الأطباء" },
    { href: "/working-hours", label: "ساعات العمل" },
    {
      href: "/how-to-book",
      label: "دليل المراجع",
      subItems: [
        { href: "/how-to-book", label: "كيف تحجز" },
        { href: "/faq", label: "الأسئلة الشائعة" },
        { href: "/location", label: "موقع العيادة" },
        { href: "/contact", label: "تواصل معنا" },
        { href: "/privacy", label: "سياسة الخصوصية" },
      ],
    },
  ];

  const allMobileLinks = [
    { href: "/", label: "الرئيسية" },
    { href: "/services", label: "الخدمات (19 خدمة)" },
    { href: "/departments", label: "الأقسام الثلاثة" },
    { href: "/about", label: "من نحن" },
    { href: "/doctors", label: "الأطباء (24 طبيبًا)" },
    { href: "/book", label: "احجزي موعدك الآن" },
    { href: "/how-to-book", label: "كيف تحجز" },
    { href: "/working-hours", label: "ساعات العمل" },
    { href: "/faq", label: "الأسئلة الشائعة" },
    { href: "/contact", label: "تواصل معنا" },
    { href: "/location", label: "موقع العيادة" },
    { href: "/privacy", label: "سياسة الخصوصية" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgb(101_20_61/8%)] border-b border-[#D8C3A5]/40 h-18"
          : "bg-[#F7F3EF]/92 backdrop-blur-sm border-b border-[#E8DFD8] h-20"
      }`}
    >
      <div className="reflect-container h-full flex items-center justify-between gap-4">
        {/* الشعار والعلامة */}
        <Link
          href="/"
          className="flex items-center gap-3 group"
          aria-label="REFLECT CLINIC — عيادات ريفلكت — الصفحة الرئيسية"
        >
          <div className="w-11 h-11 rounded-full border-2 border-[#65143D] bg-white flex items-center justify-center shadow-2xs group-hover:border-[#E94D91] transition-colors">
            <span className="text-[#65143D] font-extrabold text-lg">R</span>
          </div>
          <div className="flex flex-col leading-none text-right">
            <span className="text-[#65143D] font-extrabold text-lg sm:text-xl tracking-tight">
              Reflect
            </span>
            <span className="text-[#E94D91] font-bold text-[10px] tracking-[0.26em] uppercase mt-0.5">
              CLINIC
            </span>
          </div>
        </Link>

        {/* التنقل الرئيسي على الشاشات الكبيرة */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-1.5"
          aria-label="التنقل الرئيسي"
        >
          {primaryNav.map((item) => {
            const active = isActive(item.href);
            if (item.subItems) {
              return (
                <div key={item.href} className="relative group">
                  <Link
                    href={item.href}
                    className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all inline-flex items-center gap-1 ${
                      active
                        ? "bg-[#65143D] text-white"
                        : "text-[#2B2027] hover:text-[#65143D] hover:bg-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                  <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 focus-within:visible focus-within:opacity-100 transition-all duration-200 absolute right-0 top-full pt-2 w-60 z-50">
                    <div className="bg-white rounded-2xl border border-[#E8DFD8] shadow-xl p-2 flex flex-col gap-1">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-between ${
                            pathname === sub.href
                              ? "bg-[#65143D] text-white"
                              : "text-[#2B2027] hover:bg-[#F7F3EF] hover:text-[#65143D]"
                          }`}
                        >
                          <span>{sub.label}</span>
                          <ChevronLeft className="w-4 h-4 opacity-70" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-full text-sm font-bold transition-all ${
                  active
                    ? "bg-[#65143D] text-white"
                    : "text-[#2B2027] hover:text-[#65143D] hover:bg-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* زر الحجز الأساسي وزر قائمة الهاتف */}
        <div className="flex items-center gap-2.5">
          <Link
            href="/book"
            className="bg-[#E94D91] hover:bg-[#d43b7e] text-white font-bold text-sm sm:text-base px-5 sm:px-6 py-2.5 rounded-full shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all inline-flex items-center gap-2 whitespace-nowrap"
          >
            <span>احجز موعدك</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="lg:hidden w-11 h-11 rounded-full bg-white border border-[#E8DFD8] text-[#2B2027] hover:border-[#65143D] flex items-center justify-center transition-colors"
            aria-label={mobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation-drawer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* قائمة الهاتف المتجاوبة */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-[#2B2027]/50 backdrop-blur-xs flex justify-start"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            id="mobile-navigation-drawer"
            className="w-[86%] max-w-sm bg-[#F7F3EF] h-dvh shadow-2xl border-l border-[#E8DFD8] p-6 flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-5 border-b border-[#E8DFD8]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border-2 border-[#65143D] bg-white flex items-center justify-center">
                    <span className="text-[#65143D] font-extrabold text-base">R</span>
                  </div>
                  <div className="flex flex-col leading-none">
                    <span className="text-[#65143D] font-extrabold text-base">
                      Reflect
                    </span>
                    <span className="text-[#E94D91] font-bold text-[10px] tracking-[0.22em] uppercase mt-0.5">
                      CLINIC
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-10 h-10 rounded-full bg-white border border-[#E8DFD8] text-[#2B2027] flex items-center justify-center"
                  aria-label="إغلاق القائمة"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="mt-5 flex flex-col gap-1.5" aria-label="قائمة الهاتف">
                {allMobileLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-sm flex items-center justify-between transition-colors ${
                      isActive(item.href)
                        ? "bg-[#65143D] text-white"
                        : "bg-white text-[#2B2027] border border-[#E8DFD8] hover:border-[#65143D]"
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronLeft className="w-4 h-4 opacity-70" />
                  </Link>
                ))}
              </nav>
            </div>

            <div className="pt-5 mt-5 border-t border-[#E8DFD8] flex flex-col gap-2.5">
              <Link
                href="/book"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full bg-[#E94D91] hover:bg-[#d43b7e] text-white font-bold py-3.5 px-5 rounded-full text-center shadow-sm flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>احجزي موعدك الآن</span>
              </Link>
              {SITE_CONFIG.contact.phoneAvailable && (
                <a
                  href={SITE_CONFIG.contact.phoneHref}
                  className="w-full bg-white border border-[#E8DFD8] text-[#65143D] font-bold py-3 px-4 rounded-full text-center text-sm flex items-center justify-center gap-2"
                >
                  <Phone className="w-4 h-4 text-[#E94D91]" />
                  <span dir="ltr">{SITE_CONFIG.contact.phoneDisplay}</span>
                </a>
              )}
              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-[#756A71] hover:text-[#65143D] text-center py-1 flex items-center justify-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>لوحة الإدارة</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
