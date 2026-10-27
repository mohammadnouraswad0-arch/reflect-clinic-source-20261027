"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Check,
  Calendar,
  Clock,
  UserRound,
  Stethoscope,
  ChevronRight,
  ChevronLeft,
  ShieldCheck,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { MedicalIcon } from "./MedicalIcon";

interface WizardService {
  id: number;
  slug: string;
  nameAr: string;
  shortDescription: string;
  specialtyTag: string;
  iconName: string;
  durationMinutes: number;
  priceNote: string;
  isBookable: boolean;
  department: { id: number; slug: string; nameAr: string } | null;
  doctors: Array<{
    id: number;
    slug: string;
    nameAr: string;
    professionalTitle: string;
  }>;
}

interface WizardDoctor {
  id: number;
  slug: string;
  nameAr: string;
  professionalTitle: string;
  primarySpecialty: string;
  department: { id: number; slug: string; nameAr: string } | null;
  services: Array<{ id: number; slug: string; nameAr: string }>;
}

interface BookingWizardProps {
  services: WizardService[];
  doctors: WizardDoctor[];
  departments: Array<{ id: number; slug: string; nameAr: string }>;
}

const REQUESTED_TIME_WINDOWS = [
  { time: "10:00", labelAr: "10:00 صباحًا (فترة صباحية)" },
  { time: "11:30", labelAr: "11:30 صباحًا (فترة الضحى)" },
  { time: "13:00", labelAr: "1:00 مساءً (فترة الظهيرة)" },
  { time: "16:30", labelAr: "4:30 مساءً (فترة العصر)" },
  { time: "18:00", labelAr: "6:00 مساءً (فترة المساء الأولى)" },
  { time: "19:30", labelAr: "7:30 مساءً (فترة المساء الثانية)" },
];

export function BookingWizard({
  services,
  doctors,
  departments,
}: BookingWizardProps) {
  const searchParams = useSearchParams();

  const initialServiceSlug = searchParams.get("service") || "";
  const initialDoctorSlug = searchParams.get("doctor") || "";
  const initialDeptSlug = searchParams.get("department") || "all";
  const initialDate = searchParams.get("date") || "";
  const initialTime = searchParams.get("time") || "10:00";

  const bookableServices = useMemo(
    () => services.filter((s) => s.isBookable && s.doctors.length > 0),
    [services]
  );

  const preselectedDoctor = useMemo(
    () => doctors.find((d) => d.slug === initialDoctorSlug) || null,
    [doctors, initialDoctorSlug]
  );

  // 5 خطوات: 1. الخدمة | 2. الطبيب | 3. التاريخ والوقت المطلوبين | 4. بيانات التواصل | 5. المراجعة والإرسال
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [deptFilter, setDeptFilter] = useState<string>(initialDeptSlug);

  const [selectedServiceId, setSelectedServiceId] = useState<number>(() => {
    const matchedSrv = bookableServices.find((s) => s.slug === initialServiceSlug);
    if (matchedSrv) return matchedSrv.id;
    if (preselectedDoctor && preselectedDoctor.services.length > 0) {
      const firstDocSrv = bookableServices.find(
        (s) => s.id === preselectedDoctor.services[0].id
      );
      if (firstDocSrv) return firstDocSrv.id;
    }
    return bookableServices[0]?.id || 0;
  });

  const selectedService = useMemo(
    () => bookableServices.find((s) => s.id === selectedServiceId) || null,
    [bookableServices, selectedServiceId]
  );

  // الأطباء المرتبطون بالخدمة المختارة فقط (يمنع اختيار طبيب غير مرتبط بالخدمة)
  const qualifiedDoctors = useMemo(() => {
    if (!selectedService) return [];
    return selectedService.doctors;
  }, [selectedService]);

  const [selectedDoctorId, setSelectedDoctorId] = useState<number>(() => {
    if (preselectedDoctor) return preselectedDoctor.id;
    return 0;
  });

  useEffect(() => {
    if (!selectedService) return;
    const docs = selectedService.doctors;
    if (docs.length === 1) {
      setSelectedDoctorId(docs[0].id);
    } else if (
      preselectedDoctor &&
      docs.some((d) => d.id === preselectedDoctor.id)
    ) {
      setSelectedDoctorId(preselectedDoctor.id);
    } else if (!docs.some((d) => d.id === selectedDoctorId)) {
      setSelectedDoctorId(docs[0]?.id || 0);
    }
  }, [selectedService, preselectedDoctor, selectedDoctorId]);

  const selectedDoctor = useMemo(
    () => qualifiedDoctors.find((d) => d.id === selectedDoctorId) || null,
    [qualifiedDoctors, selectedDoctorId]
  );

  const todayIso = useMemo(() => new Date().toISOString().slice(0, 10), []);

  const upcomingDays = useMemo(() => {
    const days: Array<{
      dateStr: string;
      dayNameAr: string;
      dayNumber: string;
      monthNameAr: string;
      isFriday: boolean;
    }> = [];
    const dayNames = [
      "الأحد",
      "الاثنين",
      "الثلاثاء",
      "الأربعاء",
      "الخميس",
      "الجمعة",
      "السبت",
    ];
    const monthNames = [
      "يناير",
      "فبراير",
      "مارس",
      "أبريل",
      "مايو",
      "يونيو",
      "يوليو",
      "أغسطس",
      "سبتمبر",
      "أكتوبر",
      "نوفمبر",
      "ديسمبر",
    ];
    const now = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(now);
      d.setDate(now.getDate() + i);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const dayOfWeek = d.getDay();
      days.push({
        dateStr: `${yyyy}-${mm}-${dd}`,
        dayNameAr: i === 0 ? "اليوم" : i === 1 ? "غدًا" : dayNames[dayOfWeek],
        dayNumber: dd,
        monthNameAr: monthNames[d.getMonth()],
        isFriday: dayOfWeek === 5,
      });
    }
    return days;
  }, []);

  const [requestedDate, setRequestedDate] = useState<string>(() => {
    if (
      initialDate &&
      /^\d{4}-\d{2}-\d{2}$/.test(initialDate) &&
      initialDate >= todayIso
    ) {
      return initialDate;
    }
    const firstWorkingDay = upcomingDays.find((d) => !d.isFriday);
    return firstWorkingDay?.dateStr || upcomingDays[0]?.dateStr || todayIso;
  });

  const [requestedTime, setRequestedTime] = useState<string>(initialTime || "10:00");

  // بيانات التواصل للمراجع (محفوظة عند الرجوع بين الخطوات)
  const [patientName, setPatientName] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientNotes, setPatientNotes] = useState("");
  const [privacyConsent, setPrivacyConsent] = useState(false);

  // أخطاء التحقق وحالات الإرسال
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submittedBooking, setSubmittedBooking] = useState<{
    referenceCode: string;
    appointmentDate: string;
    appointmentTime: string;
    status: string;
  } | null>(null);

  const filteredStep1Services = useMemo(() => {
    if (deptFilter === "all") return bookableServices;
    return bookableServices.filter((s) => s.department?.slug === deptFilter);
  }, [bookableServices, deptFilter]);

  const validateStep3 = (): boolean => {
    const errs: Record<string, string> = {};
    if (!requestedDate || !/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
      errs.date = "يرجى تحديد التاريخ المطلوب للموعد.";
    } else if (requestedDate < todayIso) {
      errs.date = "لا يمكن اختيار تاريخ سابق لليوم الحالي.";
    } else {
      const [y, m, d] = requestedDate.split("-").map(Number);
      const dayOfWeek = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
      if (dayOfWeek === 5) {
        errs.date = "يوم الجمعة عطلة أسبوعية وفق جدول العيادة الأولي. يرجى اختيار يوم آخر.";
      }
    }

    if (!requestedTime) {
      errs.time = "يرجى اختيار الفترة الزمنية المطلوبة.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = (): boolean => {
    const errs: Record<string, string> = {};
    if (patientName.trim().length < 3) {
      errs.patientName = "يرجى إدخال الاسم الكامل (3 أحرف على الأقل).";
    }
    const cleanPhone = patientPhone.replace(/\s+/g, "");
    if (!/^[+0-9]{9,15}$/.test(cleanPhone)) {
      errs.patientPhone = "يرجى إدخال رقم هاتف صحيح مكون من 9 إلى 15 رقمًا.";
    }
    if (
      patientEmail.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientEmail.trim())
    ) {
      errs.patientEmail = "صيغة البريد الإلكتروني غير صحيحة.";
    }
    if (!privacyConsent) {
      errs.privacyConsent = "يرجى الموافقة على سياسة الخصوصية للمتابعة.";
    }
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFinalSubmit = async () => {
    if (submitting || submittedBooking) return; // منع الإرسال المكرر
    setSubmitError(null);

    if (!selectedService || !selectedDoctor) {
      setSubmitError("يرجى التأكد من اختيار الخدمة والطبيب المرتبط بها.");
      return;
    }
    if (!validateStep3() || !validateStep4()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          doctorId: selectedDoctor.id,
          appointmentDate: requestedDate,
          appointmentTime: requestedTime,
          patientName: patientName.trim(),
          patientPhone: patientPhone.trim(),
          patientEmail: patientEmail.trim(),
          patientNotes: patientNotes.trim(),
          privacyConsent,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setSubmitError(json.error || "تعذر تسجيل طلب الموعد. يرجى المحاولة مرة أخرى.");
        setSubmitting(false);
        return;
      }

      setSubmittedBooking({
        referenceCode: json.data.referenceCode,
        appointmentDate: json.data.appointmentDate,
        appointmentTime: json.data.appointmentTime,
        status: json.data.status,
      });
      setSubmitting(false);
    } catch {
      setSubmitError("حدث خطأ في الاتصال بالخادم أثناء حفظ الطلب.");
      setSubmitting(false);
    }
  };

  const stepsMeta = [
    { num: 1, title: "1. اختيار الخدمة" },
    { num: 2, title: "2. اختيار الطبيب" },
    { num: 3, title: "3. الموعد المطلوب" },
    { num: 4, title: "4. بيانات التواصل" },
    { num: 5, title: "5. مراجعة وإرسال" },
  ];

  const selectedTimeLabel =
    REQUESTED_TIME_WINDOWS.find((w) => w.time === requestedTime)?.labelAr ||
    requestedTime;

  // حالة النجاح الصادقة بعد الحفظ الفعلي في قاعدة البيانات
  if (submittedBooking) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="bg-white rounded-[2rem] p-7 sm:p-10 border-2 border-[#C5D6A0] shadow-[0_8px_30px_rgb(101_13_61/6%)] text-right space-y-6 max-w-3xl mx-auto"
      >
        <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-[#E9DFE4]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C5D6A0]/30 text-[#650D3D] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-[#650D3D]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F04491] block">
                تم استلام طلب الموعد (بانتظار تأكيد العيادة)
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D]">
                تم تسجيل طلبك بنجاح في نظام العيادة
              </h2>
            </div>
          </div>

          <div className="bg-[#F8F4F0] px-4 py-2 rounded-2xl border border-[#E9DFE4] text-left">
            <span className="text-[11px] text-[#756A71] block">الرقم المرجعي للطلب:</span>
            <span dir="ltr" className="font-mono font-bold text-base text-[#650D3D]">
              {submittedBooking.referenceCode}
            </span>
          </div>
        </div>

        <div className="bg-[#FFF0F6] rounded-2xl p-4 border border-[#F04491]/30 text-xs sm:text-sm text-[#650D3D] leading-relaxed">
          <strong>تنويه هام:</strong> تسجيل هذا الطلب لا يعني التأكيد النهائي التلقائي للموعد؛ سيقوم فريق تنسيق المواعيد في عيادات ريفلكت بمراجعة الموعد المطلوب والتواصل معك عبر رقم الهاتف المسجل لتأكيد الموعد النهائي.
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-[#F8F4F0] p-4 rounded-2xl border border-[#E9DFE4]">
            <span className="text-xs text-[#756A71] block mb-1">الخدمة المختارة:</span>
            <strong className="text-[#650D3D]">{selectedService?.nameAr}</strong>
          </div>
          <div className="bg-[#F8F4F0] p-4 rounded-2xl border border-[#E9DFE4]">
            <span className="text-xs text-[#756A71] block mb-1">الطبيب المختار:</span>
            <strong className="text-[#650D3D]">{selectedDoctor?.nameAr}</strong>
          </div>
          <div className="bg-[#F8F4F0] p-4 rounded-2xl border border-[#E9DFE4]">
            <span className="text-xs text-[#756A71] block mb-1">الموعد المطلوب:</span>
            <strong className="text-[#2B2027]">
              {submittedBooking.appointmentDate} · {selectedTimeLabel}
            </strong>
          </div>
          <div className="bg-[#F8F4F0] p-4 rounded-2xl border border-[#E9DFE4]">
            <span className="text-xs text-[#756A71] block mb-1">بيانات المراجع:</span>
            <strong className="text-[#2B2027]">{patientName}</strong>
            <span dir="ltr" className="block text-xs text-[#756A71]">
              {patientPhone}
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E9DFE4] flex flex-wrap items-center justify-between gap-3">
          <Link
            href={`/booking/confirmation?ref=${encodeURIComponent(
              submittedBooking.referenceCode
            )}`}
            className="bg-[#650D3D] hover:bg-[#4e092f] text-white font-bold text-sm px-6 py-3 rounded-full transition-all"
          >
            صفحة متابعة حالة الطلب
          </Link>

          <Link
            href="/"
            className="bg-[#F8F4F0] hover:bg-[#E9DFE4] text-[#650D3D] font-bold text-sm px-6 py-3 rounded-full transition-all"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* مؤشر التقدم للخطوات الخمس */}
      <div className="bg-white rounded-[1.75rem] p-4 sm:p-6 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)]">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {stepsMeta.map((s) => {
            const isCurrent = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < step) setStep(s.num as 1 | 2 | 3 | 4 | 5);
                }}
                disabled={s.num > step}
                className={`flex items-center gap-2.5 p-3 rounded-2xl text-right transition-all ${
                  isCurrent
                    ? "bg-[#650D3D] text-white shadow-xs"
                    : isDone
                    ? "bg-[#FFF0F6] text-[#650D3D] border border-[#F04491]/40 cursor-pointer"
                    : "bg-[#F8F4F0] text-[#756A71] opacity-75"
                }`}
              >
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isCurrent
                      ? "bg-[#F04491] text-white"
                      : isDone
                      ? "bg-[#650D3D] text-white"
                      : "bg-white text-[#756A71] border border-[#E9DFE4]"
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5" /> : s.num}
                </span>
                <span className="text-xs font-bold truncate">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {submitError && (
        <div
          role="alert"
          className="bg-rose-50 border-2 border-[#F04491] text-[#650D3D] rounded-2xl p-4 flex items-center gap-3 text-sm font-bold"
        >
          <AlertCircle className="w-5 h-5 text-[#F04491] shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] text-right">
          {/* الخطوة 1: اختيار الخدمة */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#F04491]">الخطوة 1 من 5</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D] mt-1">
                  اختر الخدمة المطلوبة
                </h2>
                <p className="text-xs sm:text-sm text-[#756A71] mt-1">
                  اختر الخدمة الطبية أو التجميلية من بين خدمات العيادة ليتم عرض الأطباء المرتبطين بها في الخطوة التالية.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setDeptFilter("all")}
                  className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                    deptFilter === "all"
                      ? "bg-[#650D3D] text-white"
                      : "bg-[#F8F4F0] text-[#2B2027] border border-[#E9DFE4]"
                  }`}
                >
                  جميع الأقسام ({bookableServices.length})
                </button>
                {departments.map((d) => (
                  <button
                    key={d.slug}
                    type="button"
                    onClick={() => setDeptFilter(d.slug)}
                    className={`px-4 py-2 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                      deptFilter === d.slug
                        ? "bg-[#650D3D] text-white"
                        : "bg-[#F8F4F0] text-[#2B2027] border border-[#E9DFE4]"
                    }`}
                  >
                    {d.nameAr}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[440px] overflow-y-auto pl-1">
                {filteredStep1Services.map((srv) => {
                  const isSelected = srv.id === selectedServiceId;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={[
                        "service-card p-4 text-right flex items-start gap-3.5 cursor-pointer",
                        isSelected ? "is-selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#650D3D] text-white"
                            : "bg-[#F8F4F0] text-[#650D3D] border border-[#E9DFE4]"
                        }`}
                      >
                        <MedicalIcon name={srv.iconName} className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm sm:text-base text-[#650D3D]">
                          {srv.nameAr}
                        </p>
                        <p className="text-xs text-[#756A71] mt-1 line-clamp-2">
                          {srv.shortDescription}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#E9DFE4] flex justify-end">
                <button
                  type="button"
                  disabled={!selectedService}
                  onClick={() => setStep(2)}
                  className="bg-[#F04491] hover:bg-[#d8357f] disabled:opacity-50 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>التالي: اختيار الطبيب</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* الخطوة 2: اختيار الطبيب المرتبط بالخدمة فقط */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#F04491]">الخطوة 2 من 5</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D] mt-1">
                  اختر الطبيب المرتبط بخدمة «{selectedService?.nameAr}»
                </h2>
                <p className="text-xs sm:text-sm text-[#756A71] mt-1">
                  يظهر هنا حصريًا الأطباء المسجلون لتقديم هذه الخدمة في قاعدة البيانات، ولا يُسمح باختيار طبيب غير مرتبط بالخدمة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {qualifiedDoctors.map((doc) => {
                  const isSelected = doc.id === selectedDoctorId;
                  return (
                    <button
                      key={doc.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => setSelectedDoctorId(doc.id)}
                      className={[
                        "service-card p-5 text-right flex items-center gap-3.5 cursor-pointer",
                        isSelected ? "is-selected" : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-[#650D3D] text-white"
                            : "bg-[#F8F4F0] text-[#650D3D] border border-[#E9DFE4]"
                        }`}
                      >
                        <UserRound className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-base text-[#650D3D]">
                          {doc.nameAr}
                        </p>
                        <p className="text-xs text-[#756A71] mt-0.5">
                          {doc.professionalTitle}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-[#E9DFE4] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-[#F8F4F0] hover:bg-[#E9DFE4] text-[#650D3D] font-bold text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  type="button"
                  disabled={!selectedDoctor}
                  onClick={() => setStep(3)}
                  className="bg-[#F04491] hover:bg-[#d8357f] disabled:opacity-50 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>التالي: تحديد الموعد المطلوب</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* الخطوة 3: تحديد التاريخ والوقت المطلوبين */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#F04491]">الخطوة 3 من 5</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D] mt-1">
                  تحديد التاريخ والوقت المطلوبين (الموعد المطلوب)
                </h2>
                <p className="text-xs sm:text-sm text-[#756A71] mt-1">
                  اختر التاريخ والفترة الزمنية المطلوبة. هذا الاختيار يمثل «الموعد المطلوب» المفضل لديك، ويحتاج الطلب إلى تأكيد من منسق العيادة بعد المراجعة.
                </p>
              </div>

              {/* اختيار التاريخ مع رفض التاريخ السابق */}
              <div className="space-y-3">
                <label
                  htmlFor="requested-date-input"
                  className="block text-xs sm:text-sm font-bold text-[#650D3D]"
                >
                  اختر التاريخ المطلوب (السبت – الخميس):
                </label>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-2">
                  {upcomingDays.map((day) => {
                    const isSelected = day.dateStr === requestedDate;
                    return (
                      <button
                        key={day.dateStr}
                        type="button"
                        disabled={day.isFriday}
                        onClick={() => {
                          setRequestedDate(day.dateStr);
                          setFieldErrors((prev) => ({ ...prev, date: "" }));
                        }}
                        className={`p-2.5 rounded-2xl border text-center transition-all ${
                          day.isFriday
                            ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            : isSelected
                            ? "bg-[#650D3D] border-[#F04491] text-white shadow-xs cursor-pointer"
                            : "bg-[#F8F4F0] border-[#E9DFE4] text-[#2B2027] hover:border-[#650D3D] cursor-pointer"
                        }`}
                      >
                        <span className="block text-[11px] font-bold">
                          {day.dayNameAr}
                        </span>
                        <span className="block text-base font-bold my-0.5">
                          {day.dayNumber}
                        </span>
                        <span className="block text-[10px] opacity-80">
                          {day.isFriday ? "عطلة" : day.monthNameAr}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <label
                    htmlFor="requested-date-input"
                    className="block text-xs text-[#756A71] mb-1"
                  >
                    أو حدد تاريخًا آخر من التقويم (لا يقبل تاريخًا سابقًا لـ {todayIso}):
                  </label>
                  <input
                    id="requested-date-input"
                    type="date"
                    min={todayIso}
                    value={requestedDate}
                    onChange={(e) => {
                      setRequestedDate(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, date: "" }));
                    }}
                    aria-describedby={fieldErrors.date ? "date-error-msg" : undefined}
                    className="bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-xl px-4 py-2.5 text-sm font-bold text-[#650D3D]"
                  />
                </div>

                {fieldErrors.date && (
                  <p id="date-error-msg" className="text-xs font-bold text-rose-600">
                    {fieldErrors.date}
                  </p>
                )}
              </div>

              {/* اختيار الفترة الزمنية المطلوبة */}
              <div className="space-y-3 pt-4 border-t border-[#E9DFE4]">
                <label className="block text-xs sm:text-sm font-bold text-[#650D3D]">
                  اختر الوقت المطلوب (ضمن ساعات الدوام 10:00 صباحًا – 9:00 مساءً):
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {REQUESTED_TIME_WINDOWS.map((slot) => {
                    const isSelected = slot.time === requestedTime;
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => {
                          setRequestedTime(slot.time);
                          setFieldErrors((prev) => ({ ...prev, time: "" }));
                        }}
                        className={[
                          "service-card p-3.5 text-right flex items-center gap-2.5 cursor-pointer",
                          isSelected ? "is-selected" : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                      >
                        <Clock className="w-4 h-4 text-[#F04491] shrink-0" />
                        <span className="text-xs sm:text-sm font-bold text-[#650D3D]">
                          {slot.labelAr}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {fieldErrors.time && (
                  <p className="text-xs font-bold text-rose-600">{fieldErrors.time}</p>
                )}
              </div>

              <div className="pt-4 border-t border-[#E9DFE4] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="bg-[#F8F4F0] hover:bg-[#E9DFE4] text-[#650D3D] font-bold text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep3()) setStep(4);
                  }}
                  className="bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>التالي: بيانات التواصل</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* الخطوة 4: إدخال بيانات التواصل */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#F04491]">الخطوة 4 من 5</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D] mt-1">
                  إدخال بيانات التواصل
                </h2>
                <p className="text-xs sm:text-sm text-[#756A71] mt-1">
                  نجمع أقل قدر ضروري من البيانات للتواصل معك وتأكيد الموعد المطلوب، ولا نطلب تفاصيل صحية حساسة.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label
                    htmlFor="booking-patient-name"
                    className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
                  >
                    الاسم الكامل <span className="text-[#F04491]">*</span>
                  </label>
                  <input
                    id="booking-patient-name"
                    type="text"
                    value={patientName}
                    onChange={(e) => {
                      setPatientName(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, patientName: "" }));
                    }}
                    aria-invalid={Boolean(fieldErrors.patientName)}
                    aria-describedby={
                      fieldErrors.patientName ? "err-patient-name" : undefined
                    }
                    placeholder="أدخل الاسم الكامل"
                    className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl px-4 py-3.5 text-sm text-[#2B2027]"
                  />
                  {fieldErrors.patientName && (
                    <p
                      id="err-patient-name"
                      className="text-xs font-bold text-rose-600 mt-1"
                    >
                      {fieldErrors.patientName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-patient-phone"
                    className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
                  >
                    رقم الجوال <span className="text-[#F04491]">*</span>
                  </label>
                  <input
                    id="booking-patient-phone"
                    type="tel"
                    dir="ltr"
                    value={patientPhone}
                    onChange={(e) => {
                      setPatientPhone(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, patientPhone: "" }));
                    }}
                    aria-invalid={Boolean(fieldErrors.patientPhone)}
                    aria-describedby={
                      fieldErrors.patientPhone ? "err-patient-phone" : undefined
                    }
                    placeholder="05XXXXXXXX"
                    className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl px-4 py-3.5 text-sm text-right text-[#2B2027]"
                  />
                  {fieldErrors.patientPhone && (
                    <p
                      id="err-patient-phone"
                      className="text-xs font-bold text-rose-600 mt-1"
                    >
                      {fieldErrors.patientPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="booking-patient-email"
                    className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
                  >
                    البريد الإلكتروني (اختياري)
                  </label>
                  <input
                    id="booking-patient-email"
                    type="email"
                    dir="ltr"
                    value={patientEmail}
                    onChange={(e) => {
                      setPatientEmail(e.target.value);
                      setFieldErrors((prev) => ({ ...prev, patientEmail: "" }));
                    }}
                    aria-invalid={Boolean(fieldErrors.patientEmail)}
                    aria-describedby={
                      fieldErrors.patientEmail ? "err-patient-email" : undefined
                    }
                    placeholder="name@example.com"
                    className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl px-4 py-3.5 text-sm text-right text-[#2B2027]"
                  />
                  {fieldErrors.patientEmail && (
                    <p
                      id="err-patient-email"
                      className="text-xs font-bold text-rose-600 mt-1"
                    >
                      {fieldErrors.patientEmail}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="booking-patient-notes"
                    className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
                  >
                    ملاحظات إضافية لمنسق المواعيد (اختياري)
                  </label>
                  <textarea
                    id="booking-patient-notes"
                    rows={3}
                    value={patientNotes}
                    onChange={(e) => setPatientNotes(e.target.value)}
                    placeholder="أضف أي ملاحظة تنظيمية خاصة بالتواصل (يرجى عدم كتابة معلومات صحية حساسة)..."
                    className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl p-4 text-sm text-[#2B2027]"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-start gap-3 p-4 rounded-2xl bg-[#F8F4F0] border border-[#E9DFE4] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={privacyConsent}
                    onChange={(e) => {
                      setPrivacyConsent(e.target.checked);
                      setFieldErrors((prev) => ({ ...prev, privacyConsent: "" }));
                    }}
                    className="mt-1 w-4 h-4 accent-[#650D3D]"
                  />
                  <span className="text-xs sm:text-sm text-[#2B2027] leading-relaxed">
                    أوافق على{" "}
                    <Link href="/privacy" className="text-[#650D3D] font-bold underline">
                      سياسة الخصوصية
                    </Link>{" "}
                    وأقر بأن هذا الطلب يمثل «موعدًا مطلوبًا» يحتاج إلى تأكيد من منسق المواعيد في عيادات ريفلكت.
                  </span>
                </label>
                {fieldErrors.privacyConsent && (
                  <p className="text-xs font-bold text-rose-600 mt-1">
                    {fieldErrors.privacyConsent}
                  </p>
                )}
              </div>

              <div className="pt-4 border-t border-[#E9DFE4] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="bg-[#F8F4F0] hover:bg-[#E9DFE4] text-[#650D3D] font-bold text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السابق</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (validateStep4()) setStep(5);
                  }}
                  className="bg-[#F04491] hover:bg-[#d8357f] text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all"
                >
                  <span>التالي: مراجعة الطلب</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* الخطوة 5: مراجعة الطلب وإرساله */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold text-[#F04491]">الخطوة 5 من 5</span>
                <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D] mt-1">
                  مراجعة الطلب وإرساله
                </h2>
                <p className="text-xs sm:text-sm text-[#756A71] mt-1">
                  راجع بيانات الموعد المطلوب قبل إرسال الطلب إلى نظام عيادات ريفلكت.
                </p>
              </div>

              <div className="bg-[#F8F4F0] rounded-3xl p-6 border border-[#E9DFE4] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-2xl border border-[#E9DFE4]">
                    <span className="text-xs text-[#756A71] block mb-1">الخدمة:</span>
                    <strong className="text-[#650D3D] text-base">
                      {selectedService?.nameAr}
                    </strong>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#E9DFE4]">
                    <span className="text-xs text-[#756A71] block mb-1">الطبيب:</span>
                    <strong className="text-[#650D3D] text-base">
                      {selectedDoctor?.nameAr}
                    </strong>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#E9DFE4]">
                    <span className="text-xs text-[#756A71] block mb-1">
                      الموعد المطلوب (يحتاج لتأكيد العيادة):
                    </span>
                    <strong className="text-[#2B2027]">
                      {requestedDate} · {selectedTimeLabel}
                    </strong>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-[#E9DFE4]">
                    <span className="text-xs text-[#756A71] block mb-1">بيانات التواصل:</span>
                    <strong className="text-[#2B2027] block">{patientName}</strong>
                    <span dir="ltr" className="text-xs text-[#756A71]">
                      {patientPhone}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9DFE4] flex items-center justify-between gap-4">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => setStep(4)}
                  className="bg-[#F8F4F0] hover:bg-[#E9DFE4] text-[#650D3D] font-bold text-sm px-6 py-3.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>تعديل البيانات</span>
                </button>

                <button
                  type="button"
                  disabled={submitting}
                  onClick={handleFinalSubmit}
                  className="bg-[#F04491] hover:bg-[#d8357f] disabled:opacity-60 text-white font-bold text-base px-9 py-4 rounded-full shadow-md inline-flex items-center gap-2.5 cursor-pointer transition-all"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري حفظ الطلب...</span>
                    </>
                  ) : (
                    <>
                      <Calendar className="w-5 h-5" />
                      <span>إرسال طلب الموعد</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ملخص جانبي يحتفظ بالبيانات عبر جميع الخطوات */}
        <aside className="lg:col-span-4 bg-[#650D3D] text-white rounded-[2rem] p-6 sm:p-7 border border-white/15 shadow-lg text-right space-y-5 sticky top-24">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/15">
            <Sparkles className="w-5 h-5 text-[#C5D6A0]" />
            <h3 className="text-lg font-bold">ملخص طلب الموعد</h3>
          </div>

          <div className="space-y-4 text-sm">
            <div>
              <span className="text-xs text-[#C5D6A0] block mb-1">1. الخدمة المختارة:</span>
              <p className="font-bold text-white">
                {selectedService?.nameAr || "لم يتم الاختيار"}
              </p>
            </div>

            <div className="pt-3 border-t border-white/15">
              <span className="text-xs text-[#C5D6A0] block mb-1">2. الطبيب المختار:</span>
              <p className="font-bold text-white">
                {selectedDoctor?.nameAr || "لم يتم الاختيار"}
              </p>
            </div>

            <div className="pt-3 border-t border-white/15">
              <span className="text-xs text-[#C5D6A0] block mb-1">3. الموعد المطلوب:</span>
              <p className="font-bold text-white">
                {requestedDate} · {selectedTimeLabel}
              </p>
            </div>

            {patientName && (
              <div className="pt-3 border-t border-white/15">
                <span className="text-xs text-[#C5D6A0] block mb-1">4. المراجع:</span>
                <p className="font-bold text-white">{patientName}</p>
              </div>
            )}
          </div>

          <div className="bg-white/10 rounded-2xl p-4 text-xs text-[#F8F4F0]/90 leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#C5D6A0] shrink-0 mt-0.5" />
            <span>
              يتم إصدار رقم مرجعي فور حفظ الطلب، ويتواصل معك فريق العيادة لتأكيد الموعد النهائي.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
