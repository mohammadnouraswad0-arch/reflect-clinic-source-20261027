import assert from "node:assert/strict";
import { DEPARTMENTS_DATA } from "../data/departments";
import { SERVICES_DATA, FEATURED_12_SERVICES } from "../data/services";
import { DOCTORS_DATA } from "../data/doctors";
import { SITE_CONFIG } from "../data/siteConfig";
import { normalizeArabicText, matchesArabicQuery } from "../lib/arabic";
import { isOpenAt, computeClinicWorkingStatus } from "../lib/workingHours";

function runVerificationSuite() {
  console.log("=== بدء تشغيل اختبارات التحقق الشاملة لمشروع REFLECT CLINIC ===");

  // 1. التحقق من وجود 24 طبيبًا
  assert.equal(
    DOCTORS_DATA.length,
    24,
    `يجب أن يكون عدد الأطباء 24، الموجود: ${DOCTORS_DATA.length}`
  );
  const bodyDocs = DOCTORS_DATA.filter((d) => d.departmentId === "body");
  const skinDocs = DOCTORS_DATA.filter((d) => d.departmentId === "skin");
  const faceDocs = DOCTORS_DATA.filter((d) => d.departmentId === "face");
  assert.equal(bodyDocs.length, 9, "قسم الجسم يجب أن يضم 9 أطباء");
  assert.equal(skinDocs.length, 7, "قسم الجلد يجب أن يضم 7 أطباء");
  assert.equal(faceDocs.length, 8, "قسم الوجه يجب أن يضم 8 أطباء");
  assert.ok(
    DOCTORS_DATA.some((d) => d.name === "العرفج"),
    "يجب الاحتفاظ باسم «العرفج» كما ورد دون اختراع اسم كامل"
  );
  console.log("✓ اختبار 1: وجود 24 طبيبًا موزعين (9 جسم، 7 جلد، 8 وجه) مع الاحتفاظ باسم «العرفج».");

  // 2. التحقق من وجود 19 خدمة
  assert.equal(
    SERVICES_DATA.length,
    19,
    `يجب أن يكون عدد الخدمات 19، الموجود: ${SERVICES_DATA.length}`
  );
  console.log("✓ اختبار 2: وجود 19 خدمة كاملة في المصدر المركزي.");

  // 3. التحقق من وجود 3 أقسام
  assert.equal(
    DEPARTMENTS_DATA.length,
    3,
    `يجب أن يكون عدد الأقسام 3، الموجود: ${DEPARTMENTS_DATA.length}`
  );
  assert.deepEqual(
    DEPARTMENTS_DATA.map((d) => d.slug),
    ["body", "skin", "face"],
    "مسارات الأقسام يجب أن تكون body, skin, face"
  );
  console.log("✓ اختبار 3: وجود ثلاثة أقسام (body, skin, face).");

  // 4. التحقق من ظهور 12 خدمة مختارة في الرئيسية
  assert.equal(
    FEATURED_12_SERVICES.length,
    12,
    `يجب أن يظهر 12 خدمة في الرئيسية، الموجود: ${FEATURED_12_SERVICES.length}`
  );
  console.log("✓ اختبار 4: ظهور 12 خدمة متنوعة في الصفحة الرئيسية.");

  // 5. التحقق من عدم تكرار المعرفات والـ Slugs
  const srvIds = new Set(SERVICES_DATA.map((s) => s.id));
  const srvSlugs = new Set(SERVICES_DATA.map((s) => s.slug));
  assert.equal(srvIds.size, 19, "معرفات الخدمات يجب أن تكون فريدة");
  assert.equal(srvSlugs.size, 19, "روابط الخدمات (Slugs) يجب أن تكون فريدة");

  const docIds = new Set(DOCTORS_DATA.map((d) => d.id));
  const docSlugs = new Set(DOCTORS_DATA.map((d) => d.slug));
  assert.equal(docIds.size, 24, "معرفات الأطباء يجب أن تكون فريدة");
  assert.equal(docSlugs.size, 24, "روابط الأطباء (Slugs) يجب أن تكون فريدة");
  console.log("✓ اختبار 5: عدم تكرار أي معرف (ID) أو مسار (Slug) في الخدمات والأطباء.");

  // 6. التحقق من صحة العلاقات بين الخدمات والأطباء والأقسام
  for (const srv of SERVICES_DATA) {
    assert.ok(srv.doctorIds.length > 0, `الخدمة ${srv.name} يجب أن ترتبط بطبيب واحد على الأقل`);
    for (const docId of srv.doctorIds) {
      const doc = DOCTORS_DATA.find((d) => d.id === docId);
      assert.ok(doc, `الطبيب ${docId} المرتبط بالخدمة ${srv.name} غير موجود`);
      assert.ok(
        srv.departmentIds.includes(doc.departmentId),
        `الطبيب ${doc.name} ينتمي لقسم مختلف عن خدمة ${srv.name}`
      );
    }
  }
  console.log("✓ اختبار 6: تطابق العلاقات المركزية بين الأقسام والخدمات والأطباء دون خلط التخصصات.");

  // 7. التحقق من تطبيع النص العربي والبحث
  assert.equal(normalizeArabicText("إِبْرَاهِيمُ العَوَض"), "ابراهيم العوض");
  assert.ok(matchesArabicQuery("عبد العزيز أباالخيل", "عبدالعزيز ابالخيل"));
  assert.ok(matchesArabicQuery("إبراهيم العوض", "ابراهيم"));
  assert.ok(matchesArabicQuery("العرفج", "عرفج"));
  console.log("✓ اختبار 7: نجاح تطبيع النص العربي وإزالة التشكيل وتوحيد الألف أثناء البحث.");

  // 8. التحقق من جدول ساعات العمل التفاعلي وإظهار الجمعة عطلة
  const fridayConfig = SITE_CONFIG.workingHours.find((d) => d.dayIndex === 5);
  assert.ok(fridayConfig, "يجب وجود يوم الجمعة في جدول الدوام");
  assert.equal(fridayConfig.isHoliday, true, "يجب أن يكون يوم الجمعة عطلة");
  assert.equal(fridayConfig.openMinute, null);
  assert.equal(fridayConfig.closeMinute, null);

  const satHours = { day: 6, openMinute: 600, closeMinute: 1260 };
  assert.equal(isOpenAt(599, satHours), false, "9:59 صباحًا يجب أن يكون مغلقًا");
  assert.equal(isOpenAt(600, satHours), true, "10:00 صباحًا يجب أن يكون مفتوحًا");
  assert.equal(isOpenAt(900, satHours), true, "3:00 مساءً يجب أن يكون مفتوحًا");
  assert.equal(isOpenAt(1260, satHours), false, "9:00 مساءً يجب أن يكون مغلقًا");

  const currentStatus = computeClinicWorkingStatus(new Date());
  assert.ok(
    ["مفتوح الآن", "مغلق الآن", "عطلة اليوم"].includes(currentStatus.statusLabel),
    "حالة الدوام يجب أن تكون إحدى الحالات الثلاث المعتمدة"
  );
  console.log(
    `✓ اختبار 8: حساب جدول الدوام التفاعلي يعمل بدقة (الحالة الحالية: ${currentStatus.statusLabel}).`
  );

  console.log("=== اجتازت جميع الاختبارات بنجاح 100% ===");
}

runVerificationSuite();
