"use client";

import React from "react";
import AuthProvider from "../../components/dashboard/AuthProvider";
import Sidebar from "../../components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 ml-[116px] min-h-screen">
          <div className="px-4 py-5 lg:py-6 max-w-[480px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
