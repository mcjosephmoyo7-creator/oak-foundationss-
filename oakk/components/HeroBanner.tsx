"use client";

import React from "react";
import { EVENT_DETAILS } from "../lib/types";

export default function HeroBanner() {
  return (
    <div className="w-full bg-[#0D1A33] text-[#EDF1F7] rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F7FAFD]/10 text-blue-100 text-xs font-medium mb-3 backdrop-blur-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          <span>{EVENT_DETAILS.location} · {EVENT_DETAILS.dates}</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#EDF1F7] mb-2">
          {EVENT_DETAILS.title}
        </h2>
        <p className="text-sm text-[#C8D4E3] mb-6 max-w-xl">
          Annual gathering bringing together regional grantees, partners, and leaders to shape transformative impact and collective strategies.
        </p>

        {/* Stats Row matching the Figma design */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md pt-2 border-t border-[#D6DEE8]/10">
          <div className="bg-[#F7FAFD]/5 rounded-xl p-2.5 sm:p-3 border border-[#D6DEE8]/10 text-center">
            <span className="block text-xl sm:text-2xl font-extrabold text-[#EDF1F7]">
              {EVENT_DETAILS.stats.attendees}
            </span>
            <span className="text-[11px] sm:text-xs text-[#C8D4E3] font-medium">
              Attendees
            </span>
          </div>

          <div className="bg-[#F7FAFD]/5 rounded-xl p-2.5 sm:p-3 border border-[#D6DEE8]/10 text-center">
            <span className="block text-xl sm:text-2xl font-extrabold text-[#EDF1F7]">
              {EVENT_DETAILS.stats.sessions}
            </span>
            <span className="text-[11px] sm:text-xs text-[#C8D4E3] font-medium">
              Sessions
            </span>
          </div>

          <div className="bg-[#F7FAFD]/5 rounded-xl p-2.5 sm:p-3 border border-[#D6DEE8]/10 text-center">
            <span className="block text-xl sm:text-2xl font-extrabold text-[#EDF1F7]">
              {EVENT_DETAILS.stats.partners}
            </span>
            <span className="text-[11px] sm:text-xs text-[#C8D4E3] font-medium">
              Partners
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
