import { formatEventDateTime, formatTimestamp } from "@/lib/format-datetime";
import { formatPrice } from "@/lib/format-price";
import { getReservationStatusLabel } from "@/lib/reservation-status";
import {
  parseActiveSeatsDisplay,
  parseCancelledSeats,
} from "@/lib/reservation-seats";
import type { Event, Reservation } from "@/types";

function formatSeatsLabel(count: number): string {
  return count === 1 ? "1 vieta" : `${count} vietos`;
}

export function formatReservationForCopy(
  reservation: Reservation,
  event: Event | null,
): string {
  const activeSeats = parseActiveSeatsDisplay(reservation.seats_count);
  const cancelledSeats = parseCancelledSeats(reservation.cancelled_seats);
  const lines = [
    "=== Rezervacija ===",
    `Renginys: ${event?.title ?? "Renginys nerastas"}`,
    `Būsena: ${getReservationStatusLabel(reservation.status)}`,
  ];

  if (event) {
    lines.push(
      `Kategorija: ${event.category}`,
      `Data: ${formatEventDateTime(event.event_date, event.event_time)}`,
      `Vieta: ${event.location}`,
      `Kaina: ${formatPrice(event.price)}`,
    );
  }

  lines.push(`Aktyvios vietos: ${formatSeatsLabel(activeSeats)}`);

  if (cancelledSeats > 0) {
    lines.push(`Atšauktos vietos: ${formatSeatsLabel(cancelledSeats)}`);
  }

  lines.push(
    `Rezervacijos ID: ${reservation.id}`,
    `Rezervuota: ${formatTimestamp(reservation.created_at)}`,
  );

  return lines.join("\n");
}

export function formatAllReservationsForCopy(
  items: { reservation: Reservation; event: Event | null }[],
): string {
  if (items.length === 0) {
    return "Rezervacijų nėra.";
  }

  return items
    .map((item, index) => {
      const block = formatReservationForCopy(item.reservation, item.event);
      return index === 0 ? block : `\n\n${block}`;
    })
    .join("");
}
