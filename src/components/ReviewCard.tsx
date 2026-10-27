import React from "react";
import { Star, ShieldCheck } from "lucide-react";

export interface VerifiedReviewItem {
  id: number;
  reviewerName: string;
  rating: number;
  comment: string;
  reviewDate?: string | null;
  sourceUrl?: string | null;
  isVerified: boolean;
}

export function ReviewCard({ review }: { review: VerifiedReviewItem }) {
  return (
    <div className="bg-white rounded-[1.75rem] p-6 border border-[#E9DDE2] shadow-xs flex flex-col justify-between text-right">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1 text-[#E94D91]">
            {Array.from({ length: Math.min(5, Math.max(1, review.rating)) }).map((_, idx) => (
              <Star key={idx} className="w-4 h-4 fill-current" />
            ))}
          </div>
          {review.isVerified && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#F7F2EF] text-[#5A103A] text-[11px] font-bold border border-[#E9DDE2]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E94D91]" />
              <span>تقييم موثق</span>
            </span>
          )}
        </div>
        <p className="text-sm sm:text-base text-[#2B2228] leading-relaxed mb-4">
          &ldquo;{review.comment}&rdquo;
        </p>
      </div>
      <div className="pt-3 border-t border-[#E9DDE2] flex items-center justify-between text-xs text-[#756A70]">
        <span className="font-bold text-[#5A103A]">{review.reviewerName}</span>
        {review.reviewDate && <span>{review.reviewDate}</span>}
      </div>
    </div>
  );
}
