"use client";

import { useState } from "react";
import AttendeePass from "../components/AttendeePass";
import HeroBanner from "../components/HeroBanner";
import Navbar from "../components/Navbar";
import RegistrationForm from "../components/RegistrationForm";
import { AttendeeRegistration } from "../lib/types";

export default function Home() {
  const [attendee, setAttendee] = useState<AttendeeRegistration | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-8">
        <HeroBanner />
        {attendee ? (
          <AttendeePass attendee={attendee} onRegisterAnother={() => setAttendee(null)} />
        ) : (
          <RegistrationForm onSuccess={setAttendee} />
        )}
      </main>
    </div>
  );
}
