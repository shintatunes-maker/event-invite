export type EventTheme = "birthday" | "drinking";

export type RsvpStatus = "yes" | "maybe" | "no";

// Full record as stored in the database. Includes the admin token — never
// send this shape to the public invite page.
export interface EventRecord {
  id: string;
  adminToken: string;
  theme: EventTheme;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  description: string;
  organizerName: string;
  isPaid: boolean;
  createdAt: string;
  updatedAt: string;
  // Anonymous, browser-generated ID for usage analytics. Not tied to any
  // personal information — see AnalyticsSummary.
  creatorId: string;
}

// Safe to expose to anyone with the invite link.
export type PublicEventRecord = Omit<EventRecord, "adminToken" | "creatorId">;

export interface ResponseRecord {
  id: string;
  eventId: string;
  name: string;
  status: RsvpStatus;
  comment: string;
  createdAt: string;
}

export interface RsvpCounts {
  yes: number;
  maybe: number;
  no: number;
}

export interface CreateEventInput {
  theme: EventTheme;
  title: string;
  date: string;
  time: string;
  location: string;
  description?: string;
  organizerName?: string;
  creatorId?: string;
}

export interface AnalyticsSummary {
  totalEvents: number;
  themeCounts: Record<EventTheme, number>;
  uniqueCreators: number;
  repeatCreators: number;
  repeatRate: number;
  responseCounts: RsvpCounts;
}

export interface UpdateEventInput {
  theme?: EventTheme;
  title?: string;
  date?: string;
  time?: string;
  location?: string;
  description?: string;
  organizerName?: string;
}
