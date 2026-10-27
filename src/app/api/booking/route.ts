import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/db";
import { appointments, doctors, services, departments, appointmentEvents } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { createAppointmentTransaction, ensureClinicDatabase } from "@/lib/clinic-service";

export const dynamic = "force-dynamic";

const createBookingSchema = z.object({
  serviceId: z.number().int().positive("يرجى اختيار الخدمة"),
  doctorId: z.number().int().positive("يرجى اختيار الطبيب المختص"),
  appointmentDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "صيغة التاريخ غير صحيحة"),
  appointmentTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, "صيغة الوقت غير صحيحة"),
  patientName: z
    .string()
    .min(3, "يرجى إدخال الاسم الكامل (3 أحرف على الأقل)")
    .max(120, "الاسم طويل جداً"),
  patientPhone: z
    .string()
    .min(9, "يرجى إدخال رقم هاتف صحيح للتواصل")
    .max(25, "رقم الهاتف غير صالح"),
  patientEmail: z.string().email("البريد الإلكتروني غير صالح").optional().or(z.literal("")),
  patientNotes: z.string().max(600, "الملاحظات لا تتجاوز 600 حرف").optional().or(z.literal("")),
  privacyConsent: z.boolean().refine((v) => v === true, {
    message: "يجب الموافقة على سياسة الخصوصية وشروط الحجز للمتابعة",
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = createBookingSchema.safeParse(body);

    if (!parsed.success) {
      const firstIssue = parsed.error.issues[0];
      return NextResponse.json(
        {
          ok: false,
          error: firstIssue?.message || "يرجى التحقق من البيانات المدخلة",
          issues: parsed.error.issues,
        },
        { status: 400 }
      );
    }

    const created = await createAppointmentTransaction(parsed.data);

    return NextResponse.json({
      ok: true,
      data: {
        referenceCode: created.reference_code,
        status: created.status,
        appointmentDate: created.appointment_date,
        appointmentTime: created.appointment_time,
        endTime: created.end_time,
        priceDisplay: created.price_display,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "تعذر إتمام طلب الحجز في الوقت الحالي";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}

export async function GET(request: NextRequest) {
  try {
    await ensureClinicDatabase();
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get("ref")?.trim();

    if (!ref) {
      return NextResponse.json(
        { ok: false, error: "رمز الحجز المرجعي مطلوب لعرض تفاصيل الطلب" },
        { status: 400 }
      );
    }

    const apptRows = await db
      .select()
      .from(appointments)
      .where(eq(appointments.referenceCode, ref));

    const appt = apptRows[0];
    if (!appt) {
      return NextResponse.json(
        { ok: false, error: "لم يتم العثور على طلب حجز بهذا الرمز المرجعي" },
        { status: 404 }
      );
    }

    const [srvRows, docRows, eventRows] = await Promise.all([
      db.select().from(services).where(eq(services.id, appt.serviceId)),
      db.select().from(doctors).where(eq(doctors.id, appt.doctorId)),
      db
        .select()
        .from(appointmentEvents)
        .where(eq(appointmentEvents.appointmentId, appt.id))
        .orderBy(desc(appointmentEvents.createdAt)),
    ]);

    const srv = srvRows[0];
    const doc = docRows[0];
    const deptRows = doc
      ? await db.select().from(departments).where(eq(departments.id, doc.departmentId))
      : [];

    // Mask phone number partially for public lookup security while showing confirmation details
    const phone = appt.patientPhone;
    const maskedPhone =
      phone.length > 6
        ? `${phone.slice(0, 4)}***${phone.slice(-3)}`
        : phone;

    return NextResponse.json({
      ok: true,
      data: {
        referenceCode: appt.referenceCode,
        status: appt.status,
        appointmentDate: appt.appointmentDate,
        appointmentTime: appt.appointmentTime,
        endTime: appt.endTime,
        durationMinutes: appt.durationMinutes,
        patientName: appt.patientName,
        patientPhoneMasked: maskedPhone,
        priceDisplay: appt.priceDisplay,
        adminNotes: appt.adminNotes,
        createdAt: appt.createdAt,
        service: srv
          ? { id: srv.id, slug: srv.slug, nameAr: srv.nameAr, specialtyTag: srv.specialtyTag }
          : null,
        doctor: doc
          ? {
              id: doc.id,
              slug: doc.slug,
              nameAr: doc.nameAr,
              professionalTitle: doc.professionalTitle,
            }
          : null,
        department: deptRows[0]
          ? { slug: deptRows[0].slug, nameAr: deptRows[0].nameAr }
          : null,
        events: eventRows,
      },
    });
  } catch (error) {
    console.error("Error fetching booking by reference:", error);
    return NextResponse.json(
      { ok: false, error: "تعذر استرجاع بيانات الحجز" },
      { status: 500 }
    );
  }
}
