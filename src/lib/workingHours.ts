import { SITE_CONFIG, type DayScheduleConfig } from "../data/siteConfig";

export type DayHours = {
  day: number;
  openMinute: number | null;
  closeMinute: number | null;
};

export function isOpenAt(currentMinute: number, hours: DayHours): boolean {
  if (hours.openMinute === null || hours.closeMinute === null) {
    return false;
  }
  if (hours.closeMinute > hours.openMinute) {
    return currentMinute >= hours.openMinute && currentMinute < hours.closeMinute;
  }
  // معالجة حدود منتصف الليل في حال امتد الدوام لما بعد 00:00
  return currentMinute >= hours.openMinute || currentMinute < hours.closeMinute;
}

export function formatMinuteAr(minuteOfDay: number): string {
  const normalized = ((minuteOfDay % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const mins = normalized % 60;
  const period = hour24 >= 12 ? "مساءً" : "صباحًا";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const minsStr = mins.toString().padStart(2, "0");
  return `${hour12}:${minsStr} ${period}`;
}

export function getZonedDayAndMinute(
  now: Date = new Date(),
  timeZone: string = SITE_CONFIG.timezone
): { dayIndex: number; currentMinute: number; formattedTimeAr: string } {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);
  const weekdayStr = parts.find((p) => p.type === "weekday")?.value || "Sat";
  const hourStr = parts.find((p) => p.type === "hour")?.value || "0";
  const minuteStr = parts.find((p) => p.type === "minute")?.value || "0";

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  const dayIndex = weekdayMap[weekdayStr] ?? 6;
  const rawHour = Number(hourStr) % 24;
  const rawMin = Number(minuteStr) || 0;
  const currentMinute = rawHour * 60 + rawMin;

  return {
    dayIndex,
    currentMinute,
    formattedTimeAr: formatMinuteAr(currentMinute),
  };
}

export interface ClinicHoursStatus {
  statusLabel: "مفتوح الآن" | "مغلق الآن" | "عطلة اليوم";
  statusCode: "open" | "closed" | "holiday";
  currentDayIndex: number;
  currentMinute: number;
  detailTextAr: string;
  todayConfig: DayScheduleConfig;
}

export function computeClinicWorkingStatus(
  now: Date = new Date(),
  schedule: DayScheduleConfig[] = SITE_CONFIG.workingHours,
  timeZone: string = SITE_CONFIG.timezone
): ClinicHoursStatus {
  const { dayIndex, currentMinute } = getZonedDayAndMinute(now, timeZone);
  const todayConfig =
    schedule.find((d) => d.dayIndex === dayIndex) || schedule[0];

  if (
    todayConfig.isHoliday ||
    todayConfig.openMinute === null ||
    todayConfig.closeMinute === null
  ) {
    // يوم الجمعة عطلة: يفتح السبت الساعة 10:00 صباحًا
    const satConfig = schedule.find((d) => d.dayIndex === 6);
    const nextOpenText =
      satConfig && satConfig.openMinute !== null
        ? `يُعاد فتح العيادة يوم ${satConfig.dayNameAr} الساعة ${formatMinuteAr(
            satConfig.openMinute
          )}`
        : "يرجى مراجعة جدول الدوام";
    return {
      statusLabel: "عطلة اليوم",
      statusCode: "holiday",
      currentDayIndex: dayIndex,
      currentMinute,
      detailTextAr: nextOpenText,
      todayConfig,
    };
  }

  const openNow = isOpenAt(currentMinute, {
    day: todayConfig.dayIndex,
    openMinute: todayConfig.openMinute,
    closeMinute: todayConfig.closeMinute,
  });

  if (openNow) {
    return {
      statusLabel: "مفتوح الآن",
      statusCode: "open",
      currentDayIndex: dayIndex,
      currentMinute,
      detailTextAr: `يغلق اليوم الساعة ${formatMinuteAr(todayConfig.closeMinute)}`,
      todayConfig,
    };
  }

  // مغلق الآن: إما قبل وقت الفتح اليوم أو بعد وقت الإغلاق
  if (currentMinute < todayConfig.openMinute) {
    return {
      statusLabel: "مغلق الآن",
      statusCode: "closed",
      currentDayIndex: dayIndex,
      currentMinute,
      detailTextAr: `يفتح اليوم الساعة ${formatMinuteAr(todayConfig.openMinute)}`,
      todayConfig,
    };
  }

  // بعد وقت الإغلاق: نبحث عن اليوم التالي المتاح للدوام
  const nextDayIndex = (dayIndex + 1) % 7;
  const nextDayConfig = schedule.find((d) => d.dayIndex === nextDayIndex);
  if (
    nextDayConfig &&
    !nextDayConfig.isHoliday &&
    nextDayConfig.openMinute !== null
  ) {
    return {
      statusLabel: "مغلق الآن",
      statusCode: "closed",
      currentDayIndex: dayIndex,
      currentMinute,
      detailTextAr: `يُعاد الفتح غدًا (${nextDayConfig.dayNameAr}) الساعة ${formatMinuteAr(
        nextDayConfig.openMinute
      )}`,
      todayConfig,
    };
  }

  // إذا كان الغد عطلة (مثل ليلة الجمعة)، نبحث عن السبت
  const satConfig = schedule.find((d) => d.dayIndex === 6);
  return {
    statusLabel: "مغلق الآن",
    statusCode: "closed",
    currentDayIndex: dayIndex,
    currentMinute,
    detailTextAr:
      satConfig && satConfig.openMinute !== null
        ? `يُعاد الفتح يوم ${satConfig.dayNameAr} الساعة ${formatMinuteAr(
            satConfig.openMinute
          )}`
        : "مغلق خارج أوقات الدوام",
    todayConfig,
  };
}
