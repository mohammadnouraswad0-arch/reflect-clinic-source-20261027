"use client";

import React, { useState } from "react";
import { ServiceIconCard, ServiceIconCardData } from "./ServiceIconCard";

export function DoctorServicesGrid({ services }: { services: ServiceIconCardData[] }) {
  const [selectedSlug, setSelectedSlug] = useState<string>("");

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:gap-5">
      {services.map((srv) => (
        <ServiceIconCard
          key={srv.slug}
          service={srv}
          isActive={srv.slug === selectedSlug}
          onSelect={(slug) => setSelectedSlug(slug)}
          navigateOnClick={true}
        />
      ))}
    </div>
  );
}
