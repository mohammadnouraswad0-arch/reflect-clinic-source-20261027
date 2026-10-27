import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  appointments,
  appointmentEvents,
  doctors,
  services,
  departments,
  doctorServices,
  doctorSchedules,
  scheduleExceptions,
  clinicSettings,
  reviews,
  adminUsers,
} from "@/db/schema";
import { eq, desc, asc, and } from "drizzle-orm";
import { ensureClinicDatabase } from "@/lib/clinic-service";
import { INITIAL_CLINIC_SETTINGS } from "@/lib/clinic-seed-data";

export const dynamic = "force-dynamic";

async function verifyAdminAuth(request: NextRequest): Promise<boolean> {
  await ensureClinicDatabase();
  const passcode =
    request.headers.get("x-admin-passcode") ||
    request.cookies.get("reflect_admin_token")?.value ||
    "";

  const expectedEnv = process.env.ADMIN_PASSCODE || "reflect2026";
  if (passcode === expectedEnv) return true;

  if (!passcode) return false;
  const rows = await db
    .select()
    .from(adminUsers)
    .where(and(eq(adminUsers.passwordHash, passcode), eq(adminUsers.isActive, true)));

  return rows.length > 0;
}

export async function GET(request: NextRequest) {
  try {
    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { ok: false, error: "غير مصرح بالوصول. يرجى تسجيل الدخول برمز الإدارة الصحيح." },
        { status: 401 }
      );
    }

    const [
      allDepts,
      allServices,
      allDoctors,
      allDocServices,
      allSchedules,
      allExceptions,
      allAppointments,
      allEvents,
      settingsRows,
      allReviews,
    ] = await Promise.all([
      db.select().from(departments).orderBy(asc(departments.displayOrder)),
      db.select().from(services).orderBy(asc(services.displayOrder)),
      db.select().from(doctors).orderBy(asc(doctors.displayOrder)),
      db.select().from(doctorServices),
      db.select().from(doctorSchedules),
      db.select().from(scheduleExceptions).orderBy(desc(scheduleExceptions.exceptionDate)),
      db.select().from(appointments).orderBy(desc(appointments.createdAt)),
      db.select().from(appointmentEvents).orderBy(desc(appointmentEvents.createdAt)),
      db.select().from(clinicSettings).where(eq(clinicSettings.key, "general")),
      db.select().from(reviews).orderBy(desc(reviews.createdAt)),
    ]);

    const settings =
      (settingsRows[0]?.valueJson as typeof INITIAL_CLINIC_SETTINGS | undefined) ??
      INITIAL_CLINIC_SETTINGS;

    return NextResponse.json({
      ok: true,
      data: {
        departments: allDepts,
        services: allServices,
        doctors: allDoctors,
        doctorServices: allDocServices,
        doctorSchedules: allSchedules,
        scheduleExceptions: allExceptions,
        appointments: allAppointments,
        appointmentEvents: allEvents,
        settings,
        reviews: allReviews,
      },
    });
  } catch (error) {
    console.error("Admin GET error:", error);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تحميل بيانات لوحة الإدارة" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Allow login check action
    if (body.action === "login") {
      await ensureClinicDatabase();
      const passcode = String(body.passcode || "").trim();
      const expectedEnv = process.env.ADMIN_PASSCODE || "reflect2026";
      const rows = await db
        .select()
        .from(adminUsers)
        .where(and(eq(adminUsers.passwordHash, passcode), eq(adminUsers.isActive, true)));

      if (passcode === expectedEnv || rows.length > 0) {
        const res = NextResponse.json({
          ok: true,
          adminName: rows[0]?.nameAr || "مدير النظام الطبي — Reflect Clinic",
        });
        res.cookies.set("reflect_admin_token", passcode, {
          httpOnly: false,
          path: "/",
          maxAge: 60 * 60 * 12,
        });
        return res;
      }
      return NextResponse.json(
        { ok: false, error: "رمز الدخول غير صحيح" },
        { status: 401 }
      );
    }

    const isAuthorized = await verifyAdminAuth(request);
    if (!isAuthorized) {
      return NextResponse.json(
        { ok: false, error: "غير مصرح بتنفيذ هذا الإجراء" },
        { status: 401 }
      );
    }

    const { action, payload } = body;

    // 1. Update Appointment Status
    if (action === "update_appointment_status") {
      const { appointmentId, status, adminNotes } = payload;
      const existing = await db
        .select()
        .from(appointments)
        .where(eq(appointments.id, Number(appointmentId)));
      if (!existing[0]) {
        return NextResponse.json({ ok: false, error: "الحجز غير موجود" }, { status: 404 });
      }

      const prevStatus = existing[0].status;
      await db
        .update(appointments)
        .set({
          status,
          adminNotes: adminNotes ?? existing[0].adminNotes,
          updatedAt: new Date(),
        })
        .where(eq(appointments.id, Number(appointmentId)));

      await db.insert(appointmentEvents).values({
        appointmentId: Number(appointmentId),
        eventType: "status_changed",
        previousStatus: prevStatus,
        newStatus: status,
        note: adminNotes || `تم تحديث حالة الموعد إلى ${status}`,
        performedBy: "admin",
      });

      return NextResponse.json({ ok: true });
    }

    // 2. Update Doctor Profile & Verification / Publish Status & Linked Services
    if (action === "update_doctor") {
      const {
        id,
        nameAr,
        nameEn,
        professionalTitle,
        primarySpecialty,
        subSpecialties,
        qualifications,
        bioAr,
        departmentId,
        officialImageUrl,
        infoSources,
        verificationStatus,
        publishStatus,
        profileStatus,
        verificationNotes,
        isFeaturedCard,
        displayOrder,
        serviceIds,
      } = payload;

      await db
        .update(doctors)
        .set({
          nameAr,
          nameEn,
          professionalTitle,
          primarySpecialty,
          subSpecialties: Array.isArray(subSpecialties) ? subSpecialties : [],
          qualifications: Array.isArray(qualifications) ? qualifications : [],
          bioAr,
          departmentId: Number(departmentId),
          officialImageUrl: officialImageUrl || null,
          infoSources,
          lastVerifiedAt: new Date().toISOString().slice(0, 10),
          verificationStatus,
          publishStatus,
          profileStatus,
          verificationNotes: verificationNotes || null,
          isFeaturedCard: Boolean(isFeaturedCard),
          displayOrder: Number(displayOrder) || 1,
          updatedAt: new Date(),
        })
        .where(eq(doctors.id, Number(id)));

      if (Array.isArray(serviceIds)) {
        await db.delete(doctorServices).where(eq(doctorServices.doctorId, Number(id)));
        for (const sId of serviceIds) {
          await db
            .insert(doctorServices)
            .values({
              doctorId: Number(id),
              serviceId: Number(sId),
              isVerifiedRelation: true,
            })
            .onConflictDoNothing();
        }
      }

      return NextResponse.json({ ok: true });
    }

    // 3. Create New Doctor
    if (action === "create_doctor") {
      const {
        slug,
        nameAr,
        nameEn,
        professionalTitle,
        primarySpecialty,
        subSpecialties,
        qualifications,
        bioAr,
        departmentId,
        officialImageUrl,
        infoSources,
        verificationStatus,
        publishStatus,
        profileStatus,
        verificationNotes,
        serviceIds,
      } = payload;

      const cleanSlug =
        (slug || nameEn || `doctor-${Date.now()}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `doctor-${Date.now()}`;

      const [created] = await db
        .insert(doctors)
        .values({
          slug: cleanSlug,
          nameAr,
          nameEn: nameEn || nameAr,
          professionalTitle,
          primarySpecialty,
          subSpecialties: Array.isArray(subSpecialties) ? subSpecialties : [],
          qualifications: Array.isArray(qualifications) ? qualifications : [],
          bioAr: bioAr || "",
          departmentId: Number(departmentId),
          officialImageUrl: officialImageUrl || null,
          infoSources: infoSources || "لوحة إدارة العيادة",
          lastVerifiedAt: new Date().toISOString().slice(0, 10),
          verificationStatus: verificationStatus || "draft",
          publishStatus: publishStatus || "draft",
          profileStatus: profileStatus || "incomplete_draft",
          verificationNotes: verificationNotes || null,
          displayOrder: 25,
          isFeaturedCard: false,
        })
        .returning();

      for (let day = 0; day <= 6; day++) {
        await db.insert(doctorSchedules).values({
          doctorId: created.id,
          dayOfWeek: day,
          isWorkingDay: day !== 5,
          startTime: "12:00",
          endTime: "16:00",
          secondShiftStart: "17:00",
          secondShiftEnd: "21:00",
          slotDurationMinutes: 30,
        });
      }

      if (Array.isArray(serviceIds)) {
        for (const sId of serviceIds) {
          await db
            .insert(doctorServices)
            .values({
              doctorId: created.id,
              serviceId: Number(sId),
              isVerifiedRelation: true,
            })
            .onConflictDoNothing();
        }
      }

      return NextResponse.json({ ok: true, data: created });
    }

    // 4. Update Service
    if (action === "update_service") {
      const {
        id,
        nameAr,
        shortDescription,
        fullDescription,
        generalMedicalInfo,
        specialtyTag,
        iconName,
        departmentId,
        durationMinutes,
        priceNote,
        isHomepageFeatured,
        homepageOrder,
        isBookable,
        isVisible,
      } = payload;

      await db
        .update(services)
        .set({
          nameAr,
          shortDescription,
          fullDescription,
          generalMedicalInfo,
          specialtyTag,
          iconName: iconName || "Sparkles",
          departmentId: Number(departmentId),
          durationMinutes: Number(durationMinutes) || 30,
          priceNote: priceNote || "يُحدد بعد التواصل مع العيادة",
          isHomepageFeatured: Boolean(isHomepageFeatured),
          homepageOrder: Number(homepageOrder) || 99,
          isBookable: Boolean(isBookable),
          isVisible: Boolean(isVisible),
          updatedAt: new Date(),
        })
        .where(eq(services.id, Number(id)));

      return NextResponse.json({ ok: true });
    }

    // 5. Create New Service
    if (action === "create_service") {
      const {
        slug,
        nameAr,
        nameEn,
        departmentId,
        shortDescription,
        fullDescription,
        generalMedicalInfo,
        specialtyTag,
        iconName,
        durationMinutes,
        isHomepageFeatured,
        homepageOrder,
      } = payload;

      const cleanSlug =
        (slug || nameEn || `service-${Date.now()}`)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || `service-${Date.now()}`;

      const [created] = await db
        .insert(services)
        .values({
          slug: cleanSlug,
          departmentId: Number(departmentId),
          nameAr,
          nameEn: nameEn || nameAr,
          shortDescription,
          fullDescription: fullDescription || shortDescription,
          generalMedicalInfo: generalMedicalInfo || shortDescription,
          specialtyTag: specialtyTag || "تخصص طبي وتجميلي",
          iconName: iconName || "Sparkles",
          durationMinutes: Number(durationMinutes) || 30,
          priceNote: "يُحدد بعد التواصل مع العيادة",
          isHomepageFeatured: Boolean(isHomepageFeatured),
          homepageOrder: Number(homepageOrder) || 99,
          displayOrder: 20,
          isBookable: true,
          isVisible: true,
        })
        .returning();

      return NextResponse.json({ ok: true, data: created });
    }

    // 6. Add Schedule Exception / Holiday
    if (action === "add_schedule_exception") {
      const { doctorId, exceptionDate, isFullDayOff, startTime, endTime, reason } = payload;
      await db.insert(scheduleExceptions).values({
        doctorId: doctorId ? Number(doctorId) : null,
        exceptionDate,
        isFullDayOff: Boolean(isFullDayOff),
        startTime: startTime || null,
        endTime: endTime || null,
        reason: reason || "إجازة / فترة محجوبة",
      });
      return NextResponse.json({ ok: true });
    }

    // 7. Delete Schedule Exception
    if (action === "delete_schedule_exception") {
      await db
        .delete(scheduleExceptions)
        .where(eq(scheduleExceptions.id, Number(payload.id)));
      return NextResponse.json({ ok: true });
    }

    // 8. Update Clinic Settings (Opening Hours, Contact Info, Homepage Content, Reviews Visibility)
    if (action === "update_settings") {
      const existing = await db
        .select()
        .from(clinicSettings)
        .where(eq(clinicSettings.key, "general"));
      const merged = {
        ...(existing[0]?.valueJson as Record<string, unknown>),
        ...payload,
      };
      await db
        .update(clinicSettings)
        .set({ valueJson: merged, updatedAt: new Date() })
        .where(eq(clinicSettings.key, "general"));
      return NextResponse.json({ ok: true, data: merged });
    }

    // 9. Add or Update Verified Review
    if (action === "add_review") {
      const { reviewerName, rating, comment, sourceUrl, isVerified, isVisible, reviewDate } =
        payload;
      await db.insert(reviews).values({
        reviewerName,
        rating: Number(rating) || 5,
        comment,
        sourceUrl: sourceUrl || null,
        isVerified: Boolean(isVerified),
        isVisible: Boolean(isVisible),
        reviewDate: reviewDate || new Date().toISOString().slice(0, 10),
      });
      return NextResponse.json({ ok: true });
    }

    if (action === "toggle_review") {
      const { id, isVisible, isVerified } = payload;
      await db
        .update(reviews)
        .set({ isVisible: Boolean(isVisible), isVerified: Boolean(isVerified) })
        .where(eq(reviews.id, Number(id)));
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "إجراء غير معروف" }, { status: 400 });
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء تنفيذ العملية الإدارية" },
      { status: 500 }
    );
  }
}
