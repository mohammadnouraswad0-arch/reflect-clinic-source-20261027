import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "الشروط والأحكام وضوابط الحجز",
  description: "الشروط والأحكام الخاصة بحجز المواعيد والخدمات الطبية في عيادات ريفلكت Reflect Clinic.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2EF]">
      <Header />
      <main className="flex-1 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        <div className="bg-white rounded-[2.25rem] p-7 sm:p-12 border border-[#E9DDE2] shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F2EF] text-[#5A103A] text-xs font-bold border border-[#DCA0B2]">
            <FileText className="w-4 h-4 text-[#E94D91]" />
            <span>ضوابط الاستخدام والحجز الإلكتروني</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5A103A]">
            الشروط والأحكام — Reflect Clinic
          </h1>

          <div className="space-y-5 text-sm sm:text-base text-[#2B2228] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                1. طبيعة المعلومات الطبية على الموقع
              </h2>
              <p className="text-[#756A70]">
                المحتوى المنشور في موقع Reflect Clinic يهدف إلى التعريف بالأقسام الطبية والخدمات وأطباء العيادة وتسهيل حجز المواعيد، ولا يُغني عن الاستشارة الطبية السريرية المباشرة مع الطبيب المختص.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                2. آلية الحجز الإلكتروني وتأكيد المواعيد
              </h2>
              <p className="text-[#756A70]">
                عند إرسال طلب الحجز عبر الموقع، يُسجَّل الطلب في قاعدة البيانات بحالة «طلب جديد بانتظار التأكيد» مع حجز الفترة الزمنية لمنع تضارب المواعيد، ثم يقوم منسق المواعيد بالتواصل مع المراجع لتأكيد الموعد النهائي.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                3. تعديل أو إلغاء الموعد
              </h2>
              <p className="text-[#756A70]">
                نرجو إبلاغ العيادة قبل الموعد بـ 24 ساعة على الأقل في حال الرغبة بتأجيل أو إلغاء الموعد لإتاحة الفترة الزمنية لمراجعين آخرين.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                4. الرسوم والأسعار
              </h2>
              <p className="text-[#756A70]">
                تُحدَّد تكلفة الإجراءات العلاجية أو الجراحية أو التجميلية بناءً على تقييم الطبيب المختص لحالة المراجع وخطة العلاج المعتمدة داخل العيادة.
              </p>
            </section>
          </div>

          <div className="pt-4 border-t border-[#E9DDE2]">
            <Link
              href="/booking"
              className="inline-block bg-[#5A103A] text-white font-bold text-sm px-6 py-3 rounded-full"
            >
              العودة لنظام الحجز
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
