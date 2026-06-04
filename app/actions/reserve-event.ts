"use server";

import { revalidatePath } from "next/cache";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-result";
import {
  formatReservationDbError,
  RESERVATION_MESSAGES,
} from "@/lib/reservation-messages";
import {
  MAX_RESERVATION_SEATS,
  MIN_RESERVATION_SEATS,
} from "@/lib/reservation-seats";
import { createClient } from "@/lib/supabase/server";

function parseAvailableSeats(value: unknown): number {
  const seats = Number(value);
  return Number.isFinite(seats) ? Math.floor(seats) : 0;
}

function parseEventId(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const id = value.trim();
  return id.length > 0 ? id : null;
}

function parseSeatsInput(value: unknown): number {
  if (typeof value === "number") {
    return Math.floor(value);
  }
  if (typeof value === "string" && value.trim() !== "") {
    return Math.floor(Number(value));
  }
  return NaN;
}

export async function reserveEvent(
  eventId: unknown,
  seatsCountInput: unknown,
): Promise<ActionResult> {
  try {
    const parsedEventId = parseEventId(eventId);
    if (!parsedEventId) {
      return actionError("Netinkamas renginys.");
    }

    const rawSeats = parseSeatsInput(seatsCountInput);
    if (!Number.isFinite(rawSeats)) {
      return actionError("Pasirinkite vietų skaičių nuo 1 iki 11.");
    }

    const seatsCount = Math.floor(rawSeats);

    if (
      !Number.isFinite(seatsCount) ||
      seatsCount < MIN_RESERVATION_SEATS ||
      seatsCount > MAX_RESERVATION_SEATS
    ) {
      return actionError(RESERVATION_MESSAGES.tooManySeats);
    }

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return actionError(RESERVATION_MESSAGES.loginRequired);
    }

    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, available_seats")
      .eq("id", parsedEventId)
      .single();

    if (eventError || !event) {
      return actionError(
        formatReservationDbError(
          eventError?.message ?? RESERVATION_MESSAGES.unknown,
          eventError?.code,
        ),
      );
    }

    const availableSeats = parseAvailableSeats(event.available_seats);

    if (availableSeats < seatsCount) {
      return actionError(RESERVATION_MESSAGES.noSeats);
    }

    const { data: existing } = await supabase
      .from("reservations")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("event_id", parsedEventId)
      .maybeSingle();

    if (existing?.status === "active") {
      return actionError(RESERVATION_MESSAGES.alreadyReserved);
    }

    const newAvailableSeats = availableSeats - seatsCount;

    const { data: updatedEvent, error: updateError } = await supabase
      .from("events")
      .update({ available_seats: newAvailableSeats })
      .eq("id", parsedEventId)
      .eq("available_seats", availableSeats)
      .select("id")
      .maybeSingle();

    if (updateError) {
      return actionError(
        formatReservationDbError(updateError.message, updateError.code),
      );
    }

    if (!updatedEvent) {
      return actionError(RESERVATION_MESSAGES.noSeats);
    }

    if (existing?.status === "cancelled") {
      const { data: reactivated, error: reactivateError } = await supabase
        .from("reservations")
        .update({
          status: "active",
          seats_count: seatsCount,
          cancelled_seats: 0,
        })
        .eq("id", existing.id)
        .eq("user_id", user.id)
        .eq("status", "cancelled")
        .select("id")
        .maybeSingle();

      if (reactivateError) {
        await supabase
          .from("events")
          .update({ available_seats: availableSeats })
          .eq("id", parsedEventId);

        return actionError(
          formatReservationDbError(reactivateError.message, reactivateError.code),
        );
      }

      if (!reactivated) {
        await supabase
          .from("events")
          .update({ available_seats: availableSeats })
          .eq("id", parsedEventId);

        return actionError(RESERVATION_MESSAGES.alreadyReserved);
      }
    } else {
      const { error: insertError } = await supabase.from("reservations").insert({
        user_id: user.id,
        event_id: parsedEventId,
        status: "active",
        seats_count: seatsCount,
      });

      if (insertError) {
        await supabase
          .from("events")
          .update({ available_seats: availableSeats })
          .eq("id", parsedEventId);

        if (insertError.code === "23505") {
          return actionError(RESERVATION_MESSAGES.alreadyReserved);
        }

        const seatsHint =
          insertError.message.includes("seats_count") ||
          insertError.code === "PGRST204"
            ? " Patikrink, ar Supabase lentelėje reservations yra stulpelis seats_count."
            : "";

        return actionError(
          formatReservationDbError(insertError.message, insertError.code) +
            seatsHint,
        );
      }
    }

    revalidatePath("/events");
    revalidatePath("/my-reservations");
    revalidatePath("/dashboard");

    return actionSuccess(RESERVATION_MESSAGES.success);
  } catch (err) {
    return actionError(
      err instanceof Error ? err.message : RESERVATION_MESSAGES.unknown,
    );
  }
}
