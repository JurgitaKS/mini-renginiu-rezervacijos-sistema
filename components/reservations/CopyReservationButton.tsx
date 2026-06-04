"use client";

import { useState } from "react";
import { formatReservationForCopy } from "@/lib/format-reservation";
import type { Event, Reservation } from "@/types";

type CopyReservationButtonProps = {
  reservation: Reservation;
  event: Event | null;
};

export function CopyReservationButton({
  reservation,
  event,
}: CopyReservationButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleCopy() {
    const text = formatReservationForCopy(reservation, event);

    try {
      await navigator.clipboard.writeText(text);
      setFeedback("Nukopijuota!");
      setTimeout(() => setFeedback(null), 2000);
    } catch {
      setFeedback("Nepavyko nukopijuoti");
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={handleCopy}
        className="app-btn-secondary w-full"
      >
        Kopijuoti rezervaciją
      </button>
      {feedback && (
        <p className="app-alert-success mt-2 text-center">{feedback}</p>
      )}
    </div>
  );
}
