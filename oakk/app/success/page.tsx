"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { EVENT_DETAILS, AttendeeRegistration } from "../../lib/types";
import { getStoredAttendees } from "../../lib/utils";
import QRCodeSVG from "../../components/QRCodeSVG";

function SuccessContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const [attendee, setAttendee] = useState<AttendeeRegistration | null>(null);

  useEffect(() => {
    if (!code) return;
    const all = getStoredAttendees();
    const found = all.find((a) => a.passCode === code) ?? null;
    setAttendee(found);
  }, [code]);

  if (!code) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9] p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-900">Invalid QR Code</h1>
          <p className="mt-2 text-sm text-gray-500">No pass code found in the URL.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] px-4 py-10">
      <div className="mx-auto max-w-md space-y-6">
        {/* Success Banner */}
        <div className="relative overflow-hidden rounded-xl bg-[#444444] px-5 py-5 text-white shadow-sm">
          <div className="absolute -right-7 -top-8 h-24 w-24 rounded-full bg-white/10" />
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/20">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
              </svg>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                Registration Successful
              </span>
              <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl">
                {attendee ? `Welcome, ${attendee.firstName}!` : "You're Registered!"}
              </h1>
              <p className="mt-1 text-sm text-white/70">{EVENT_DETAILS.title}</p>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="rounded-xl bg-white px-4 py-5 shadow-sm ring-1 ring-gray-200/70">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#62718a]">
            Your Entry Pass
          </p>
          <div className="mx-auto mt-3 w-fit rounded-xl bg-[#edf2f6] p-3">
            <QRCodeSVG value={code} size={180} level="H" fgColor="#444444" />
          </div>
          <p className="mt-3 text-center font-mono text-sm font-semibold tracking-[0.12em] text-[#444444]">
            {code}
          </p>
          <p className="mt-2 text-center text-xs text-gray-400">
            Present this QR code at the event entrance for check-in
          </p>
        </div>

        {/* Attendee Details */}
        {attendee && (
          <div className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-gray-200/70">
            <h3 className="border-b border-gray-100 pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#62718a]">
              Registration Details
            </h3>
            <dl className="divide-y divide-gray-100 text-sm">
              <div className="flex items-center justify-between py-2">
                <dt className="text-gray-500">Name</dt>
                <dd className="font-semibold text-gray-900">
                  {attendee.firstName} {attendee.lastName}
                </dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-gray-500">Organisation</dt>
                <dd className="font-medium text-gray-900">{attendee.organisation}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-gray-500">Role</dt>
                <dd className="font-semibold text-gray-900">{attendee.role}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-gray-500">Event Dates</dt>
                <dd className="font-semibold text-gray-900">{EVENT_DETAILS.dates}</dd>
              </div>
              <div className="flex items-center justify-between py-2">
                <dt className="text-gray-500">Location</dt>
                <dd className="text-right font-medium text-gray-900">{EVENT_DETAILS.location}</dd>
              </div>
            </dl>
          </div>
        )}

        {!attendee && (
          <div className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-gray-200/70">
            <p className="text-center text-sm text-gray-500">
              Pass code <span className="font-mono font-semibold text-[#444444]">{code}</span> is valid.
              Show this at the event entrance for check-in.
            </p>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          {EVENT_DETAILS.organization} {EVENT_DETAILS.title} &middot; {EVENT_DETAILS.location}
        </p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#f4f6f9]" />}>
      <SuccessContent />
    </Suspense>
  );
}