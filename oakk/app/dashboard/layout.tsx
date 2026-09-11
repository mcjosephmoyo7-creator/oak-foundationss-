"use client";

import React from "react";
import AuthProvider from "../../components/dashboard/AuthProvider";
import Sidebar from "../../components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#F3F6FA]">
        <Sidebar />
        <main className="min-h-screen md:ml-56">
          <div className="px-4 pt-4 pb-24 md:pt-8 md:pb-8 max-w-120 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
