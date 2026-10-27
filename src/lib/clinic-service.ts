import { db, pool } from "@/db";
import {
  departments,
  services,
  doctors,
  doctorServices,
  doctorSchedules,
  scheduleExceptions,
  appointments,
  appointmentEvents,
  clinicSettings,
  reviews,
  adminUsers,
} from "@/db/schema";
import { eq, asc, desc, and, ne } from "drizzle-orm";
import {
  INITIAL_CLINIC_SETTINGS,
  INITIAL_DEPARTMENTS,
  INITIAL_SERVICES,
  INITIAL_DOCTORS,
} from "./clinic-seed-data";

let isInitialized = false;
let initPromise: Promise<void> | null = null;

export async function ensureClinicDatabase(): Promise<void> {
  if (isInitialized) return;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const client = await pool.connect();
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS departments (
          id SERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          name_ar TEXT NOT NULL,
          name_en TEXT NOT NULL,
          title_ar TEXT NOT NULL,
          short_description TEXT NOT NULL,
          full_description TEXT NOT NULL,
          specialties_overview TEXT NOT NULL,
          icon_name TEXT NOT NULL DEFAULT 'Sparkles',
          display_order INTEGER NOT NULL DEFAULT 1,
          is_visible BOOLEAN NOT NULL DEFAULT TRUE,
          faqs_json JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS services (
          id SERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
          name_ar TEXT NOT NULL,
          name_en TEXT NOT NULL,
          short_description TEXT NOT NULL,
          full_description TEXT NOT NULL,
          general_medical_info TEXT NOT NULL,
          specialty_tag TEXT NOT NULL,
          icon_name TEXT NOT NULL DEFAULT 'Sparkles',
          duration_minutes INTEGER NOT NULL DEFAULT 30,
          price_note TEXT NOT NULL DEFAULT 'يُحدد بعد التواصل مع العيادة وتقييم الطبيب المختص',
          is_homepage_featured BOOLEAN NOT NULL DEFAULT FALSE,
          homepage_order INTEGER DEFAULT 99,
          display_order INTEGER NOT NULL DEFAULT 1,
          is_bookable BOOLEAN NOT NULL DEFAULT TRUE,
          is_visible BOOLEAN NOT NULL DEFAULT TRUE,
          faqs_json JSONB DEFAULT '[]'::jsonb,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS doctors (
          id SERIAL PRIMARY KEY,
          slug TEXT NOT NULL UNIQUE,
          name_ar TEXT NOT NULL,
          name_en TEXT NOT NULL,
          professional_title TEXT NOT NULL,
          primary_specialty TEXT NOT NULL,
          sub_specialties JSONB DEFAULT '[]'::jsonb,
          qualifications JSONB DEFAULT '[]'::jsonb,
          bio_ar TEXT NOT NULL,
          department_id INTEGER NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
          official_image_url TEXT,
          info_sources TEXT NOT NULL,
          last_verified_at TEXT NOT NULL,
          verification_status TEXT NOT NULL DEFAULT 'verified',
          publish_status TEXT NOT NULL DEFAULT 'published',
          profile_status TEXT NOT NULL DEFAULT 'complete',
          verification_notes TEXT,
          display_order INTEGER NOT NULL DEFAULT 1,
          is_featured_card BOOLEAN NOT NULL DEFAULT FALSE,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS doctor_services (
          id SERIAL PRIMARY KEY,
          doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
          service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE CASCADE,
          is_verified_relation BOOLEAN NOT NULL DEFAULT TRUE,
          notes TEXT
        );

        CREATE UNIQUE INDEX IF NOT EXISTS doctor_service_unique_idx ON doctor_services(doctor_id, service_id);

        CREATE TABLE IF NOT EXISTS doctor_schedules (
          id SERIAL PRIMARY KEY,
          doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
          day_of_week INTEGER NOT NULL,
          is_working_day BOOLEAN NOT NULL DEFAULT TRUE,
          start_time TEXT NOT NULL DEFAULT '10:00',
          end_time TEXT NOT NULL DEFAULT '21:00',
          second_shift_start TEXT,
          second_shift_end TEXT,
          slot_duration_minutes INTEGER NOT NULL DEFAULT 30
        );

        CREATE TABLE IF NOT EXISTS schedule_exceptions (
          id SERIAL PRIMARY KEY,
          doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
          exception_date TEXT NOT NULL,
          start_time TEXT,
          end_time TEXT,
          is_full_day_off BOOLEAN NOT NULL DEFAULT TRUE,
          reason TEXT NOT NULL DEFAULT 'إجازة / فترة محجوبة',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS appointments (
          id SERIAL PRIMARY KEY,
          reference_code TEXT NOT NULL UNIQUE,
          service_id INTEGER NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
          doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
          appointment_date TEXT NOT NULL,
          appointment_time TEXT NOT NULL,
          end_time TEXT NOT NULL,
          duration_minutes INTEGER NOT NULL DEFAULT 30,
          patient_name TEXT NOT NULL,
          patient_phone TEXT NOT NULL,
          patient_email TEXT,
          patient_notes TEXT,
          privacy_consent BOOLEAN NOT NULL DEFAULT TRUE,
          price_display TEXT NOT NULL DEFAULT 'يُحدد بعد التواصل مع العيادة',
          status TEXT NOT NULL DEFAULT 'pending_confirmation',
          admin_notes TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS appointment_events (
          id SERIAL PRIMARY KEY,
          appointment_id INTEGER NOT NULL REFERENCES appointments(id) ON DELETE CASCADE,
          event_type TEXT NOT NULL,
          previous_status TEXT,
          new_status TEXT NOT NULL,
          note TEXT,
          performed_by TEXT NOT NULL DEFAULT 'system',
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS clinic_settings (
          id SERIAL PRIMARY KEY,
          key TEXT NOT NULL UNIQUE,
          value_json JSONB NOT NULL,
          updated_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS reviews (
          id SERIAL PRIMARY KEY,
          reviewer_name TEXT NOT NULL,
          rating INTEGER NOT NULL DEFAULT 5,
          comment TEXT NOT NULL,
          service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
          doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
          source_url TEXT,
          is_verified BOOLEAN NOT NULL DEFAULT FALSE,
          is_visible BOOLEAN NOT NULL DEFAULT FALSE,
          review_date TEXT,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS admin_users (
          id SERIAL PRIMARY KEY,
          username TEXT NOT NULL UNIQUE,
          name_ar TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'super_admin',
          password_hash TEXT NOT NULL,
          is_active BOOLEAN NOT NULL DEFAULT TRUE,
          last_login_at TIMESTAMP,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS contact_messages (
          id SERIAL PRIMARY KEY,
          full_name TEXT NOT NULL,
          phone TEXT NOT NULL,
          email TEXT,
          subject TEXT NOT NULL,
          message TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
      `);

      // Check if V3 catalog (19 services including 'plastic-surgery' and 'dr-alarfaj') is already seeded
      const existingServices = await db.select().from(services);
      const existingDoctors = await db.select().from(doctors);
      const hasV3Catalog =
        existingServices.length === 19 &&
        existingServices.some((s) => s.slug === "plastic-surgery") &&
        existingDoctors.length === 24 &&
        existingDoctors.some((d) => d.nameAr === "العرفج");

      if (!hasV3Catalog) {
        // Reseed catalog cleanly to match V3 19 services + 24 doctors + 3 departments
        await client.query(`
          TRUNCATE TABLE appointment_events, appointments, doctor_services, doctor_schedules, services, doctors, departments RESTART IDENTITY CASCADE;
        `);

        const deptMap = new Map<string, number>();

        for (const dept of INITIAL_DEPARTMENTS) {
          const [inserted] = await db
            .insert(departments)
            .values({
              slug: dept.slug,
              nameAr: dept.nameAr,
              nameEn: dept.nameEn,
              titleAr: dept.titleAr,
              shortDescription: dept.shortDescription,
              fullDescription: dept.fullDescription,
              specialtiesOverview: dept.specialtiesOverview,
              iconName: dept.iconName,
              displayOrder: dept.displayOrder,
              isVisible: dept.isVisible,
              faqsJson: dept.faqsJson,
            })
            .returning();
          deptMap.set(dept.slug, inserted.id);
        }

        const serviceMap = new Map<string, number>();
        for (const srv of INITIAL_SERVICES) {
          const deptId = deptMap.get(srv.departmentSlug);
          if (!deptId) continue;
          const [insertedSrv] = await db
            .insert(services)
            .values({
              slug: srv.slug,
              departmentId: deptId,
              nameAr: srv.nameAr,
              nameEn: srv.nameEn,
              shortDescription: srv.shortDescription,
              fullDescription: srv.fullDescription,
              generalMedicalInfo: srv.generalMedicalInfo,
              specialtyTag: srv.specialtyTag,
              iconName: srv.iconName,
              durationMinutes: srv.durationMinutes,
              priceNote: srv.priceNote,
              isHomepageFeatured: srv.isHomepageFeatured,
              homepageOrder: srv.homepageOrder,
              displayOrder: srv.displayOrder,
              isBookable: srv.isBookable,
              isVisible: srv.isVisible,
              faqsJson: srv.faqsJson,
            })
            .returning();
          serviceMap.set(srv.slug, insertedSrv.id);
        }

        for (const doc of INITIAL_DOCTORS) {
          const deptId = deptMap.get(doc.departmentSlug);
          if (!deptId) continue;
          const [insertedDoc] = await db
            .insert(doctors)
            .values({
              slug: doc.slug,
              nameAr: doc.nameAr,
              nameEn: doc.nameEn,
              professionalTitle: doc.professionalTitle,
              primarySpecialty: doc.primarySpecialty,
              subSpecialties: doc.subSpecialties,
              qualifications: doc.qualifications,
              bioAr: doc.bioAr,
              departmentId: deptId,
              officialImageUrl: doc.officialImageUrl,
              infoSources: doc.infoSources,
              lastVerifiedAt: doc.lastVerifiedAt,
              verificationStatus: doc.verificationStatus,
              publishStatus: doc.publishStatus,
              profileStatus: doc.profileStatus,
              verificationNotes: doc.verificationNotes ?? null,
              displayOrder: doc.displayOrder,
              isFeaturedCard: doc.isFeaturedCard,
            })
            .returning();

          for (const srvSlug of doc.serviceSlugs) {
            const srvId = serviceMap.get(srvSlug);
            if (srvId) {
              await db
                .insert(doctorServices)
                .values({
                  doctorId: insertedDoc.id,
                  serviceId: srvId,
                  isVerifiedRelation: true,
                })
                .onConflictDoNothing();
            }
          }

          // جدول الدوام الأولي: السبت - الخميس 10:00 صباحًا – 9:00 مساءً، الجمعة عطلة
          for (let day = 0; day <= 6; day++) {
            const isFriday = day === 5;
            await db.insert(doctorSchedules).values({
              doctorId: insertedDoc.id,
              dayOfWeek: day,
              isWorkingDay: !isFriday,
              startTime: "10:00",
              endTime: "15:00",
              secondShiftStart: "16:00",
              secondShiftEnd: "21:00",
              slotDurationMinutes: 30,
            });
          }
        }

        await db
          .insert(clinicSettings)
          .values({
            key: "general",
            valueJson: INITIAL_CLINIC_SETTINGS,
          })
          .onConflictDoNothing();

        await db
          .insert(adminUsers)
          .values({
            username: "admin",
            nameAr: "مدير النظام الطبي — Reflect Clinic",
            role: "super_admin",
            passwordHash: "reflect2026",
            isActive: true,
          })
          .onConflictDoNothing();
      }

      isInitialized = true;
    } finally {
      client.release();
    }
  })();

  return initPromise;
}

export async function getClinicPublicCatalog() {
  await ensureClinicDatabase();

  const [allDepts, allServices, allDoctors, allDocServices, settingsRows, visibleReviews] =
    await Promise.all([
      db.select().from(departments).orderBy(asc(departments.displayOrder)),
      db.select().from(services).orderBy(asc(services.displayOrder)),
      db.select().from(doctors).orderBy(asc(doctors.displayOrder)),
      db.select().from(doctorServices),
      db.select().from(clinicSettings).where(eq(clinicSettings.key, "general")),
      db
        .select()
        .from(reviews)
        .where(and(eq(reviews.isVerified, true), eq(reviews.isVisible, true)))
        .orderBy(desc(reviews.createdAt)),
    ]);

  const settings =
    (settingsRows[0]?.valueJson as typeof INITIAL_CLINIC_SETTINGS | undefined) ??
    INITIAL_CLINIC_SETTINGS;

  const deptById = new Map(allDepts.map((d) => [d.id, d]));
  const doctorIdsByServiceId = new Map<number, number[]>();
  const serviceIdsByDoctorId = new Map<number, number[]>();

  for (const rel of allDocServices) {
    if (!rel.isVerifiedRelation) continue;
    const dList = doctorIdsByServiceId.get(rel.serviceId) ?? [];
    dList.push(rel.doctorId);
    doctorIdsByServiceId.set(rel.serviceId, dList);

    const sList = serviceIdsByDoctorId.get(rel.doctorId) ?? [];
    sList.push(rel.serviceId);
    serviceIdsByDoctorId.set(rel.doctorId, sList);
  }

  const enrichedDoctors = allDoctors.map((doc) => {
    const dept = deptById.get(doc.departmentId);
    const sIds = serviceIdsByDoctorId.get(doc.id) ?? [];
    const docServicesList = allServices.filter((s) => sIds.includes(s.id) && s.isVisible);
    return {
      ...doc,
      department: dept ?? null,
      services: docServicesList,
    };
  });

  const enrichedServices = allServices.map((srv) => {
    const dept = deptById.get(srv.departmentId);
    const dIds = doctorIdsByServiceId.get(srv.id) ?? [];
    const srvDoctors = enrichedDoctors.filter(
      (d) => dIds.includes(d.id) && d.publishStatus === "published"
    );
    return {
      ...srv,
      department: dept ?? null,
      doctors: srvDoctors,
    };
  });

  const enrichedDepartments = allDepts.map((dept) => {
    const deptServices = enrichedServices.filter(
      (s) => s.departmentId === dept.id && s.isVisible
    );
    const deptDoctors = enrichedDoctors.filter((d) => d.departmentId === dept.id);
    return {
      ...dept,
      services: deptServices,
      doctors: deptDoctors,
    };
  });

  // 12 خدمة متنوعة مختارة في الصفحة الرئيسية
  const homepageServices = enrichedServices
    .filter((s) => s.isHomepageFeatured && s.isVisible)
    .sort((a, b) => (a.homepageOrder ?? 99) - (b.homepageOrder ?? 99))
    .slice(0, 12);

  return {
    settings,
    departments: enrichedDepartments,
    homepageServices,
    services: enrichedServices,
    doctors: enrichedDoctors,
    publishedDoctors: enrichedDoctors.filter((d) => d.publishStatus === "published"),
    reviews: visibleReviews,
  };
}

function timeToMinutes(t: string): number {
  const [hh, mm] = t.split(":").map(Number);
  return (hh || 0) * 60 + (mm || 0);
}

function minutesToTime(m: number): string {
  const hh = Math.floor(m / 60)
    .toString()
    .padStart(2, "0");
  const mm = (m % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export async function getAvailableSlotsForDoctorAndDate(params: {
  doctorId: number;
  serviceId: number;
  dateStr: string;
}): Promise<{
  isWorkingDay: boolean;
  reasonIfClosed?: string;
  durationMinutes: number;
  slots: Array<{ time: string; endTime: string; labelAr: string; available: boolean }>;
}> {
  await ensureClinicDatabase();

  const { doctorId, serviceId, dateStr } = params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return { isWorkingDay: false, reasonIfClosed: "تاريخ غير صالح", durationMinutes: 30, slots: [] };
  }

  const [year, month, day] = dateStr.split("-").map(Number);
  const dateObj = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = dateObj.getUTCDay();

  const [srvRows, docRows, schedRows, exRows, existingAppts] = await Promise.all([
    db.select().from(services).where(eq(services.id, serviceId)),
    db.select().from(doctors).where(eq(doctors.id, doctorId)),
    db
      .select()
      .from(doctorSchedules)
      .where(and(eq(doctorSchedules.doctorId, doctorId), eq(doctorSchedules.dayOfWeek, dayOfWeek))),
    db
      .select()
      .from(scheduleExceptions)
      .where(eq(scheduleExceptions.exceptionDate, dateStr)),
    db
      .select()
      .from(appointments)
      .where(
        and(
          eq(appointments.doctorId, doctorId),
          eq(appointments.appointmentDate, dateStr),
          ne(appointments.status, "cancelled"),
          ne(appointments.status, "rejected")
        )
      ),
  ]);

  const service = srvRows[0];
  const doctor = docRows[0];
  if (!service || !doctor || doctor.publishStatus !== "published") {
    return {
      isWorkingDay: false,
      reasonIfClosed: "الطبيب أو الخدمة غير متاحة حاليًا",
      durationMinutes: 30,
      slots: [],
    };
  }

  const durationMinutes = service.durationMinutes || 30;

  const relevantExceptions = exRows.filter(
    (ex) => ex.doctorId === null || ex.doctorId === doctorId
  );
  const fullDayOffException = relevantExceptions.find((ex) => ex.isFullDayOff);
  if (fullDayOffException) {
    return {
      isWorkingDay: false,
      reasonIfClosed: fullDayOffException.reason || "عطلة مجدولة",
      durationMinutes,
      slots: [],
    };
  }

  const schedule = schedRows[0];
  if (!schedule || !schedule.isWorkingDay) {
    return {
      isWorkingDay: false,
      reasonIfClosed: dayOfWeek === 5 ? "يوم الجمعة عطلة أسبوعية" : "خارج أيام الدوام",
      durationMinutes,
      slots: [],
    };
  }

  const shifts: Array<[number, number]> = [];
  if (schedule.startTime && schedule.endTime) {
    shifts.push([timeToMinutes(schedule.startTime), timeToMinutes(schedule.endTime)]);
  }
  if (schedule.secondShiftStart && schedule.secondShiftEnd) {
    shifts.push([
      timeToMinutes(schedule.secondShiftStart),
      timeToMinutes(schedule.secondShiftEnd),
    ]);
  }

  const slots: Array<{ time: string; endTime: string; labelAr: string; available: boolean }> = [];

  for (const [shiftStart, shiftEnd] of shifts) {
    for (let cursor = shiftStart; cursor + durationMinutes <= shiftEnd; cursor += durationMinutes) {
      const slotStart = cursor;
      const slotEnd = cursor + durationMinutes;
      const timeStr = minutesToTime(slotStart);
      const endTimeStr = minutesToTime(slotEnd);

      const isBlockedByException = relevantExceptions.some((ex) => {
        if (ex.isFullDayOff) return true;
        if (!ex.startTime || !ex.endTime) return false;
        const exStart = timeToMinutes(ex.startTime);
        const exEnd = timeToMinutes(ex.endTime);
        return slotStart < exEnd && slotEnd > exStart;
      });

      const isBooked = existingAppts.some((appt) => {
        const apptStart = timeToMinutes(appt.appointmentTime);
        const apptEnd = timeToMinutes(appt.endTime);
        return slotStart < apptEnd && slotEnd > apptStart;
      });

      const hour24 = Math.floor(slotStart / 60);
      const mins = (slotStart % 60).toString().padStart(2, "0");
      const periodAr = hour24 >= 12 ? "مساءً" : "صباحًا";
      const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
      const labelAr = `${hour12}:${mins} ${periodAr}`;

      slots.push({
        time: timeStr,
        endTime: endTimeStr,
        labelAr,
        available: !isBlockedByException && !isBooked,
      });
    }
  }

  return {
    isWorkingDay: true,
    durationMinutes,
    slots,
  };
}

export async function createAppointmentTransaction(input: {
  serviceId: number;
  doctorId: number;
  appointmentDate: string;
  appointmentTime: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientNotes?: string;
  privacyConsent: boolean;
}) {
  await ensureClinicDatabase();

  // Reject past dates
  const todayIso = new Date().toISOString().slice(0, 10);
  if (input.appointmentDate < todayIso) {
    throw new Error("لا يمكن اختيار تاريخ سابق لليوم الحالي. يرجى اختيار تاريخ مستقبلي صالح.");
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const relRes = await client.query(
      `SELECT ds.id, s.duration_minutes, s.price_note, s.is_bookable, d.publish_status
       FROM doctor_services ds
       JOIN services s ON s.id = ds.service_id
       JOIN doctors d ON d.id = ds.doctor_id
       WHERE ds.doctor_id = $1 AND ds.service_id = $2 AND ds.is_verified_relation = TRUE`,
      [input.doctorId, input.serviceId]
    );

    if (relRes.rows.length === 0) {
      throw new Error("عذرًا، هذا الطبيب غير مرتبط بتقديم هذه الخدمة وفق السجلات المعتمدة.");
    }

    const { duration_minutes, price_note, is_bookable, publish_status } = relRes.rows[0];
    if (!is_bookable || publish_status !== "published") {
      throw new Error("هذه الخدمة أو ملف الطبيب غير متاح لطلب الحجز حاليًا.");
    }

    const durationMinutes = Number(duration_minutes) || 30;
    const slotStart = timeToMinutes(input.appointmentTime);
    const slotEnd = slotStart + durationMinutes;
    const endTimeStr = minutesToTime(slotEnd);

    const existingRes = await client.query(
      `SELECT id, appointment_time, end_time, status
       FROM appointments
       WHERE doctor_id = $1
         AND appointment_date = $2
         AND status NOT IN ('cancelled', 'rejected')
       FOR UPDATE`,
      [input.doctorId, input.appointmentDate]
    );

    for (const row of existingRes.rows) {
      const existingStart = timeToMinutes(row.appointment_time);
      const existingEnd = timeToMinutes(row.end_time);
      if (slotStart < existingEnd && slotEnd > existingStart) {
        throw new Error(
          "عذرًا، هذه الفترة الزمنية محجوزة بالفعل. يرجى اختيار وقت مطلوب آخر."
        );
      }
    }

    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const referenceCode = `REF-${new Date().getFullYear()}-${randomSuffix}`;

    const insertRes = await client.query(
      `INSERT INTO appointments (
        reference_code,
        service_id,
        doctor_id,
        appointment_date,
        appointment_time,
        end_time,
        duration_minutes,
        patient_name,
        patient_phone,
        patient_email,
        patient_notes,
        privacy_consent,
        price_display,
        status
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'pending_confirmation')
      RETURNING *`,
      [
        referenceCode,
        input.serviceId,
        input.doctorId,
        input.appointmentDate,
        input.appointmentTime,
        endTimeStr,
        durationMinutes,
        input.patientName.trim(),
        input.patientPhone.trim(),
        input.patientEmail?.trim() || null,
        input.patientNotes?.trim() || null,
        input.privacyConsent,
        price_note || "يُحدد بعد التواصل مع العيادة",
      ]
    );

    const createdAppt = insertRes.rows[0];

    await client.query(
      `INSERT INTO appointment_events (
        appointment_id,
        event_type,
        previous_status,
        new_status,
        note,
        performed_by
      ) VALUES ($1, 'created', NULL, 'pending_confirmation', 'تم تسجيل طلب الموعد المطلوب وهو بانتظار تأكيد منسق العيادة', 'patient')`,
      [createdAppt.id]
    );

    await client.query("COMMIT");
    return createdAppt;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
