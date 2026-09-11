"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Register", href: "/register", icon: "register" },
  { label: "Check In", href: "/dashboard", icon: "scan" },
  { label: "Programme", href: "/dashboard/programme", icon: "calendar" },
  { label: "Partners", href: "/dashboard/export", icon: "users" },
  { label: "Attendance", href: "/dashboard/attendees", icon: "grid" },
] as const;

type NavIconName = (typeof NAV_ITEMS)[number]["icon"];

function NavIcon({ name }: { name: NavIconName }) {
  const paths = {
    register: <><circle cx="8" cy="8" r="2.5" /><path d="M3.5 15c.4-2 1.9-3 4.5-3" /><path d="M14 11v6M11 14h6" /></>,
    scan: <><path d="M4 8V5a1 1 0 0 1 1-1h3" /><path d="M16 8V5a1 1 0 0 0-1-1h-3" /><path d="M4 12v3a1 1 0 0 0 1 1h3" /><path d="M16 12v3a1 1 0 0 1-1 1h-3" /><path d="M7 10h6" /></>,
    calendar: <><rect x="3.5" y="4.5" width="13" height="12" rx="1.5" /><path d="M6.5 3.5v3M13.5 3.5v3M3.5 8h13" /></>,
    users: <><circle cx="8" cy="8" r="2.5" /><path d="M3.5 15c.4-2 1.9-3 4.5-3s4.1 1 4.5 3M13 6.2a2.5 2.5 0 0 1 0 4.6M14 12c1.8.2 2.8 1.2 3 3" /></>,
    grid: <><rect x="3.5" y="3.5" width="4" height="4" rx=".5" /><rect x="10.5" y="3.5" width="4" height="4" rx=".5" /><rect x="3.5" y="10.5" width="4" height="4" rx=".5" /><rect x="10.5" y="10.5" width="4" height="4" rx=".5" /></>,
  };

  return (
    <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

  // Only show "Register" while on the register section
  const visibleItems = pathname.startsWith("/register")
    ? NAV_ITEMS.filter((item) => item.href === "/register")
    : NAV_ITEMS.filter((item) => item.href !== "/register");

  const renderLinks = (compact: boolean) =>
    visibleItems.map((item) => {
      const active = isActive(item.href);
      return (
        <Link
          key={item.label}
          href={item.href}
          className={`flex items-center gap-1.5 font-medium transition-all ${
            compact
              ? "shrink-0 px-2.5 py-1.5 rounded-full text-[9px] " +
                (active
                  ? "bg-[#444444] text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-200")
                  : "px-2 py-2 rounded-md text-[7px] " +
                (active
                  ? "bg-[#444444] text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-100")
          }`}
        >
          <span className={active ? "text-white" : "text-gray-400"}>
            <NavIcon name={item.icon} />
          </span>
          {item.label}
        </Link>
      );
    });

  return (
    <>
      {/* Mobile: always-visible top navigation bar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 px-3 h-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/oak-logo.svg" alt="OAK Foundation" className="h-6 w-auto" />
          <span className="text-[7px] font-semibold text-gray-900 leading-tight uppercase tracking-wide truncate">
            Partner Convening 2026
          </span>
        </div>
        <nav className="flex gap-1.5 px-2 pb-2 overflow-x-auto">
          {renderLinks(true)}
        </nav>
      </div>

      {/* Desktop: simple Register link (no hamburger) */}
      <div className="hidden md:flex fixed top-3 left-3 z-50 items-center gap-2">
        <Link
          href="/register"
          className="flex items-center gap-1.5 rounded-lg bg-[#444444] px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-colors hover:bg-[#333333]"
        >
          <NavIcon name="register" />
          Register
        </Link>
      </div>
    </>
  );
}