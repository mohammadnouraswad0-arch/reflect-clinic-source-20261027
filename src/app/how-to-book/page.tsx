import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, ShieldCheck, Info } from "lucide-react";
import { Header } from "@/components/Header";
import { HowToBookSection } from "@/components/HowToBookSection";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "كيف تحجز موعدك — دليل الحجز خطوة بخطوة",
  description:
    "تعرّف على خطوات طلب حجز الموعد في عيادات ريفلكت REFLECT CLINIC، وكيفية اختيار الخدمة والطبيب والموعد المطلوب.",
};

export default function HowToBookPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 space-y-12 pb-10">
        <section className="bg-[#650D3D] text-white py-14 sm:py-18">
          <div className="reflect-container text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">كيف تحجز</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              كيف تحجز موعدك في عيادات ريفلكت؟
            </h1>
            <p className="text-base sm:text-lg text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              دليل واضح يشرح رحلة طلب الموعد الإلكتروني من لحظة اختيار الخدمة وحتى استلام الرقم المرجعي وتواصل منسق العيادة معك.
            </p>
          </div>
        </section>

        <HowToBookSection showFullDetails />

        <section className="reflect-container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-right">
            <div className="bg-white rounded-[1.75rem] p-6 sm:p-8 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-3">
              <div className="flex items-center gap-2 text-[#650D3D] font-bold text-lg">
                <Info className="w-5 h-5 text-[#F04491]" />
                <h2>ماذا يعني «الموعد المطلوب»؟</h2>
              </div>
              <p className="text-sm text-[#756A71] leading-relaxed">
                عند اختيارك للتاريخ والوقت عبر الموقع، يتم تسجيل طلبك باعتباره «موعدًا مطلوبًا» مبدئيًا ويصدر لك رقم مرجعي فوري، ثم يقوم منسق المواعيد في العيادة بمراجعة جدول الطبيب والتواصل معك هاتفيًا لتأكيد الموعد النهائي.
              </p>
            </div>

            <div className="bg-white rounded-[1.75rem] p-6 sm:p-8 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-3">
              <div className="flex items-center gap-2 text-[#650D3D] font-bold text-lg">
                <ShieldCheck className="w-5 h-5 text-[#C5D6A0]" />
                <h2>حماية بياناتك أثناء الحجز</h2>
              </div>
              <p className="text-sm text-[#756A71] leading-relaxed">
                نطلب فقط الاسم الكامل ورقم الجوال للتواصل بشأن الموعد، ولا نطلب عبر الموقع أي تفاصيل صحية حساسة أو ملفات طبية.
              </p>
              <div className="pt-2">
                <Link
                  href="/book"
                  className="inline-flex items-center gap-2 bg-[#F04491] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-full"
                >
                  <Calendar className="w-4 h-4" />
                  <span>انتقل لصفحة الحجز</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FinalBookingBanner />
      </main>

      <Footer />
    </div>
  );
}
