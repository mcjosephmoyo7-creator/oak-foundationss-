"use client";

import React from "react";
import Image from "next/image";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({ activeTab = "register", onTabChange }: NavbarProps) {
  return (
    <header className="w-full bg-[#F7FAFD] border-b border-[#D6DEE8] sticky top-0 z-40 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Event Title */}
        <div className="flex items-center space-x-3">
          <Image src="/oak-logo.svg" alt="OAK Foundation" width={110} height={32} className="h-8 w-auto" priority />
          <div>
            <h1 className="text-sm font-semibold text-[#162E55] leading-tight">
              Partner Convening 2026
            </h1>
            <p className="text-xs text-[#3A5A85] hidden sm:block">
              OAK Foundation · Annual Partner Gathering
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <button
            type="button"
            onClick={() => onTabChange?.("register")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "register"
                ? "bg-[#162E55] text-[#EDF1F7]"
                : "text-[#3A5A85] hover:text-[#162E55] hover:bg-[#EDF1F7]"
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => onTabChange?.("programme")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "programme"
                ? "bg-[#162E55] text-[#EDF1F7]"
                : "text-[#3A5A85] hover:text-[#162E55] hover:bg-[#EDF1F7]"
            }`}
          >
            Programme
          </button>
          <button
            type="button"
            onClick={() => onTabChange?.("partners")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "partners"
                ? "bg-[#162E55] text-[#EDF1F7]"
                : "text-[#3A5A85] hover:text-[#162E55] hover:bg-[#EDF1F7]"
            }`}
          >
            Partners
          </button>
        </nav>

        {/* Location & Dates Pill */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-semibold text-[#162E55]">Harare, Zimbabwe</span>
          <span className="text-[11px] text-[#3A5A85]">9–11 March 2026</span>
        </div>
      </div>
    </header>
  );
}
