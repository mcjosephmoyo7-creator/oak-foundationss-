"use client";

import React, { useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import type { CheckInWithAttendee } from "../../lib/types";

const DEMO_CHECKINS: CheckInWithAttendee[] = [
  { id: "demo-1", attendee_id: "demo-1", check_in_date: "2026-09-09", checked_in_at: "2026-09-09T08:00:00Z", checked_in_by: null, attendees: { id: "demo-1", full_name: "Maria Schmidt", email: null, phone: null, qr_code: null, accommodation: "OAK-2026-7842-XKPH", created_at: "2026-09-09T08:00:00Z" } },
  { id: "demo-2", attendee_id: "demo-2", check_in_date: "2026-09-09", checked_in_at: "2026-09-09T08:01:00Z", checked_in_by: null, attendees: { id: "demo-2", full_name: "James Gutiérrez", email: null, phone: null, qr_code: null, accommodation: "OAK-2026-1549-JGTR", created_at: "2026-09-09T08:01:00Z" } },
  { id: "demo-3", attendee_id: "demo-3", check_in_date: "2026-09-09", checked_in_at: "2026-09-09T08:02:00Z", checked_in_by: null, attendees: { id: "demo-3", full_name: "Awa Diallo", email: null, phone: null, qr_code: null, accommodation: "OAK-2026-0192-AWDL", created_at: "2026-09-09T08:02:00Z" } },
  { id: "demo-4", attendee_id: "demo-4", check_in_date: "2026-09-09", checked_in_at: "2026-09-09T08:03:00Z", checked_in_by: null, attendees: { id: "demo-4", full_name: "Fatima Z. Bonali", email: null, phone: null, qr_code: null, accommodation: "OAK-2026-5260-FZBN", created_at: "2026-09-09T08:03:00Z" } },
];

export default function RecentCheckins() {
  const [checkins, setCheckins] = useState<CheckInWithAttendee[]>([]);
  const today = new Date().toISOString().split("T")[0];

  const fetchRecent = useCallback(async () => {
    const { data } = await supabase
      .from("check_ins")
      .select("*, attendees(*)")
      .eq("check_in_date", today)
      .order("checked_in_at", { ascending: false })
      .limit(20);

    if (data) setCheckins(data as CheckInWithAttendee[]);
  }, [today]);

  useEffect(() => {
    void (async () => { await fetchRecent(); })();

    const channel = supabase
      .channel("recent-checkins-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "check_ins" }, async (payload) => {
        const { data: newCheckin } = await supabase
          .from("check_ins")
          .select("*, attendees(*)")
          .eq("id", payload.new.id)
          .single();

        if (newCheckin) {
          setCheckins((prev) => [newCheckin as CheckInWithAttendee, ...prev].slice(0, 20));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRecent]);

  const getInitials = (name: string) => {
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const avatarColors = [
    "bg-[#0F223D]", "bg-blue-600", "bg-indigo-600", "bg-violet-600",
    "bg-teal-600", "bg-emerald-600", "bg-cyan-600",
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="px-2.5 pt-2.5 pb-1.5">
        <h3 className="text-[7px] font-bold text-gray-500 uppercase tracking-[0.12em]">Simulate QR Scan</h3>
      </div>
      <div className="px-2 pb-2 space-y-1">
        {(checkins.length === 0 ? DEMO_CHECKINS : checkins).map((ci, i) => {
          const name = ci.attendees?.full_name || "Unknown";
          const color = avatarColors[i % avatarColors.length];
          return (
            <div key={ci.id} className="px-1 py-1 flex items-center gap-1.5 border border-gray-100 rounded-md">
              <div className={`w-4 h-4 rounded-full ${color} text-white flex items-center justify-center text-[5px] font-bold shrink-0`}>
                {getInitials(name)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[7px] font-semibold text-gray-900 truncate">{name}</p>
                <p className="text-[5px] text-gray-400 font-mono">
                  {ci.attendees?.accommodation || "No accommodation"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className={`inline-flex items-center px-1 py-0.5 rounded-full text-[5px] font-semibold ${i === 1 ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : i === 2 ? "bg-orange-50 text-orange-600 border border-orange-200" : "bg-blue-50 text-blue-700 border border-blue-200"}`}>
                  {i === 1 ? "OAK Staff" : i === 2 ? "Coordination Team" : "Partner"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
