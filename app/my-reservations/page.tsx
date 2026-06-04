import Link from "next/link";
import { redirect } from "next/navigation";
import { CopyAllReservationsButton } from "@/components/reservations/CopyAllReservationsButton";
import { ReservationCard } from "@/components/reservations/ReservationCard";
import { PageHeader } from "@/components/ui/PageHeader";
import { AlertError } from "@/components/ui/Alert";
import { createClient } from "@/lib/supabase/server";
import {
  parseActiveSeatsDisplay,
  parseCancelledSeats,
  parseSeatsCount,
} from "@/lib/reservation-seats";
import type { Event, Reservation, ReservationWithEvent } from "@/types";

export const dynamic = "force-dynamic";

type ReservationQueryRow = Reservation & {
  events: Event | Event[] | null;
};

function getEventFromRow(row: ReservationQueryRow): Event | null {
  const eventData = row.events;
  return Array.isArray(eventData) ? (eventData[0] ?? null) : eventData;
}

function toReservation(row: ReservationQueryRow): Reservation {
  return {
    id: row.id,
    user_id: row.user_id,
    event_id: row.event_id,
    status: row.status,
    seats_count:
      row.status === "active"
        ? parseSeatsCount(row.seats_count)
        : parseActiveSeatsDisplay(row.seats_count),
    cancelled_seats: parseCancelledSeats(row.cancelled_seats),
    created_at: row.created_at,
  };
}

function normalizeReservation(row: ReservationQueryRow): ReservationWithEvent | null {
  const event = getEventFromRow(row);
  if (!event) {
    return null;
  }

  return {
    ...toReservation(row),
    events: event,
  };
}

export default async function MyReservationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data, error } = await supabase
    .from("reservations")
    .select(
      `
      id,
      user_id,
      event_id,
      status,
      seats_count,
      cancelled_seats,
      created_at,
      events (
        id,
        title,
        description,
        event_date,
        event_time,
        location,
        category,
        price,
        total_seats,
        available_seats,
        created_at
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <section className="space-y-4">
        <PageHeader title="Mano rezervacijos">
          <AlertError>
            <strong>Klaida:</strong> Nepavyko užkrauti rezervacijų. {error.message}
          </AlertError>
        </PageHeader>
      </section>
    );
  }

  const reservations = (data ?? [])
    .map((row) => normalizeReservation(row as ReservationQueryRow))
    .filter((item): item is ReservationWithEvent => item !== null);

  const rowsWithMissingEvent = (data ?? []).filter(
    (row) => !getEventFromRow(row as ReservationQueryRow),
  );

  const copyItems = [
    ...reservations.map((item) => ({
      reservation: item,
      event: item.events,
    })),
    ...rowsWithMissingEvent.map((row) => ({
      reservation: toReservation(row as ReservationQueryRow),
      event: null as Event | null,
    })),
  ];

  return (
    <section className="space-y-4">
      <PageHeader title="Mano rezervacijos">
        <p className="page-subtitle">
          Prisijungta kaip{" "}
          <span className="font-medium text-app-text">{user.email}</span>
        </p>
        {copyItems.length > 0 && (
          <div className="mt-4">
            <CopyAllReservationsButton items={copyItems} />
          </div>
        )}
      </PageHeader>

      {copyItems.length === 0 ? (
        <div className="app-card text-center">
          <p className="text-lg font-medium text-app-text">
            Rezervacijų dar nėra
          </p>
          <p className="mt-2 text-sm text-app-text-muted">
            Užsisakyk renginį skiltyje{" "}
            <Link href="/events" className="app-link">
              Renginiai
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {reservations.map((item) => (
            <li key={item.id}>
              <ReservationCard reservation={item} event={item.events} />
            </li>
          ))}
          {rowsWithMissingEvent.map((row) => {
            const reservation = toReservation(row as ReservationQueryRow);
            return (
              <li key={reservation.id}>
                <ReservationCard reservation={reservation} event={null} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
