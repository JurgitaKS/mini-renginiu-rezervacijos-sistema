import type { Event } from "@/types";

type EventFormProps = {
  event?: Event;
};

export function EventForm({ event }: EventFormProps) {
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
          required
          defaultValue={event?.title ?? ""}
          className="app-input"
        />
      </div>

      <div>
        <label
          className="block text-sm font-semibold text-app-text"
          htmlFor="description"
        >
          Aprašymas
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={event?.description ?? ""}
          className="app-input min-h-[120px] resize-none"
        />
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
