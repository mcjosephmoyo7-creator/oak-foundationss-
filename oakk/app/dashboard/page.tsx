"use client";

import React, { useState, useCallback } from "react";
import QRScanner from "../../components/dashboard/QRScanner";
import RecentCheckins from "../../components/dashboard/RecentCheckins";
import ManualCodeEntry from "../../components/dashboard/ManualCodeEntry";
import HeadcountCards from "../../components/dashboard/HeadcountCards";

export default function CheckInPage() {
  const [headcountKey, setHeadcountKey] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleScanStart = useCallback(() => {
    setErrorMsg(null);
  }, []);

  const handleError = useCallback((message: string) => {
    setErrorMsg(message);
    setHeadcountKey((k) => k + 1);
  }, []);

  return (
    <div className="w-full max-w-66.5 mx-auto space-y-2">
      {/* Page header */}
      <div>
        <h1 className="text-[13px] font-bold text-[#162E55] tracking-tight">
          Event Check-In
        </h1>
        <p className="text-[8px] text-[#3A5A85] mt-0.5">
          Scan an attendee QR code to check them in
        </p>
      </div>

      <HeadcountCards refreshKey={headcountKey} />

      {/* Inline error banner */}
      {errorMsg && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 flex items-start gap-2"
        >
          <svg
            className="w-4 h-4 text-red-500 shrink-0 mt-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-red-800">{errorMsg}</p>
          </div>
          <button
            type="button"
            onClick={() => setErrorMsg(null)}
            className="text-red-400 hover:text-red-600 shrink-0"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <div>
        <QRScanner onScanStart={handleScanStart} onError={handleError} />
      </div>
      <RecentCheckins />
      <ManualCodeEntry onError={handleError} />
    </div>
  );
}
