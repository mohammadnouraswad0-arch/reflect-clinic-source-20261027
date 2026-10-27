import React from "react";
import Link from "next/link";
import {
  Stethoscope,
  UserRound,
  Calendar,
  FileText,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

export function HowToBookSection({ showFullDetails = false }: { showFullDetails?: boolean }) {
  const steps = [
    {
      number: "01",
      icon: Stethoscope,
      title: "اختر الخدمة المطلوبة",
      description:
        "حدد الخدمة الطبية أو التجميلية المناسبة لاحتياجك من بين خدمات أقسام الجسم أو الجلد أو الوجه.",
    },
    {
      number: "02",
      icon: UserRound,
      title: "اختر الطبيب المرتبط بالخدمة",
      description:
        "يعرض لك النظام الأطباء المسجلين لتقديم هذه الخدمة فقط لتختار الطبيب المناسب.",
    },
    {
      number: "03",
      icon: Calendar,
      title: "حدد التاريخ والوقت المطلوبين",
      description:
        "اختر اليوم والفترة الزمنية المطلوبة ضمن أيام الدوام (السبت – الخميس).",
    },
    {
      number: "04",
      icon: FileText,
      title: "أدخل بيانات التواصل",
      description:
        "أدخل الاسم الكامل ورقم الجوال للتواصل دون الحاجة لإدخال معلومات صحية حساسة.",
    },
    {
      number: "05",
      icon: CheckCircle2,
      title: "مراجعة الطلب واستلام الرقم المرجعي",
      description:
        "راجع ملخص طلبك وأرسله لتحصل على رقم مرجعي لحين تواصل منسق العيادة لتأكيد الموعد.",
    },
  ];

  return (
    <section className="py-16 lg:py-22 bg-white border-t border-[#E9DFE4]">
      <div className="reflect-container">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12 text-right">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F8F4F0] border border-[#E9DFE4] text-[#650D3D] text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F04491]" />
              <span>خطوات الحجز الإلكتروني</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#650D3D] tracking-tight mb-2.5">
              كيف تحجز موعدك في 5 خطوات واضحة؟
            </h2>
            <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
              صممنا رحلة طلب الموعد في عيادات ريفلكت لتكون واضحة ومباشرة، مع ربط كل خدمة بالأطباء المسجلين لتقديمها.
            </p>
          </div>

          {!showFullDetails && (
            <Link
              href="/how-to-book"
              className="self-start md:self-auto inline-flex items-center gap-2 bg-[#F8F4F0] hover:bg-[#650D3D] text-[#650D3D] hover:text-white border border-[#E9DFE4] font-bold text-sm px-6 py-3 rounded-full transition-all"
            >
              <span>تفاصيل كيف تحجز</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="bg-[#F8F4F0] rounded-[1.5rem] p-5 sm:p-6 border border-[#E9DFE4] text-right flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-white border border-[#E9DFE4] text-[#650D3D] flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#F04491]" />
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-[#650D3D] border border-[#E9DFE4]">
                      الخطوة {step.number}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#650D3D] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#756A71] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/book"
            className="inline-flex items-center gap-2.5 bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-base sm:text-lg px-9 py-4 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            <Calendar className="w-5 h-5" />
            <span>ابدأ طلب الحجز الآن</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
