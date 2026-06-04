import type { ReservationStatus } from "@/types";

const STATUS_LABELS: Record<ReservationStatus, string> = {
  active: "Aktyvi",
  cancelled: "Atšaukta",
};

export function getReservationStatusLabel(status: string): string {
  if (status === "active" || status === "cancelled") {
    return STATUS_LABELS[status];
  }
  return status;
}
