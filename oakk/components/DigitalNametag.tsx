"use client";

import React from "react";
import { AttendeeRegistration, EVENT_DETAILS } from "../lib/types";
import QRCodeSVG from "./QRCodeSVG";

interface DigitalNametagProps {
  attendee: AttendeeRegistration;
}

export default function DigitalNametag({ attendee }: DigitalNametagProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-[#F7FAFD] rounded-3xl border-2 border-[#D6DEE8] shadow-xl overflow-hidden text-center relative print:shadow-none print:border-[#162E55]">
      {/* Lanyard Hole Mockup */}
      <div className="pt-4 pb-2 flex justify-center">
        <div className="w-16 h-3 bg-[#D6DEE8] rounded-full border border-[#C9D4E0] shadow-inner" />
      </div>

      {/* Header Band */}
      <div className="bg-[#162E55] text-[#EDF1F7] py-4 px-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <img src="/oak-logo.svg" alt="OAK Foundation" className="h-6 w-auto brightness-0 invert" />
          <span className="text-xs font-bold tracking-widest uppercase text-[#DCE4EE]">
            {EVENT_DETAILS.organization}
          </span>
        </div>
        <p className="text-[11px] text-blue-200 font-medium tracking-wide uppercase">
          {EVENT_DETAILS.title}
        </p>
      </div>

      {/* Attendee Body */}
      <div className="p-6">
        {/* Role Pill */}
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#162E55] border border-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
          {attendee.role}
        </div>

        {/* Attendee Name */}
        <h3 className="text-2xl sm:text-3xl font-black text-[#162E55] leading-tight mb-1">
          {attendee.firstName} {attendee.lastName}
        </h3>

        {/* Organisation */}
        <p className="text-sm font-semibold text-[#3A5A85] mb-1">
          {attendee.organisation}
        </p>
        {attendee.subPartner && (
          <p className="text-xs text-[#3A5A85] mb-4">{attendee.subPartner}</p>
        )}

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="p-3 bg-[#F7FAFD] rounded-2xl border-2 border-[#D6DEE8] shadow-inner inline-block">
            <QRCodeSVG
              value={attendee.passCode}
              size={160}
              level="M"
              fgColor="#162E55"
            />
          </div>
          <span className="mt-3 font-mono text-xs font-bold text-[#3A5A85] tracking-wider bg-[#EDF1F7] px-3 py-1 rounded-md">
            {attendee.passCode}
          </span>
        </div>

        {/* Event Details Footer */}
        <div className="pt-4 border-t border-[#E2E9F1] text-xs text-[#3A5A85] space-y-0.5">
          <p className="font-semibold text-[#162E55]">{EVENT_DETAILS.venue}</p>
          <p>{EVENT_DETAILS.location} · {EVENT_DETAILS.dates}</p>
        </div>
      </div>

      {/* Lanyard Bottom Accent */}
      <div className="h-2 bg-linear-to-r from-blue-600 via-[#162E55] to-indigo-600" />
    </div>
  );
}
