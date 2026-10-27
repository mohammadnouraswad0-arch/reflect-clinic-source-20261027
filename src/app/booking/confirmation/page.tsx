"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Calendar,
  User,
  Stethoscope,
  Search,
  ArrowLeft,
  Phone,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface BookingConfirmationData {
  referenceCode: string;
  status: "pending_confirmation" | "confirmed" | "rejected" | "cancelled";
  appointmentDate: string;
  appointmentTime: string;
  endTime: string;
  durationMinutes: number;
  patientName: string;
  patientPhoneMasked: string;
  priceDisplay: string;
  adminNotes?: string | null;
  service: { id: number; slug: string; nameAr: string; specialtyTag: string } | null;
  doctor: { id: number; slug: string; nameAr: string; professionalTitle: string } | null;
  department: { slug: string; nameAr: string } | null;
  events: Array<{
    id: number;
    eventType: string;
    newStatus: string;
    note: string | null;
    createdAt: string;
  }>;
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const initialRef = searchParams.get("ref") || "";
  const [refInput, setRefInput] = useState(initialRef);
  const [loading, setLoading] = useState(Boolean(initialRef));
  const [booking, setBooking] = useState<BookingConfirmationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchBookingByRef = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/booking?ref=${encodeURIComponent(code.trim())}`);
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setBooking(null);
        setError(json.error || "لم يتم العثور على طلب حجز بهذا الرمز المرجعي");
      } else {
        setBooking(json.data);
      }
    } catch {
      setError("تعذر الاتصال بالخادم للتحقق من حالة الطلب");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialRef) {
      fetchBookingByRef(initialRef);
    }
  }, [initialRef]);

  const getStatusPresentation = (status: BookingConfirmationData["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          badge: "موعد مؤكد",
          heading: "تم تأكيد الموعد في جدول العيادة",
          description:
            "تمت مراجعة وتأكيد موعدك رسمياً في قاعدة بيانات Reflect Clinic. نتطلع لاستقبالك في الموعد المحدد.",
          icon: CheckCircle2,
          bgClass: "bg-emerald-50 border-emerald-300 text-emerald-900",
          badgeClass: "bg-emerald-600 text-white",
        };
      case "rejected":
        return {
          badge: "طلب مرفوض",
          heading: "تعذر قبول الموعد في الفترة المختارة",
          description:
            "يرجى مراجعة ملاحظة منسق العيادة أدناه أو اختيار فترة زمنية أخرى متاحة.",
          icon: XCircle,
          bgClass: "bg-rose-50 border-rose-300 text-rose-900",
          badgeClass: "bg-rose-600 text-white",
        };
      case "cancelled":
        return {
          badge: "موعد ملغى",
          heading: "هذا الموعد ملغى",
          description: "تم إلغاء هذا الحجز وإتاحة الفترة الزمنية في جدول الطبيب.",
          icon: AlertTriangle,
          bgClass: "bg-gray-100 border-gray-300 text-gray-800",
          badgeClass: "bg-gray-600 text-white",
        };
      default:
        return {
          badge: "طلب جديد بانتظار التأكيد",
          heading: "تم استلام طلب الحجز وهو بانتظار التأكيد",
          description:
            "تم تسجيل طلبك في قاعدة بيانات العيادة وحجز الفترة مبدئياً. سيتواصل معك منسق المواعيد في Reflect Clinic لتأكيد الموعد النهائي.",
          icon: Clock,
          bgClass: "bg-[#F4E6EB] border-[#DCA0B2] text-[#5A103A]",
          badgeClass: "bg-[#5A103A] text-white",
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-right">
      {/* شريط البحث برمز المرجع لمتابعة حالة الحجز */}
      <div className="bg-white rounded-[2rem] p-6 border border-[#E9DDE2] shadow-xs">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#5A103A] mb-2">
          نتيجة ومتابعة حالة طلب الحجز
        </h1>
        <p className="text-xs sm:text-sm text-[#756A70] mb-4">
          أدخل رمز الحجز المرجعي (مثل: REF-2026-XXXXXX) للتحقق من الحالة الفعلية لطلبك في قاعدة البيانات:
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchBookingByRef(refInput);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            type="text"
            dir="ltr"
            value={refInput}
            onChange={(e) => setRefInput(e.target.value)}
            placeholder="REF-2026-XXXXXX"
            className="flex-1 bg-[#F7F2EF] border border-[#E9DDE2] rounded-full px-5 py-3 text-sm font-bold text-center sm:text-right text-[#2B2228]"
          />
          <button
            type="submit"
            className="bg-[#5A103A] hover:bg-[#3E0A27] text-white font-bold text-sm px-7 py-3 rounded-full inline-flex items-center justify-center gap-2"
          >
            <Search className="w-4 h-4 text-[#E94D91]" />
            <span>استعلام عن الحجز</span>
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-white rounded-[2rem] p-12 text-center border border-[#E9DDE2] text-[#5A103A] font-bold">
          جاري التحقق من حالة الحجز في قاعدة البيانات...
        </div>
      )}

      {error && !loading && (
        <div className="bg-white rounded-[2rem] p-8 text-center border border-[#E94D91] space-y-4">
          <p className="text-lg font-extrabold text-[#5A103A]">{error}</p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-[#E94D91] text-white font-bold text-sm px-6 py-3 rounded-full"
          >
            <span>العودة لصفحة الحجز</span>
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </div>
      )}

      {booking && !loading && (
        <div className="bg-white rounded-[2.25rem] p-6 sm:p-10 border border-[#E9DDE2] shadow-lg space-y-8">
          {(() => {
            const pres = getStatusPresentation(booking.status);
            const StatusIcon = pres.icon;
            return (
              <div className={`rounded-3xl p-6 border-2 ${pres.bgClass} space-y-3`}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-extrabold ${pres.badgeClass}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span>الحالة الحالية: {pres.badge}</span>
                  </span>
                  <span
                    dir="ltr"
                    className="font-mono font-extrabold text-sm sm:text-base bg-white px-4 py-1 rounded-full border border-[#E9DDE2] text-[#5A103A]"
                  >
                    {booking.referenceCode}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold">{pres.heading}</h2>
                <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                  {pres.description}
                </p>
              </div>
            );
          })()}

          {/* تفاصيل الحجز المسجلة */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-[#F7F2EF] rounded-2xl p-5 border border-[#E9DDE2]">
              <span className="text-xs text-[#756A70] flex items-center gap-1.5 mb-1">
                <Stethoscope className="w-4 h-4 text-[#E94D91]" />
                <span>الخدمة المطلوبة:</span>
              </span>
              <p className="font-extrabold text-base text-[#5A103A]">
                {booking.service?.nameAr}
              </p>
              {booking.department && (
                <span className="text-xs text-[#756A70]">{booking.department.nameAr}</span>
              )}
            </div>

            <div className="bg-[#F7F2EF] rounded-2xl p-5 border border-[#E9DDE2]">
              <span className="text-xs text-[#756A70] flex items-center gap-1.5 mb-1">
                <User className="w-4 h-4 text-[#E94D91]" />
                <span>الطبيب المختص:</span>
              </span>
              <p className="font-extrabold text-base text-[#5A103A]">
                {booking.doctor?.nameAr}
              </p>
              <span className="text-xs text-[#9E2A63]">
                {booking.doctor?.professionalTitle}
              </span>
            </div>

            <div className="bg-[#F7F2EF] rounded-2xl p-5 border border-[#E9DDE2]">
              <span className="text-xs text-[#756A70] flex items-center gap-1.5 mb-1">
                <Calendar className="w-4 h-4 text-[#E94D91]" />
                <span>التاريخ والوقت:</span>
              </span>
              <p className="font-extrabold text-base text-[#2B2228]">
                {booking.appointmentDate} · {booking.appointmentTime} – {booking.endTime}
              </p>
              <span className="text-xs text-[#756A70]">
                المدة: {booking.durationMinutes} دقيقة
              </span>
            </div>

            <div className="bg-[#F7F2EF] rounded-2xl p-5 border border-[#E9DDE2]">
              <span className="text-xs text-[#756A70] block mb-1">المراجع والرسوم:</span>
              <p className="font-extrabold text-base text-[#2B2228]">
                {booking.patientName} ({booking.patientPhoneMasked})
              </p>
              <span className="text-xs text-[#5A103A] font-bold">
                {booking.priceDisplay}
              </span>
            </div>
          </div>

          {booking.adminNotes && (
            <div className="bg-[#F4E6EB] rounded-2xl p-4 border border-[#DCA0B2] text-xs sm:text-sm text-[#5A103A]">
              <strong>ملاحظة منسق العيادة:</strong> {booking.adminNotes}
            </div>
          )}

          {/* سجل أحداث الطلب */}
          {booking.events && booking.events.length > 0 && (
            <div className="pt-4 border-t border-[#E9DDE2]">
              <h3 className="text-sm font-extrabold text-[#5A103A] mb-3">
                سجل تحديثات الطلب:
              </h3>
              <div className="space-y-2">
                {booking.events.map((ev) => (
                  <div
                    key={ev.id}
                    className="text-xs bg-[#F7F2EF] rounded-xl px-4 py-2.5 border border-[#E9DDE2] flex flex-wrap items-center justify-between gap-2"
                  >
                    <span className="font-bold text-[#2B2228]">
                      {ev.note || `تغيير الحالة إلى ${ev.newStatus}`}
                    </span>
                    <span className="text-[#756A70]" dir="ltr">
                      {new Date(ev.createdAt).toLocaleString("ar-SA")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#E9DDE2] flex flex-wrap items-center justify-between gap-4">
            <a
              href="tel:+966112220555"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#5A103A] hover:text-[#E94D91]"
            >
              <Phone className="w-4 h-4 text-[#E94D91]" />
              <span>للاستفسار المباشر: 0555 222 11 966+</span>
            </a>

            <Link
              href="/"
              className="bg-[#5A103A] hover:bg-[#3E0A27] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-full inline-flex items-center gap-2"
            >
              <span>العودة للصفحة الرئيسية</span>
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2EF]">
      <Header />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="p-12 text-center font-bold text-[#5A103A]">
              جاري التحميل...
            </div>
          }
        >
          <ConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
