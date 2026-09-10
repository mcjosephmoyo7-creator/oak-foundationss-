"use client";

import React, { useState } from "react";

const days = [
  { label: "MON", day: "Day 1", date: "9 Mar" },
  { label: "TUE", day: "Day 2", date: "10 Mar" },
  { label: "WED", day: "Day 3", date: "11 Mar" },
];

const sessions = [
  {
    time: "10:50",
    duration: "-12:00",
    title: "Thematic Dialogue: Climate Justice & Grantmaking",
    speaker: "Samuel Okafor · Africa Civil Alliance",
    room: "Conference Room B2",
    type: "Breakout",
    tone: "amber",
  },
  {
    time: "10:50",
    duration: "-12:00",
    title: "Workshop: Measuring Long-term Change",
    speaker: "Dr. Ingrid Holm · Nordic Evaluation Centre",
    room: "Workshop Room C",
    type: "Workshop",
    tone: "violet",
  },
  {
    time: "13:30",
    duration: "-14:30",
    title: "Partner Spotlight: Rights-Based Approaches",
    speaker: "Fatima Zahra Belal · MENA Rights Group",
    room: "Main Hall A",
    type: "Plenary",
    tone: "blue",
  },
  {
    time: "14:45",
    duration: "-16:00",
    title: "Digital Rights in Authoritarian Contexts",
    speaker: "Li Wei · Digital Frontiers Institute",
    room: "Conference Room B1",
    type: "Breakout",
    tone: "amber",
  },
  {
    time: "18:00",
    duration: "-20:00",
    title: "Welcome Reception & Dinner",
    speaker: "",
    room: "Rooftop Terrace",
    type: "Social",
    tone: "orange",
  },
];

const toneStyles = {
  amber: "bg-[#fff3c9] text-[#bd8500]",
  violet: "bg-[#f3eaff] text-[#8648dc]",
  blue: "bg-[#e8effa] text-[#294c82]",
  orange: "bg-[#fff0e6] text-[#d86b25]",
};

export default function ProgrammePage() {
  const [selectedDay, setSelectedDay] = useState(0);

  return (
    <div className="programme-shell mx-auto w-full max-w-85.5 pb-5">
      <header className="mb-2">
        <h1 className="text-[13px] font-extrabold tracking-[-0.02em] text-[#111b2c]">Programme</h1>
        <p className="mt-0.5 text-[8px] text-[#7a879c]">OAK Partner Convening 2026</p>
      </header>

      <div className="mb-2 flex h-5.5 items-center justify-between rounded-sm bg-[#e5e9f0] p-0.5 text-[7px] font-semibold text-[#758198]">
        <button type="button" className="h-4.5 w-19.75 rounded-sm bg-white text-[#233047] shadow-sm">Schedule</button>
        <button type="button" className="px-2">Docs</button>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-1.5">
        {days.map((day, index) => (
          <button
            key={day.day}
            type="button"
            onClick={() => setSelectedDay(index)}
            className={`h-12 rounded-xl px-2.5 text-left shadow-[0_4px_10px_rgba(31,48,77,0.08)] transition-colors ${selectedDay === index ? "bg-[#19345b] text-white" : "bg-white text-[#1b283d]"}`}
          >
            <span className={`block text-[6px] font-bold tracking-widest ${selectedDay === index ? "text-white/75" : "text-[#8190a7]"}`}>{day.label}</span>
            <span className="mt-0.5 block text-[12px] font-extrabold leading-none">{day.day}</span>
            <span className={`mt-0.5 block text-[6px] ${selectedDay === index ? "text-white/65" : "text-[#8793a6]"}`}>{day.date}</span>
          </button>
        ))}
      </div>

      <section className="mb-4 rounded-xl bg-[#17253e] px-3.5 py-3 text-white shadow-[0_7px_16px_rgba(23,37,62,0.2)]">
        <div className="flex items-center gap-2 text-[6px] font-semibold uppercase tracking-[0.13em] text-white/55">
          <span className="text-[8px] text-white/70">✦</span> Featured <span className="text-white/30">08:00–10:30</span>
        </div>
        <h2 className="mt-2 text-[10px] font-extrabold tracking-tight">Opening Plenary: Pathways to Impact</h2>
        <p className="mt-2 text-[7px] text-white/50">◉ &nbsp;Dr. Helena Murewa · OAK Foundation</p>
        <p className="mt-1 text-[7px] text-white/50">⌖ &nbsp;Main Hall A</p>
      </section>

      <div className="mb-3 flex items-center gap-2 text-[6px] text-[#718097]">
        <span><i className="programme-dot bg-[#19345b]" />Plenary</span>
        <span><i className="programme-dot bg-[#e8a900]" />Breakout</span>
        <span><i className="programme-dot bg-[#9c5de3]" />Workshop</span>
        <span><i className="programme-dot bg-[#f18445]" />Social</span>
      </div>

      <div className="space-y-1.5">
        <div className="programme-divider"><span>08:00</span><i /><em>Registration &amp; Welcome Coffee</em></div>
        <div className="programme-divider"><span>10:30</span><i /><em>Coffee Break</em></div>
        {sessions.map((session) => (
          <article key={session.title} className="flex min-h-14.25 items-start rounded-xl bg-white px-2.5 py-2 shadow-[0_3px_10px_rgba(31,48,77,0.09)]">
            <div className="w-9.75 shrink-0 pt-0.5 text-center font-mono text-[6px] font-bold leading-2 text-[#1b283d]">
              <span className="block">{session.time}</span><span className="block font-normal text-[#9aa5b5]">{session.duration}</span>
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-[8px] font-bold leading-2.5 text-[#17243a]">{session.title}</h3>
              {session.speaker && <p className="mt-1 truncate text-[6px] text-[#718097]">{session.speaker}</p>}
              <p className="mt-0.5 truncate text-[6px] text-[#9aa5b5]">⌖ {session.room}</p>
            </div>
            <span className={`ml-1 mt-0.5 shrink-0 rounded-full px-1.5 py-1 text-[6px] font-semibold ${toneStyles[session.tone as keyof typeof toneStyles]}`}>● {session.type}</span>
            <span className="ml-1 mt-1 text-[8px] text-[#9aa5b5]">⌄</span>
          </article>
        ))}
      </div>
    </div>
  );
}