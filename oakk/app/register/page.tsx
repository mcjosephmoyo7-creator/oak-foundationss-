"use client";

import React, { useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import AttendeePass from "../../components/AttendeePass";
import RegistrationForm from "../../components/RegistrationForm";
import RegistrationSuccessPopup from "../../components/RegistrationSuccessPopup";
import type { AttendeeRegistration } from "../../lib/types";

const STATS = [
  ["110+", "Attendees"],
  ["24", "Sessions"],
  ["38", "Partners"],
];

export default function RegistrationPage() {
  const [attendee, setAttendee] = useState<AttendeeRegistration | null>(null);
  const [popupAttendee, setPopupAttendee] = useState<AttendeeRegistration | null>(null);

  const handleSuccess = (registered: AttendeeRegistration) => {
    setPopupAttendee(registered);
  };

  const handleViewPass = () => {
    if (popupAttendee) setAttendee(popupAttendee);
    setPopupAttendee(null);
  };

  const handleRegisterAnother = () => {
    setAttendee(null);
    setPopupAttendee(null);
  };

  return (
    <div className="min-h-screen bg-[#EDF1F7]">
      <Sidebar />
      <main className="min-h-screen px-4 pb-10 pt-20 sm:px-6 sm:pt-8 lg:px-10 lg:py-10">
        <div className="mx-auto w-full max-w-3xl">
          {attendee ? (
            <AttendeePass attendee={attendee} onRegisterAnother={handleRegisterAnother} />
          ) : (
            <>
              <section className="rounded-2xl bg-[#162E55] px-5 py-6 text-[#EDF1F7] shadow-sm sm:px-7 sm:py-7">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-100">OAK Foundation</p>
                <h1 className="mt-2 text-2xl font-bold leading-tight sm:text-3xl">Partner Convening 2026</h1>
                <p className="mt-2 text-sm text-blue-100">Harare, Zimbabwe · 9–11 March 2026</p>
              </section>

              <section className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                {STATS.map(([value, label]) => (
                  <div key={label} className="rounded-xl bg-[#F7FAFD] px-3 py-3 shadow-sm ring-1 ring-[#D6DEE8]/70 sm:px-4 sm:py-4">
                    <p className="text-lg font-bold text-[#162E55] sm:text-xl">{value}</p>
                    <p className="mt-0.5 text-xs text-[#3A5A85] sm:text-sm">{label}</p>
                  </div>
                ))}
              </section>

              <div className="mt-4">
                <RegistrationForm onSuccess={handleSuccess} />
              </div>
            </>
          )}
        </div>
      </main>

      {popupAttendee && (
        <RegistrationSuccessPopup
          attendee={popupAttendee}
          onViewPass={handleViewPass}
          onRegisterAnother={handleRegisterAnother}
        />
      )}
    </div>
  );
}
