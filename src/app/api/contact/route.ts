import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/db";
import { ensureClinicDatabase } from "@/lib/clinic-service";

export const dynamic = "force-dynamic";

const contactSchema = z.object({
  fullName: z.string().min(3, "يرجى إدخال الاسم الكامل (3 أحرف على الأقل)").max(120),
  phone: z.string().min(9, "يرجى إدخال رقم جوال صحيح للتواصل").max(25),
  email: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  subject: z.string().min(3, "يرجى تحديد موضوع الرسالة").max(150),
  message: z.string().min(10, "يرجى كتابة تفاصيل الاستفسار (10 أحرف على الأقل)").max(1000),
});

export async function POST(request: NextRequest) {
  try {
    await ensureClinicDatabase();
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: parsed.error.issues[0]?.message || "يرجى التحقق من الحقول المدخلة",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const { fullName, phone, email, subject, message } = parsed.data;
    const res = await pool.query(
      `INSERT INTO contact_messages (full_name, phone, email, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [fullName.trim(), phone.trim(), email?.trim() || null, subject.trim(), message.trim()]
    );

    return NextResponse.json({
      ok: true,
      data: {
        messageId: res.rows[0].id,
        createdAt: res.rows[0].created_at,
      },
    });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { ok: false, error: "تعذر حفظ الرسالة في الوقت الحالي" },
      { status: 500 }
    );
  }
}
