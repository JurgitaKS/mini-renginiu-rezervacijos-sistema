export type EventStatus = "active" | "cancelled";

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  active: "Aktyvus",
  cancelled: "Atšauktas",
};

export const EVENT_CANCELLED_MESSAGE = "Renginys atšauktas";

export const EVENT_DELETE_HAS_RESERVATIONS_MESSAGE =
  "Negalima ištrinti renginio, nes jis turi rezervacijų.";

export const EVENT_DELETE_CONFIRM_MESSAGE =
  "Ar tikrai norite ištrinti šį renginį?";

export function normalizeEventStatus(
  status: string | null | undefined,
): EventStatus {
  return status === "cancelled" ? "cancelled" : "active";
}

export function isEventCancelled(status: string | null | undefined): boolean {
  return normalizeEventStatus(status) === "cancelled";
}
