import { formatEventDateTime, formatTimestamp } from "@/lib/format-datetime";
import { formatPrice } from "@/lib/format-price";
import { getReservationStatusLabel } from "@/lib/reservation-status";
import {
  parseActiveSeatsDisplay,
  parseCancelledSeats,
} from "@/lib/reservation-seats";
import type { Event, Reservation } from "@/types";
import { CancelReservationButton } from "./CancelReservationButton";
import { CopyReservationButton } from "./CopyReservationButton";

type ReservationCardProps = {
  reservation: Reservation;
  event: Event | null;
};

function formatSeatsLine(count: number): string {
  return count === 1 ? "1 vieta" : `${count} vietos`;
}

export function ReservationCard({ reservation, event }: ReservationCardProps) {
  const statusLabel = getReservationStatusLabel(reservation.status);
  const isActive = reservation.status === "active";
  const activeSeats = parseActiveSeatsDisplay(reservation.seats_count);
  const cancelledSeats = parseCancelledSeats(reservation.cancelled_seats);

  return (
    <article className="app-content-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold">
          {event?.title ?? "Renginys nerastas"}
        </h2>
        <span
          className={`rounded-lg px-2 py-1 text-xs font-medium ${
            isActive
              ? "bg-app-nav-active-bg text-app-nav-active-text"
              : "bg-app-card text-app-text-muted"
          }`}
        >
          {statusLabel}
        </span>
      </div>

      {event ? (
        <ul className="mt-3 flex-1 space-y-1 text-sm text-app-text">
          <li>
            <span className="text-app-text-muted">Kategorija: </span>
            {event.category}
          </li>
          <li>
            <span className="text-app-text-muted">Data: </span>
            {formatEventDateTime(event.event_date, event.event_time)}
          </li>
          <li>
            <span className="text-app-text-muted">Vieta: </span>
            {event.location}
          </li>
          <li>
            <span className="text-app-text-muted">Kaina: </span>
            {formatPrice(event.price)}
          </li>
          <li>
            <span className="text-app-text-muted">Aktyvios vietos: </span>
            {isActive
              ? formatSeatsLine(activeSeats)
              : activeSeats > 0
                ? formatSeatsLine(activeSeats)
                : "0 vietų"}
          </li>
          {cancelledSeats > 0 && (
            <li>
              <span className="text-app-text-muted">Atšauktos vietos: </span>
              {formatSeatsLine(cancelledSeats)}
            </li>
          )}
        </ul>
      ) : (
        <p className="mt-3 text-sm text-app-text-muted">
          Susijusio renginio duomenų nepavyko užkrauti.
        </p>
      )}

      <p className="mt-3 text-xs text-app-text-muted">
        Rezervuota: {formatTimestamp(reservation.created_at)}
      </p>

      <CopyReservationButton reservation={reservation} event={event} />

      {isActive && activeSeats > 0 && (
        <CancelReservationButton
          reservationId={reservation.id}
          seatsCount={activeSeats}
        />
      )}
    </article>
  );
}
