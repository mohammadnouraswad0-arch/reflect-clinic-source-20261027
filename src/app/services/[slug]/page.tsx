import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  Calendar,
  Building2,
  Stethoscope,
  Clock,
  CheckCircle2,
  HelpCircle,
  ArrowLeft,
  Info,
} from "lucide-react";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { MedicalIcon } from "@/components/MedicalIcon";
import { DoctorCard } from "@/components/DoctorCard";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

interface ServiceDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getClinicPublicCatalog();
  const srv = catalog.services.find((s) => s.slug === slug);
  if (!srv) return { title: "تفاصيل الخدمة" };
  return {
    title: `${srv.nameAr} — ${srv.specialtyTag}`,
    description: srv.shortDescription,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;
  const catalog = await getClinicPublicCatalog();
  const service = catalog.services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const serviceDoctorIds = new Set(service.doctors.map((d) => d.id));
  const fullQualifiedDoctors = catalog.publishedDoctors.filter((d) =>
    serviceDoctorIds.has(d.id)
  );

  const relatedServices = catalog.services.filter(
    (s) =>
      s.departmentId === service.departmentId &&
      s.slug !== service.slug &&
      s.isVisible
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 space-y-14 pb-10">
        {/* ترويسة صفحة الخدمة */}
        <section className="bg-[#650D3D] text-white py-12 sm:py-18 relative overflow-hidden">
          <div className="reflect-container relative z-10 text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-5">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <Link href="/services" className="hover:text-white transition-colors">
                الخدمات
              </Link>
              {service.department && (
                <>
                  <span>/</span>
                  <Link
                    href={`/departments/${service.department.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {service.department.nameAr}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-white font-bold">{service.nameAr}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <div className="w-13 h-13 rounded-2xl bg-white/15 text-[#F04491] flex items-center justify-center border border-white/20">
                    <MedicalIcon name={service.iconName} className="w-6 h-6 text-white" />
                  </div>
                  {service.department && (
                    <Link
                      href={`/departments/${service.department.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-bold border border-white/20 transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#C5D6A0]" />
                      <span>{service.department.nameAr}</span>
                    </Link>
                  )}
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C5D6A0] text-xs font-bold border border-white/15">
                    <Stethoscope className="w-3.5 h-3.5 text-[#F04491]" />
                    <span>{service.specialtyTag}</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-bold text-white leading-tight">
                  {service.nameAr}
                </h1>

                <p className="text-base sm:text-xl text-[#F8F4F0]/90 leading-relaxed max-w-3xl">
                  {service.shortDescription}
                </p>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href={`/book?service=${service.slug}`}
                    className="bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-base sm:text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2.5"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>احجز هذه الخدمة الآن</span>
                  </Link>

                  <Link
                    href="/services"
                    className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-sm sm:text-base px-6 py-4 rounded-full transition-all inline-flex items-center gap-2"
                  >
                    <span>جميع الخدمات</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* بطاقة ملخص معلومات الخدمة */}
              <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-[2rem] p-6 sm:p-7 border border-white/20 space-y-4">
                <h2 className="text-lg font-bold text-white border-b border-white/15 pb-3">
                  معلومات عن الخدمة
                </h2>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5D6A0]">القسم الطبي:</span>
                    <span className="font-bold text-white">
                      {service.department?.nameAr || service.specialtyTag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5D6A0]">المدة التقديرية:</span>
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#F04491]" />
                      {service.durationMinutes} دقيقة
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#C5D6A0]">الأطباء المسؤولون:</span>
                    <span className="font-bold text-white">
                      {fullQualifiedDoctors.length} أطباء ومختصين
                    </span>
                  </div>
                  <div className="pt-2 border-t border-white/15">
                    <span className="text-xs text-[#C5D6A0] block mb-1">رسوم الخدمة:</span>
                    <span className="text-xs sm:text-sm font-bold text-white">
                      {service.priceNote}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* شرح الخدمة الكامل وكل التفاصيل الطبية عنها */}
        <section className="reflect-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 text-right">
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 sm:p-9 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F4F0] text-[#650D3D] text-xs font-bold border border-[#E9DFE4]">
                <CheckCircle2 className="w-4 h-4 text-[#F04491]" />
                <span>شرح الخدمة</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D]">
                كل ما تحتاج معرفته عن «{service.nameAr}»
              </h2>
              <p className="text-sm sm:text-base text-[#2B2027] leading-relaxed">
                {service.fullDescription}
              </p>
              <div className="pt-4 border-t border-[#E9DFE4] flex items-start gap-3 text-xs sm:text-sm text-[#756A71]">
                <Info className="w-5 h-5 text-[#F04491] shrink-0 mt-0.5" />
                <span>
                  تبدأ الرعاية باستشارة طبية مباشرة مع الطبيب المختص لتقييم الحالة ووضع الخطة المناسبة بوضوح وأمان.
                </span>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white rounded-[2rem] p-6 sm:p-9 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F4F0] text-[#650D3D] text-xs font-bold border border-[#E9DFE4]">
                <Stethoscope className="w-4 h-4 text-[#F04491]" />
                <span>إرشادات ومعلومات عامة</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D]">
                آلية الرعاية وحجز الموعد
              </h2>
              <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                {service.generalMedicalInfo}
              </p>
              <div className="pt-2">
                <Link
                  href={`/book?service=${service.slug}`}
                  className="w-full bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-sm py-3.5 px-6 rounded-full text-center inline-flex items-center justify-center gap-2 transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>اطلب موعدًا لهذه الخدمة</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* الأطباء المسؤولون عن تقديم هذه الخدمة (كل طبيبين جنبًا إلى جنب grid-cols-2) */}
        <section className="reflect-container">
          <div className="text-right max-w-3xl mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E9DFE4] text-[#650D3D] text-xs font-bold mb-3">
              <span className="w-2 h-2 rounded-full bg-[#F04491]" />
              <span>الأطباء المسؤولون عن الخدمة ({fullQualifiedDoctors.length})</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold text-[#650D3D] mb-2">
              الأطباء الذين يقدمون «{service.nameAr}»
            </h2>
            <p className="text-sm sm:text-base text-[#756A71]">
              اضغط على بطاقة أي طبيب للانتقال إلى صفحته الشخصية واستعراض مهاراته وخدماته وجدول مواعيده، أو احجز معه مباشرة.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
            {fullQualifiedDoctors.map((doc) => (
              <DoctorCard key={doc.slug} doctor={doc} />
            ))}
          </div>
        </section>

        {/* الأسئلة الشائعة حول الخدمة */}
        {service.faqsJson && service.faqsJson.length > 0 && (
          <section className="reflect-container max-w-4xl">
            <h2 className="text-2xl font-bold text-[#650D3D] mb-6 flex items-center gap-2 text-right">
              <HelpCircle className="w-6 h-6 text-[#F04491]" />
              <span>أسئلة شائعة حول الخدمة</span>
            </h2>
            <div className="space-y-4">
              {service.faqsJson.map((faq, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-[#E9DFE4] text-right"
                >
                  <h3 className="text-base sm:text-lg font-bold text-[#650D3D] mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* خدمات أخرى ذات صلة (كل خدمتين جنبًا إلى جنب grid-cols-2) */}
        {relatedServices.length > 0 && (
          <section className="reflect-container">
            <div className="flex items-center justify-between mb-8 text-right">
              <h2 className="text-xl sm:text-3xl font-bold text-[#650D3D]">
                خدمات أخرى في {service.department?.nameAr}
              </h2>
              <Link
                href="/services"
                className="text-xs sm:text-sm font-bold text-[#650D3D] hover:text-[#F04491] inline-flex items-center gap-1"
              >
                <span>جميع الخدمات</span>
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
              {relatedServices.slice(0, 4).map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/services/${rel.slug}`}
                  className="service-card p-4 sm:p-7 text-right flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-[#F6F1EC] text-[#7D1048] flex items-center justify-center mb-4">
                      <MedicalIcon name={rel.iconName} className="w-6 h-6 sm:w-7 sm:h-7" />
                    </div>
                    <h3 className="text-base sm:text-xl font-bold text-[#1F171C] mb-2">
                      {rel.nameAr}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#6E6269] line-clamp-3 mb-4">
                      {rel.shortDescription}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#7D1048]">
                    <span>اعرف المزيد</span>
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}

        <FinalBookingBanner />
      </main>

      <Footer />
    </div>
  );
}
