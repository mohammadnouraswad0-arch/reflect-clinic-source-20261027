import { NextResponse } from "next/server";
import { getClinicPublicCatalog } from "@/lib/clinic-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = await getClinicPublicCatalog();
    return NextResponse.json({ ok: true, data: catalog });
  } catch (error) {
    console.error("Failed to fetch clinic catalog:", error);
    return NextResponse.json(
      { ok: false, error: "تعذر تحميل بيانات العيادة" },
      { status: 500 }
    );
  }
}
