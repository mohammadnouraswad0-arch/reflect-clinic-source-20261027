"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export function FloatingContactButtons() {
  return (
    <div
      className="fixed bottom-6 left-4 sm:left-6 z-50 flex flex-col items-center gap-3"
      aria-label="أزرار التواصل السريع"
    >
      {SITE_CONFIG.contact.phoneAvailable && (
        <a
          href={SITE_CONFIG.contact.phoneHref}
          aria-label="اتصل بالعيادة الآن"
          title="اتصل الآن"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#B84A14] hover:bg-[#9E3E10] text-white shadow-[0_8px_22px_rgba(184,74,20,0.42)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/20"
        >
          <Phone className="w-6 h-6" strokeWidth={2.1} />
        </a>
      )}

      {SITE_CONFIG.contact.whatsappAvailable && (
        <a
          href={SITE_CONFIG.contact.whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="راسلنا على واتساب"
          title="راسلنا على واتساب"
          className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#198754] hover:bg-[#146c43] text-white shadow-[0_8px_22px_rgba(25,135,84,0.42)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/20"
        >
          <MessageCircle className="w-6 h-6" strokeWidth={2.1} />
        </a>
      )}
    </div>
  );
}
