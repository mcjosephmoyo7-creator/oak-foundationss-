"use client";

import React from "react";

interface NavbarProps {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function Navbar({ activeTab = "register", onTabChange }: NavbarProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand & Event Title */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#0F223D] flex items-center justify-center text-white font-bold text-sm tracking-wider">
            OAK
          </div>
          <div>
            <h1 className="text-sm font-semibold text-gray-900 leading-tight">
              Partner Convening 2026
            </h1>
            <p className="text-xs text-gray-500 hidden sm:block">
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
                ? "bg-[#0F223D] text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => onTabChange?.("programme")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "programme"
                ? "bg-[#0F223D] text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Programme
          </button>
          <button
            type="button"
            onClick={() => onTabChange?.("partners")}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${
              activeTab === "partners"
                ? "bg-[#0F223D] text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            Partners
          </button>
        </nav>

        {/* Location & Dates Pill */}
        <div className="hidden md:flex flex-col text-right">
          <span className="text-xs font-semibold text-gray-800">Harare, Zimbabwe</span>
          <span className="text-[11px] text-gray-500">9–11 March 2026</span>
        </div>
      </div>
    </header>
  );
}
