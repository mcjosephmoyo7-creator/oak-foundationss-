"use client";

import React, { useState, useCallback } from "react";
import { supabase } from "../../../lib/supabase";
import type { Day3Attendee, CheckIn } from "../../../lib/types";

interface ExportRow extends Day3Attendee {
  check_ins: CheckIn[];
}

const partners = [
  { name: "Africa Civil Alliance", focus: "Climate justice & grantmaking", location: "Nairobi, Kenya", region: "East Africa", delegates: 12, tone: "bg-[#D6DEE8] text-[#1D3E6E]" },
  { name: "MENA Rights Group", focus: "Rights-based approaches", location: "Tunis, Tunisia", region: "Middle East & North Africa", delegates: 8, tone: "bg-[#fff3c9] text-[#bd8500]" },
  { name: "Digital Frontiers Institute", focus: "Digital rights & access", location: "Accra, Ghana", region: "West Africa", delegates: 10, tone: "bg-[#f3eaff] text-[#8648dc]" },
  { name: "Nordic Evaluation Centre", focus: "Long-term change", location: "Helsinki, Finland", region: "Europe", delegates: 5, tone: "bg-[#fff0e6] text-[#d86b25]" },
  { name: "Pamoja Fund", focus: "Pan-African participatory grantmaking", location: "Dar es Salaam, Tanzania", region: "East Africa", delegates: 9, tone: "bg-[#dcefe8] text-[#12805c]" },
  { name: "Global Evaluation Network", focus: "Evidence & learning systems", location: "Addis Ababa, Ethiopia", region: "East Africa", delegates: 7, tone: "bg-[#e7e2fb] text-[#5b4bb2]" },
  { name: "Civic Commons Collective", focus: "Civic space & participation", location: "Lagos, Nigeria", region: "West Africa", delegates: 11, tone: "bg-[#ffe4d6] text-[#c2571e]" },
  { name: "Reimagining Governance Fund", focus: "Just & accountable governance", location: "Johannesburg, South Africa", region: "Southern Africa", delegates: 6, tone: "bg-[#fde9d3] text-[#a66a12]" },
  { name: "Access Now Middle East", focus: "Digital rights & free expression", location: "Amman, Jordan", region: "Middle East & North Africa", delegates: 4, tone: "bg-[#d6e9f8] text-[#1a6ca8]" },
  { name: "Philanthropy for Africa", focus: "African philanthropy ecosystems", location: "Kampala, Uganda", region: "East Africa", delegates: 8, tone: "bg-[#f6e0e6] text-[#b04a63]" },
];

const regionTone: Record<string, string> = {
  "East Africa": "bg-[#dcefe8] text-[#12805c]",
  "West Africa": "bg-[#ffe4d6] text-[#c2571e]",
  "Southern Africa": "bg-[#fde9d3] text-[#a66a12]",
  "Europe": "bg-[#e7e2fb] text-[#5b4bb2]",
  "Middle East & North Africa": "bg-[#f3eaff] text-[#8648dc]",
};

export default function ExportPage() {
  const [loading, setLoading] = useState(false);
  const [row_count, setRowCount] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const today = new Date().toISOString().split("T")[0];

  const regions = ["All", ...Array.from(new Set(partners.map((p) => p.region)))];

  const filteredPartners = partners.filter(
    (p) =>
      (selectedRegion === "All" || p.region === selectedRegion) &&
      (query.trim() === "" ||
        [p.name, p.focus, p.location, p.region].some((field) =>
          field.toLowerCase().includes(query.trim().toLowerCase())
        ))
  );

  const exportCSV = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("attendees")
        .select("*, check_ins(*)")
        .order("full_name")
        .limit(10000);

      if (!data || data.length === 0) {
        alert("No attendee data found to export.");
        setLoading(false);
        return;
      }

      const rows = data as ExportRow[];

      const csvHeader = "Name,Email,Accommodation,Check-in Date,Check-in Time,Status";
      const csvRows = rows.map((a) => {
        const todayCheckin = a.check_ins?.find((c) => c.check_in_date === today);
        const name = `"${(a.full_name || "").replace(/"/g, '""')}"`;
        const email = `"${(a.email || "").replace(/"/g, '""')}"`;
        const accom = `"${(a.accommodation || "None").replace(/"/g, '""')}"`;
        const date = todayCheckin ? new Date(todayCheckin.checked_in_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "";
        const time = todayCheckin ? new Date(todayCheckin.checked_in_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }) : "";
        const status = todayCheckin ? "Checked In" : "Not Checked In";
        return `${name},${email},${accom},${date},${time},${status}`;
      });

      const csvContent = [csvHeader, ...csvRows].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `OAK_Attendance_Export_${today}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      setRowCount(rows.length);
    } catch {
      alert("Failed to export data.");
    } finally {
      setLoading(false);
    }
  }, [today]);

  return (
    <div className="programme-shell mx-auto w-full max-w-85.5 pb-5">
      <header className="mb-3">
        <h1 className="text-[13px] font-extrabold tracking-[-0.02em] text-[#162E55]">Partners</h1>
        <p className="mt-0.5 text-[8px] text-[#3A5A85]">OAK Partner Convening 2026</p>
      </header>

      <section className="mb-3 rounded-xl bg-[#162E55] px-3.5 py-3 text-[#EDF1F7] shadow-[0_7px_16px_rgba(13,26,51,0.2)]">
        <p className="text-[6px] font-semibold uppercase tracking-[0.13em] text-[#EDF1F7]/55">01 / Convening network</p>
        <h2 className="mt-2 text-[11px] font-extrabold tracking-tight">Partners shaping change together</h2>
        <p className="mt-1.5 text-[7px] leading-3 text-[#EDF1F7]/55">Meet the organisations joining this year&apos;s conversations across regions and movements.</p>
      </section>

      <div className="mb-3 grid grid-cols-3 gap-1.5">
        <div className="rounded-xl bg-[#F7FAFD] px-2.5 py-2 text-center shadow-[0_3px_10px_rgba(22,46,85,0.09)]">
          <p className="text-[13px] font-extrabold text-[#162E55]">{partners.length}</p>
          <p className="text-[6px] font-semibold text-[#3A5A85]">Organisations</p>
        </div>
        <div className="rounded-xl bg-[#F7FAFD] px-2.5 py-2 text-center shadow-[0_3px_10px_rgba(22,46,85,0.09)]">
          <p className="text-[13px] font-extrabold text-[#162E55]">{regions.length - 1}</p>
          <p className="text-[6px] font-semibold text-[#3A5A85]">Regions</p>
        </div>
        <div className="rounded-xl bg-[#F7FAFD] px-2.5 py-2 text-center shadow-[0_3px_10px_rgba(22,46,85,0.09)]">
          <p className="text-[13px] font-extrabold text-[#162E55]">{partners.reduce((sum, p) => sum + p.delegates, 0)}</p>
          <p className="text-[6px] font-semibold text-[#3A5A85]">Delegates</p>
        </div>
      </div>

      <section aria-labelledby="partner-directory-heading">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="partner-directory-heading" className="text-[8px] font-extrabold text-[#162E55]">02 / Partner Directory</h2>
          <span className="text-[6px] text-[#3A5A85]">{filteredPartners.length} organisations</span>
        </div>

        <div className="mb-2 rounded-xl bg-[#F7FAFD] px-2.5 py-2 shadow-[0_3px_10px_rgba(22,46,85,0.09)]">
          <span className="mb-1 flex text-[7px] font-bold text-[#5C7AA2]">⌕ Search partners</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Name, focus area or location…"
            className="w-full bg-transparent text-[8px] font-medium text-[#162E55] outline-none placeholder:text-[#9DB1CC]"
          />
        </div>

        <div className="mb-2 flex flex-wrap items-center gap-1">
          {regions.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setSelectedRegion(region)}
              className={`rounded-full px-2 py-1 text-[6px] font-semibold transition-colors ${
                selectedRegion === region
                  ? "bg-[#1D3E6E] text-[#EDF1F7]"
                  : "bg-[#F7FAFD] text-[#3A5A85] shadow-[0_3px_10px_rgba(22,46,85,0.09)] hover:text-[#162E55]"
              }`}
            >
              {region}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          {filteredPartners.map((partner) => (
            <article key={partner.name} className="flex items-center gap-2 rounded-xl bg-[#F7FAFD] px-2.5 py-2.5 shadow-[0_3px_10px_rgba(22,46,85,0.09)]">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[9px] font-extrabold ${partner.tone}`}>
                {partner.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-[8px] font-bold leading-2.5 text-[#162E55]">{partner.name}</h3>
                  <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[5px] font-semibold ${regionTone[partner.region] ?? "bg-[#EDF1F7] text-[#3A5A85]"}`}>
                    {partner.region}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-[6px] text-[#3A5A85]">{partner.focus}</p>
                <p className="mt-0.5 truncate text-[6px] text-[#5C7AA2]">⌖ {partner.location} · {partner.delegates} delegates</p>
              </div>
              <span className="text-[9px] text-[#5C7AA2]">›</span>
            </article>
          ))}
          {filteredPartners.length === 0 && (
            <p className="rounded-xl bg-[#F7FAFD] px-2.5 py-3 text-center text-[7px] text-[#5C7AA2]">No partners match your search.</p>
          )}
        </div>
      </section>

      <section className="mt-4 rounded-xl bg-[#F7FAFD] px-3 py-3 shadow-[0_3px_10px_rgba(22,46,85,0.09)]">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-[8px] font-extrabold text-[#162E55]">Resources</h2>
            <p className="mt-1 text-[6px] text-[#3A5A85]">Download the latest attendee directory.</p>
          </div>
          <button type="button" onClick={exportCSV} disabled={loading} className="rounded-lg bg-[#1D3E6E] px-2.5 py-2 text-[6px] font-semibold text-[#EDF1F7] transition-colors hover:bg-[#1D3E6E] disabled:opacity-50">
            {loading ? "Exporting..." : "Download CSV"}
          </button>
        </div>
        {row_count !== null && <p className="mt-2 text-[6px] text-emerald-600">Exported {row_count} attendee record(s).</p>}
      </section>
    </div>
  );
}