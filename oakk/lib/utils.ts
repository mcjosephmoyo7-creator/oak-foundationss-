import { AttendeeRegistration } from "./types";
import { generateQRMatrix, type QRECCLevel } from "./qrcode";

/**
 * Draws a scannable QR code directly onto a canvas context.
 * Drawing module-by-module (instead of rasterizing an SVG) produces a crisp,
 * high-contrast QR that scans reliably from screens or print.
 */
export function drawQRToContext(
  ctx: CanvasRenderingContext2D,
  value: string,
  x: number,
  y: number,
  size: number,
  opts: {
    level?: QRECCLevel;
    fgColor?: string;
    bgColor?: string;
    quietZoneModules?: number;
  } = {}
): boolean {
  const {
    level = "H",
    fgColor = "#162E55",
    bgColor = "#F7FAFD",
    quietZoneModules = 4,
  } = opts;

  const matrix = generateQRMatrix(value, level);
  if (!matrix.length) return false;

  const matrixSize = matrix.length;
  const cellPx = size / (matrixSize + quietZoneModules * 2);

  ctx.fillStyle = bgColor;
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = fgColor;
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (matrix[r][c]) {
        ctx.fillRect(
          Math.round(x + (c + quietZoneModules) * cellPx),
          Math.round(y + (r + quietZoneModules) * cellPx),
          Math.ceil(cellPx),
          Math.ceil(cellPx)
        );
      }
    }
  }
  return true;
}

/**
 * Generates a unique OAK pass code matching the Figma design format:
 * e.g., OAK-2026-7842-XKPH
 */
export function generatePassCode(): string {
  const digits = Math.floor(1000 + Math.random() * 9000);
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `OAK-2026-${digits}-${suffix}`;
}

export function getPassQRUrl(passCode: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
  return `${base}/success?code=${encodeURIComponent(passCode)}`;
}

const STORAGE_KEY_CURRENT = "oak_convening_current_attendee";
const STORAGE_KEY_ALL = "oak_convening_all_attendees";

export function saveAttendeeToStorage(attendee: AttendeeRegistration): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(attendee));
    const existing = getStoredAttendees();
    const filtered = existing.filter((a) => a.id !== attendee.id);
    localStorage.setItem(STORAGE_KEY_ALL, JSON.stringify([attendee, ...filtered]));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

export function getCurrentAttendee(): AttendeeRegistration | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getStoredAttendees(): AttendeeRegistration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ALL);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearCurrentAttendee(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY_CURRENT);
}
