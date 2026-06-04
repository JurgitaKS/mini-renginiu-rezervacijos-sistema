"use client";

import { useRef, useState } from "react";
import type { Event } from "@/types";

type EventFormProps = {
  event?: Event;
  isAdmin?: boolean;
};

export function EventForm({ event, isAdmin }: EventFormProps) {
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const categoryRef = useRef<HTMLInputElement | null>(null);
  const locationRef = useRef<HTMLInputElement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    const title = titleRef.current?.value?.trim() ?? "";
    if (!title) {
      setError("Pirmiausia įveskite renginio pavadinimą.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-event-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category: categoryRef.current?.value ?? "",
          location: locationRef.current?.value ?? "",
          event_date: dateRef.current?.value ?? "",
          event_time: timeRef.current?.value ?? "",
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ?? "AI aprašymo sugeneruoti nepavyko.");
        return;
      }

      const data = await res.json();
      if (data?.description && descRef.current) {
        descRef.current.value = data.description;
      }
    } catch (err) {
      setError("AI aprašymo sugeneruoti nepavyko.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {event?.id && <input type="hidden" name="eventId" value={event.id} />}

      <div>
        <label className="block text-sm font-semibold text-app-text" htmlFor="title">
          Pavadinimas
        </label>
        <input
          id="title"
          name="title"
          type="text"
          ref={titleRef}
          required
          defaultValue={event?.title ?? ""}
          className="app-input"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label
            className="block text-sm font-semibold text-app-text"
            htmlFor="description"
          >
            Aprašymas
          </label>
          {isAdmin && (
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="app-btn-secondary text-sm"
            >
              {loading ? "Generuojamas aprašymas..." : "Sugeneruoti aprašymą su AI"}
            </button>
          )}
        </div>
        <textarea
          id="description"
          name="description"
          rows={4}
          ref={descRef}
          defaultValue={event?.description ?? ""}
          className="app-input min-h-[120px] resize-none"
        />
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            className="block text-sm font-semibold text-app-text"
            htmlFor="event_date"
          >
            Data
          </label>
          <input
            id="event_date"
            name="event_date"
            type="date"
            ref={dateRef}
            required
            defaultValue={event?.event_date ?? ""}
            className="app-input"
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-app-text"
            htmlFor="event_time"
          >
            Laikas
          </label>
          <input
            id="event_time"
            name="event_time"
            type="time"
            ref={timeRef}
            required
            defaultValue={event?.event_time ?? ""}
            className="app-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-app-text" htmlFor="location">
          Vieta
        </label>
        <input
          id="location"
          name="location"
          type="text"
          ref={locationRef}
          required
          defaultValue={event?.location ?? ""}
          className="app-input"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-app-text" htmlFor="category">
          Kategorija
        </label>
        <input
          id="category"
          name="category"
          type="text"
          ref={categoryRef}
          required
          defaultValue={event?.category ?? ""}
          className="app-input"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-semibold text-app-text" htmlFor="price">
            Kaina
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            required
            defaultValue={event?.price ?? 0}
            className="app-input"
          />
        </div>

        <div>
          <label
            className="block text-sm font-semibold text-app-text"
            htmlFor="total_seats"
          >
            Bendras vietų skaičius
          </label>
          <input
            id="total_seats"
            name="total_seats"
            type="number"
            min="1"
            required
            defaultValue={event?.total_seats ?? 1}
            className="app-input"
          />
        </div>
      </div>
    </>
  );
}
