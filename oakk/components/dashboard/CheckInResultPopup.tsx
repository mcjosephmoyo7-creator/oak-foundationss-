"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { CheckInResult } from "../../lib/types";

interface CheckInResultPopupProps {
  result: CheckInResult;
  onClose: () => void;
}

interface Headcount {
  total: number;
  checkedIn: number;
}

export default function CheckInResultPopup({ result, onClose }: CheckInResultPopupProps) {
  const [headcount, setHeadcount] = useState<Headcount | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    void (async () => {
      const [totalRes, checkedRes] = await Promise.all([
        supabase.from("attendees").select("id", { count: "exact", head: true }),
        supabase
          .from("check_ins")
          .select("id", { count: "exact", head: true })
          .eq("check_in_date", today),
      ]);

      setHeadcount({
        total: totalRes.count ?? 0,
        checkedIn: checkedRes.count ?? 0,
      });
    })();
  }, []);

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const success = result.success;

  const renderSuccess = () => {
    const attendee = result.attendee;
    const name = attendee?.full_name || "Attendee";
    const email = attendee?.email || "";
    const role = attendee?.role || "Guest / Partner";
    const checkedIn = headcount?.checkedIn ?? 0;
    const total = headcount?.total ?? 0;
    const remaining = Math.max(total - checkedIn, 0);
    const progress = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

    return (
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-9 w-9 text-emerald-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
          </svg>
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          Checked In Successfully!
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {name} is now checked in for today
        </p>
        {formatTime(result.check_in?.checked_in_at) && (
          <p className="mt-1 text-xs font-mono text-gray-400">
            {formatTime(result.check_in?.checked_in_at)}
          </p>
        )}

        <div className="mt-5 flex items-center gap-3 rounded-xl bg-[#edf2f6] p-3 text-left">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#142c52] text-sm font-bold text-white">
            {getInitials(name)}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-[#17243a]">{name}</p>
            <p className="truncate text-xs text-gray-500">{email || "No email on record"}</p>
            {attendee?.organization && (
              <p className="truncate text-xs text-gray-500">{attendee.organization}</p>
            )}
          </div>
          <span className="shrink-0 rounded-full bg-white px-2 py-1 text-[11px] font-semibold text-[#38547d] ring-1 ring-gray-200">
            {role}
          </span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-[#edf2f6] p-3 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              Next session
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">Opening Plenary</p>
            <p className="text-xs text-gray-500">09:30 · Main Hall A</p>
          </div>
          <div className="rounded-xl bg-[#edf2f6] p-3 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              Venue
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">Cresta Lodge</p>
            <p className="text-xs text-gray-500">Msasa, Harare</p>
          </div>
        </div>

        <div className="mt-3 rounded-xl bg-white p-3 text-left ring-1 ring-gray-100">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-500">
            Live event status
          </p>
          <p className="mt-2 text-xs font-semibold text-gray-700">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
            {checkedIn} of {total} attendees checked in today
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-[#2a4777] transition-all"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-gray-400">{remaining} remaining</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#444444] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#333333]"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3" />
            <path d="M8 12h8" />
          </svg>
          Scan Next Attendee
        </button>
      </div>
    );
  };

  const renderFailure = () => (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow-2xl">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
        <svg
          className="h-9 w-9 text-red-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>

      <h2 className="mt-4 text-2xl font-bold text-gray-900">QR Not Recognised</h2>
      <p className="mt-1 text-sm text-gray-500">{result.message || "Code is invalid or unregistered"}</p>

      <div className="mt-5 rounded-xl bg-red-50 p-4 text-left ring-1 ring-red-100">
        <p className="text-xs font-bold text-red-700">Possible reasons</p>
        <ul className="mt-2 space-y-1.5 text-xs text-red-600/80">
          <li>QR code belongs to a different event</li>
          <li>Registration was not completed</li>
          <li>Code has been altered or corrupted</li>
          <li>Attendee registered under a different email</li>
        </ul>
      </div>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#444444] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#333333]"
      >
        Try Again
      </button>
      <button
        type="button"
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-200 transition-colors hover:bg-gray-50"
      >
        Contact Coordination Team
      </button>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#444444]/75 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkin-result-title"
    >
      <div id="checkin-result-title" className="sr-only">
        {success ? "Check-in successful" : "Check-in failed"}
      </div>
      {success ? renderSuccess() : renderFailure()}
    </div>
  );
}