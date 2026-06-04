"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  cancelOneSeat,
  cancelReservation,
} from "@/app/actions/cancel-reservation";
import { isActionResult } from "@/lib/action-result";

type CancelReservationButtonProps = {
  reservationId: string;
  seatsCount: number;
};

const btnClass = "app-btn-secondary w-full";

type PendingAction = "one" | "full" | null;

export function CancelReservationButton({
  reservationId,
  seatsCount,
}: CancelReservationButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const canCancelOneSeat = seatsCount > 1;

  function runAction(
    action: PendingAction,
    call: () => Promise<unknown>,
  ) {
    setFeedback(null);
    setPendingAction(action);

    startTransition(async () => {
      let result: unknown;

      try {
        result = await call();
      } catch {
        setFeedback({
          type: "error",
          text: "Nepavyko susisiekti su serveriu. Bandyk dar kartą.",
        });
        setPendingAction(null);
        return;
      }

      setPendingAction(null);

      if (!isActionResult(result)) {
        setFeedback({
          type: "error",
          text: "Gautas netinkamas serverio atsakymas. Perkrauk puslapį ir bandyk dar kartą.",
        });
        return;
      }

      if (result.success) {
        setFeedback({ type: "success", text: result.message });
        router.refresh();
        return;
      }

      setFeedback({ type: "error", text: result.message });
    });
  }

  return (
    <div className="mt-4 space-y-2 border-t border-app-border pt-4">
      {canCancelOneSeat && (
        <button
          type="button"
          onClick={() => runAction("one", () => cancelOneSeat(reservationId))}
          disabled={isPending}
          className={btnClass}
        >
          {pendingAction === "one" ? "Atšaukiama..." : "Atšaukti 1 vietą"}
        </button>
      )}

      <button
        type="button"
        onClick={() =>
          runAction("full", () => cancelReservation(reservationId))
        }
        disabled={isPending}
        className={btnClass}
      >
        {pendingAction === "full"
          ? "Atšaukiama..."
          : "Atšaukti visą rezervaciją"}
      </button>

      {feedback && (
        <p
          role="alert"
          className={`text-sm ${
            feedback.type === "success" ? "app-alert-success" : "app-alert-error"
          }`}
        >
          {feedback.text}
        </p>
      )}
    </div>
  );
}
