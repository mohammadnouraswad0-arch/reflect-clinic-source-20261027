"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Lock,
  Calendar,
  Users,
  Layers,
  Settings,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Trash2,
  Save,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  Loader2,
} from "lucide-react";

interface AdminAppointment {
  id: number;
  referenceCode: string;
  serviceId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  endTime: string;
  durationMinutes: number;
  patientName: string;
  patientPhone: string;
  patientEmail?: string | null;
  patientNotes?: string | null;
  status: string;
  adminNotes?: string | null;
  createdAt: string;
}

interface AdminDoctor {
  id: number;
  slug: string;
  nameAr: string;
  nameEn: string;
  professionalTitle: string;
  primarySpecialty: string;
  subSpecialties: string[];
  qualifications: string[];
  bioAr: string;
  departmentId: number;
  officialImageUrl: string | null;
  infoSources: string;
  lastVerifiedAt: string;
  verificationStatus: string;
  publishStatus: string;
  profileStatus: string;
  verificationNotes: string | null;
  displayOrder: number;
  isFeaturedCard: boolean;
}

interface AdminService {
  id: number;
  slug: string;
  departmentId: number;
  nameAr: string;
  nameEn: string;
  shortDescription: string;
  fullDescription: string;
  generalMedicalInfo: string;
  specialtyTag: string;
  iconName: string;
  durationMinutes: number;
  priceNote: string;
  isHomepageFeatured: boolean;
  homepageOrder: number;
  isBookable: boolean;
  isVisible: boolean;
}

interface AdminDepartment {
  id: number;
  slug: string;
  nameAr: string;
  titleAr: string;
}

export default function AdminDashboardPage() {
  const [passcode, setPasscode] = useState("reflect2026");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<
    "bookings" | "doctors" | "services" | "schedules" | "content"
  >("bookings");

  const [departments, setDepartments] = useState<AdminDepartment[]>([]);
  const [services, setServices] = useState<AdminService[]>([]);
  const [doctors, setDoctors] = useState<AdminDoctor[]>([]);
  const [doctorServices, setDoctorServices] = useState<
    Array<{ doctorId: number; serviceId: number }>
  >([]);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [exceptions, setExceptions] = useState<
    Array<{
      id: number;
      doctorId: number | null;
      exceptionDate: string;
      isFullDayOff: boolean;
      reason: string;
    }>
  >([]);
  const [settings, setSettings] = useState<Record<string, any>>({});
  const [reviewsList, setReviewsList] = useState<Array<any>>([]);

  // فلاتر الحجوزات
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [bookingDoctorFilter, setBookingDoctorFilter] = useState("all");

  // الطبيب المختار للتعديل
  const [editingDoctor, setEditingDoctor] = useState<AdminDoctor | null>(null);
  const [editingDocServiceIds, setEditingDocServiceIds] = useState<number[]>([]);

  // الخدمة المختارة للتعديل
  const [editingService, setEditingService] = useState<AdminService | null>(null);

  // إضافة إجازة / استثناء جديد
  const [newExDoctorId, setNewExDoctorId] = useState<string>("");
  const [newExDate, setNewExDate] = useState<string>("");
  const [newExReason, setNewExReason] = useState<string>("إجازة رسمية / فترة محجوبة");

  const showToast = (msg: string) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(null), 4000);
  };

  const fetchAdminData = async (tokenToUse?: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        headers: {
          "x-admin-passcode": tokenToUse || passcode,
        },
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setIsAuthenticated(false);
        setAuthError(json.error || "يرجى تسجيل الدخول");
      } else {
        setIsAuthenticated(true);
        setAuthError(null);
        setDepartments(json.data.departments || []);
        setServices(json.data.services || []);
        setDoctors(json.data.doctors || []);
        setDoctorServices(json.data.doctorServices || []);
        setAppointments(json.data.appointments || []);
        setExceptions(json.data.scheduleExceptions || []);
        setSettings(json.data.settings || {});
        setReviewsList(json.data.reviews || []);
      }
    } catch {
      setAuthError("تعذر الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", passcode }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setAuthError(json.error || "رمز الدخول غير صحيح");
        setLoading(false);
        return;
      }
      await fetchAdminData(passcode);
    } catch {
      setAuthError("حدث خطأ أثناء تسجيل الدخول");
      setLoading(false);
    }
  };

  const runAdminAction = async (action: string, payload: Record<string, any>) => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-passcode": passcode,
      },
      body: JSON.stringify({ action, payload }),
    });
    const json = await res.json();
    if (res.ok && json.ok) {
      await fetchAdminData(passcode);
      showToast("تم حفظ التغييرات بنجاح في قاعدة البيانات");
      return true;
    } else {
      alert(json.error || "تعذر تنفيذ العملية");
      return false;
    }
  };

  const openDoctorEditor = (doc: AdminDoctor) => {
    setEditingDoctor({ ...doc });
    const sIds = doctorServices
      .filter((ds) => ds.doctorId === doc.id)
      .map((ds) => ds.serviceId);
    setEditingDocServiceIds(sIds);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F2EF] flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-white rounded-[2.25rem] p-8 sm:p-10 border border-[#E9DDE2] shadow-xl text-right space-y-6">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-2xl bg-[#5A103A] text-white flex items-center justify-center">
              <Lock className="w-6 h-6 text-[#E94D91]" />
            </div>
            <Link
              href="/"
              className="text-xs font-bold text-[#5A103A] hover:text-[#E94D91] inline-flex items-center gap-1"
            >
              <span>العودة للموقع</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-[#5A103A] mb-1">
              بوابة الإدارة المحمية — Reflect Clinic
            </h1>
            <p className="text-xs sm:text-sm text-[#756A70]">
              مخصصة للموظفين المصرح لهم لإدارة الأطباء والخدمات والحجوزات وساعات العمل.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-[#E94D91] text-xs font-bold text-[#5A103A]">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-extrabold text-[#5A103A] mb-2">
                رمز مرور الإدارة:
              </label>
              <input
                type="password"
                dir="ltr"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="أدخل رمز الإدارة"
                className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-2xl px-4 py-3.5 text-sm text-center font-bold"
              />
              <p className="text-[11px] text-[#756A70] mt-1.5">
                رمز الدخول الافتراضي لبيئة المعاينة: <code className="font-mono font-bold text-[#5A103A]">reflect2026</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5A103A] hover:bg-[#3E0A27] text-white font-extrabold py-3.5 rounded-full shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#E94D91]" />
                  <span>دخول إلى لوحة الإدارة</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus =
      bookingStatusFilter === "all" || appt.status === bookingStatusFilter;
    const matchesDoc =
      bookingDoctorFilter === "all" || String(appt.doctorId) === bookingDoctorFilter;
    const q = bookingSearch.trim().toLowerCase();
    const matchesSearch =
      !q ||
      appt.patientName.toLowerCase().includes(q) ||
      appt.patientPhone.toLowerCase().includes(q) ||
      appt.referenceCode.toLowerCase().includes(q);
    return matchesStatus && matchesDoc && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F7F2EF] flex flex-col text-right">
      {/* شريط الإدارة العلوي */}
      <header className="bg-[#5A103A] text-white py-5 px-4 sm:px-8 border-b border-white/15 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-[#5A103A] font-extrabold flex items-center justify-center">
              R
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-extrabold">
                لوحة إدارة Reflect Clinic
              </h1>
              <p className="text-xs text-[#DCA0B2]">
                إدارة الأطباء ({doctors.length}) · الخدمات ({services.length}) · الحجوزات (
                {appointments.length})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors"
            >
              معاينة الموقع العام
            </Link>
            <button
              type="button"
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 rounded-full bg-[#E94D91] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>خروج</span>
            </button>
          </div>
        </div>
      </header>

      {feedbackMsg && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#5A103A] text-white px-6 py-3.5 rounded-2xl shadow-2xl border-2 border-[#E94D91] text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#E94D91]" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* أزرار التبويب الرئيسية */}
        <div className="flex flex-wrap gap-2 bg-white p-2.5 rounded-3xl border border-[#E9DDE2] shadow-2xs">
          {[
            { id: "bookings", label: `الحجوزات (${appointments.length})`, icon: Calendar },
            { id: "doctors", label: `الأطباء (${doctors.length})`, icon: Users },
            { id: "services", label: `الخدمات والأقسام (${services.length})`, icon: Layers },
            { id: "schedules", label: "الإجازات والفترات المحجوبة", icon: Clock },
            { id: "content", label: "ساعات العمل والتواصل والمحتوى", icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-5 py-3 rounded-2xl text-xs sm:text-sm font-extrabold inline-flex items-center gap-2 transition-all ${
                  active
                    ? "bg-[#5A103A] text-white shadow-sm"
                    : "text-[#2B2228] hover:bg-[#F7F2EF]"
                }`}
              >
                <Icon className="w-4 h-4 text-[#E94D91]" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. تبويب إدارة الحجوزات */}
        {activeTab === "bookings" && (
          <div className="space-y-6">
            <div className="bg-white rounded-[2rem] p-6 border border-[#E9DDE2] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[#756A70] absolute right-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="بحث باسم المراجع أو رقم الهاتف أو الرمز المرجعي..."
                  className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-full pr-10 pl-4 py-2.5 text-xs sm:text-sm"
                />
              </div>

              <select
                value={bookingStatusFilter}
                onChange={(e) => setBookingStatusFilter(e.target.value)}
                className="bg-[#F7F2EF] border border-[#E9DDE2] rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold text-[#5A103A]"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending_confirmation">طلب جديد بانتظار التأكيد</option>
                <option value="confirmed">موعد مؤكد</option>
                <option value="rejected">طلب مرفوض</option>
                <option value="cancelled">موعد ملغى</option>
              </select>

              <select
                value={bookingDoctorFilter}
                onChange={(e) => setBookingDoctorFilter(e.target.value)}
                className="bg-[#F7F2EF] border border-[#E9DDE2] rounded-full px-4 py-2.5 text-xs sm:text-sm font-bold text-[#5A103A]"
              >
                <option value="all">جميع الأطباء</option>
                {doctors.map((d) => (
                  <option key={d.id} value={String(d.id)}>
                    {d.nameAr}
                  </option>
                ))}
              </select>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="bg-white rounded-[2rem] p-12 text-center border border-[#E9DDE2]">
                <p className="font-extrabold text-[#5A103A] text-base">
                  لا توجد حجوزات مطابقة للفلاتر المحددة حالياً
                </p>
                <p className="text-xs text-[#756A70] mt-1">
                  الحجوزات المرسلة عبر صفحة /booking ستظهر هنا فوراً لإدارتها وتأكيدها.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appt) => {
                  const doc = doctors.find((d) => d.id === appt.doctorId);
                  const srv = services.find((s) => s.id === appt.serviceId);
                  return (
                    <div
                      key={appt.id}
                      className="bg-white rounded-3xl p-6 border border-[#E9DDE2] shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-5"
                    >
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            dir="ltr"
                            className="font-mono font-extrabold text-xs px-3 py-1 rounded-full bg-[#F7F2EF] text-[#5A103A] border border-[#DCA0B2]"
                          >
                            {appt.referenceCode}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                              appt.status === "confirmed"
                                ? "bg-emerald-100 text-emerald-800"
                                : appt.status === "rejected"
                                ? "bg-rose-100 text-rose-800"
                                : appt.status === "cancelled"
                                ? "bg-gray-200 text-gray-700"
                                : "bg-amber-100 text-amber-900"
                            }`}
                          >
                            {appt.status === "confirmed"
                              ? "موعد مؤكد"
                              : appt.status === "rejected"
                              ? "طلب مرفوض"
                              : appt.status === "cancelled"
                              ? "موعد ملغى"
                              : "بانتظار التأكيد"}
                          </span>
                          <span className="text-xs font-bold text-[#5A103A]">
                            {appt.appointmentDate} · {appt.appointmentTime} – {appt.endTime}
                          </span>
                        </div>

                        <p className="text-base font-extrabold text-[#2B2228]">
                          المراجع: {appt.patientName} —{" "}
                          <span dir="ltr" className="text-[#5A103A]">
                            {appt.patientPhone}
                          </span>
                        </p>

                        <p className="text-xs sm:text-sm text-[#756A70]">
                          الخدمة: <strong className="text-[#5A103A]">{srv?.nameAr}</strong> ·
                          الطبيب: <strong className="text-[#5A103A]">{doc?.nameAr}</strong>
                        </p>

                        {appt.patientNotes && (
                          <p className="text-xs text-[#756A70] bg-[#F7F2EF] p-2.5 rounded-xl">
                            ملاحظات المراجع: {appt.patientNotes}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            runAdminAction("update_appointment_status", {
                              appointmentId: appt.id,
                              status: "confirmed",
                              adminNotes: "تم تأكيد الموعد من قِبل منسق العيادة",
                            })
                          }
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-full inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>تأكيد الموعد</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            runAdminAction("update_appointment_status", {
                              appointmentId: appt.id,
                              status: "rejected",
                              adminNotes: "تعذر توفر الفترة، يرجى اختيار موعد آخر",
                            })
                          }
                          className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-full inline-flex items-center gap-1"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>رفض</span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            runAdminAction("update_appointment_status", {
                              appointmentId: appt.id,
                              status: "cancelled",
                              adminNotes: "تم إلغاء الموعد",
                            })
                          }
                          className="bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-full"
                        >
                          إلغاء
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* 2. تبويب إدارة الأطباء (جميع الـ 24 سجلاً) */}
        {activeTab === "doctors" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              <div className="bg-white rounded-3xl p-5 border border-[#E9DDE2] flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-[#5A103A]">
                    سجلات الأطباء المحفوظة ({doctors.length} طبيباً ومختصاً)
                  </h2>
                  <p className="text-xs text-[#756A70]">
                    اضغط على أي طبيب لتعديل بياناته، صورته الرسمية، حالة التحقق والنشر، والخدمات المرتبطة به.
                  </p>
                </div>
              </div>

              {doctors.map((doc) => {
                const dept = departments.find((d) => d.id === doc.departmentId);
                const linkedCount = doctorServices.filter(
                  (ds) => ds.doctorId === doc.id
                ).length;
                return (
                  <div
                    key={doc.id}
                    className={`bg-white rounded-2xl p-4 border transition-all flex items-center justify-between gap-4 ${
                      editingDoctor?.id === doc.id
                        ? "border-2 border-[#E94D91]"
                        : "border-[#E9DDE2]"
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-extrabold text-sm sm:text-base text-[#5A103A]">
                          {doc.displayOrder}. {doc.nameAr}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            doc.publishStatus === "published"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-900"
                          }`}
                        >
                          {doc.publishStatus === "published" ? "منشور" : "مسودة (Draft)"}
                        </span>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#F7F2EF] text-[#5A103A]">
                          {dept?.nameAr}
                        </span>
                      </div>
                      <p className="text-xs text-[#756A70] mt-1">
                        {doc.professionalTitle} · ({linkedCount} خدمات مرتبطة)
                      </p>
                      {doc.verificationNotes && (
                        <p className="text-[11px] text-amber-800 mt-1">
                          {doc.verificationNotes}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => openDoctorEditor(doc)}
                      className="shrink-0 bg-[#F7F2EF] hover:bg-[#5A103A] text-[#5A103A] hover:text-white text-xs font-bold px-4 py-2 rounded-full border border-[#DCA0B2] transition-colors"
                    >
                      تعديل الملف والخدمات
                    </button>
                  </div>
                );
              })}
            </div>

            {/* نموذج تحرير الطبيب المختار */}
            <div className="lg:col-span-5 bg-white rounded-[2rem] p-6 border border-[#E9DDE2] sticky top-24 space-y-4">
              {!editingDoctor ? (
                <div className="py-12 text-center text-sm text-[#756A70]">
                  اختر طبيباً من القائمة اليمنى لتعديل ملفه، أو تحديث حالة التحقق والنشر، أو ربطه بالخدمات.
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-extrabold text-[#5A103A] border-b border-[#E9DDE2] pb-3">
                    تعديل ملف: {editingDoctor.nameAr}
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="font-bold text-[#5A103A] block mb-1">
                        الاسم بالعربية:
                      </label>
                      <input
                        type="text"
                        value={editingDoctor.nameAr}
                        onChange={(e) =>
                          setEditingDoctor({ ...editingDoctor, nameAr: e.target.value })
                        }
                        className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#5A103A] block mb-1">
                        المسمى المهني:
                      </label>
                      <input
                        type="text"
                        value={editingDoctor.professionalTitle}
                        onChange={(e) =>
                          setEditingDoctor({
                            ...editingDoctor,
                            professionalTitle: e.target.value,
                          })
                        }
                        className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#5A103A] block mb-1">
                        رابط الصورة الرسمية الموثقة (اتركه فارغاً لعرض المساحة الرسمية البديلة):
                      </label>
                      <input
                        type="text"
                        dir="ltr"
                        value={editingDoctor.officialImageUrl || ""}
                        onChange={(e) =>
                          setEditingDoctor({
                            ...editingDoctor,
                            officialImageUrl: e.target.value || null,
                          })
                        }
                        placeholder="https://..."
                        className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-[#5A103A] block mb-1">
                          حالة النشر:
                        </label>
                        <select
                          value={editingDoctor.publishStatus}
                          onChange={(e) =>
                            setEditingDoctor({
                              ...editingDoctor,
                              publishStatus: e.target.value,
                            })
                          }
                          className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2 font-bold"
                        >
                          <option value="published">منشور (Published)</option>
                          <option value="draft">مسودة (Draft)</option>
                          <option value="hidden">مخفي (Hidden)</option>
                        </select>
                      </div>

                      <div>
                        <label className="font-bold text-[#5A103A] block mb-1">
                          حالة التحقق:
                        </label>
                        <select
                          value={editingDoctor.verificationStatus}
                          onChange={(e) =>
                            setEditingDoctor({
                              ...editingDoctor,
                              verificationStatus: e.target.value,
                            })
                          }
                          className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2 font-bold"
                        >
                          <option value="verified">تم التحقق</option>
                          <option value="pending_verification">بانتظار التحقق</option>
                          <option value="ready_to_publish">جاهز للنشر</option>
                          <option value="draft">مسودة</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="font-bold text-[#5A103A] block mb-1">
                        ربط الطبيب بالخدمات المؤهل لتقديمها فعلياً:
                      </label>
                      <div className="max-h-44 overflow-y-auto bg-[#F7F2EF] rounded-xl p-3 border border-[#E9DDE2] space-y-1.5">
                        {services.map((srv) => {
                          const checked = editingDocServiceIds.includes(srv.id);
                          return (
                            <label
                              key={srv.id}
                              className="flex items-center gap-2 cursor-pointer"
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditingDocServiceIds([
                                      ...editingDocServiceIds,
                                      srv.id,
                                    ]);
                                  } else {
                                    setEditingDocServiceIds(
                                      editingDocServiceIds.filter((id) => id !== srv.id)
                                    );
                                  }
                                }}
                                className="accent-[#5A103A]"
                              />
                              <span>{srv.nameAr}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          runAdminAction("update_doctor", {
                            ...editingDoctor,
                            serviceIds: editingDocServiceIds,
                          })
                        }
                        className="flex-1 bg-[#E94D91] hover:bg-[#D43B7E] text-white font-extrabold py-3 rounded-full inline-flex items-center justify-center gap-1.5"
                      >
                        <Save className="w-4 h-4" />
                        <span>حفظ تعديلات الطبيب</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* 3. تبويب إدارة الخدمات والأقسام */}
        {activeTab === "services" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-3">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="bg-white rounded-2xl p-4 border border-[#E9DDE2] flex items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-sm sm:text-base text-[#5A103A]">
                        {srv.nameAr}
                      </span>
                      {srv.isHomepageFeatured && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#5A103A] text-white text-[10px] font-bold">
                          بطاقة رئيسية #{srv.homepageOrder}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#756A70] mt-1">
                      {srv.specialtyTag} · المدة: {srv.durationMinutes} دقيقة
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEditingService({ ...srv })}
                    className="shrink-0 bg-[#F7F2EF] hover:bg-[#5A103A] text-[#5A103A] hover:text-white text-xs font-bold px-4 py-2 rounded-full border border-[#DCA0B2]"
                  >
                    تعديل الخدمة
                  </button>
                </div>
              ))}
            </div>

            <div className="lg:col-span-5 bg-white rounded-[2rem] p-6 border border-[#E9DDE2] sticky top-24 space-y-4">
              {!editingService ? (
                <div className="py-12 text-center text-sm text-[#756A70]">
                  اختر خدمة من القائمة لتعديل وصفها أو مدتها أو ترتيب ظهورها في البطاقات العشر بالصفحة الرئيسية.
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <h3 className="text-lg font-extrabold text-[#5A103A] border-b border-[#E9DDE2] pb-3">
                    تعديل خدمة: {editingService.nameAr}
                  </h3>

                  <div>
                    <label className="font-bold text-[#5A103A] block mb-1">
                      اسم الخدمة:
                    </label>
                    <input
                      type="text"
                      value={editingService.nameAr}
                      onChange={(e) =>
                        setEditingService({ ...editingService, nameAr: e.target.value })
                      }
                      className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#5A103A] block mb-1">
                      الوصف المختصر:
                    </label>
                    <textarea
                      rows={2}
                      value={editingService.shortDescription}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          shortDescription: e.target.value,
                        })
                      }
                      className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl p-3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-[#5A103A] block mb-1">
                        مدة الموعد (دقيقة):
                      </label>
                      <input
                        type="number"
                        value={editingService.durationMinutes}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            durationMinutes: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2"
                      />
                    </div>

                    <div>
                      <label className="font-bold text-[#5A103A] block mb-1">
                        ترتيب البطاقة بالرئيسية (1-10):
                      </label>
                      <input
                        type="number"
                        value={editingService.homepageOrder}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            homepageOrder: Number(e.target.value),
                          })
                        }
                        className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2"
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2 pt-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingService.isHomepageFeatured}
                      onChange={(e) =>
                        setEditingService({
                          ...editingService,
                          isHomepageFeatured: e.target.checked,
                        })
                      }
                      className="accent-[#5A103A]"
                    />
                    <span className="font-bold text-[#5A103A]">
                      إظهار ضمن البطاقات العشر التفاعلية في الصفحة الرئيسية
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => runAdminAction("update_service", editingService)}
                    className="w-full bg-[#E94D91] hover:bg-[#D43B7E] text-white font-extrabold py-3 rounded-full inline-flex items-center justify-center gap-1.5 mt-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>حفظ تعديلات الخدمة</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 4. تبويب الإجازات والأوقات المحجوبة */}
        {activeTab === "schedules" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 bg-white rounded-[2rem] p-6 border border-[#E9DDE2] space-y-4">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                إضافة إجازة أو حجب يوم من التقويم
              </h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#5A103A] block mb-1">
                    الطبيب (أو اتركه فارغاً لإجازة عامة للعيادة):
                  </label>
                  <select
                    value={newExDoctorId}
                    onChange={(e) => setNewExDoctorId(e.target.value)}
                    className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2.5 font-bold"
                  >
                    <option value="">جميع أطباء العيادة (إجازة عامة)</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={String(d.id)}>
                        {d.nameAr}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#5A103A] block mb-1">
                    التاريخ:
                  </label>
                  <input
                    type="date"
                    value={newExDate}
                    onChange={(e) => setNewExDate(e.target.value)}
                    className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2.5"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#5A103A] block mb-1">
                    السبب / الملاحظة:
                  </label>
                  <input
                    type="text"
                    value={newExReason}
                    onChange={(e) => setNewExReason(e.target.value)}
                    className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-3 py-2.5"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (!newExDate) return;
                    runAdminAction("add_schedule_exception", {
                      doctorId: newExDoctorId ? Number(newExDoctorId) : null,
                      exceptionDate: newExDate,
                      isFullDayOff: true,
                      reason: newExReason,
                    });
                    setNewExDate("");
                  }}
                  className="w-full bg-[#5A103A] text-white font-extrabold py-3 rounded-full inline-flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4 text-[#E94D91]" />
                  <span>إضافة حجب / إجازة في التقويم</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-[2rem] p-6 border border-[#E9DDE2] space-y-3">
              <h2 className="text-lg font-extrabold text-[#5A103A]">
                الإجازات والأيام المحجوبة المسجلة ({exceptions.length})
              </h2>
              {exceptions.length === 0 ? (
                <p className="text-xs text-[#756A70] py-6">
                  لا توجد إجازات استثنائية مسجلة حالياً (تعمل الجداول الأسبوعية المعتمدة للأطباء من السبت إلى الخميس).
                </p>
              ) : (
                exceptions.map((ex) => {
                  const doc = doctors.find((d) => d.id === ex.doctorId);
                  return (
                    <div
                      key={ex.id}
                      className="p-3.5 rounded-2xl bg-[#F7F2EF] border border-[#E9DDE2] flex items-center justify-between"
                    >
                      <div className="text-xs">
                        <p className="font-extrabold text-[#5A103A]">
                          {ex.exceptionDate} — {doc ? doc.nameAr : "إجازة عامة للعيادة"}
                        </p>
                        <p className="text-[#756A70]">{ex.reason}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          runAdminAction("delete_schedule_exception", { id: ex.id })
                        }
                        className="text-rose-600 hover:text-rose-800 p-2"
                        aria-label="حذف الإجازة"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 5. تبويب ساعات العمل والتواصل والمحتوى */}
        {activeTab === "content" && (
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-[#E9DDE2] space-y-6">
            <h2 className="text-xl font-extrabold text-[#5A103A]">
              إدارة المحتوى وساعات العمل وبيانات التواصل الموثقة
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs sm:text-sm">
              <div>
                <label className="font-bold text-[#5A103A] block mb-1.5">
                  عنوان قسم الـ Hero بالصفحة الرئيسية:
                </label>
                <input
                  type="text"
                  value={settings.heroTitleAr || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, heroTitleAr: e.target.value })
                  }
                  className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-4 py-2.5"
                />
              </div>

              <div>
                <label className="font-bold text-[#5A103A] block mb-1.5">
                  الهاتف الرسمي الموحد:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={settings.phone || ""}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-4 py-2.5"
                />
              </div>

              <div className="md:col-span-2">
                <label className="font-bold text-[#5A103A] block mb-1.5">
                  العنوان الرسمي الموثق:
                </label>
                <input
                  type="text"
                  value={settings.addressAr || ""}
                  onChange={(e) =>
                    setSettings({ ...settings, addressAr: e.target.value })
                  }
                  className="w-full bg-[#F7F2EF] border border-[#E9DDE2] rounded-xl px-4 py-2.5"
                />
              </div>

              <label className="flex items-center gap-2.5 p-4 rounded-2xl bg-[#F7F2EF] border border-[#E9DDE2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.openingHoursVerified)}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      openingHoursVerified: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#5A103A]"
                />
                <span>
                  إظهار جدول ساعات العمل التفصيلي (إذا كان غير مفعل يظهر: «يرجى التواصل لمعرفة ساعات العمل»)
                </span>
              </label>

              <label className="flex items-center gap-2.5 p-4 rounded-2xl bg-[#F7F2EF] border border-[#E9DDE2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.reviewsEnabled)}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      reviewsEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-[#5A103A]"
                />
                <span>
                  إظهار قسم آراء المراجعين الموثقة في الصفحة الرئيسية ({reviewsList.length} تقييم مسجل)
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => runAdminAction("update_settings", settings)}
              className="bg-[#E94D91] hover:bg-[#D43B7E] text-white font-extrabold text-sm px-8 py-3.5 rounded-full inline-flex items-center gap-2 shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>حفظ إعدادات العيادة وساعات العمل</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
