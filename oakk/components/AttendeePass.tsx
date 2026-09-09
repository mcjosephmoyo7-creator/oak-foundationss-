"use client";

import React, { useState } from "react";
import { AttendeeRegistration, EVENT_DETAILS } from "../lib/types";
import QRCodeSVG from "./QRCodeSVG";
import DigitalNametag from "./DigitalNametag";

interface AttendeePassProps {
  attendee: AttendeeRegistration;
  onRegisterAnother: () => void;
}

export default function AttendeePass({
  attendee,
  onRegisterAnother,
}: AttendeePassProps) {
  const [viewMode, setViewMode] = useState<"pass" | "nametag">("pass");
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(attendee.passCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownloadPass = () => {
    setIsDownloading(true);

    try {
      // Create offscreen canvas for high-resolution pass download
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = 2; // retina quality
      const width = 480 * scale;
      const height = 640 * scale;

      canvas.width = width;
      canvas.height = height;

      // Background
      ctx.fillStyle = "#F8FAFC";
      ctx.fillRect(0, 0, width, height);

      // Card Header
      ctx.fillStyle = "#0F223D";
      ctx.fillRect(0, 0, width, 140 * scale);

      // Header Text
      ctx.fillStyle = "#FFFFFF";
      ctx.font = `bold ${16 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(EVENT_DETAILS.organization.toUpperCase(), width / 2, 45 * scale);

      ctx.font = `bold ${22 * scale}px sans-serif`;
      ctx.fillText(EVENT_DETAILS.title, width / 2, 75 * scale);

      ctx.fillStyle = "#93C5FD";
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.fillText(`${EVENT_DETAILS.location} · ${EVENT_DETAILS.dates}`, width / 2, 105 * scale);

      // Attendee Name
      ctx.fillStyle = "#111827";
      ctx.font = `bold ${24 * scale}px sans-serif`;
      ctx.fillText(`${attendee.firstName} ${attendee.lastName}`, width / 2, 195 * scale);

      // Org & Role
      ctx.fillStyle = "#4B5563";
      ctx.font = `${15 * scale}px sans-serif`;
      ctx.fillText(`${attendee.organisation} • ${attendee.role}`, width / 2, 225 * scale);

      // Pass Code Box
      ctx.fillStyle = "#EEF2F6";
      ctx.fillRect(width / 2 - 130 * scale, 250 * scale, 260 * scale, 36 * scale);
      ctx.fillStyle = "#0F223D";
      ctx.font = `bold ${15 * scale}px monospace`;
      ctx.fillText(attendee.passCode, width / 2, 273 * scale);

      // Convert SVG QR to Image onto Canvas
      const svgElement = document.querySelector("#attendee-qr-code svg");
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const img = new Image();
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(svgBlob);

        img.onload = () => {
          const qrSize = 220 * scale;
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(width / 2 - qrSize / 2 - 12 * scale, 310 * scale - 12 * scale, qrSize + 24 * scale, qrSize + 24 * scale);
          ctx.drawImage(img, width / 2 - qrSize / 2, 310 * scale, qrSize, qrSize);
          URL.revokeObjectURL(url);

          // Footer Notice
          ctx.fillStyle = "#6B7280";
          ctx.font = `${12 * scale}px sans-serif`;
          ctx.fillText("Present this QR pass at event entrance for check-in", width / 2, 580 * scale);
          ctx.fillText("OAK Foundation Partner Gathering 2026", width / 2, 605 * scale);

          // Download Trigger
          const link = document.createElement("a");
          link.download = `OAK_Pass_${attendee.firstName}_${attendee.lastName}_${attendee.passCode}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          setIsDownloading(false);
        };
        img.src = url;
      } else {
        setIsDownloading(false);
      }
    } catch (err) {
      console.error("Pass generation error:", err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Registration Complete */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
            ✓
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 block">
              Registration Complete
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-emerald-950">
              You&apos;re Registered, {attendee.firstName}!
            </h2>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-xs font-semibold text-emerald-900 bg-emerald-100/80 px-2.5 py-1 rounded-full">
            {attendee.organisation}
          </span>
        </div>
      </div>

      {/* View Switcher: Pass vs Digital Nametag */}
      <div className="flex justify-center">
        <div className="bg-gray-200 p-1 rounded-xl inline-flex gap-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setViewMode("pass")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              viewMode === "pass"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Digital Pass View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("nametag")}
            className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
              viewMode === "nametag"
                ? "bg-white text-gray-900 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Nametag / Badge View
          </button>
        </div>
      </div>

      {viewMode === "nametag" ? (
        <div className="space-y-4">
          <DigitalNametag attendee={attendee} />

          <div className="flex flex-wrap items-center justify-center gap-3 max-w-sm mx-auto">
            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🖨</span> Print Badge
            </button>
            <button
              type="button"
              onClick={handleDownloadPass}
              disabled={isDownloading}
              className="flex-1 py-2.5 px-4 bg-[#0F223D] hover:bg-[#1A365D] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <span>📥</span> {isDownloading ? "Saving..." : "Save Image"}
            </button>
          </div>
        </div>
      ) : (
        /* Standard Entry Pass View matching Figma Screen 2 */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Left Column: Your Entry Pass (2 cols) */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col items-center text-center">
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Your Entry Pass
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              Present at event entrance for check-in
            </p>

            {/* Pass Code Badge */}
            <div className="w-full mb-4 bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center justify-between">
              <span className="font-mono text-sm sm:text-base font-bold text-[#0F223D] tracking-wider select-all">
                {attendee.passCode}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                title="Copy Pass Code"
                className="text-xs text-gray-500 hover:text-gray-900 bg-white border border-gray-200 hover:border-gray-300 rounded-md px-2 py-1 transition-colors cursor-pointer"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            {/* QR Code Container */}
            <div
              id="attendee-qr-code"
              className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-xs mb-5"
            >
              <QRCodeSVG
                value={attendee.passCode}
                size={180}
                level="M"
                fgColor="#0F223D"
              />
            </div>

            {/* Actions */}
            <div className="w-full space-y-2.5">
              <button
                type="button"
                onClick={handleDownloadPass}
                disabled={isDownloading}
                className="w-full py-2.5 px-4 bg-[#0F223D] hover:bg-[#1A365D] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <span>📥</span>
                <span>{isDownloading ? "Generating Pass..." : "Download QR Code"}</span>
              </button>

              <button
                type="button"
                onClick={onRegisterAnother}
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold rounded-xl border border-gray-300 shadow-2xs transition-colors cursor-pointer"
              >
                Register another attendee
              </button>
            </div>
          </div>

          {/* Right Column: Registration Details (3 cols) */}
          <div className="md:col-span-3 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 sm:p-7 flex flex-col justify-between">
            <div>
              <div className="border-b border-gray-100 pb-4 mb-4 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900">
                  Registration Details
                </h3>
                <span className="text-[11px] font-semibold text-[#0F223D] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Official Attendee
                </span>
              </div>

              {/* Data Table */}
              <dl className="divide-y divide-gray-100 text-xs sm:text-sm">
                <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="font-semibold text-gray-500">Name</dt>
                  <dd className="sm:col-span-2 font-bold text-gray-900 mt-0.5 sm:mt-0">
                    {attendee.firstName} {attendee.lastName}
                  </dd>
                </div>

                <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="font-semibold text-gray-500">Organisation</dt>
                  <dd className="sm:col-span-2 font-medium text-gray-900 mt-0.5 sm:mt-0">
                    {attendee.organisation}
                  </dd>
                </div>

                {attendee.subPartner && (
                  <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="font-semibold text-gray-500">Sub-Partner / Area</dt>
                    <dd className="sm:col-span-2 text-gray-800 mt-0.5 sm:mt-0">
                      {attendee.subPartner}
                    </dd>
                  </div>
                )}

                <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="font-semibold text-gray-500">Role</dt>
                  <dd className="sm:col-span-2 mt-0.5 sm:mt-0">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800 font-semibold text-xs border border-slate-200">
                      {attendee.role}
                    </span>
                  </dd>
                </div>

                <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="font-semibold text-gray-500">Email</dt>
                  <dd className="sm:col-span-2 text-gray-800 font-mono text-xs mt-0.5 sm:mt-0 break-all">
                    {attendee.email}
                  </dd>
                </div>

                {attendee.phone && (
                  <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="font-semibold text-gray-500">Phone</dt>
                    <dd className="sm:col-span-2 text-gray-800 text-xs mt-0.5 sm:mt-0">
                      {attendee.phone}
                    </dd>
                  </div>
                )}

                <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="font-semibold text-gray-500">Event Dates</dt>
                  <dd className="sm:col-span-2 font-semibold text-gray-900 mt-0.5 sm:mt-0">
                    {EVENT_DETAILS.dates}
                  </dd>
                </div>

                <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                  <dt className="font-semibold text-gray-500">Location</dt>
                  <dd className="sm:col-span-2 text-gray-900 mt-0.5 sm:mt-0">
                    <span className="font-medium">{EVENT_DETAILS.venue}</span>
                    <span className="text-gray-500 block text-xs">
                      {EVENT_DETAILS.location}
                    </span>
                  </dd>
                </div>

                {/* Requirements list */}
                {(attendee.dietary || attendee.accessibility || attendee.travel) && (
                  <div className="py-2.5 sm:grid sm:grid-cols-3 sm:gap-4">
                    <dt className="font-semibold text-gray-500">Special Notes</dt>
                    <dd className="sm:col-span-2 text-xs text-gray-700 space-y-1 mt-0.5 sm:mt-0">
                      {attendee.dietary && (
                        <p>
                          <strong className="text-gray-900">Dietary:</strong> {attendee.dietary}
                        </p>
                      )}
                      {attendee.accessibility && (
                        <p>
                          <strong className="text-gray-900">Accessibility:</strong> {attendee.accessibility}
                        </p>
                      )}
                      {attendee.travel && (
                        <p>
                          <strong className="text-gray-900">Travel:</strong> {attendee.travel}
                        </p>
                      )}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Funder / Platform Notice */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400">
              <span>Secure Check-in Verified</span>
              <span>Supported by Uncommon.org</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
