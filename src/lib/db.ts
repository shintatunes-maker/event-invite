import { randomBytes } from "crypto";
import { createClient } from "@libsql/client";
import { mkdirSync } from "fs";
import path from "path";
import type {
  CreateEventInput,
  EventRecord,
  EventTheme,
  ResponseRecord,
  RsvpCounts,
  RsvpStatus,
  UpdateEventInput,
} from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_DB_URL = `file:${path.join(DATA_DIR, "app.db")}`;

// In production, set TURSO_DATABASE_URL / TURSO_AUTH_TOKEN to point at a
// remote libSQL (Turso) database — serverless hosts don't persist local
// files between invocations. Falling back to a local file keeps `npm run
// dev` working with zero setup.
const url = process.env.TURSO_DATABASE_URL || LOCAL_DB_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!process.env.TURSO_DATABASE_URL) {
  mkdirSync(DATA_DIR, { recursive: true });
}

const db = createClient(authToken ? { url, authToken } : { url });

let ready: Promise<void> | null = null;

function init(): Promise<void> {
  if (!ready) {
    ready = (async () => {
      await db.execute(`
        CREATE TABLE IF NOT EXISTS events (
          id TEXT PRIMARY KEY,
          admin_token TEXT NOT NULL,
          theme TEXT NOT NULL,
          title TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          location TEXT NOT NULL,
          description TEXT NOT NULL DEFAULT '',
          organizer_name TEXT NOT NULL DEFAULT '',
          is_paid INTEGER NOT NULL DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
      await db.execute(`
        CREATE TABLE IF NOT EXISTS responses (
          id TEXT PRIMARY KEY,
          event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
          name TEXT NOT NULL,
          status TEXT NOT NULL,
          comment TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL
        );
      `);
      await db.execute(
        "CREATE INDEX IF NOT EXISTS idx_responses_event_id ON responses(event_id);",
      );
    })();
  }
  return ready;
}

function generateId(): string {
  return randomBytes(6).toString("base64url");
}

function generateAdminToken(): string {
  return randomBytes(18).toString("base64url");
}

interface EventRow {
  id: string;
  admin_token: string;
  theme: string;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  organizer_name: string;
  is_paid: number;
  created_at: string;
  updated_at: string;
}

interface ResponseRow {
  id: string;
  event_id: string;
  name: string;
  status: string;
  comment: string;
  created_at: string;
}

function rowToEvent(row: EventRow): EventRecord {
  return {
    id: row.id,
    adminToken: row.admin_token,
    theme: row.theme as EventTheme,
    title: row.title,
    date: row.date,
    time: row.time,
    location: row.location,
    description: row.description,
    organizerName: row.organizer_name,
    isPaid: Number(row.is_paid) === 1,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToResponse(row: ResponseRow): ResponseRecord {
  return {
    id: row.id,
    eventId: row.event_id,
    name: row.name,
    status: row.status as RsvpStatus,
    comment: row.comment,
    createdAt: row.created_at,
  };
}

export async function createEvent(
  input: CreateEventInput,
): Promise<EventRecord> {
  await init();
  const now = new Date().toISOString();
  const row: EventRow = {
    id: generateId(),
    admin_token: generateAdminToken(),
    theme: input.theme,
    title: input.title,
    date: input.date,
    time: input.time,
    location: input.location,
    description: input.description ?? "",
    organizer_name: input.organizerName ?? "",
    is_paid: 0,
    created_at: now,
    updated_at: now,
  };

  await db.execute({
    sql: `INSERT INTO events
      (id, admin_token, theme, title, date, time, location, description, organizer_name, is_paid, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      row.id,
      row.admin_token,
      row.theme,
      row.title,
      row.date,
      row.time,
      row.location,
      row.description,
      row.organizer_name,
      row.is_paid,
      row.created_at,
      row.updated_at,
    ],
  });

  return rowToEvent(row);
}

export async function getEvent(id: string): Promise<EventRecord | undefined> {
  await init();
  const result = await db.execute({
    sql: "SELECT * FROM events WHERE id = ?",
    args: [id],
  });
  const row = result.rows[0] as unknown as EventRow | undefined;
  return row ? rowToEvent(row) : undefined;
}

export async function updateEvent(
  id: string,
  patch: UpdateEventInput,
): Promise<EventRecord | undefined> {
  await init();
  const existing = await getEvent(id);
  if (!existing) return undefined;

  const merged = {
    theme: patch.theme ?? existing.theme,
    title: patch.title ?? existing.title,
    date: patch.date ?? existing.date,
    time: patch.time ?? existing.time,
    location: patch.location ?? existing.location,
    description: patch.description ?? existing.description,
    organizer_name: patch.organizerName ?? existing.organizerName,
  };
  const updatedAt = new Date().toISOString();

  await db.execute({
    sql: `UPDATE events SET
      theme = ?, title = ?, date = ?, time = ?, location = ?,
      description = ?, organizer_name = ?, updated_at = ?
     WHERE id = ?`,
    args: [
      merged.theme,
      merged.title,
      merged.date,
      merged.time,
      merged.location,
      merged.description,
      merged.organizer_name,
      updatedAt,
      id,
    ],
  });

  return getEvent(id);
}

export async function setEventPaidStatus(
  id: string,
  isPaid: boolean,
): Promise<EventRecord | undefined> {
  await init();
  const updatedAt = new Date().toISOString();
  await db.execute({
    sql: "UPDATE events SET is_paid = ?, updated_at = ? WHERE id = ?",
    args: [isPaid ? 1 : 0, updatedAt, id],
  });
  return getEvent(id);
}

export async function deleteEvent(id: string): Promise<boolean> {
  await init();
  const result = await db.execute({
    sql: "DELETE FROM events WHERE id = ?",
    args: [id],
  });
  await db.execute({
    sql: "DELETE FROM responses WHERE event_id = ?",
    args: [id],
  });
  return result.rowsAffected > 0;
}

export async function getResponses(
  eventId: string,
): Promise<ResponseRecord[]> {
  await init();
  const result = await db.execute({
    sql: "SELECT * FROM responses WHERE event_id = ? ORDER BY created_at DESC",
    args: [eventId],
  });
  return (result.rows as unknown as ResponseRow[]).map(rowToResponse);
}

export async function addResponse(
  eventId: string,
  name: string,
  status: RsvpStatus,
  comment = "",
): Promise<{ response: ResponseRecord; counts: RsvpCounts }> {
  await init();
  const event = await getEvent(eventId);
  if (!event) {
    throw new Error("EVENT_NOT_FOUND");
  }

  const row: ResponseRow = {
    id: generateId(),
    event_id: eventId,
    name,
    status,
    comment,
    created_at: new Date().toISOString(),
  };

  await db.execute({
    sql: `INSERT INTO responses (id, event_id, name, status, comment, created_at)
     VALUES (?, ?, ?, ?, ?, ?)`,
    args: [
      row.id,
      row.event_id,
      row.name,
      row.status,
      row.comment,
      row.created_at,
    ],
  });

  const counts = await getCounts(eventId);
  return { response: rowToResponse(row), counts };
}

export function countResponses(responses: ResponseRecord[]): RsvpCounts {
  const counts: RsvpCounts = { yes: 0, maybe: 0, no: 0 };
  for (const r of responses) {
    counts[r.status] += 1;
  }
  return counts;
}

export async function getCounts(eventId: string): Promise<RsvpCounts> {
  const responses = await getResponses(eventId);
  return countResponses(responses);
}
