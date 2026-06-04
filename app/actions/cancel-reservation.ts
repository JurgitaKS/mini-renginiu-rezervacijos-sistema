"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import {
  formatReservationDbError,
  RESERVATION_MESSAGES,
} from "@/lib/reservation-messages";
import {
  MIN_RESERVATION_SEATS,
  parseCancelledSeats,
  parseSeatsCount,
} from "@/lib/reservation-seats";
import { createClient } from "@/lib/supabase/server";

function parseSeats(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

function parseReservationId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const id = value.trim();
  return id.length > 0 ? id : null;
}

async function restoreEventSeats(
  supabase: Awaited<ReturnType<typeof createClient>>,
  eventId: string,
  seatsToRestore: number,
): Promise<ActionResult | null> {
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, available_seats, total_seats")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return actionError(RESERVATION_MESSAGES.cancelFailed);
  }

  const currentSeats = parseSeats(event.available_seats);
  const totalSeats = parseSeats(event.total_seats);
  const newSeats = Math.min(totalSeats, currentSeats + seatsToRestore);

  const { data: updatedEvent, error: seatsError } = await supabase
    .from("events")
    .update({ available_seats: newSeats })
    .eq("id", eventId)
    .eq("available_seats", currentSeats)
    .select("id")
    .maybeSingle();

  if (seatsError) {
    return actionError(
      formatReservationDbError(seatsError.message, seatsError.code, "cancel"),
    );
  }

  if (!updatedEvent) {
    return actionError(RESERVATION_MESSAGES.rlsUpdateBlocked);
  }

  return null;
}

function revalidateReservationPaths() {
  revalidatePath("/my-reservations");
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

export async function cancelOneSeat(
  reservationIdInput: unknown,
): Promise<ActionResult> {
  try {
    const reservationId = parseReservationId(reservationIdInput);
    if (!reservationId) {
      return actionError(RESERVATION_MESSAGES.cancelOneSeatFailed);
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return actionError(RESERVATION_MESSAGES.cancelOneSeatFailed);
    }

    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("id, user_id, event_id, status, seats_count, cancelled_seats")
      .eq("id", reservationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError || !reservation) {
      return actionError(RESERVATION_MESSAGES.cancelOneSeatFailed);
    }

    if (reservation.status !== "active") {
      return actionError(RESERVATION_MESSAGES.alreadyCancelled);
    }

    const seatsCount = parseSeatsCount(reservation.seats_count);
    const cancelledSeats = parseCancelledSeats(reservation.cancelled_seats);

    if (seatsCount <= MIN_RESERVATION_SEATS) {
      return actionError(RESERVATION_MESSAGES.cancelOneSeatFailed);
    }

    const newSeatsCount = seatsCount - 1;
    const newCancelledSeats = cancelledSeats + 1;

    const { data: updatedReservation, error: seatsUpdateError } = await supabase
      .from("reservations")
      .update({
        seats_count: newSeatsCount,
        cancelled_seats: newCancelledSeats,
      })
      .eq("id", reservationId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("seats_count", seatsCount)
      .eq("cancelled_seats", cancelledSeats)
      .select("id, event_id")
      .maybeSingle();

    if (seatsUpdateError) {
      return actionError(
        formatReservationDbError(
          seatsUpdateError.message,
          seatsUpdateError.code,
          "cancel",
        ),
      );
    }

    if (!updatedReservation) {
      return actionError(RESERVATION_MESSAGES.alreadyCancelled);
    }

    const eventRestoreError = await restoreEventSeats(
      supabase,
      reservation.event_id,
      1,
    );

    if (eventRestoreError) {
      await supabase
        .from("reservations")
        .update({
          seats_count: seatsCount,
          cancelled_seats: cancelledSeats,
        })
        .eq("id", reservationId)
        .eq("user_id", user.id)
        .eq("status", "active");

      return eventRestoreError;
    }

    revalidateReservationPaths();

    return actionSuccess(RESERVATION_MESSAGES.cancelOneSeatSuccess);
  } catch (err) {
    return actionError(
      err instanceof Error
        ? err.message
        : RESERVATION_MESSAGES.cancelOneSeatFailed,
    );
  }
}

export async function cancelReservation(
  reservationIdInput: unknown,
): Promise<ActionResult> {
  try {
    const reservationId = parseReservationId(reservationIdInput);
    if (!reservationId) {
      return actionError(RESERVATION_MESSAGES.cancelFailed);
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return actionError(RESERVATION_MESSAGES.cancelFailed);
    }

    const { data: reservation, error: fetchError } = await supabase
      .from("reservations")
      .select("id, user_id, event_id, status, seats_count, cancelled_seats")
      .eq("id", reservationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (fetchError || !reservation) {
      return actionError(RESERVATION_MESSAGES.cancelFailed);
    }

    if (reservation.status !== "active") {
      return actionError(RESERVATION_MESSAGES.alreadyCancelled);
    }

    const seatsToRestore = parseSeatsCount(reservation.seats_count);
    const cancelledSeats = parseCancelledSeats(reservation.cancelled_seats);
    const newCancelledSeats = cancelledSeats + seatsToRestore;

    const { data: cancelledRow, error: cancelError } = await supabase
      .from("reservations")
      .update({
        status: "cancelled",
        seats_count: 0,
        cancelled_seats: newCancelledSeats,
      })
      .eq("id", reservationId)
      .eq("user_id", user.id)
      .eq("status", "active")
      .eq("seats_count", seatsToRestore)
      .eq("cancelled_seats", cancelledSeats)
      .select("id, event_id")
      .maybeSingle();

    if (cancelError) {
      return actionError(
        formatReservationDbError(cancelError.message, cancelError.code, "cancel"),
      );
    }

    if (!cancelledRow) {
      return actionError(RESERVATION_MESSAGES.alreadyCancelled);
    }

    const eventRestoreError = await restoreEventSeats(
      supabase,
      reservation.event_id,
      seatsToRestore,
    );

    if (eventRestoreError) {
      await supabase
        .from("reservations")
        .update({
          status: "active",
          seats_count: seatsToRestore,
          cancelled_seats: cancelledSeats,
        })
        .eq("id", reservationId)
        .eq("user_id", user.id);

      return eventRestoreError;
    }

    revalidateReservationPaths();

    return actionSuccess(RESERVATION_MESSAGES.cancelSuccess);
  } catch (err) {
    return actionError(
      err instanceof Error ? err.message : RESERVATION_MESSAGES.cancelFailed,
    );
  }
}
