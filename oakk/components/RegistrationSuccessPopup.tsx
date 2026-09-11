"use client";

import React from "react";
import { AttendeeRegistration } from "../lib/types";
import { getPassQRUrl } from "../lib/utils";
import QRCodeSVG from "./QRCodeSVG";

interface RegistrationSuccessPopupProps {
  attendee: AttendeeRegistration;
  onViewPass: () => void;
  onRegisterAnother: () => void;
}

export default function RegistrationSuccessPopup({
  attendee,
  onViewPass,
  onRegisterAnother,
}: RegistrationSuccessPopupProps) {
  const qrUrl = getPassQRUrl(attendee.passCode);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#162E55]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-success-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[#F7FAFD] p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </div>

        <h2
          id="registration-success-title"
          className="mt-4 text-xl font-bold text-[#162E55]"
        >
          Successfully Checked In!
        </h2>
        <p className="mt-1 text-sm text-[#3A5A85]">
          Welcome, {attendee.firstName}! Your entry pass is ready &mdash; show
          this QR code at the event entrance to check in.
        </p>

        <div className="mx-auto mt-4 w-fit rounded-xl bg-[#EDF1F7] p-3">
          <QRCodeSVG value={qrUrl} size={180} level="H" fgColor="#162E55" />
        </div>
        <p className="mt-2 font-mono text-sm font-semibold tracking-[0.12em] text-[#162E55]">
          {attendee.passCode}
        </p>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onViewPass}
            className="flex w-full items-center justify-center rounded-lg bg-[#162E55] px-3 py-3 text-sm font-semibold text-[#EDF1F7] shadow-sm transition-colors hover:bg-[#112344]"
          >
            View My Entry Pass
          </button>
          <button
            type="button"
            onClick={onRegisterAnother}
            className="flex w-full items-center justify-center rounded-lg bg-[#EDF1F7] px-3 py-3 text-sm font-semibold text-[#162E55] transition-colors hover:bg-[#D6DEE8]"
          >
            Register Another Attendee
          </button>
        </div>
      </div>
    </div>
  );
}