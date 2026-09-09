export interface AttendeeRegistration {
  id: string;
  passCode: string;
  firstName: string;
  lastName: string;
  organisation: string;
  subPartner?: string;
  role: string;
  email: string;
  phone?: string;
  dietary?: string;
  accessibility?: string;
  travel?: string;
  consentAgreed: boolean;
  registeredAt: string;
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  organisation?: string;
  role?: string;
  email?: string;
  phone?: string;
  consentAgreed?: string;
}

export const ROLE_OPTIONS = [
  "Partner",
  "OAK Staff",
  "Coordination Team",
  "Speaker",
  "Panelist",
  "Observer / Guest",
] as const;

export const EVENT_DETAILS = {
  title: "Partner Convening 2026",
  organization: "OAK Foundation",
  location: "Harare, Zimbabwe",
  venue: "Cresta Lodge, Msasa",
  dates: "9–11 March 2026",
  stats: {
    attendees: "110+",
    sessions: "24",
    partners: "38",
  },
};
