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

const notes = [
  { initials: "HM", name: "Helena Murewa", role: "OAK Foundation", time: "Today, 09:25", text: "The rights-based approaches session surfaced strong demand for a shared learning platform. OAK will follow up with MENA Rights Group on joint programming opportunities in the MENA region." },
  { initials: "JO", name: "James Okafor", role: "Africa Civil Alliance", time: "Day 1, 10:10", text: "Digital rights in authoritarian contexts was a recurring thread across the opening sessions. Partnership opportunities with Digital Frontiers, Access Now, and others are emerging." },
  { initials: "AD", name: "Amina Diallo", role: "Global Evaluation Network", time: "Day 1, 11:40", text: "Strategic communications workshop highly rated. Participants asked for more practical tools and examples for organisations working with smaller teams." },
  { initials: "PC", name: "Paul Maseko", role: "Pamoja Fund", time: "Day 1, 14:00", text: "Feedback showed strong preference for practical tools and peer learning over long-form policy and better share learning. Key ask: OAK to publish future case studies alongside success stories." },
];

const gallery = [
  { src: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=700&q=80", alt: "Audience gathered in a conference room" },
  { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=80", alt: "Microphone ready for a speaker" },
  { src: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=700&q=80", alt: "Partners collaborating around a laptop" },
  { src: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=700&q=80", alt: "Bright meeting room prepared for a session" },
  { src: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=700&q=80", alt: "Team of partners talking together" },
  { src: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=700&q=80", alt: "Workshop participant taking notes" },
];

const takeaways = [
  "Philanthropy needs to accept 10+ year time horizons for systemic change",
  "Shared learning infrastructure is the most requested resource across the portfolio",
  "Digital rights must be integrated into all programme areas, not siloed",
  "Rights-based framing significantly improves grantmaking effectiveness",
  "Peer exchange is rated most valuable when expert-led sessions are practical",
];

const resources = [
  ["Opening Plenary Presentation", "PDF · 12.8 MB · Day 1"],
  ["OAK Portfolio Overview 2024–26", "PDF · 1.8 MB · Day 2"],
  ["Action Planning Workbook", "DOCX · 3.6 MB · Day 2"],
  ["Partner Contact Directory", "XLSX · 0.4 MB · All days"],
  ["Photo Gallery (High Res)", "ZIP · 48.2 MB · All days"],
];

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

      <section className="mt-4" aria-labelledby="session-notes-heading">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="session-notes-heading" className="text-[8px] font-extrabold text-[#17243a]">◉ Session Notes</h2>
          <button type="button" className="rounded-md bg-[#19345b] px-2 py-1.5 text-[6px] font-semibold text-white">+ Add Note</button>
        </div>
        <div className="space-y-1.5">
          {notes.map((note) => (
            <article key={note.name} className="rounded-xl bg-white px-2.5 py-2 shadow-[0_3px_10px_rgba(31,48,77,0.09)]">
              <div className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#19345b] text-[5px] font-bold text-white">{note.initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[6px] font-bold text-[#17243a]">{note.name}</p>
                  <p className="truncate text-[5px] text-[#8c97a8]">{note.role}</p>
                </div>
                <span className="rounded-full bg-[#f1f4f8] px-1.5 py-1 text-[5px] text-[#8c97a8]">{note.time}</span>
              </div>
              <p className="mt-1.5 text-[6px] leading-2.5 text-[#405069]">{note.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-4" aria-labelledby="photo-gallery-heading">
        <div className="mb-2 flex items-center justify-between">
          <h2 id="photo-gallery-heading" className="text-[8px] font-extrabold text-[#17243a]">▧ Photo Gallery</h2>
          <span className="text-[6px] text-[#8c97a8]">{gallery.length} photos</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {gallery.map((photo) => (
            <div key={photo.src} className="aspect-[1.35] overflow-hidden rounded-lg bg-[#e9edf2]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4" aria-labelledby="takeaways-heading">
        <h2 id="takeaways-heading" className="mb-2 text-[8px] font-extrabold text-[#17243a]">♧ Key Takeaways</h2>
        <div className="rounded-xl bg-white px-2.5 py-2.5 shadow-[0_3px_10px_rgba(31,48,77,0.09)]">
          <ul className="space-y-1.5">
            {takeaways.map((takeaway) => (
              <li key={takeaway} className="flex items-start gap-1.5 text-[6px] leading-2.5 text-[#405069]">
                <span className="mt-0.5 flex h-2 w-2 shrink-0 items-center justify-center rounded-full bg-[#19345b] text-[4px] text-white">✓</span>
                {takeaway}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mt-4" aria-labelledby="resources-heading">
        <h2 id="resources-heading" className="mb-2 text-[8px] font-extrabold text-[#17243a]">♧ Resources</h2>
        <div className="space-y-1.5">
          {resources.map(([name, detail]) => (
            <button key={name} type="button" className="flex w-full items-center gap-2 rounded-xl bg-white px-2.5 py-2 text-left shadow-[0_3px_10px_rgba(31,48,77,0.09)] transition-colors hover:bg-[#f8fafc]">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-[#eef2f7] text-[7px] text-[#718097]">▧</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[6px] font-bold text-[#405069]">{name}</span>
                <span className="mt-0.5 block truncate text-[5px] text-[#9aa5b5]">{detail}</span>
              </span>
              <span className="text-[8px] text-[#9aa5b5]">⌄</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}