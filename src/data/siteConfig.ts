export type DayScheduleConfig = {
  dayIndex: number; // 0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday
  dayNameAr: string;
  openMinute: number | null; // 10:00 AM = 600
  closeMinute: number | null; // 9:00 PM = 1260
  displayHoursAr: string;
  isHoliday: boolean;
};

export const SITE_CONFIG = {
  nameEn: "REFLECT CLINIC",
  nameAr: "عيادات ريفلكت",
  fullNameAr: "Reflect Clinic — عيادات ريفلكت",
  heroTitleEn: "REFLECT CLINIC",
  heroTitleAr: "جمالك يبدأ من هنا",
  heroSubtitleAr:
    "اكتشفي خدماتنا الطبية والتجميلية مع فريق متخصص يهتم بجمالك وراحتك.",
  colors: {
    primary: "#65143D",
    accent: "#E94D91",
    champagne: "#D8C3A5",
    secondary: "#C5D6A0",
    background: "#F7F3EF",
    surface: "#FFFFFF",
    text: "#2B2027",
    muted: "#756A71",
    border: "#E8DFD8",
    selectedBg: "#FFF0F6",
  },
  timezone: "Asia/Riyadh",
  workingHoursOfficialConfirmed: false,
  workingHoursDisclaimerAr:
    "جدول الدوام المعروض هو جدول أولي استرشادي (السبت – الخميس: 10:00 صباحًا – 9:00 مساءً، الجمعة: عطلة) ويخضع للاعتماد النهائي وجداول الأطباء في العيادة.",
  workingHours: [
    {
      dayIndex: 6,
      dayNameAr: "السبت",
      openMinute: 10 * 60,
      closeMinute: 21 * 60,
      displayHoursAr: "10:00 صباحًا – 9:00 مساءً",
      isHoliday: false,
    },
    {
      dayIndex: 0,
      dayNameAr: "الأحد",
      openMinute: 10 * 60,
      closeMinute: 21 * 60,
      displayHoursAr: "10:00 صباحًا – 9:00 مساءً",
      isHoliday: false,
    },
    {
      dayIndex: 1,
      dayNameAr: "الاثنين",
      openMinute: 10 * 60,
      closeMinute: 21 * 60,
      displayHoursAr: "10:00 صباحًا – 9:00 مساءً",
      isHoliday: false,
    },
    {
      dayIndex: 2,
      dayNameAr: "الثلاثاء",
      openMinute: 10 * 60,
      closeMinute: 21 * 60,
      displayHoursAr: "10:00 صباحًا – 9:00 مساءً",
      isHoliday: false,
    },
    {
      dayIndex: 3,
      dayNameAr: "الأربعاء",
      openMinute: 10 * 60,
      closeMinute: 21 * 60,
      displayHoursAr: "10:00 صباحًا – 9:00 مساءً",
      isHoliday: false,
    },
    {
      dayIndex: 4,
      dayNameAr: "الخميس",
      openMinute: 10 * 60,
      closeMinute: 21 * 60,
      displayHoursAr: "10:00 صباحًا – 9:00 مساءً",
      isHoliday: false,
    },
    {
      dayIndex: 5,
      dayNameAr: "الجمعة",
      openMinute: null,
      closeMinute: null,
      displayHoursAr: "عطلة",
      isHoliday: true,
    },
  ] satisfies DayScheduleConfig[],
  contact: {
    phoneAvailable: true,
    phoneDisplay: "+966 11 222 0555",
    phoneHref: "tel:+966112220555",
    whatsappAvailable: true,
    whatsappHref: "https://wa.me/966112220555",
    instagramUrl: "https://www.instagram.com/reflect_clinic/",
    email: "marketing@reflect.sa",
    addressVerified: true,
    addressAr:
      "3254 طريق الأمير تركي بن عبدالعزيز الأول، حي المحمدية، الرياض 12362، المملكة العربية السعودية",
    cityAr: "الرياض — حي المحمدية",
    directionsAvailable: true,
    mapDirectionsUrl: "https://g.page/reflect_clinic?share",
    coordinatesConfirmed: false,
  },
  integrations: {
    bookingBackendEnabled: true,
    bookingConfirmationMode: "request_pending_clinic_confirmation" as const,
    contactBackendEnabled: true,
  },
  media: {
    heroPhoto: {
      url: "/images/clinic/hero-reflect.jpg",
      fallbackUrl: "/images/clinic/hero-reflect-alt.jpg",
      altAr:
        "استشارة طبية وتجميلية راقية للعناية بالبشرة في بيئة عيادة حديثة وهادئة",
      credit:
        "Pexels (Photo ID: 3985305 — Gustavo Fring) — صورة فوتوغرافية حقيقية مرخصة توضيحية للعناية الطبية والتجميلية الراقية",
    },
    aboutPrimaryPhoto: {
      url: "https://images.pexels.com/photos/39833690/pexels-photo-39833690.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
      fallbackUrl: "/images/placeholders/clinic-placeholder.svg",
      altAr: "بيئة استقبال عيادة طبية حديثة بتصميم هادئ ومساحات مريحة",
      credit:
        "Pexels — shaza jocarlos (صورة فوتوغرافية مرخصة توضيحية لبيئة طبية حديثة)",
    },
    aboutSecondaryPhoto: {
      url: "https://images.pexels.com/photos/5619462/pexels-photo-5619462.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1200",
      fallbackUrl: "/images/placeholders/clinic-placeholder.svg",
      altAr: "غرفة فحص واستشارة طبية مجهزة بتقنيات حديثة وإضاءة هادئة",
      credit: "Pexels — Nico Becker (صورة فوتوغرافية مرخصة توضيحية)",
    },
    doctorPlaceholder: "/images/placeholders/doctor-placeholder.svg",
  },
};
