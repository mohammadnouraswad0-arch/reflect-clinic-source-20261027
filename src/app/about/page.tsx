import React from "react";
import Link from "next/link";
import type { Metadata } from "next";
import {
  HeartPulse,
  Stethoscope,
  ShieldCheck,
  Calendar,
  ArrowLeft,
  Users,
  Layers,
  Camera,
} from "lucide-react";
import { SITE_CONFIG } from "@/data/siteConfig";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "من نحن — تعرّف على قصتنا ورؤيتنا في العناية",
  description:
    "تعرّف على عيادات ريفلكت REFLECT CLINIC في الرياض، رؤيتنا في العناية الطبية والتجميلية، وأقسامنا التخصصية الثلاثة وخدماتنا.",
};

export default async function AboutPage() {
  const catalog = await getClinicPublicCatalog();
  const { departments, homepageServices, publishedDoctors } = catalog;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 space-y-16 lg:space-y-22 pb-12">
        {/* ترويسة صفحة من نحن */}
        <section className="bg-[#650D3D] text-white py-14 sm:py-20">
          <div className="reflect-container text-right">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#C5D6A0] mb-4">
              <Link href="/" className="hover:text-white transition-colors">
                الرئيسية
              </Link>
              <span>/</span>
              <span className="text-white font-bold">من نحن</span>
            </div>

            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-[#C5D6A0] text-xs font-bold mb-3">
              <span>{SITE_CONFIG.nameEn} · رؤيتنا في العناية</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-bold text-white mb-4">
              تعرّف على قصتنا
            </h1>
            <p className="text-base sm:text-xl text-[#F8F4F0]/90 max-w-3xl leading-relaxed">
              في عيادات ريفلكت (REFLECT CLINIC)، نضع فهم احتياجات المراجع ووضوح الخطة الطبية والتجميلية في قلب كل استشارة وإجراء.
            </p>
          </div>
        </section>

        {/* القسم التحريري الأول: رؤيتنا في العناية + صورة فوتوغرافية مرخصة */}
        <section className="reflect-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center text-right">
            <div className="lg:col-span-7 bg-white rounded-[2rem] p-7 sm:p-10 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-5">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F4F0] text-[#650D3D] text-xs font-bold border border-[#E9DFE4]">
                <span className="w-2 h-2 rounded-full bg-[#F04491]" />
                <span>رؤيتنا في العناية</span>
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#650D3D]">
                رعاية طبية وتجميلية ترتكز على الوضوح والاختصاص
              </h2>

              <p className="text-sm sm:text-base text-[#2B2027] leading-relaxed">
                تسعى عيادات «ريفلكت» في المملكة العربية السعودية إلى تقديم خدمات طبية وتجميلية وجراحية منظمة، بحيث يحصل المراجع على تجربة هادئة ومطمئنة تبدأ من الاستشارة الطبية المتخصصة وتقييم الحالة بدقة قبل اتخاذ أي قرار علاجي أو تجميلي.
              </p>

              <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                نحرص في رسالتنا على الفصل الواضح بين التخصصات الطبية؛ فكل خدمة في العيادة تندرج ضمن قسمها المختص وترتبط بالأطباء المسجلين لتقديمها، دون وعود مبالغ فيها أو ادعاءات غير موثقة.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3">
                {[
                  {
                    icon: HeartPulse,
                    title: "اهتمام فردي",
                    desc: "إصغاء دقيق لاحتياجات وتطلعات كل مراجع.",
                  },
                  {
                    icon: Stethoscope,
                    title: "تنظيم تخصصي",
                    desc: "ثلاثة أقسام واضحة للجسم والجلد والوجه.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "شفافية وخصوصية",
                    desc: "التزام بالوضوح وحماية بيانات المراجعين.",
                  },
                ].map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={idx}
                      className="bg-[#F8F4F0] rounded-2xl p-4 border border-[#E9DFE4]"
                    >
                      <Icon className="w-5 h-5 text-[#F04491] mb-2" />
                      <h3 className="font-bold text-sm text-[#650D3D] mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#756A71] leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="rounded-[2rem] overflow-hidden bg-[#650D3D] border border-[#E9DFE4] shadow-md aspect-[4/3]">
                <img
                  src={SITE_CONFIG.media.aboutPrimaryPhoto.url}
                  alt={SITE_CONFIG.media.aboutPrimaryPhoto.altAr}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-[#756A71] px-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#650D3D] shrink-0" />
                <span>{SITE_CONFIG.media.aboutPrimaryPhoto.credit}</span>
              </p>
            </div>
          </div>
        </section>

        {/* القسم التحريري الثاني بتوزيع عكسي للصور: بيئة الاستشارة + روابط الأقسام */}
        <section className="reflect-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center text-right">
            <div className="lg:col-span-5 order-2 lg:order-1 space-y-3">
              <div className="rounded-[2rem] overflow-hidden bg-[#650D3D] border border-[#E9DFE4] shadow-md aspect-[4/3]">
                <img
                  src={SITE_CONFIG.media.aboutSecondaryPhoto.url}
                  alt={SITE_CONFIG.media.aboutSecondaryPhoto.altAr}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-[11px] text-[#756A71] px-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#650D3D] shrink-0" />
                <span>{SITE_CONFIG.media.aboutSecondaryPhoto.credit}</span>
              </p>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 bg-white rounded-[2rem] p-7 sm:p-10 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F8F4F0] text-[#650D3D] text-xs font-bold border border-[#E9DFE4]">
                <Layers className="w-3.5 h-3.5 text-[#F04491]" />
                <span>الأقسام التخصصية الثلاثة</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold text-[#650D3D]">
                تكامل بين أقسام الجسم والجلد والوجه
              </h2>

              <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                يمكنك الانتقال مباشرة إلى أي من الأقسام الثلاثة للتعرف على الخدمات التابعة له والأطباء المرتبطين به:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {departments.map((dept) => (
                  <Link
                    key={dept.slug}
                    href={`/departments/${dept.slug}`}
                    className="p-5 rounded-2xl bg-[#F8F4F0] hover:bg-[#650D3D] text-[#2B2027] hover:text-white border border-[#E9DFE4] transition-all group flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-base text-[#650D3D] group-hover:text-white mb-1.5">
                        {dept.nameAr}
                      </h3>
                      <p className="text-xs text-[#756A71] group-hover:text-white/85 line-clamp-3">
                        {dept.shortDescription}
                      </p>
                    </div>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#F04491] group-hover:text-[#C5D6A0]">
                      <span>تصفح القسم</span>
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* قسم تعريفي بالخدمات وروابط الأطباء وزر الحجز */}
        <section className="reflect-container">
          <div className="bg-white rounded-[2rem] p-7 sm:p-10 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] text-right space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#650D3D] mb-2">
                  دليل الخدمات والأطباء في العيادة
                </h2>
                <p className="text-sm sm:text-base text-[#756A71]">
                  استكشف خدماتنا الطبية والتجميلية أو انتقل إلى ملفات الأطباء لاختيار الطبيب المناسب.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/services"
                  className="bg-[#F8F4F0] hover:bg-[#650D3D] text-[#650D3D] hover:text-white border border-[#E9DFE4] font-bold text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all"
                >
                  <span>جميع الخدمات (19)</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
                <Link
                  href="/doctors"
                  className="bg-[#F8F4F0] hover:bg-[#650D3D] text-[#650D3D] hover:text-white border border-[#E9DFE4] font-bold text-sm px-6 py-3 rounded-full inline-flex items-center gap-2 transition-all"
                >
                  <Users className="w-4 h-4 text-[#F04491]" />
                  <span>جميع الأطباء ({publishedDoctors.length})</span>
                </Link>
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              {homepageServices.map((srv) => (
                <Link
                  key={srv.slug}
                  href={`/services/${srv.slug}`}
                  className="px-4 py-2 rounded-full bg-[#F8F4F0] hover:bg-[#FFF0F6] text-[#650D3D] border border-[#E9DFE4] hover:border-[#F04491] text-xs sm:text-sm font-semibold transition-all"
                >
                  {srv.nameAr}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-[#E9DFE4] flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-[#756A71]">
                هل ترغب في طلب موعد استشارة في أحد أقسام العيادة؟
              </p>
              <Link
                href="/book"
                className="bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-xs hover:shadow-md transition-all inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>احجز موعدًا</span>
              </Link>
            </div>
          </div>
        </section>

        <FinalBookingBanner />
      </main>

      <Footer />
    </div>
  );
}
