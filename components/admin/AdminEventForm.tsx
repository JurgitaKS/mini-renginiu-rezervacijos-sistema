"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { ActionResult } from "@/lib/action-result";
import type { Event } from "@/types";
import { EventForm } from "./EventForm";

type AdminEventFormProps = {
  action: (
    prevState: ActionResult | null,
    formData: FormData,
  ) => Promise<ActionResult>;
  submitLabel: string;
  event?: Event;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function AdminEventForm({
  action,
  submitLabel,
  event,
  onSuccess,
  onCancel,
}: AdminEventFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      onSuccess?.();
    }
  }, [state, router, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      <EventForm event={event} />

      <div className="flex flex-wrap gap-2">
        <button type="submit" disabled={isPending} className="app-btn-primary">
          {isPending ? "Saugoma..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="app-btn-secondary"
          >
            Uždaryti
          </button>
        )}
      </div>

      {state && (
        <p
          role="alert"
          className={
            state.success ? "app-alert-success text-sm" : "app-alert-error text-sm"
          }
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
