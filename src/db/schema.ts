import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const departments = pgTable("departments", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  titleAr: text("title_ar").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  specialtiesOverview: text("specialties_overview").notNull(),
  iconName: text("icon_name").notNull().default("Sparkles"),
  displayOrder: integer("display_order").notNull().default(1),
  isVisible: boolean("is_visible").notNull().default(true),
  faqsJson: jsonb("faqs_json").$type<Array<{ question: string; answer: string }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id, { onDelete: "cascade" }),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  shortDescription: text("short_description").notNull(),
  fullDescription: text("full_description").notNull(),
  generalMedicalInfo: text("general_medical_info").notNull(),
  specialtyTag: text("specialty_tag").notNull(),
  iconName: text("icon_name").notNull().default("Sparkles"),
  durationMinutes: integer("duration_minutes").notNull().default(30),
  priceNote: text("price_note").notNull().default("يُحدد بعد التواصل مع العيادة وتقييم الطبيب المختص"),
  isHomepageFeatured: boolean("is_homepage_featured").notNull().default(false),
  homepageOrder: integer("homepage_order").default(99),
  displayOrder: integer("display_order").notNull().default(1),
  isBookable: boolean("is_bookable").notNull().default(true),
  isVisible: boolean("is_visible").notNull().default(true),
  faqsJson: jsonb("faqs_json").$type<Array<{ question: string; answer: string }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  nameEn: text("name_en").notNull(),
  professionalTitle: text("professional_title").notNull(),
  primarySpecialty: text("primary_specialty").notNull(),
  subSpecialties: jsonb("sub_specialties").$type<string[]>().default([]),
  qualifications: jsonb("qualifications").$type<string[]>().default([]),
  bioAr: text("bio_ar").notNull(),
  departmentId: integer("department_id")
    .notNull()
    .references(() => departments.id, { onDelete: "cascade" }),
  officialImageUrl: text("official_image_url"),
  infoSources: text("info_sources").notNull(),
  lastVerifiedAt: text("last_verified_at").notNull(),
  verificationStatus: text("verification_status").notNull().default("verified"), // draft | pending_verification | verified | ready_to_publish | published | hidden
  publishStatus: text("publish_status").notNull().default("published"), // draft | published | hidden
  profileStatus: text("profile_status").notNull().default("complete"), // complete | incomplete_draft | under_review
  verificationNotes: text("verification_notes"),
  displayOrder: integer("display_order").notNull().default(1),
  isFeaturedCard: boolean("is_featured_card").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const doctorServices = pgTable(
  "doctor_services",
  {
    id: serial("id").primaryKey(),
    doctorId: integer("doctor_id")
      .notNull()
      .references(() => doctors.id, { onDelete: "cascade" }),
    serviceId: integer("service_id")
      .notNull()
      .references(() => services.id, { onDelete: "cascade" }),
    isVerifiedRelation: boolean("is_verified_relation").notNull().default(true),
    notes: text("notes"),
  },
  (table) => [
    uniqueIndex("doctor_service_unique_idx").on(table.doctorId, table.serviceId),
  ]
);

export const doctorSchedules = pgTable("doctor_schedules", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctors.id, { onDelete: "cascade" }),
  dayOfWeek: integer("day_of_week").notNull(), // 0 = Sunday ... 6 = Saturday
  isWorkingDay: boolean("is_working_day").notNull().default(true),
  startTime: text("start_time").notNull().default("12:00"),
  endTime: text("end_time").notNull().default("20:00"),
  secondShiftStart: text("second_shift_start"),
  secondShiftEnd: text("second_shift_end"),
  slotDurationMinutes: integer("slot_duration_minutes").notNull().default(30),
});

export const scheduleExceptions = pgTable("schedule_exceptions", {
  id: serial("id").primaryKey(),
  doctorId: integer("doctor_id").references(() => doctors.id, { onDelete: "cascade" }),
  exceptionDate: text("exception_date").notNull(), // YYYY-MM-DD
  startTime: text("start_time"),
  endTime: text("end_time"),
  isFullDayOff: boolean("is_full_day_off").notNull().default(true),
  reason: text("reason").notNull().default("إجازة / فترة محجوبة"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  referenceCode: text("reference_code").notNull().unique(),
  serviceId: integer("service_id")
    .notNull()
    .references(() => services.id, { onDelete: "restrict" }),
  doctorId: integer("doctor_id")
    .notNull()
    .references(() => doctors.id, { onDelete: "restrict" }),
  appointmentDate: text("appointment_date").notNull(), // YYYY-MM-DD
  appointmentTime: text("appointment_time").notNull(), // HH:mm
  endTime: text("end_time").notNull(), // HH:mm
  durationMinutes: integer("duration_minutes").notNull().default(30),
  patientName: text("patient_name").notNull(),
  patientPhone: text("patient_phone").notNull(),
  patientEmail: text("patient_email"),
  patientNotes: text("patient_notes"),
  privacyConsent: boolean("privacy_consent").notNull().default(true),
  priceDisplay: text("price_display").notNull().default("يُحدد بعد التواصل مع العيادة"),
  status: text("status").notNull().default("pending_confirmation"), // pending_confirmation | confirmed | rejected | cancelled
  adminNotes: text("admin_notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appointmentEvents = pgTable("appointment_events", {
  id: serial("id").primaryKey(),
  appointmentId: integer("appointment_id")
    .notNull()
    .references(() => appointments.id, { onDelete: "cascade" }),
  eventType: text("event_type").notNull(),
  previousStatus: text("previous_status"),
  newStatus: text("new_status").notNull(),
  note: text("note"),
  performedBy: text("performed_by").notNull().default("system"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const clinicSettings = pgTable("clinic_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueJson: jsonb("value_json").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  reviewerName: text("reviewer_name").notNull(),
  rating: integer("rating").notNull().default(5),
  comment: text("comment").notNull(),
  serviceId: integer("service_id").references(() => services.id, { onDelete: "set null" }),
  doctorId: integer("doctor_id").references(() => doctors.id, { onDelete: "set null" }),
  sourceUrl: text("source_url"),
  isVerified: boolean("is_verified").notNull().default(false),
  isVisible: boolean("is_visible").notNull().default(false),
  reviewDate: text("review_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  nameAr: text("name_ar").notNull(),
  role: text("role").notNull().default("super_admin"),
  passwordHash: text("password_hash").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
