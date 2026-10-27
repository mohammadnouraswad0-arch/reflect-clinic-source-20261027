"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export function ContactForm() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (fullName.trim().length < 3) {
      errs.fullName = "يرجى إدخال الاسم الكامل (3 أحرف على الأقل).";
    }
    const cleanPhone = phone.replace(/\s+/g, "");
    if (!/^[+0-9]{9,15}$/.test(cleanPhone)) {
      errs.phone = "يرجى إدخال رقم هاتف صحيح مكون من 9 إلى 15 رقمًا.";
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "صيغة البريد الإلكتروني غير صحيحة.";
    }
    if (subject.trim().length < 3) {
      errs.subject = "يرجى إدخال عنوان أو موضوع الاستفسار.";
    }
    if (message.trim().length < 10) {
      errs.message = "يرجى كتابة نص الرسالة (10 أحرف على الأقل).";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setServerError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          phone,
          email,
          subject,
          message,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setServerError(json.error || "تعذر حفظ الرسالة، يرجى المحاولة مرة أخرى.");
      } else {
        setSavedId(json.data.messageId);
        setFullName("");
        setPhone("");
        setEmail("");
        setSubject("");
        setMessage("");
      }
    } catch {
      setServerError("تعذر الاتصال بالخادم، يرجى المحاولة لاحقًا.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-[2rem] p-6 sm:p-9 border border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/6%)] text-right">
      <h2 className="text-xl sm:text-2xl font-bold text-[#650D3D] mb-2">
        نموذج المراسلة والاستفسارات
      </h2>
      <p className="text-xs sm:text-sm text-[#756A71] mb-6 leading-relaxed">
        يتم التحقق من البيانات وحفظ استفسارك في قاعدة بيانات العيادة ليطلع عليه فريق خدمة المراجعين. للحالات السريعة يُنصح بالتواصل المباشر عبر الهاتف أو واتساب.
      </p>

      {savedId && (
        <div
          role="status"
          className="mb-6 bg-[#FFF0F6] border border-[#F04491]/40 rounded-2xl p-4 text-xs sm:text-sm text-[#650D3D] flex items-start gap-3"
        >
          <CheckCircle2 className="w-5 h-5 text-[#F04491] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">تم حفظ رسالتك في سجل الاستفسارات (#{savedId})</p>
            <p className="text-[#756A71] mt-0.5">
              تم تسجيل استفسارك في قاعدة البيانات المحلية للعيادة، وسيقوم فريق التنسيق بمراجعته.
            </p>
          </div>
        </div>
      )}

      {serverError && (
        <div
          role="alert"
          className="mb-6 bg-rose-50 border border-rose-300 rounded-2xl p-4 text-xs sm:text-sm text-rose-900 flex items-center gap-2.5 font-bold"
        >
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-fullname"
              className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
            >
              الاسم الكامل <span className="text-[#F04491]">*</span>
            </label>
            <input
              id="contact-fullname"
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                setErrors((p) => ({ ...p, fullName: "" }));
              }}
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "err-contact-name" : undefined}
              className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl px-4 py-3 text-sm"
              placeholder="الاسم الكامل"
            />
            {errors.fullName && (
              <p id="err-contact-name" className="text-xs font-bold text-rose-600 mt-1">
                {errors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-phone"
              className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
            >
              رقم الجوال <span className="text-[#F04491]">*</span>
            </label>
            <input
              id="contact-phone"
              type="tel"
              dir="ltr"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setErrors((p) => ({ ...p, phone: "" }));
              }}
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "err-contact-phone" : undefined}
              className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl px-4 py-3 text-sm text-right"
              placeholder="05XXXXXXXX"
            />
            {errors.phone && (
              <p id="err-contact-phone" className="text-xs font-bold text-rose-600 mt-1">
                {errors.phone}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="contact-email"
              className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
            >
              البريد الإلكتروني (اختياري)
            </label>
            <input
              id="contact-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: "" }));
              }}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "err-contact-email" : undefined}
              className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl px-4 py-3 text-sm text-right"
              placeholder="name@example.com"
            />
            {errors.email && (
              <p id="err-contact-email" className="text-xs font-bold text-rose-600 mt-1">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contact-subject"
              className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
            >
              الموضوع <span className="text-[#F04491]">*</span>
            </label>
            <input
              id="contact-subject"
              type="text"
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                setErrors((p) => ({ ...p, subject: "" }));
              }}
              aria-invalid={Boolean(errors.subject)}
              aria-describedby={errors.subject ? "err-contact-subject" : undefined}
              className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl px-4 py-3 text-sm"
              placeholder="استفسار عن قسم أو خدمة"
            />
            {errors.subject && (
              <p id="err-contact-subject" className="text-xs font-bold text-rose-600 mt-1">
                {errors.subject}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-xs sm:text-sm font-bold text-[#650D3D] mb-1.5"
          >
            نص الاستفسار <span className="text-[#F04491]">*</span>
          </label>
          <textarea
            id="contact-message"
            rows={4}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              setErrors((p) => ({ ...p, message: "" }));
            }}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={errors.message ? "err-contact-message" : undefined}
            className="w-full bg-[#F8F4F0] border border-[#E9DFE4] focus:border-[#650D3D] rounded-2xl p-4 text-sm"
            placeholder="اكتب رسالتك هنا (يرجى عدم تضمين بيانات صحية حساسة)..."
          />
          {errors.message && (
            <p id="err-contact-message" className="text-xs font-bold text-rose-600 mt-1">
              {errors.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="bg-[#650D3D] hover:bg-[#4e092f] disabled:opacity-60 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-full inline-flex items-center gap-2 cursor-pointer transition-all"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>جاري الحفظ...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4 text-[#F04491]" />
              <span>إرسال الاستفسار</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
