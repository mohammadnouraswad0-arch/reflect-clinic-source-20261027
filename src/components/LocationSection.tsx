import React from "react";
import Link from "next/link";
import { MapPin, ArrowLeft, Calendar } from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";

export function LocationSection() {
  return (
    <section className="py-14 lg:py-20 bg-[#F8F4F0] border-t border-[#E9DFE4]">
      <div className="reflect-container max-w-3xl mx-auto space-y-6">
        {/* البطاقة العلوية للموقع بتدرج دافئ ودائرة الدبوس البيضاء مطابقة للصورة المرجعية الثالثة */}
        <div className="rounded-[2.25rem] p-8 sm:p-14 bg-gradient-to-b from-[#F5E6DF] via-[#F7EFEA] to-[#FBF8F6] border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/5%)] text-center flex flex-col items-center justify-center min-h-[340px]">
          <div className="w-20 h-20 rounded-full bg-white shadow-[0_8px_24px_rgba(101,13,61,0.10)] flex items-center justify-center mb-6">
            <MapPin className="w-9 h-9 text-[#7D1048]" strokeWidth={2} />
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-[#1F171C] mb-2">
            3254 طريق الأمير تركي الأول
          </h2>

          <p className="text-base sm:text-xl text-[#5A5056] mb-1">
            حي المحمدية، الرياض
          </p>

          <p className="text-sm sm:text-base text-[#756A71] mb-7">
            المملكة العربية السعودية — الرمز البريدي 12362
          </p>

          {SITE_CONFIG.contact.directionsAvailable && (
            <a
              href={SITE_CONFIG.contact.mapDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-[#7D1048] hover:text-[#F04491] transition-colors"
            >
              <span className="underline underline-offset-8 decoration-2">
                احصل على الاتجاهات
              </span>
              <ArrowLeft className="w-5 h-5" />
            </a>
          )}
        </div>

        {/* بطاقة العنوان البيضاء السفلية مطابقة للصورة المرجعية الثالثة */}
        <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] text-right space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#F3E6EC] text-[#7D1048] flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#1F171C]">
              العنوان
            </h3>
          </div>

          <div className="space-y-1.5 text-base sm:text-xl text-[#4A4046] pr-1">
            <p>3254 طريق الأمير تركي بن عبدالعزيز الأول</p>
            <p>حي المحمدية، الرياض، المملكة العربية السعودية</p>
            <p className="text-sm sm:text-base text-[#756A71]">
              عيادات ريفلكت — REFLECT CLINIC
            </p>
          </div>
        </div>

        {/* زر الحجز الواضح أسفل قسم الموقع */}
        <div className="pt-2 text-center">
          <Link
            href="/book"
            className="inline-flex items-center justify-center gap-2.5 bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-base sm:text-lg px-10 py-4 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>احجز الآن</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
