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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#444444]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="registration-success-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
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
          className="mt-4 text-xl font-bold text-gray-900"
        >
          Successfully Checked In!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome, {attendee.firstName}! Your entry pass is ready &mdash; show
          this QR code at the event entrance to check in.
        </p>

        <div className="mx-auto mt-4 w-fit rounded-xl bg-[#edf2f6] p-3">
          <QRCodeSVG value={qrUrl} size={180} level="H" fgColor="#444444" />
        </div>
        <p className="mt-2 font-mono text-sm font-semibold tracking-[0.12em] text-[#444444]">
          {attendee.passCode}
        </p>

        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onViewPass}
            className="flex w-full items-center justify-center rounded-lg bg-[#444444] px-3 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#333333]"
          >
            View My Entry Pass
          </button>
          <button
            type="button"
            onClick={onRegisterAnother}
            className="flex w-full items-center justify-center rounded-lg bg-[#edf2f6] px-3 py-3 text-sm font-semibold text-[#444444] transition-colors hover:bg-[#e2e9f0]"
          >
            Register Another Attendee
          </button>
        </div>
      </div>
    </div>
  );
}