"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  cancelEvent,
  deleteEvent,
  restoreEvent,
  updateEvent,
} from "@/app/admin/actions";
import { formatEventDateTime } from "@/lib/format-datetime";
import { formatPrice } from "@/lib/format-price";
import {
  EVENT_DELETE_CONFIRM_MESSAGE,
  EVENT_STATUS_LABELS,
  isEventCancelled,
  normalizeEventStatus,
} from "@/lib/event-status";
import type { Event } from "@/types";
import { AdminEventForm } from "./AdminEventForm";

type AdminEventListProps = {
  events: Event[];
  isAdmin?: boolean;
};

export function AdminEventList({ events }: AdminEventListProps) {
  const router = useRouter();
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  function runAction(action: () => Promise<{ success: boolean; message: string }>) {
    setActionMessage(null);
    startTransition(async () => {
      const result = await action();
      setActionMessage({
        type: result.success ? "success" : "error",
        text: result.message,
      });
      if (result.success) {
        setEditingEventId(null);
        router.refresh();
      }
    });
  }

  if (events.length === 0) {
    return (
      <div className="app-card">
        <p className="text-app-text-muted">Renginių dar nėra.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {actionMessage && (
        <p
          role="alert"
          className={
            actionMessage.type === "success"
              ? "app-alert-success rounded-lg px-3 py-2 text-sm"
              : "app-alert-error rounded-lg px-3 py-2 text-sm"
          }
        >
          {actionMessage.text}
        </p>
      )}

      {events.map((event) => {
        const status = normalizeEventStatus(event.status);
        const cancelled = isEventCancelled(status);
        const isEditing = editingEventId === event.id;

        return (
          <article key={event.id} className="app-content-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <span
                    className={`rounded-lg px-2 py-0.5 text-xs font-medium ${
                      cancelled
                        ? "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-200"
                        : "bg-app-card text-app-text-muted"
                    }`}
                  >
                    {EVENT_STATUS_LABELS[status]}
                  </span>
                </div>
                <p className="text-sm text-app-text-muted">{event.category}</p>
              </div>

              {!isEditing && (
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActionMessage(null);
                      setEditingEventId(event.id);
                    }}
                    className="app-btn-secondary"
                  >
                    Redaguoti
                  </button>

                  {!cancelled && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => runAction(() => cancelEvent(event.id))}
                      className="app-btn-secondary"
                    >
                      Atšaukti renginį
                    </button>
                  )}

                  {cancelled && (
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => runAction(() => restoreEvent(event.id))}
                      className="app-btn-secondary"
                    >
                      Atkurti renginį
                    </button>
                  )}

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      if (!window.confirm(EVENT_DELETE_CONFIRM_MESSAGE)) {
                        return;
                      }
                      runAction(() => deleteEvent(event.id));
                    }}
                    className="app-btn-secondary text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Ištrinti
                  </button>
                </div>
              )}
            </div>

            {!isEditing && (
              <>
                <div className="mt-4 grid gap-2 text-sm text-app-text-muted sm:grid-cols-2">
                  <div>
                    <strong className="text-app-text">Data ir laikas:</strong>{" "}
                    {formatEventDateTime(event.event_date, event.event_time)}
                  </div>
                  <div>
                    <strong className="text-app-text">Vieta:</strong> {event.location}
                  </div>
                  <div>
                    <strong className="text-app-text">Kaina:</strong>{" "}
                    {formatPrice(event.price)}
                  </div>
                  <div>
                    <strong className="text-app-text">Vietos:</strong>{" "}
                    {event.available_seats} / {event.total_seats} laisvos
                  </div>
                </div>

                {event.description && (
                  <p className="mt-3 text-sm text-app-text-muted">{event.description}</p>
                )}
              </>
            )}

            {isEditing && (
              <div className="mt-4 border-t border-app-border pt-4">
                <h4 className="mb-3 text-sm font-semibold text-app-text">
                  Redaguoti renginį
                </h4>
                <AdminEventForm
                  event={event}
                  action={updateEvent}
                  submitLabel="Išsaugoti pakeitimus"
                  onSuccess={() => setEditingEventId(null)}
                  onCancel={() => setEditingEventId(null)}
                  isAdmin={true}
                />
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
