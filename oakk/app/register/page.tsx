"use client";

import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import AttendeePass from "../../components/AttendeePass";
import RegistrationForm from "../../components/RegistrationForm";
import type { AttendeeRegistration } from "../../lib/types";

const STATS = [
  ["110+", "Attendees"],
  ["24", "Sessions"],
  ["38", "Partners"],
];

export default function RegistrationPage() {
  const [attendee, setAttendee] = useState<AttendeeRegistration | null>(null);

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <Sidebar />
      <main className="ml-0 min-h-screen px-3 py-5 sm:ml-29 sm:px-6 lg:py-6">
        <div className="mx-auto w-full max-w-73">
          {attendee ? (
            <AttendeePass attendee={attendee} onRegisterAnother={() => setAttendee(null)} />
          ) : (
            <>
              <section className="rounded-xl bg-[#203b68] px-3.5 py-3.5 text-white shadow-sm">
                <h1 className="text-[15px] font-bold leading-tight">Partner<br />Convening 2026</h1>
                <p className="mt-1 text-[6px] text-blue-100">Geneva · 9–11 March 2026</p>
              </section>

              <section className="mt-2 grid grid-cols-3 gap-1.5">
                {STATS.map(([value, label]) => (
                  <div key={label} className="rounded-[10px] bg-white px-2 py-2 shadow-sm ring-1 ring-gray-200/70">
                    <p className="text-[11px] font-bold text-[#152746]">{value}</p>
                    <p className="text-[5px] text-gray-400">{label}</p>
                  </div>
                ))}
              </section>

              <div className="registration-form-compact mt-2">
                <RegistrationForm onSuccess={setAttendee} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
