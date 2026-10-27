export type ServiceIconName =
  | "HeartPulse"
  | "Activity"
  | "ScanFace"
  | "Stethoscope"
  | "Sparkles"
  | "UserRound"
  | "Syringe"
  | "Microscope"
  | "Eye"
  | "Brain"
  | "ShieldCheck"
  | "Waves";

export interface ServiceRecord {
  id: string;
  numericId: number;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  departmentIds: Array<"body" | "skin" | "face">;
  doctorIds: string[];
  icon: ServiceIconName;
  featured: boolean;
  featuredOrder?: number;
  verificationStatus: "verified" | "pending" | "unavailable";
  bookingEnabled: boolean;
}

export const SERVICES_DATA: ServiceRecord[] = [
  // ==================== خدمات قسم الجسم (1 - 7) ====================
  {
    id: "srv-1",
    numericId: 1,
    slug: "plastic-surgery",
    name: "الجراحة التجميلية",
    shortDescription:
      "استشارات وإجراءات جراحية تجميلية لتنسيق القوام وتحسين المظهر بتوازن طبيعي ومعايير طبية دقيقة.",
    description:
      "تشمل خدمة الجراحة التجميلية في عيادات ريفلكت التقييم الجراحي الشامل لإجراءات تجميل وتنسيق الجسم وشد الترهلات وفق خطة علاجية مخصصة تراعي الحالة الصحية لكل مراجع وسلامته في كافة المراحل.",
    departmentIds: ["body"],
    doctorIds: ["doc-1", "doc-2", "doc-3", "doc-5", "doc-6", "doc-7", "doc-8"],
    icon: "Sparkles",
    featured: true,
    featuredOrder: 1,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-2",
    numericId: 2,
    slug: "reconstructive-surgery",
    name: "الجراحة الترميمية",
    shortDescription:
      "إجراءات الترميم الجراحي المتخصص (ترميم الأنف، الصدر، والأنسجة وما إلى ذلك) لاستعادة التناسق والوظيفة.",
    description:
      "تُعنى الجراحة الترميمية بإعادة بناء وترميم الأنسجة والأعضاء مثل ترميم الصدر، وترميم الأنف، ومعالجة آثار العمليات السابقة أو الإصابات، بهدف استعادة الوظيفة الطبيعية والمظهر المتناسق تحت إشراف أطباء الجراحة التجميلية والترميمية.",
    departmentIds: ["body"],
    doctorIds: ["doc-1", "doc-2", "doc-3", "doc-5", "doc-6", "doc-7", "doc-8"],
    icon: "ShieldCheck",
    featured: true,
    featuredOrder: 2,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-3",
    numericId: 3,
    slug: "gynecology",
    name: "أمراض النساء",
    shortDescription:
      "رعاية طبية تشخيصية وعلاجية متخصصة في صحة المرأة وأمراض النساء بخصوصية تامة.",
    description:
      "تقدم عيادة أمراض النساء خدمات الفحص الدوري والتشخيص والمتابعة لمختلف الحالات الصحية النسائية بإشراف طبي متخصص يحرص على راحة المراجعة وخصوصيتها.",
    departmentIds: ["body"],
    doctorIds: ["doc-4"],
    icon: "HeartPulse",
    featured: true,
    featuredOrder: 3,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-4",
    numericId: 4,
    slug: "cosmetic-gynecology",
    name: "تجميل النساء",
    shortDescription:
      "استشارات وإجراءات تجميلية وترميمية نسائية متخصصة لتحسين الراحة الوظيفية وجودة الحياة.",
    description:
      "تختص خدمة تجميل النساء بالإجراءات الطبية والتجميلية والترميمية النسائية التي تُجرى وفق تقييم سريري دقيق وبأعلى درجات الخصوصية والعناية الطبية.",
    departmentIds: ["body"],
    doctorIds: ["doc-4"],
    icon: "UserRound",
    featured: false,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-5",
    numericId: 5,
    slug: "obstetrics-maternity",
    name: "الولادة",
    shortDescription:
      "استشارات ومتابعة طبية متخصصة لصحة الأم خلال مراحل الحمل والتحضير للولادة ورعاية ما بعد الولادة.",
    description:
      "توفر عيادة متابعة الحمل والولادة استشارات طبية متخصصة لمتابعة صحة الأم وتقديم الرعاية والإرشاد الطبي قبل وبعد الولادة وفق البروتوكولات المعتمدة.",
    departmentIds: ["body"],
    doctorIds: ["doc-4"],
    icon: "HeartPulse",
    featured: false,
    verificationStatus: "pending",
    bookingEnabled: true,
  },
  {
    id: "srv-6",
    numericId: 6,
    slug: "physical-therapy",
    name: "العلاج الطبيعي",
    shortDescription:
      "برامج تأهيل وعلاج طبيعي متخصصة لدعم الحركة والتعافي السليم بعد الإجراءات الجراحية.",
    description:
      "تقدم وحدة العلاج الطبيعي جلسات تأهيلية مدروسة تساعد على استعادة المرونة وتخفيف التورم والشد العضلي ودعم التعافي الصحي بعد العمليات الجراحية والتجميلية.",
    departmentIds: ["body"],
    doctorIds: ["doc-9"],
    icon: "Activity",
    featured: false,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-7",
    numericId: 7,
    slug: "lymphedema-lipedema-treatment",
    name: "علاج الوذمة اللمفاوية والليبيديما",
    shortDescription:
      "جلسات تصريف لمفاوي وبرامج علاجية متخصصة لإدارة الوذمة اللمفاوية والليبيديما والتأهيل.",
    description:
      "خدمة علاجية وتأهيلية متخصصة تعتمد على تقنيات التصريف اللمفاوي اليدوي وبرامج الرعاية التحفظية لتخفيف الاحتقان والتورم لدى حالات الوذمة اللمفاوية والليبيديما ومراجعي ما بعد جراحات التجميل.",
    departmentIds: ["body"],
    doctorIds: ["doc-9"],
    icon: "Waves",
    featured: true,
    featuredOrder: 4,
    verificationStatus: "verified",
    bookingEnabled: true,
  },

  // ==================== خدمات قسم الجلد (8 - 13) ====================
  {
    id: "srv-8",
    numericId: 8,
    slug: "skin-diseases-treatment",
    name: "علاج أمراض الجلد",
    shortDescription:
      "تشخيص وعلاج المشكلات والأمراض الجلدية المزمنة والطارئة وفق تقييم طبي متخصص.",
    description:
      "تشمل الخدمة الفحص السريري وتشخيص وعلاج أمراض الجلد المختلفة مثل حب الشباب، الأكزيما، الصدفية، التهابات الجلد، والتصبغات تحت إشراف أطباء الجلدية في العيادة.",
    departmentIds: ["skin"],
    doctorIds: ["doc-10", "doc-11", "doc-12", "doc-13", "doc-14", "doc-15", "doc-16"],
    icon: "Microscope",
    featured: true,
    featuredOrder: 5,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-9",
    numericId: 9,
    slug: "skin-aesthetics-care",
    name: "تجميل الجلد والعناية به",
    shortDescription:
      "جلسات وبرامج طبية لتجديد نضارة البشرة وتوحيد لونها والعناية المتقدمة بصحة الجلد.",
    description:
      "تهدف خدمة تجميل الجلد والعناية به إلى تحسين جودة البشرة وملمسها وعلاج التصبغات وآثار الإرهاق عبر إجراءات طبية تجميلية غير جراحية مصممة لنوع بشرة كل مراجع.",
    departmentIds: ["skin"],
    doctorIds: ["doc-10", "doc-11", "doc-12", "doc-13", "doc-15", "doc-16"],
    icon: "Sparkles",
    featured: false,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-10",
    numericId: 10,
    slug: "dermatologic-surgery",
    name: "جراحة الجلد",
    shortDescription:
      "إجراءات جلدية جراحية دقيقة لإزالة الزوائد الجلدية والوحمات ومعالجة الندبات تحت تخدير موضعي.",
    description:
      "تختص جراحة الجلد بالإجراءات الجراحية الجلدية الدقيقة والآمنة لمعالجة الآفات الجلدية السطحية والندبات والزوائد الجلدية مع العناية بالمظهر التجميلي للجلد.",
    departmentIds: ["skin"],
    doctorIds: ["doc-11", "doc-14"],
    icon: "ShieldCheck",
    featured: false,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-11",
    numericId: 11,
    slug: "laser-therapy",
    name: "العلاج بالليزر",
    shortDescription:
      "تقنيات الليزر الطبي لعلاج التصبغات والندبات وتجديد البشرة وإزالة الشعر بالليزر بأمان.",
    description:
      "تضم خدمة العلاج بالليزر جلسات الليزر الطبي الموجهة لتحفيز الكولاجين وتخفيف الندبات والتصبغات، إلى جانب خدمات إزالة الشعر بالليزر بمعايير تتناسب مع مختلف أنواع البشرة.",
    departmentIds: ["skin"],
    doctorIds: ["doc-11", "doc-12", "doc-13", "doc-14", "doc-15", "doc-16"],
    icon: "Activity",
    featured: true,
    featuredOrder: 6,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-12",
    numericId: 12,
    slug: "cosmetic-injectables",
    name: "الحقن التجميلي",
    shortDescription:
      "إجراءات الحقن التجميلي والفيلر والبوتوكس ومحفزات النضارة بلمسة طبيعية متوازنة.",
    description:
      "تُقدَّم خدمات الحقن التجميلي في عيادات ريفلكت لاستعادة الحيوية وتخفيف التجاعيد التعبيرية وتعويض الحجم المفقود باستخدام مواد طبية معتمدة وبعد تقييم دقيق لتفاصيل الوجه.",
    departmentIds: ["skin"],
    doctorIds: ["doc-11", "doc-12", "doc-13", "doc-16"],
    icon: "Syringe",
    featured: true,
    featuredOrder: 7,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-13",
    numericId: 13,
    slug: "hair-disorders",
    name: "أمراض الشعر",
    shortDescription:
      "تشخيص وعلاج تساقط الشعر ومشكلات فروة الرأس والجلسات التحفيزية لنمو الشعر.",
    description:
      "تقدم عيادة أمراض الشعر فحصًا متخصصًا لفروة الرأس وبصيلات الشعر لتحديد مسببات التساقط أو الضعف ووضع خطة علاجية دوائية أو إجرائية مناسبة.",
    departmentIds: ["skin"],
    doctorIds: ["doc-12", "doc-14", "doc-15"],
    icon: "Stethoscope",
    featured: true,
    featuredOrder: 8,
    verificationStatus: "verified",
    bookingEnabled: true,
  },

  // ==================== خدمات قسم الوجه (14 - 19) ====================
  {
    id: "srv-14",
    numericId: 14,
    slug: "facial-plastic-rhinoplasty",
    name: "جراحة تجميل الوجه والأنف",
    shortDescription:
      "استشارات وعمليات تجميل الوجه والأنف لتحقيق التناسق الجمالي مع الحفاظ على الوظيفة التنفسية.",
    description:
      "تختص هذه الخدمة بجراحات تجميل الأنف وتناسق ملامح الوجه بإشراف أطباء متخصصين يجمعون بين الخبرة في جراحة الأنف والأذن والحنجرة والجراحة التجميلية للوجه.",
    departmentIds: ["face"],
    doctorIds: ["doc-17", "doc-18", "doc-20", "doc-24"],
    icon: "ScanFace",
    featured: true,
    featuredOrder: 9,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-15",
    numericId: 15,
    slug: "ent-surgery",
    name: "جراحة الأنف والأذن والحنجرة",
    shortDescription:
      "تشخيص وجراحة مشكلات الأنف والجيوب الأنفية والحاجز الأنفي والأذن والحنجرة.",
    description:
      "تشمل الخدمة الفحص الطبي والجراحي لأمراض الأنف والأذن والحنجرة، مثل تعديل انحراف الحاجز الأنفي وعلاج انسداد التنفس ومشكلات الجيوب الأنفية.",
    departmentIds: ["face"],
    doctorIds: ["doc-17", "doc-18", "doc-20", "doc-24"],
    icon: "Stethoscope",
    featured: false,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-16",
    numericId: 16,
    slug: "nose-face-reconstruction",
    name: "ترميم الأنف والوجه",
    shortDescription:
      "جراحات ترميمية دقيقة للأنف والوجه لإصلاح التشوهات أو آثار العمليات والإصابات السابقة.",
    description:
      "تُعنى خدمة ترميم الأنف والوجه بالحالات التي تتطلب إعادة بناء الدعامة الغضروفية أو العظمية للأنف وترميم أنسجة الوجه لاستعادة الوظيفة التنفسية والمظهر المتوازن.",
    departmentIds: ["face"],
    doctorIds: ["doc-17", "doc-18", "doc-20", "doc-24"],
    icon: "ScanFace",
    featured: true,
    featuredOrder: 10,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-17",
    numericId: 17,
    slug: "oculoplastic-eye-surgery",
    name: "جراحة العيون",
    shortDescription:
      "جراحات العيون التجميلية والتقويمية وتجميل الجفون ومحجر العين والقنوات الدمعية.",
    description:
      "تقدم عيادة جراحة العيون تقييمًا وإجراءات متخصصة لتجميل وشد الجفون، وإصلاح ارتخاء الجفون، وجراحات محجر العين والقنوات الدمعية على يد أطباء متخصصين في جراحة العيون.",
    departmentIds: ["face"],
    doctorIds: ["doc-19", "doc-22"],
    icon: "Eye",
    featured: true,
    featuredOrder: 11,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-18",
    numericId: 18,
    slug: "oral-maxillofacial-surgery",
    name: "جراحة الوجه والفكين",
    shortDescription:
      "تشخيص وجراحة الفكين والمفصل الفكي الصدغي والجراحات التقويمية والتجميلية لعظام الوجه.",
    description:
      "تختص خدمة جراحة الوجه والفكين بتقييم ومعالجة عدم تناسق الفكين، والجراحات التقويمية الفكية، وعلاج اضطرابات المفصل الفكي الصدغي تحت إشراف أطباء جراحة الوجه والفكين.",
    departmentIds: ["face"],
    doctorIds: ["doc-21", "doc-23"],
    icon: "Brain",
    featured: true,
    featuredOrder: 12,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
  {
    id: "srv-19",
    numericId: 19,
    slug: "head-neck-surgery",
    name: "جراحة الرأس والرقبة",
    shortDescription:
      "تقييم وجراحة الحالات الطبية والجراحية المرتبطة بمنطقة الرأس والرقبة والأنف والحنجرة.",
    description:
      "توفر الخدمة استشارات وتدخلات جراحية متخصصة لحالات الرأس والرقبة المرتبطة بتخصص الأنف والأذن والحنجرة وجراحة الوجه وفق تقييم سريري دقيق.",
    departmentIds: ["face"],
    doctorIds: ["doc-17", "doc-18", "doc-20", "doc-24"],
    icon: "ShieldCheck",
    featured: false,
    verificationStatus: "verified",
    bookingEnabled: true,
  },
];

export const FEATURED_12_SERVICES = SERVICES_DATA.filter((s) => s.featured).sort(
  (a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99)
);
