import React from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Home } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F4F0]">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 px-4">
        <div className="max-w-xl w-full bg-white rounded-[2rem] p-8 sm:p-12 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-[#FFF0F6] border border-[#F04491]/30 text-[#650D3D] font-bold text-2xl flex items-center justify-center mx-auto">
            404
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#650D3D]">
              الصفحة المطلوبة غير موجودة
            </h1>
            <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
              عذرًا، الرابط الذي تحاول الوصول إليه غير متوفر أو تم نقله. يمكنك العودة إلى الصفحة الرئيسية أو تصفح خدمات وأطباء عيادات ريفلكت.
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/"
              className="bg-[#650D3D] hover:bg-[#4e092f] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full inline-flex items-center gap-2 transition-all"
            >
              <Home className="w-4 h-4 text-[#C5D6A0]" />
              <span>الصفحة الرئيسية</span>
            </Link>

            <Link
              href="/services"
              className="bg-[#F8F4F0] hover:bg-[#650D3D] text-[#650D3D] hover:text-white border border-[#E9DFE4] font-bold text-sm sm:text-base px-6 py-3.5 rounded-full inline-flex items-center gap-2 transition-all"
            >
              <span>تصفح الخدمات</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>

            <Link
              href="/book"
              className="bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-sm sm:text-base px-7 py-3.5 rounded-full inline-flex items-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>احجز الآن</span>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
