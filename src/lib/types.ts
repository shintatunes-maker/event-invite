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
}

// Safe to expose to anyone with the invite link.
export type PublicEventRecord = Omit<EventRecord, "adminToken">;

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
