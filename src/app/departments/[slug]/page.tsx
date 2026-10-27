import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getClinicPublicCatalog } from "@/lib/clinic-service";
import { Header } from "@/components/Header";
import { DepartmentDetailView } from "@/components/DepartmentDetailView";
import { FinalBookingBanner } from "@/components/FinalBookingBanner";
import { Footer } from "@/components/Footer";

export const dynamic = "force-dynamic";

interface DepartmentPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: DepartmentPageProps): Promise<Metadata> {
  const { slug } = await params;
  const catalog = await getClinicPublicCatalog();
  const dept = catalog.departments.find((d) => d.slug === slug);
  if (!dept) {
    return { title: "القسم الطبي" };
  }
  return {
    title: `${dept.nameAr} — ${dept.titleAr}`,
    description: dept.shortDescription,
  };
}

export default async function DepartmentPage({ params }: DepartmentPageProps) {
  const { slug } = await params;
  const catalog = await getClinicPublicCatalog();
  const department = catalog.departments.find((d) => d.slug === slug);

  if (!department) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F2EF]">
      <Header />
      <main className="flex-1 pb-10">
        <DepartmentDetailView department={department} />
        <FinalBookingBanner />
      </main>
      <Footer />
    </div>
  );
}
