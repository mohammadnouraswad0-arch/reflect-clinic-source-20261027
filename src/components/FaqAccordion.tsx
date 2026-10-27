"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    [items[0]?.id || "faq-1"]: true,
  });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const isOpen = Boolean(openIds[item.id]);
        const panelId = `faq-panel-${item.id}`;
        const buttonId = `faq-btn-${item.id}`;

        return (
          <div
            key={item.id}
            className={`bg-white rounded-2xl border transition-all text-right overflow-hidden ${
              isOpen
                ? "border-[#F04491] shadow-[0_8px_28px_rgb(240_68_145/10%)]"
                : "border-[#E9DFE4] shadow-[0_8px_30px_rgb(101_13_61/4%)]"
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="w-full p-5 sm:p-6 text-right flex items-center justify-between gap-4 cursor-pointer hover:bg-[#F8F4F0]/50 transition-colors"
              >
                <div className="space-y-1">
                  <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#F8F4F0] text-[#650D3D] border border-[#E9DFE4]">
                    {item.category}
                  </span>
                  <span className="block text-base sm:text-lg font-bold text-[#650D3D]">
                    {item.question}
                  </span>
                </div>

                <span
                  className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                    isOpen
                      ? "bg-[#650D3D] text-white rotate-180"
                      : "bg-[#F8F4F0] text-[#650D3D] border border-[#E9DFE4]"
                  }`}
                >
                  <ChevronDown className="w-5 h-5" />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className={isOpen ? "px-5 sm:px-6 pb-6 pt-1 border-t border-[#E9DFE4]" : "hidden"}
            >
              <p className="text-sm sm:text-base text-[#756A71] leading-relaxed">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
