import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { FaqAccordion, FaqItem } from "@/components/FaqAccordion";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "الأسئلة الشائعة — إجابات واضحة للمراجعين",
  description:
    "إجابات واضحة حول الخدمات والأقسام والأطباء وآلية طلب المواعيد وساعات العمل في عيادات ريفلكت REFLECT CLINIC.",
};

const CLINIC_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "الأقسام والخدمات",
    question: "ما هي الأقسام الرئيسية المتوفرة في عيادات ريفلكت؟",
    answer:
      "تنقسم الخدمات في عيادات ريفلكت إلى ثلاثة أقسام تخصصية رئيسية: قسم الجسم، قسم الجلد، وقسم الوجه، ويضم الموقع 19 خدمة طبية وتجميلية وجراحية موزعة على هذه الأقسام.",
  },
  {
    id: "faq-2",
    category: "الحجز والمواعيد",
    question: "هل إرسال طلب الموعد عبر الموقع يعني تأكيد الحجز نهائيًا؟",
    answer:
      "لا؛ عند إرسال الطلب عبر صفحة الحجز يتم تسجيله كـ «موعد مطلوب» مبدئي ويصدر لك رقم مرجعي فوري، ثم يتواصل معك منسق المواعيد في العيادة لتأكيد الموعد النهائي وفق جدول الطبيب.",
  },
  {
    id: "faq-3",
    category: "الأطباء والتخصصات",
    question: "كيف أعرف الأطباء الذين يقدمون خدمة معينة؟",
    answer:
      "عند الضغط على أي خدمة في الصفحة الرئيسية أو صفحة الخدمات، تنتقل إلى صفحة تفاصيل الخدمة التي تعرض شرحًا واضحًا للخدمة وقائمة الأطباء المسجلين لتقديمها فقط.",
  },
  {
    id: "faq-4",
    category: "ساعات العمل",
    question: "ما هي ساعات عمل العيادة؟",
    answer:
      "وفق الجدول الأولي للعيادة، تمتد ساعات العمل من السبت إلى الخميس من الساعة 10:00 صباحًا حتى 9:00 مساءً، ويوم الجمعة عطلة أسبوعية.",
  },
  {
    id: "faq-5",
    category: "الخصوصية والبيانات",
    question: "ما هي البيانات المطلوبة عند تقديم طلب حجز الموعد؟",
    answer:
      "نطلب الحد الأدنى الضروري فقط للتواصل وتنسيق الموعد (الاسم الكامل ورقم الجوال، والبريد الإلكتروني اختياريًا)، ولا نطلب عبر الموقع أي تفاصيل طبية أو صحية حساسة.",
  },
  {
    id: "faq-6",
    category: "الموقع والتواصل",
    question: "أين تقع عيادات ريفلكت وكيف يمكن التواصل المباشر؟",
    answer:
      "تقع العيادة في مدينة الرياض، حي المحمدية، طريق الأمير تركي بن عبدالعزيز الأول. ويمكن التواصل عبر الهاتف الرسمي أو واتساب أو زيارة صفحة «تواصل معنا».",
  },
];

export default function FaqPage() {
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
              <span className="text-white font-bold">الأسئلة الشائعة</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              الأسئلة الشائعة
            </h1>
            <p className="text-base sm:text-lg text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              كل ما تحتاج إلى معرفته حول أقسام عيادات ريفلكت، وخدماتها الـ 19، وآلية طلب المواعيد وساعات العمل.
            </p>
          </div>
        </section>

        <section className="reflect-container max-w-4xl">
          <FaqAccordion items={CLINIC_FAQS} />
        </section>

        <FinalBookingBanner />
      </main>

      <Footer />
    </div>
  );
}
