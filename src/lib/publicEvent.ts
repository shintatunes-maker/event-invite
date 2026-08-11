import type { EventRecord, PublicEventRecord } from "./types";

export function toPublicEvent(event: EventRecord): PublicEventRecord {
  const { adminToken: _adminToken, ...publicEvent } = event;
  return publicEvent;
}
