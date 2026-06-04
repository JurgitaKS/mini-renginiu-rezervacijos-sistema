"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { reserveEvent } from "@/app/actions/reserve-event";
import { isActionResult } from "@/lib/action-result";
import { RESERVATION_MESSAGES } from "@/lib/reservation-messages";
import {
  getMaxSelectableSeats,
  MAX_RESERVATION_SEATS,
  MIN_RESERVATION_SEATS,
} from "@/lib/reservation-seats";

type ReserveButtonProps = {
  eventId: string;
  availableSeats: number;
  isLoggedIn: boolean;
  alreadyReserved: boolean;
};

const btnClass = "app-btn-primary w-full";

export function ReserveButton({
  eventId,
  availableSeats,
  isLoggedIn,
  alreadyReserved,
}: ReserveButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [seatsCount, setSeatsCount] = useState<number>(MIN_RESERVATION_SEATS);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const seats = Math.floor(Number(availableSeats));
  const maxSelectable = getMaxSelectableSeats(seats);
  const noSeats = maxSelectable <= 0;
  const isDisabled =
    isPending || (isLoggedIn && (alreadyReserved || noSeats));

  useEffect(() => {
    if (seatsCount > maxSelectable && maxSelectable >= MIN_RESERVATION_SEATS) {
      setSeatsCount(maxSelectable);
    }
  }, [maxSelectable, seatsCount]);

  function handleClick() {
    setFeedback(null);

    if (!isLoggedIn) {
      setFeedback({
        type: "error",
        text: RESERVATION_MESSAGES.loginRequired,
      });
      router.push("/login");
      return;
    }

    if (alreadyReserved) {
      setFeedback({
        type: "error",
        text: RESERVATION_MESSAGES.alreadyReserved,
      });
      return;
    }

    const seatsToBook = Math.floor(Number(seatsCount));

    if (
      !Number.isFinite(seatsToBook) ||
      seatsToBook < MIN_RESERVATION_SEATS ||
      seatsToBook > MAX_RESERVATION_SEATS
    ) {
      setFeedback({
        type: "error",
        text: RESERVATION_MESSAGES.tooManySeats,
      });
      return;
    }

    if (seatsToBook > maxSelectable) {
      setFeedback({
        type: "error",
        text: RESERVATION_MESSAGES.noSeats,
      });
      return;
    }

    startTransition(async () => {
      let result: unknown;

      try {
        result = await reserveEvent(eventId, seatsToBook);
      } catch {
        setFeedback({
          type: "error",
          text: "Nepavyko susisiekti su serveriu. Perkrauk puslapį ir bandyk dar kartą.",
        });
        return;
      }

      if (!isActionResult(result)) {
        setFeedback({
          type: "error",
          text: "Gautas netinkamas serverio atsakymas. Perkrauk puslapį (F5) ir bandyk dar kartą.",
        });
        return;
      }

      if (result.success) {
        setFeedback({ type: "success", text: result.message });
        router.refresh();
        return;
      }

      setFeedback({ type: "error", text: result.message });

      if (result.message === RESERVATION_MESSAGES.loginRequired) {
        router.push("/login");
      }
    });
  }

  const showSeatPicker = isLoggedIn && !alreadyReserved && !noSeats;

  return (
    <div className="mt-4 border-t border-app-border pt-4">
      {showSeatPicker && (
        <div className="mb-3">
          <label
            htmlFor={`seats-${eventId}`}
            className="text-sm font-medium text-app-text"
          >
            Vietų skaičius
          </label>
          <select
            id={`seats-${eventId}`}
            value={seatsCount}
            onChange={(e) => setSeatsCount(Number(e.target.value))}
            disabled={isPending}
            className="app-input mt-1"
          >
            {Array.from({ length: maxSelectable }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "vieta" : "vietos"}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        disabled={isDisabled && isLoggedIn}
        className={btnClass}
        aria-label="Rezervuoti renginį"
      >
        {isPending ? "Rezervuojama..." : "Rezervuoti"}
      </button>

      {isLoggedIn && alreadyReserved && !feedback && (
        <p className="mt-2 text-sm text-app-text-muted">
          {RESERVATION_MESSAGES.alreadyReserved}
        </p>
      )}

      {isLoggedIn && noSeats && !alreadyReserved && !feedback && (
        <p className="mt-2 text-sm text-app-text-muted">
          {RESERVATION_MESSAGES.noSeats}
        </p>
      )}

      {feedback && (
        <p
          role="alert"
          className={`mt-2 text-sm ${
            feedback.type === "success" ? "app-alert-success" : "app-alert-error"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}
