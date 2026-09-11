"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Check In", href: "/dashboard", icon: "scan" },
  { label: "Programme", href: "/dashboard/programme", icon: "calendar" },
  { label: "Partners", href: "/dashboard/export", icon: "users" },
  { label: "Attendance", href: "/dashboard/attendees", icon: "grid" },
] as const;

type NavIconName = (typeof NAV_ITEMS)[number]["icon"];

function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  const paths = {
    scan: (
      <>
        <path d="M4 8V5a1 1 0 0 1 1-1h3" />
        <path d="M16 8V5a1 1 0 0 0-1-1h-3" />
        <path d="M4 12v3a1 1 0 0 0 1 1h3" />
        <path d="M16 12v3a1 1 0 0 1-1 1h-3" />
        <path d="M7 10h6" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="4.5" width="13" height="12" rx="1.5" />
        <path d="M6.5 3.5v3M13.5 3.5v3M3.5 8h13" />
      </>
    ),
    users: (
      <>
        <circle cx="8" cy="8" r="2.5" />
        <path d="M3.5 15c.4-2 1.9-3 4.5-3s4.1 1 4.5 3M13 6.2a2.5 2.5 0 0 1 0 4.6M14 12c1.8.2 2.8 1.2 3 3" />
      </>
    ),
    grid: (
      <>
        <rect x="3.5" y="3.5" width="4" height="4" rx=".5" />
        <rect x="10.5" y="3.5" width="4" height="4" rx=".5" />
        <rect x="3.5" y="10.5" width="4" height="4" rx=".5" />
        <rect x="10.5" y="10.5" width="4" height="4" rx=".5" />
      </>
    ),
  };

  return (
    <svg
      className={className || "w-5 h-5"}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile: Bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[#D6DEE8] safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-colors ${
                  active
                    ? "text-[#162E55]"
                    : "text-[#8BA3BF] hover:text-[#3A5A85]"
                }`}
              >
                <NavIcon
                  name={item.icon}
                  className={`w-5 h-5 ${active ? "text-[#162E55]" : "text-[#8BA3BF]"}`}
                />
                <span
                  className={`text-[10px] font-semibold leading-none ${
                    active ? "text-[#162E55]" : "text-[#8BA3BF]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop: Left sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 bottom-0 z-50 w-56 flex-col bg-[#162E55] shadow-lg">
        {/* Logo area */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-[#1D3E6E]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/oak-logo.svg" alt="OAK Foundation" className="h-8 w-auto brightness-0 invert" />
          <div>
            <p className="text-[11px] font-bold text-white leading-tight">OAK Foundation</p>
            <p className="text-[9px] text-blue-200 leading-tight">Partner Convening 2026</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? "bg-white/15 text-white shadow-sm"
                    : "text-blue-200 hover:bg-white/8 hover:text-white"
                }`}
              >
                <NavIcon
                  name={item.icon}
                  className={`w-4.5 h-4.5 ${active ? "text-white" : "text-blue-300"}`}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#1D3E6E]">
          <p className="text-[9px] text-blue-300/60">Cresta Lodge, Harare</p>
          <p className="text-[9px] text-blue-300/60">9–11 March 2026</p>
        </div>
      </aside>
    </>
  );
}
