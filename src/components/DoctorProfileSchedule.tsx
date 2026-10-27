"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, CheckCircle2, Loader2 } from "lucide-react";

interface DoctorProfileScheduleProps {
  doctorId: number;
  doctorSlug: string;
  services: Array<{ id: number; slug: string; nameAr: string; durationMinutes: number }>;
}

export function DoctorProfileSchedule({
  doctorId,
  doctorSlug,
  services,
}: DoctorProfileScheduleProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<number>(
    services[0]?.id || 0
  );

  // توليد الأيام السبعة القادمة
  const upcomingDays = React.useMemo(() => {
    const days: Array<{ dateStr: string; dayNameAr: string; dateLabel: string }> = [];
    const dayNames = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      days.push({
        dateStr: `${yyyy}-${mm}-${dd}`,
        dayNameAr: i === 0 ? "اليوم" : i === 1 ? "غداً" : dayNames[d.getDay()],
        dateLabel: `${dd}/${mm}`,
      });
    }
    return days;
  }, []);

  const [selectedDate, setSelectedDate] = useState<string>(
    upcomingDays[0]?.dateStr || ""
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [slotsData, setSlotsData] = useState<{
    isWorkingDay: boolean;
    reasonIfClosed?: string;
    slots: Array<{ time: string; labelAr: string; available: boolean }>;
  } | null>(null);

  useEffect(() => {
    if (!doctorId || !selectedServiceId || !selectedDate) return;
    let cancelled = false;
    setLoading(true);
    fetch(
      `/api/booking/slots?doctorId=${doctorId}&serviceId=${selectedServiceId}&date=${selectedDate}`
    )
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled && json.ok) {
          setSlotsData(json.data);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [doctorId, selectedServiceId, selectedDate]);

  const selectedService = services.find((s) => s.id === selectedServiceId);

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E9DDE2] text-right">
        <h3 className="text-lg font-extrabold text-[#5A103A] mb-2">
          جدول المواعيد
        </h3>
        <p className="text-sm text-[#756A70]">
          هذا الملف قيد استكمال ربط الخدمات في لوحة الإدارة قبل إتاحة الحجز المباشر.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E9DDE2] shadow-xs text-right space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E9DDE2] pb-4">
        <div>
          <h3 className="text-xl font-extrabold text-[#5A103A]">
            المواعيد المتاحة مع الطبيب
          </h3>
          <p className="text-xs sm:text-sm text-[#756A70]">
            اختر الخدمة واليوم لاستعراض الفترات المتاحة فعلياً والانتقال للحجز المباشر
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F7F2EF] text-[#5A103A] text-xs font-bold border border-[#DCA0B2]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E94D91]" />
          <span>مرتبط بالجدول الفعلي</span>
        </span>
      </div>

      {/* 1. اختيار الخدمة التي يقدمها الطبيب */}
      <div>
        <label className="block text-xs font-bold text-[#5A103A] mb-2">
          1. اختر الخدمة المطلوبة مع الطبيب:
        </label>
        <div className="flex flex-wrap gap-2">
          {services.map((srv) => (
            <button
              key={srv.id}
              type="button"
              onClick={() => setSelectedServiceId(srv.id)}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all ${
                selectedServiceId === srv.id
                  ? "bg-[#5A103A] text-white shadow-xs"
                  : "bg-[#F7F2EF] text-[#2B2228] border border-[#E9DDE2] hover:border-[#5A103A]"
              }`}
            >
              {srv.nameAr}
            </button>
          ))}
        </div>
      </div>

      {/* 2. اختيار اليوم */}
      <div>
        <label className="block text-xs font-bold text-[#5A103A] mb-2">
          2. اختر التاريخ:
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {upcomingDays.map((day) => {
            const active = day.dateStr === selectedDate;
            return (
              <button
                key={day.dateStr}
                type="button"
                onClick={() => setSelectedDate(day.dateStr)}
                className={`p-2.5 rounded-2xl border text-center transition-all ${
                  active
                    ? "bg-[#5A103A] border-[#E94D91] text-white shadow-xs"
                    : "bg-[#F7F2EF] border-[#E9DDE2] text-[#2B2228] hover:border-[#5A103A]"
                }`}
              >
                <span className="block text-xs font-extrabold">{day.dayNameAr}</span>
                <span
                  className={`block text-[11px] mt-0.5 ${
                    active ? "text-[#DCA0B2]" : "text-[#756A70]"
                  }`}
                >
                  {day.dateLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. عرض الأوقات المتاحة */}
      <div>
        <label className="block text-xs font-bold text-[#5A103A] mb-2">
          3. الفترات الزمنية المتاحة (اضغط على الوقت للانتقال لإتمام الحجز):
        </label>

        {loading ? (
          <div className="py-8 flex items-center justify-center gap-2 text-sm text-[#756A70]">
            <Loader2 className="w-5 h-5 animate-spin text-[#E94D91]" />
            <span>جاري فحص جدول الطبيب...</span>
          </div>
        ) : !slotsData?.isWorkingDay ? (
          <div className="bg-[#F7F2EF] rounded-2xl p-4 text-xs sm:text-sm text-[#756A70] border border-[#E9DDE2]">
            {slotsData?.reasonIfClosed || "لا توجد فترات عمل متاحة في هذا اليوم. يرجى اختيار يوم آخر."}
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {slotsData.slots.map((slot) =>
              slot.available ? (
                <Link
                  key={slot.time}
                  href={`/booking?doctor=${doctorSlug}&service=${
                    selectedService?.slug || ""
                  }&date=${selectedDate}&time=${slot.time}`}
                  className="bg-[#F7F2EF] hover:bg-[#E94D91] text-[#5A103A] hover:text-white border border-[#DCA0B2] rounded-xl py-2.5 px-3 text-center text-xs font-bold transition-all flex items-center justify-center gap-1"
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{slot.labelAr}</span>
                </Link>
              ) : (
                <span
                  key={slot.time}
                  className="bg-gray-100 text-gray-400 border border-gray-200 rounded-xl py-2.5 px-3 text-center text-xs font-medium line-through cursor-not-allowed"
                  title="فترة محجوزة"
                >
                  {slot.labelAr}
                </span>
              )
            )}
          </div>
        )}
      </div>

      <div className="pt-2">
        <Link
          href={`/booking?doctor=${doctorSlug}${
            selectedService ? `&service=${selectedService.slug}` : ""
          }`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#E94D91] hover:bg-[#D43B7E] text-white font-extrabold text-sm sm:text-base px-8 py-3.5 rounded-full shadow-md transition-all"
        >
          <Calendar className="w-4 h-4" />
          <span>احجز مع الطبيب الآن</span>
        </Link>
      </div>
    </div>
  );
}
