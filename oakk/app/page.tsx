"use client";

import { useState } from "react";
import AttendeePass from "../components/AttendeePass";
import RegistrationForm from "../components/RegistrationForm";
import { AttendeeRegistration, EVENT_DETAILS } from "../lib/types";

export default function Home() {
  const [attendee, setAttendee] = useState<AttendeeRegistration | null>(null);

  return (
    <main className="min-h-screen bg-[#e6e9ec] text-[#17263b]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="flex w-[220px] shrink-0 flex-col justify-between border-r border-[#cdd3d9] bg-[#edf0f2] px-5 py-7 max-md:hidden">
          <div>
            <div className="text-center">
              <img src="/oak-logo.svg" alt="OAK Foundation" className="mx-auto h-auto w-full max-w-[170px]" />
              <div className="mt-3 text-[14px] font-semibold uppercase tracking-[0.12em] text-[#50627a]">Partner Convening 2026</div>
            </div>
            <button type="button" className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#17345b] px-3 py-2.5 text-xs font-semibold text-white shadow-md shadow-[#17345b]/20">
              <svg aria-hidden="true" className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="7" r="3" />
                <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
                <path d="M19 8v6" />
                <path d="M16 11h6" />
              </svg>
              Register
            </button>
          </div>
          <div className="text-center text-[9px] leading-relaxed text-[#68798d]">
            <div className="font-semibold">Harare, Zimbabwe</div>
            <div>{EVENT_DETAILS.dates}</div>
          </div>
        </aside>

        <section className="flex flex-1 justify-center px-4 py-6 sm:px-8 sm:py-8">
          <div className="w-full max-w-[760px]">
            <div className="mb-4 overflow-hidden rounded-[14px] bg-[#17345b] px-5 py-5 text-white shadow-lg shadow-[#17345b]/10 sm:px-7">
              <div className="text-2xl font-semibold tracking-tight sm:text-3xl">{EVENT_DETAILS.title}</div>
              <div className="mt-1 text-xs text-[#c6d2e0]">{EVENT_DETAILS.location} · {EVENT_DETAILS.dates}</div>
            </div>

            <div className="mb-4 grid grid-cols-3 gap-2">
              {[
                [EVENT_DETAILS.stats.attendees, "Attendees"],
                [EVENT_DETAILS.stats.sessions, "Sessions"],
                [EVENT_DETAILS.stats.partners, "Partners"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-[#dce1e6]">
                  <div className="text-lg font-bold leading-none text-[#1d314d]">{value}</div>
                  <div className="mt-1 text-[9px] uppercase tracking-[0.12em] text-[#718095]">{label}</div>
                </div>
              ))}
            </div>

            {attendee ? (
              <AttendeePass attendee={attendee} onRegisterAnother={() => setAttendee(null)} />
            ) : (
              <RegistrationForm onSuccess={setAttendee} />
            )}

            <p className="py-4 text-center text-[9px] text-[#78879a]">Your data is secured and handled by OAK Foundation in accordance with GDPR.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
