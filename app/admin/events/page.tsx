import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/ui/PageHeader";
import { EventForm } from "@/components/admin/EventForm";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import type { Event } from "@/types";
import { createEvent, deleteEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (!isAdminEmail(user.email)) {
    redirect("/");
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    return (
      <section className="app-card">
        <h1 className="page-title">Renginių valdymas</h1>
        <p className="mt-3 text-app-text-muted">Klaida kraunant renginių sąrašą.</p>
      </section>
    );
  }

  const currentEvents = (events ?? []) as Event[];

  return (
    <section className="space-y-6">
      <PageHeader title="Renginių valdymas">
        <p className="page-subtitle">
          Sukurkite, redaguokite arba ištrinkite renginius užpildydami reikiamus laukus.
        </p>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          {currentEvents.length === 0 ? (
            <div className="app-card">
              <p className="text-app-text-muted">Renginiai dar neįkelti.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentEvents.map((event) => (
                <article key={event.id} className="app-content-card p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold">{event.title}</h2>
                      <p className="text-sm text-app-text-muted">{event.category}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/admin/events/${event.id}`}
                        className="app-btn-secondary"
                      >
                        Koreguoti
                      </Link>
                      <form action={deleteEvent} className="inline">
                        <input type="hidden" name="eventId" value={event.id} />
                        <button type="submit" className="app-btn-secondary text-red-600 hover:text-red-800">
                          Ištrinti
                        </button>
                      </form>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-app-text-muted sm:grid-cols-2">
                    <div>
                      <strong>Data:</strong> {event.event_date} {event.event_time}
                    </div>
                    <div>
                      <strong>Vieta:</strong> {event.location}
                    </div>
                    <div>
                      <strong>Kaina:</strong> {event.price} €
                    </div>
                    <div>
                      <strong>Laisvos vietos:</strong> {event.available_seats}/{event.total_seats}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        <div className="app-card">
          <h2 className="text-xl font-semibold">Naujas renginys</h2>
          <p className="mt-2 text-sm text-app-text-muted">
            Užpildykite formą ir pridėkite naują renginį prie sąrašo.
          </p>
          <div className="mt-4">
            <EventForm action={createEvent} submitLabel="Sukurti renginį" />
          </div>
        </div>
      </div>
    </section>
  );
}
