"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import type { CheckInResult } from "../../../lib/types";

interface Headcount {
  total: number;
  checkedIn: number;
}

function parseResult(raw: string | null): CheckInResult | null {
  if (!raw) return null;
  try {
    return JSON.parse(atob(raw)) as CheckInResult;
  } catch {
    return null;
  }
}

function ApprovedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [headcount, setHeadcount] = useState<Headcount | null>(null);

  const raw = searchParams.get("r");
  const result = useMemo(() => parseResult(raw), [raw]);
  const loading = result ? !headcount : raw !== null;

  useEffect(() => {
    if (!result) {
      if (raw !== null) {
        router.replace("/dashboard");
      }
      return;
    }

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
  }, [result, raw, router]);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-10 h-10 border-2 border-gray-200 border-t-[#444444] rounded-full animate-spin" />
      </div>
    );
  }

  if (!result?.success) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm text-gray-500">No pending approval</p>
      </div>
    );
  }

  const attendee = result.attendee;
  const name = attendee?.full_name || "Attendee";
  const email = attendee?.email || "";
  const role = attendee?.role || "Guest / Partner";
  const checkedIn = headcount?.checkedIn ?? 0;
  const total = headcount?.total ?? 0;
  const remaining = Math.max(total - checkedIn, 0);
  const progress = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

  return (
    <div className="w-full max-w-66.5 mx-auto space-y-4">
      <div className="w-full rounded-2xl bg-white p-6 text-center shadow-2xl">
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
            <p className="truncate text-xs text-gray-500">
              {email || "No email on record"}
            </p>
            {attendee?.organization && (
              <p className="truncate text-xs text-gray-500">
                {attendee.organization}
              </p>
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
            <p className="mt-1 text-sm font-semibold text-gray-800">
              Opening Plenary
            </p>
            <p className="text-xs text-gray-500">09:30 · Main Hall A</p>
          </div>
          <div className="rounded-xl bg-[#edf2f6] p-3 text-left">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-gray-400">
              Venue
            </p>
            <p className="mt-1 text-sm font-semibold text-gray-800">
              Cresta Lodge
            </p>
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
          onClick={() => router.push("/dashboard")}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#444444] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#333333]"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            aria-hidden="true"
          >
            <path d="M4 8V5h3M20 8V5h-3M4 16v3h3M20 16v3h-3" />
            <path d="M8 12h8" />
          </svg>
          Scan Next Attendee
        </button>
      </div>
    </div>
  );
}

export default function ApprovedPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-2 border-gray-200 border-t-[#444444] rounded-full animate-spin" />
        </div>
      }
    >
      <ApprovedPage />
    </Suspense>
  );
}