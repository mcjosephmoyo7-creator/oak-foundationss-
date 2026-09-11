"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { verifyAndCheckIn } from "../../lib/check-in";

interface ManualCodeEntryProps {
  onError?: (message: string) => void;
}

export default function ManualCodeEntry({ onError }: ManualCodeEntryProps) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckIn = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const result = await verifyAndCheckIn(trimmed);

      if (result.success) {
        const encoded = btoa(JSON.stringify(result));
        router.push(`/dashboard/approved?r=${encodeURIComponent(encoded)}`);
        return;
      }

      setErrorMsg(result.message);
      onError?.(result.message);
    } catch {
      setErrorMsg("An unexpected error occurred");
      onError?.("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCheckIn();
  };

  return (
    <div className="bg-[#F7FAFD] rounded-lg border border-[#D6DEE8] shadow-sm p-2.5">
      <h3 className="text-[7px] font-bold text-[#3A5A85] uppercase tracking-[0.12em] mb-1">
        Manual Code Entry
      </h3>
      <div className="flex gap-1">
        <input
          type="text"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            if (errorMsg) setErrorMsg("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="OAK-2026-XXXX-XXXX"
          className="flex-1 min-w-0 px-2 py-2 rounded-md border-0 bg-[#EDF1F7] text-[8px] font-mono text-[#162E55] placeholder:text-[#5C7AA2] focus:outline-none focus:ring-1 focus:ring-blue-100 transition-all"
          disabled={loading}
        />
        <button
          type="button"
          onClick={handleCheckIn}
          disabled={loading || !code.trim()}
          className="px-3 py-2 bg-[#112344] hover:bg-[#112344] text-[#EDF1F7] text-[8px] font-semibold rounded-md shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {loading ? (
            <svg
              className="animate-spin h-4 w-4 text-[#EDF1F7]"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
          Check
        </button>
      </div>
      {errorMsg && (
        <p className="mt-1.5 text-[7px] text-red-600 font-medium">{errorMsg}</p>
      )}
    </div>
  );
}
