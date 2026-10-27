import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "سياسة الخصوصية وحماية البيانات",
  description: "سياسة الخصوصية وحماية بيانات المراجعين في عيادات ريفلكت Reflect Clinic.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2EF]">
      <Header />
      <main className="flex-1 py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-right">
        <div className="bg-white rounded-[2.25rem] p-7 sm:p-12 border border-[#E9DDE2] shadow-xs space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F7F2EF] text-[#5A103A] text-xs font-bold border border-[#DCA0B2]">
            <ShieldCheck className="w-4 h-4 text-[#E94D91]" />
            <span>حماية البيانات والخصوصية الطبية</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#5A103A]">
            سياسة الخصوصية — Reflect Clinic
          </h1>

          <div className="space-y-5 text-sm sm:text-base text-[#2B2228] leading-relaxed">
            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                1. التزامنا بخصوصية المراجعين
              </h2>
              <p className="text-[#756A70]">
                تلتزم عيادات ريفلكت (Reflect Clinic) بحماية خصوصية بيانات المراجعين وزوار الموقع الإلكتروني وفق الأنظمة المعمول بها في المملكة العربية السعودية وضوابط خصوصية البيانات الصحية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                2. البيانات التي يتم جمعها عند الحجز
              </h2>
              <p className="text-[#756A70]">
                نطلب الحد الأدنى الضروري فقط لتنسيق الموعد الطبي، ويشمل: الاسم الكامل، رقم الجوال للتواصل، البريد الإلكتروني (اختياري)، والخدمة والطبيب والتاريخ المختار. لا نطلب عبر الموقع أي معلومات طبية حساسة أو صور شخصية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                3. كيفية استخدام البيانات وحمايتها
              </h2>
              <p className="text-[#756A70]">
                تُستخدم بيانات الحجز حصرياً لغرض مراجعة وتأكيد الموعد الطبي والتواصل مع المراجع من قِبل فريق التنسيق المخول. لا تُعرض بيانات الحجوزات للعامة ولا تُشارك مع أي أطراف تسويقية خارجية.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                4. حقوق المراجع والتواصل
              </h2>
              <p className="text-[#756A70]">
                يحق للمراجع طلب تعديل أو إلغاء موعده أو تحديث بيانات التواصل الخاصة به في أي وقت عبر التواصل المباشر مع العيادة على الرقم الموحد +966 11 222 0555.
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
