"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AttendeeRegistration, EVENT_DETAILS } from "../lib/types";
import { drawQRToContext, getPassQRUrl } from "../lib/utils";
import QRCodeSVG from "./QRCodeSVG";

interface AttendeePassProps {
  attendee: AttendeeRegistration;
  onRegisterAnother: () => void;
}

export default function AttendeePass({
  attendee,
  onRegisterAnother,
}: AttendeePassProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const router = useRouter();
  const qrUrl = getPassQRUrl(attendee.passCode);

  const handleDownloadPass = () => {
    setIsDownloading(true);

    try {
      // Create offscreen canvas for high-resolution pass download
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const scale = 3; // retina quality; higher = crisper QR output
      const width = 480 * scale;
      const height = 640 * scale;

      canvas.width = width;
      canvas.height = height;

      // Background
      ctx.fillStyle = "#F7FAFD";
      ctx.fillRect(0, 0, width, height);

      // Card Header
      ctx.fillStyle = "#162E55";
      ctx.fillRect(0, 0, width, 140 * scale);

      // Header Text
      ctx.fillStyle = "#F7FAFD";
      ctx.font = `bold ${16 * scale}px sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(EVENT_DETAILS.organization.toUpperCase(), width / 2, 45 * scale);

      ctx.font = `bold ${22 * scale}px sans-serif`;
      ctx.fillText(EVENT_DETAILS.title, width / 2, 75 * scale);

      ctx.fillStyle = "#5C7AA2";
      ctx.font = `${13 * scale}px sans-serif`;
      ctx.fillText(`${EVENT_DETAILS.location} · ${EVENT_DETAILS.dates}`, width / 2, 105 * scale);

      // Attendee Name
      ctx.fillStyle = "#162E55";
      ctx.font = `bold ${24 * scale}px sans-serif`;
      ctx.fillText(`${attendee.firstName} ${attendee.lastName}`, width / 2, 195 * scale);

      // Org & Role
      ctx.fillStyle = "#3A5A85";
      ctx.font = `${15 * scale}px sans-serif`;
      ctx.fillText(`${attendee.organisation} • ${attendee.role}`, width / 2, 225 * scale);

      // Pass Code Box
      ctx.fillStyle = "#EEF2F6";
      ctx.fillRect(width / 2 - 130 * scale, 250 * scale, 260 * scale, 36 * scale);
      ctx.fillStyle = "#162E55";
      ctx.font = `bold ${15 * scale}px monospace`;
      ctx.fillText(attendee.passCode, width / 2, 273 * scale);

      // Draw QR code directly onto the canvas (crisp, high-res, level H
      // error correction) so the downloaded pass scans reliably
      const qrSize = 220 * scale;
      const qrX = width / 2 - qrSize / 2;
      const qrY = 310 * scale;

      ctx.fillStyle = "#F7FAFD";
      ctx.fillRect(qrX - 12 * scale, qrY - 12 * scale, qrSize + 24 * scale, qrSize + 24 * scale);
      drawQRToContext(ctx, qrUrl, qrX, qrY, qrSize, { level: "H", fgColor: "#162E55" });

      // Footer Notice
      ctx.fillStyle = "#5C7AA2";
      ctx.font = `${12 * scale}px sans-serif`;
      ctx.fillText("Present this QR pass at event entrance for check-in", width / 2, 580 * scale);
      ctx.fillText("OAK Foundation Partner Gathering 2026", width / 2, 605 * scale);

      // Download Trigger
      const link = document.createElement("a");
      link.download = `OAK_Pass_${attendee.firstName}_${attendee.lastName}_${attendee.passCode}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
      setIsDownloading(false);
    } catch (err) {
      console.error("Pass generation error:", err);
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Top Banner: Registration Complete */}
      <div className="relative overflow-hidden rounded-xl bg-[#162E55] px-3.5 py-3.5 text-[#EDF1F7] shadow-sm">
        <div className="absolute -right-7 -top-8 h-24 w-24 rounded-full bg-[#F7FAFD]/10" />
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#F7FAFD]/15">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="8.5" />
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.5 12 2.2 2.2 4.8-5" />
            </svg>
          </div>
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.14em] text-[#EDF1F7]/60">
              Registration Complete
            </span>
            <h2 className="text-xl font-bold leading-tight text-[#EDF1F7] sm:text-2xl">
              You&apos;re Registered, {attendee.firstName}!
            </h2>
            <p className="mt-1 text-sm text-[#EDF1F7]/70">{attendee.organisation}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex flex-col items-center rounded-xl bg-[#F7FAFD] px-3 py-3 shadow-sm ring-1 ring-[#D6DEE8]/70">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#3A5A85]">Your Entry Pass</p>
          <div className="mt-2 rounded-xl bg-[#EDF1F7] p-2">
            <div id="attendee-qr-code" className="rounded-lg bg-[#F7FAFD] p-1.5">
              <QRCodeSVG value={qrUrl} size={132} level="H" fgColor="#162E55" />
            </div>
          </div>
          <p className="mt-2 font-mono text-sm font-semibold tracking-[0.12em] text-[#162E55]">{attendee.passCode}</p>
          <p className="mt-1 text-xs text-[#5C7AA2]">Present at event entrance for check-in</p>
        </div>

        <div className="rounded-xl bg-[#F7FAFD] px-3 py-2.5 shadow-sm ring-1 ring-[#D6DEE8]/70">
          <h3 className="border-b border-[#E2E9F1] pb-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#3A5A85]">Registration Details</h3>

          <dl className="divide-y divide-[#E2E9F1] text-sm">
                <div className="flex items-center justify-between py-1.5">
                  <dt className="text-[#3A5A85]">Name</dt>
                  <dd className="font-semibold text-[#162E55]">
                    {attendee.firstName} {attendee.lastName}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <dt className="text-[#3A5A85]">Organisation</dt>
                  <dd className="font-medium text-[#162E55]">
                    {attendee.organisation}
                  </dd>
                </div>

                {attendee.subPartner && (
                  <div className="flex items-center justify-between py-1.5">
                    <dt className="text-[#3A5A85]">Sub-Partner / Area</dt>
                    <dd className="text-right text-[#162E55]">
                      {attendee.subPartner}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5">
                  <dt className="text-[#3A5A85]">Role</dt>
                  <dd className="font-semibold text-[#162E55]">
                    {attendee.role}
                  </dd>
                </div>

                <div className="flex items-center justify-between gap-2 py-1.5">
                  <dt className="shrink-0 text-[#3A5A85]">Email</dt>
                  <dd className="truncate font-mono text-[#162E55]">
                    {attendee.email}
                  </dd>
                </div>

                {attendee.phone && (
                  <div className="flex items-center justify-between py-1.5">
                    <dt className="text-[#3A5A85]">Phone</dt>
                    <dd className="text-[#162E55]">
                      {attendee.phone}
                    </dd>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5">
                  <dt className="text-[#3A5A85]">Event Dates</dt>
                  <dd className="font-semibold text-[#162E55]">
                    {EVENT_DETAILS.dates}
                  </dd>
                </div>

                <div className="flex items-center justify-between py-1.5">
                  <dt className="text-[#3A5A85]">Location</dt>
                  <dd className="text-right text-[#162E55]">
                    <span className="font-medium">{EVENT_DETAILS.location}</span>
                  </dd>
                </div>

                {/* Requirements list */}
                {(attendee.dietary || attendee.accessibility || attendee.travel) && (
                  <div className="py-1.5">
                    <dt className="text-[#3A5A85]">Special Notes</dt>
                    <dd className="mt-1 space-y-1 text-[#3A5A85]">
                      {attendee.dietary && (
                        <p>
                          <strong className="text-[#162E55]">Dietary:</strong> {attendee.dietary}
                        </p>
                      )}
                      {attendee.accessibility && (
                        <p>
                          <strong className="text-[#162E55]">Accessibility:</strong> {attendee.accessibility}
                        </p>
                      )}
                      {attendee.travel && (
                        <p>
                          <strong className="text-[#162E55]">Travel:</strong> {attendee.travel}
                        </p>
                      )}
                    </dd>
                  </div>
                )}
          </dl>
        </div>

        <button type="button" onClick={handleDownloadPass} disabled={isDownloading} className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-[#162E55] px-3 py-3 text-sm font-semibold text-[#EDF1F7] shadow-sm transition-colors hover:bg-[#112344] disabled:opacity-60">
          <span>↓</span>{isDownloading ? "Generating QR Code..." : "Download QR Code"}
        </button>
        <div className="grid grid-cols-2 gap-1.5">
          <button type="button" onClick={() => router.push("/dashboard/programme")} className="flex items-center justify-center rounded-lg bg-[#EDF1F7] px-2 py-3 text-sm font-semibold text-[#162E55] transition-colors hover:bg-[#D6DEE8]">
            View Programme
          </button>
          <button type="button" onClick={() => router.push("/dashboard")} className="flex items-center justify-center rounded-lg bg-[#EDF1F7] px-2 py-3 text-sm font-semibold text-[#162E55] transition-colors hover:bg-[#D6DEE8]">
            Open Check-In
          </button>
        </div>
        <button type="button" onClick={onRegisterAnother} className="flex w-full items-center justify-center gap-1.5 py-2 text-sm text-[#3A5A85] transition-colors hover:text-[#162E55]">
          <span>↻</span> Register next attendee
        </button>
      </div>
    </div>
  );
}
