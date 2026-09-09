"use client";

import React from "react";
import { AttendeeRegistration, EVENT_DETAILS } from "../lib/types";
import QRCodeSVG from "./QRCodeSVG";

interface DigitalNametagProps {
  attendee: AttendeeRegistration;
}

export default function DigitalNametag({ attendee }: DigitalNametagProps) {
  return (
    <div className="w-full max-w-sm mx-auto bg-white rounded-3xl border-2 border-gray-200 shadow-xl overflow-hidden text-center relative print:shadow-none print:border-black">
      {/* Lanyard Hole Mockup */}
      <div className="pt-4 pb-2 flex justify-center">
        <div className="w-16 h-3 bg-gray-200 rounded-full border border-gray-300 shadow-inner" />
      </div>

      {/* Header Band */}
      <div className="bg-[#0F223D] text-white py-4 px-6">
        <div className="flex items-center justify-center gap-2 mb-1">
          <div className="w-6 h-6 rounded bg-white text-[#0F223D] font-black text-xs flex items-center justify-center">
            OAK
          </div>
          <span className="text-xs font-bold tracking-widest uppercase text-slate-200">
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
        <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-[#0F223D] border border-blue-200 text-xs font-bold uppercase tracking-wider mb-4">
          {attendee.role}
        </div>

        {/* Attendee Name */}
        <h3 className="text-2xl sm:text-3xl font-black text-gray-900 leading-tight mb-1">
          {attendee.firstName} {attendee.lastName}
        </h3>

        {/* Organisation */}
        <p className="text-sm font-semibold text-gray-700 mb-1">
          {attendee.organisation}
        </p>
        {attendee.subPartner && (
          <p className="text-xs text-gray-500 mb-4">{attendee.subPartner}</p>
        )}

        {/* QR Code Container */}
        <div className="my-5 flex flex-col items-center justify-center">
          <div className="p-3 bg-white rounded-2xl border-2 border-gray-200 shadow-inner inline-block">
            <QRCodeSVG
              value={attendee.passCode}
              size={160}
              level="M"
              fgColor="#0F223D"
            />
          </div>
          <span className="mt-3 font-mono text-xs font-bold text-gray-700 tracking-wider bg-gray-100 px-3 py-1 rounded-md">
            {attendee.passCode}
          </span>
        </div>

        {/* Event Details Footer */}
        <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
          <p className="font-semibold text-gray-800">{EVENT_DETAILS.venue}</p>
          <p>{EVENT_DETAILS.location} · {EVENT_DETAILS.dates}</p>
        </div>
      </div>

      {/* Lanyard Bottom Accent */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-[#0F223D] to-indigo-600" />
    </div>
  );
}
