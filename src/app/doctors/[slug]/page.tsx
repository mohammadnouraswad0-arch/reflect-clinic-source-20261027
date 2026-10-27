import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  User,
  Calendar,
  Building2,
  Stethoscope,
  CheckCircle2,
  ArrowLeft,
  ShieldCheck,
  Award,
} from "lucide-react";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { DoctorServicesGrid } from "@/components/DoctorServicesGrid";
import { DoctorProfileSchedule } from "@/components/DoctorProfileSchedule";
import { WorkingHoursTable } from "@/components/WorkingHoursTable";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

interface DoctorProfilePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DoctorProfilePageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getClinicPublicCatalog();
  const doc = catalog.doctors.find((d) => d.slug === slug);
  if (!doc) return { title: "ملف الطبيب" };
  return {
    title: `${doc.nameAr} — ${doc.professionalTitle}`,
    description: doc.bioAr,
  };
}

export default async function DoctorProfilePage({
  params,
}: DoctorProfilePageProps) {
  const { slug } = await params;
  const catalog = await getClinicPublicCatalog();
  const doctor = catalog.doctors.find((d) => d.slug === slug);

  if (!doctor) {
    notFound();
  }

  const displayDoctorName =
    doctor.nameAr.startsWith("د.") || doctor.nameAr.includes("البندري")
      ? doctor.nameAr
      : `د. ${doctor.nameAr}`;

  // مهارات ومجالات عمل الطبيب المستمدة من خدماته وتخصصه
  const doctorSkills = [
    doctor.primarySpecialty,
    ...doctor.services.map((s) => `تقديم استشارات وإجراءات ${s.nameAr}`),
    ...(doctor.subSpecialties || []),
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 space-y-14 pb-12">
        {/* القسم العلوي لملف الطبيب */}
        <section className="bg-white border-b border-[#E9DFE4] py-10 sm:py-16">
          <div className="reflect-container">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#756A71] mb-6 text-right">
              <Link href="/" className="hover:text-[#650D3D] transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <Link href="/doctors" className="hover:text-[#650D3D] transition-colors">
                الأطباء
              </Link>
              {doctor.department && (
                <>
                  <span>/</span>
                  <Link
                    href={`/departments/${doctor.department.slug}`}
                    className="hover:text-[#650D3D] transition-colors"
                  >
                    {doctor.department.nameAr}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-[#650D3D] font-bold">{displayDoctorName}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
              {/* بطاقة صورة الطبيب المطابقة للصورة المرجعية الأولى */}
              <div className="lg:col-span-4">
                <div className="bg-[#5A103A] rounded-[2rem] overflow-hidden relative h-76 sm:h-96 flex flex-col items-center justify-center p-6 shadow-xl border border-[#E9DFE4]">
                  {doctor.officialImageUrl ? (
                    <img
                      src={doctor.officialImageUrl}
                      alt={displayDoctorName}
                      className="absolute inset-0 w-full h-full object-cover object-top"
                    />
                  ) : (
                    <>
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-12 -right-10 w-60 h-60 rounded-full bg-[#DCA0B2]/18"
                      />
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-14 -left-10 w-56 h-56 rounded-full bg-white/8"
                      />
                      <div className="relative z-10 w-34 h-34 rounded-full bg-white/12 border border-white/20 flex items-center justify-center">
                        <User className="w-16 h-16 text-white/90" strokeWidth={1.5} />
                      </div>
                      <div className="relative z-20 -mt-3 bg-[#350821]/80 backdrop-blur-xs border border-white/15 px-4 py-1.5 rounded-full">
                        <span className="text-white/95 text-xs sm:text-sm font-medium">
                          الصورة الرسمية للطبيب قريباً
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* اسم الطبيب ومهاراته والنبذة المهنية */}
              <div className="lg:col-span-8 text-right space-y-6">
                <div className="flex flex-wrap items-center gap-2.5">
                  {doctor.department && (
                    <Link
                      href={`/departments/${doctor.department.slug}`}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#F8F4F0] hover:bg-[#650D3D] text-[#650D3D] hover:text-white text-xs font-bold border border-[#E9DFE4] transition-colors"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#F04491]" />
                      <span>{doctor.department.nameAr}</span>
                    </Link>
                  )}

                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0F6] text-[#650D3D] text-xs font-bold border border-[#F04491]/30">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#F04491]" />
                    <span>الكادر الطبي — عيادات ريفلكت</span>
                  </span>
                </div>

                <div>
                  <h1 className="text-3xl sm:text-5xl font-bold text-[#650D3D] mb-2">
                    {displayDoctorName}
                  </h1>
                  <p className="text-lg sm:text-xl font-bold text-[#9E2A63]">
                    {doctor.professionalTitle}
                  </p>
                </div>

                <p className="text-base sm:text-lg text-[#2B2027] leading-relaxed">
                  {doctor.bioAr}
                </p>

                {/* مهارات الطبيب ومجالات الاختصاص والمؤهلات */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#F8F4F0] rounded-2xl p-5 border border-[#E9DFE4]">
                    <h2 className="text-sm font-bold text-[#650D3D] mb-3 flex items-center gap-1.5">
                      <Award className="w-4 h-4 text-[#F04491]" />
                      <span>مهارات الطبيب ومجالات الاختصاص:</span>
                    </h2>
                    <ul className="space-y-2 text-xs sm:text-sm text-[#2B2027]">
                      {doctorSkills.map((skill, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#F04491] shrink-0 mt-0.5" />
                          <span>{skill}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-[#F8F4F0] rounded-2xl p-5 border border-[#E9DFE4]">
                    <h2 className="text-sm font-bold text-[#650D3D] mb-3 flex items-center gap-1.5">
                      <Stethoscope className="w-4 h-4 text-[#F04491]" />
                      <span>القسم والتصنيف المهني:</span>
                    </h2>
                    <p className="text-xs sm:text-sm text-[#2B2027] font-semibold mb-2">
                      القسم: {doctor.department?.nameAr || "عيادات ريفلكت"}
                    </p>
                    {doctor.qualifications && doctor.qualifications.length > 0 && (
                      <ul className="space-y-1.5 text-xs sm:text-sm text-[#756A71]">
                        {doctor.qualifications.map((q, idx) => (
                          <li key={idx}>• {q}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-3.5">
                  <Link
                    href={`/book?doctor=${doctor.slug}`}
                    className="bg-[#E94D91] hover:bg-[#d8357f] text-white font-bold text-base sm:text-lg px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all inline-flex items-center gap-2.5"
                  >
                    <Calendar className="w-5 h-5" />
                    <span>احجز مع الطبيب</span>
                  </Link>

                  <Link
                    href="/doctors"
                    className="bg-[#F8F4F0] hover:bg-[#650D3D] text-[#650D3D] hover:text-white border border-[#E9DFE4] font-bold text-sm sm:text-base px-6 py-4 rounded-full transition-all inline-flex items-center gap-2"
                  >
                    <span>جميع الأطباء</span>
                    <ArrowLeft className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* خدمات الطبيب (كل خدمتين جنبًا إلى جنب grid-cols-2، وعند الضغط ينتقل لصفحة الخدمة) */}
        <section className="reflect-container space-y-6">
          <div className="text-right max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E9DFE4] text-[#650D3D] text-xs font-bold mb-2.5">
              <span className="w-2 h-2 rounded-full bg-[#F04491]" />
              <span>خدمات الطبيب ({doctor.services.length})</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#650D3D] mb-2">
              الخدمات التي يقدمها {displayDoctorName}
            </h2>
            <p className="text-sm sm:text-base text-[#756A71]">
              اضغط على أي خدمة ليتغير لونها وتنتقل إلى صفحة تفاصيل الخدمة، أو اختر الوقت المناسب من جدول الطبيب أدناه.
            </p>
          </div>

          <DoctorServicesGrid
            services={doctor.services.map((s) => ({
              id: s.id,
              slug: s.slug,
              nameAr: s.nameAr,
              shortDescription: s.shortDescription,
              iconName: s.iconName,
              specialtyTag: s.specialtyTag,
            }))}
          />
        </section>

        {/* جدول المواعيد المتاحة مع الطبيب + جدول مواعيد عمل العيادة */}
        <section className="reflect-container space-y-10">
          <DoctorProfileSchedule
            doctorId={doctor.id}
            doctorSlug={doctor.slug}
            services={doctor.services.map((s) => ({
              id: s.id,
              slug: s.slug,
              nameAr: s.nameAr,
              durationMinutes: s.durationMinutes,
            }))}
          />

          <WorkingHoursTable />
        </section>

        <FinalBookingBanner />
      </main>

      <Footer />
    </div>
  );
}
