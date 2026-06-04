"use client";

import { useState } from "react";
import { formatAllReservationsForCopy } from "@/lib/format-reservation";
import type { Event, Reservation } from "@/types";

type CopyAllReservationsButtonProps = {
  items: { reservation: Reservation; event: Event | null }[];
};

export function CopyAllReservationsButton({
  items,
}: CopyAllReservationsButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleCopy() {
    const text = formatAllReservationsForCopy(items);

    try {
      await navigator.clipboard.writeText(text);
      setFeedback("Visos rezervacijos nukopijuotos!");
      setTimeout(() => setFeedback(null), 2500);
    } catch {
      setFeedback("Nepavyko nukopijuoti");
      setTimeout(() => setFeedback(null), 2500);
    }
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={handleCopy}
        className="app-btn-secondary"
      >
        Kopijuoti visas rezervacijas
      </button>
      {feedback && <p className="text-sm text-app-text-muted">{feedback}</p>}
    </div>
  );
}
