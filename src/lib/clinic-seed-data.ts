import { SITE_CONFIG } from "@/data/siteConfig";
import { DEPARTMENTS_DATA } from "@/data/departments";
import { SERVICES_DATA } from "@/data/services";
import { DOCTORS_DATA } from "@/data/doctors";

export interface MediaSourceInfo {
  id: string;
  usage: string;
  url: string;
  fallbackUrl: string;
  altAr: string;
  photographer: string;
  photographerUrl: string;
  sourcePlatform: string;
  sourceRecordUrl: string;
  license: string;
  disclaimerAr: string;
}

export const VERIFIED_MEDIA_SOURCES: Record<string, MediaSourceInfo> = {
  heroMain: {
    id: "pexels-3985305",
    usage: "الصورة الفوتوغرافية الرئيسية في قسم الواجهة (Hero Section)",
    url: SITE_CONFIG.media.heroPhoto.url,
    fallbackUrl: SITE_CONFIG.media.heroPhoto.fallbackUrl,
    altAr: SITE_CONFIG.media.heroPhoto.altAr,
    photographer: "Gustavo Fring",
    photographerUrl: "https://www.pexels.com/@gustavo-fring",
    sourcePlatform: "Pexels",
    sourceRecordUrl: "https://www.pexels.com/photo/woman-getting-a-check-up-3985305/",
    license: "Pexels Free Commercial & Editorial License (فوتوغرافيا حقيقية مرخصة - غير مولدة بالذكاء الاصطناعي)",
    disclaimerAr:
      "صورة فوتوغرافية توضيحية مرخصة تعبّر عن الاستشارة والعناية الطبية والتجميلية الراقية (ليست صورة خاصة بمقر العيادة الداخلي).",
  },
  aboutClinic: {
    id: "pexels-39833690",
    usage: "صورة قسم من نحن (تعرّف على قصتنا / رؤيتنا في العناية)",
    url: SITE_CONFIG.media.aboutPrimaryPhoto.url,
    fallbackUrl: SITE_CONFIG.media.aboutPrimaryPhoto.fallbackUrl,
    altAr: SITE_CONFIG.media.aboutPrimaryPhoto.altAr,
    photographer: "shaza jocarlos",
    photographerUrl: "https://www.pexels.com/@shaza-jocarlos-841367558",
    sourcePlatform: "Pexels",
    sourceRecordUrl:
      "https://www.pexels.com/photo/modern-reception-area-with-elegant-design-39833690/",
    license: "Pexels Free Commercial & Editorial License (فوتوغرافيا حقيقية مرخصة)",
    disclaimerAr:
      "صورة فوتوغرافية توضيحية مرخصة لبيئة طبية حديثة (لا تُقدَّم على أنها صورة للمقر الفعلي للعيادة).",
  },
};

export const INITIAL_CLINIC_SETTINGS = {
  clinicNameAr: SITE_CONFIG.fullNameAr,
  clinicNameEn: SITE_CONFIG.nameEn,
  taglineAr: SITE_CONFIG.heroTitleAr,
  heroTitleAr: SITE_CONFIG.heroTitleAr,
  heroDescriptionAr: SITE_CONFIG.heroSubtitleAr,
  whyReflectTitleAr: "رؤيتنا في العناية",
  whyReflectTextAr:
    "في Reflect Clinic — عيادات ريفلكت، نحرص على تقديم تجربة تجمع بين الاهتمام بالمراجع، والتخصص الطبي، والوضوح في رحلة الرعاية، من الاستشارة الأولى إلى المتابعة المناسبة.",
  addressAr: SITE_CONFIG.contact.addressAr,
  addressVerified: SITE_CONFIG.contact.addressVerified,
  phone: SITE_CONFIG.contact.phoneDisplay,
  phoneRaw: "+966112220555",
  whatsapp: SITE_CONFIG.contact.whatsappHref,
  email: SITE_CONFIG.contact.email,
  mapUrl: SITE_CONFIG.contact.mapDirectionsUrl,
  instagramUrl: SITE_CONFIG.contact.instagramUrl,
  snapchatUrl: "https://www.snapchat.com/add/reflect_clinic",
  tiktokUrl: "https://www.tiktok.com/@reflect_clinic",
  websiteUrl: "https://reflect.sa/",
  reviewsEnabled: false,
  openingHoursVerified: SITE_CONFIG.workingHoursOfficialConfirmed,
  openingHoursSchedule: SITE_CONFIG.workingHours.map((d) => ({
    dayAr: d.dayNameAr,
    isWorking: !d.isHoliday,
    shifts: [d.displayHoursAr],
  })),
};

export const INITIAL_DEPARTMENTS = DEPARTMENTS_DATA.map((d, index) => ({
  slug: d.slug,
  nameAr: d.name,
  nameEn: d.id.toUpperCase(),
  titleAr: d.fullTitle,
  shortDescription: d.shortDescription,
  fullDescription: d.description,
  specialtiesOverview: d.verificationNote,
  iconName: d.icon,
  displayOrder: index + 1,
  isVisible: true,
  faqsJson: [
    {
      question: `ما هي الخدمات المدرجة ضمن ${d.name}؟`,
      answer: d.shortDescription,
    },
    {
      question: `كيف يتم اختيار الطبيب المناسب داخل ${d.name}؟`,
      answer:
        "يرتبط كل إجراء في القسم بالأطباء المسجلين لتقديمه وفق العلاقات المركزية، ويمكنك استعراض أطباء كل خدمة قبل تقديم طلب الحجز.",
    },
  ],
}));

export const INITIAL_SERVICES = SERVICES_DATA.map((s) => ({
  slug: s.slug,
  departmentSlug: s.departmentIds[0],
  nameAr: s.name,
  nameEn: s.slug,
  shortDescription: s.shortDescription,
  fullDescription: s.description,
  generalMedicalInfo:
    "تخضع خطة الإجراء أو الاستشارة للتقييم الطبي المباشر في العيادة. الطلبات المرسلة عبر الموقع تُسجل كطلبات موعد مبدئية تحتاج إلى تأكيد من منسق العيادة.",
  specialtyTag:
    s.departmentIds[0] === "body"
      ? "قسم الجسم"
      : s.departmentIds[0] === "skin"
      ? "قسم الجلد"
      : "قسم الوجه",
  iconName: s.icon,
  durationMinutes: 30,
  priceNote: "يُحدد بعد التواصل مع العيادة وتقييم الطبيب المختص",
  isHomepageFeatured: s.featured,
  homepageOrder: s.featuredOrder ?? 99,
  displayOrder: s.numericId,
  isBookable: s.bookingEnabled,
  isVisible: true,
  faqsJson: [
    {
      question: `كيف أحجز موعدًا لخدمة ${s.name}؟`,
      answer:
        "اضغط على زر «احجز الآن» في صفحة الخدمة، ثم اختر الطبيب والتاريخ والوقت المطلوبين، وسيقوم فريق تنسيق المواعيد بالتواصل معك لتأكيد الموعد.",
    },
  ],
}));

export interface SeedDoctorRecord {
  slug: string;
  nameAr: string;
  nameEn: string;
  professionalTitle: string;
  primarySpecialty: string;
  subSpecialties: string[];
  qualifications: string[];
  bioAr: string;
  departmentSlug: "body" | "skin" | "face";
  officialImageUrl: string | null;
  infoSources: string;
  lastVerifiedAt: string;
  verificationStatus:
    | "draft"
    | "pending_verification"
    | "verified"
    | "ready_to_publish"
    | "published"
    | "hidden";
  publishStatus: "draft" | "published" | "hidden";
  profileStatus: "complete" | "incomplete_draft" | "under_review";
  verificationNotes?: string;
  displayOrder: number;
  isFeaturedCard: boolean;
  serviceSlugs: string[];
}

export const INITIAL_DOCTORS: SeedDoctorRecord[] = DOCTORS_DATA.map((doc) => {
  const linkedSlugs = SERVICES_DATA.filter((srv) =>
    doc.serviceIds.includes(srv.id)
  ).map((srv) => srv.slug);

  return {
    slug: doc.slug,
    nameAr: doc.name,
    nameEn: doc.slug,
    professionalTitle: doc.roleSummary,
    primarySpecialty: doc.roleSummary,
    subSpecialties: [doc.departmentLabel],
    qualifications: [doc.verificationBadgeText],
    bioAr: doc.bio,
    departmentSlug: doc.departmentId,
    officialImageUrl: doc.imageUrl,
    infoSources: "السجلات المركزية لعيادات Reflect Clinic",
    lastVerifiedAt: "2026-03-01",
    verificationStatus: doc.verificationStatus === "verified" ? "verified" : "pending_verification",
    publishStatus: "published",
    profileStatus: "complete",
    verificationNotes: doc.verificationBadgeText,
    displayOrder: doc.numericId,
    isFeaturedCard: doc.numericId === 24,
    serviceSlugs: linkedSlugs,
  };
});
