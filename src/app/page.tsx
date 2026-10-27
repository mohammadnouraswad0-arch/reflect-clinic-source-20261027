import React from "react";
import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { InteractiveServicesSection } from "@/components/InteractiveServicesSection";
import { DepartmentsSection } from "@/components/DepartmentsSection";
import { DoctorCard } from "@/components/DoctorCard";
import { WhyReflectSection } from "@/components/WhyReflectSection";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { HowToBookSection } from "@/components/HowToBookSection";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { LocationSection } from "@/components/LocationSection";
import { WorkingHoursTable } from "@/components/WorkingHoursTable";
import { ContactSection } from "@/components/ContactSection";
import { Footer } from "@/components/Footer";
import { ScrollReveal } from "@/components/ScrollReveal";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const catalog = await getClinicPublicCatalog();
  const { departments, homepageServices, publishedDoctors, reviews } = catalog;

  const departmentCards = departments
    .filter((d) => d.isVisible)
    .map((d) => ({
      id: d.id,
      slug: d.slug,
      nameAr: d.nameAr,
      titleAr: d.titleAr,
      shortDescription: d.shortDescription,
      iconName: d.iconName,
      servicesCount: d.services.length,
      doctorsCount: d.doctors.length,
    }));

  const homepageDoctors = publishedDoctors.slice(0, 8);

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F3EF]">
      {/* 1. Elegant Sticky Navigation Header */}
      <Header />

      <main className="flex-1">
        {/* 2 & 3. Full-width Luxury Hero Section + Clinic Introduction & Welcome Message */}
        <HeroSection />

        {/* 4. Featured Services (12 diverse services side-by-side, color change & navigation to /services/[slug]) */}
        <InteractiveServicesSection services={homepageServices} />

        {/* 5. The Three Clinic Departments */}
        <DepartmentsSection departments={departmentCards} />

        {/* 6. Featured Doctors (2-column side-by-side cards with staggered reveal & navigation to /doctors/[slug]) */}
        <section className="py-16 lg:py-22 bg-[#F7F3EF] border-t border-[#E8DFD8]">
          <div className="reflect-container">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12 text-right">
                <div className="max-w-2xl">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#D8C3A5]/60 text-[#65143D] text-xs font-bold mb-3">
                    <span className="w-2 h-2 rounded-full bg-[#E94D91]" />
                    <span>الكادر الطبي ({publishedDoctors.length} طبيبًا ومختصًا)</span>
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-[#65143D] tracking-tight mb-2.5">
                    تعرّفي على أطبائنا المختصين
                  </h2>
                  <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                    اضغطي على بطاقة أي طبيب للانتقال إلى صفحته المستقلة واستعراض مهاراته وخدماته وجدول مواعيده.
                  </p>
                </div>

                <Link
                  href="/doctors"
                  className="self-start md:self-auto inline-flex items-center gap-2 bg-white hover:bg-[#65143D] text-[#65143D] hover:text-white border border-[#E8DFD8] font-bold text-sm sm:text-base px-6 py-3 rounded-full transition-all"
                >
                  <Users className="w-4 h-4 text-[#E94D91]" />
                  <span>جميع الأطباء ({publishedDoctors.length})</span>
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-2 gap-3.5 sm:gap-6">
              {homepageDoctors.map((doc, idx) => (
                <ScrollReveal key={doc.slug} delayMs={(idx % 4) * 75} className="h-full">
                  <DoctorCard doctor={doc} />
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal delayMs={150}>
              <div className="mt-10 text-center">
                <Link
                  href="/doctors"
                  className="inline-flex items-center gap-3 bg-[#65143D] hover:bg-[#470C2A] text-white font-extrabold text-base sm:text-lg px-9 py-4 rounded-full shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <span>تصفح جميع الأطباء الـ 24</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* 7. Why Choose Reflect Clinic */}
        <ScrollReveal>
          <WhyReflectSection />
        </ScrollReveal>

        {/* 8. Patient Testimonials in a Smooth Carousel */}
        <TestimonialsCarousel
          reviews={reviews.map((r) => ({
            id: r.id,
            reviewerName: r.reviewerName,
            rating: r.rating,
            comment: r.comment,
          }))}
        />

        {/* 9. Prominent Appointment Booking Section */}
        <ScrollReveal>
          <HowToBookSection />
        </ScrollReveal>
        <ScrollReveal>
          <FinalBookingBanner />
        </ScrollReveal>

        {/* 10. Clinic Location, Opening Hours, and Contact Information */}
        <ScrollReveal>
          <LocationSection />
        </ScrollReveal>

        <section className="py-14 lg:py-20 bg-[#F7F3EF] border-t border-[#E8DFD8]">
          <div className="reflect-container">
            <ScrollReveal>
              <WorkingHoursTable />
            </ScrollReveal>
          </div>
        </section>

        <ScrollReveal>
          <ContactSection />
        </ScrollReveal>
      </main>

      {/* 11. Elegant Footer */}
      <Footer />
    </div>
  );
}
