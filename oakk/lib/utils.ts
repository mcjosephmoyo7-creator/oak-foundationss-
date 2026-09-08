import { AttendeeRegistration } from "./types";

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
