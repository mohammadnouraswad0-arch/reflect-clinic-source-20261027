import { NextRequest, NextResponse } from "next/server";
import { getAvailableSlotsForDoctorAndDate } from "@/lib/clinic-service";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const doctorId = Number(searchParams.get("doctorId"));
    const serviceId = Number(searchParams.get("serviceId"));
    const dateStr = searchParams.get("date") || "";

    if (!doctorId || !serviceId || !dateStr) {
      return NextResponse.json(
        { ok: false, error: "يرجى تحديد الخدمة والطبيب والتاريخ" },
        { status: 400 }
      );
    }

    const result = await getAvailableSlotsForDoctorAndDate({
      doctorId,
      serviceId,
      dateStr,
    });

    return NextResponse.json({ ok: true, data: result });
  } catch (error) {
    console.error("Failed to compute available slots:", error);
    return NextResponse.json(
      { ok: false, error: "حدث خطأ أثناء جلب المواعيد المتاحة" },
      { status: 500 }
    );
  }
}
