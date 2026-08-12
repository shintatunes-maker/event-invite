import type { EventRecord, PublicEventRecord } from "./types";

export function toPublicEvent(event: EventRecord): PublicEventRecord {
  const { adminToken: _adminToken, creatorId: _creatorId, ...publicEvent } =
    event;
  return publicEvent;
}
