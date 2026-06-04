"use client";

import { formatEventDateTime } from "@/lib/format-datetime";
import { formatPrice } from "@/lib/format-price";
import type { Event } from "@/types";
import { ReserveButton } from "./ReserveButton";

export type EventCardProps = {
  event: Event;
  isLoggedIn: boolean;
  alreadyReserved: boolean;
};

export function EventCard({
  event,
  isLoggedIn,
  alreadyReserved,
}: EventCardProps) {
  const availableSeats = Number(event.available_seats);

  return (
    <article className="app-content-card">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold">{event.title}</h2>
        <span className="rounded-lg bg-app-card px-2 py-1 text-xs font-medium text-app-text-muted">
          {event.category}
        </span>
      </div>
      {event.description && (
        <p className="mt-2 text-sm text-app-text-muted">{event.description}</p>
      )}
      <ul className="mt-3 flex-1 space-y-1 text-sm text-app-text">
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
          <span className="text-app-text-muted">Laisvos vietos: </span>
          {availableSeats} / {event.total_seats}
        </li>
      </ul>

      <ReserveButton
        eventId={event.id}
        availableSeats={availableSeats}
        isLoggedIn={isLoggedIn}
        alreadyReserved={alreadyReserved}
      />
    </article>
  );
}
