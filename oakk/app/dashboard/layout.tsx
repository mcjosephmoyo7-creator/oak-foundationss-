"use client";

import React from "react";
import AuthProvider from "../../components/dashboard/AuthProvider";
import Sidebar from "../../components/dashboard/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex">
        <Sidebar />
        <main className="flex-1 min-w-0 ml-0 md:ml-29 min-h-screen">
          <div className="px-4 py-5 lg:py-6 max-w-120 mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AuthProvider>
  );
}
