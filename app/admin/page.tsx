import { redirect } from "next/navigation";
import { AdminEventForm } from "@/components/admin/AdminEventForm";
import { AdminEventList } from "@/components/admin/AdminEventList";
import { PageHeader } from "@/components/ui/PageHeader";
import { AlertError } from "@/components/ui/Alert";
import { isAdminUser } from "@/lib/admin";
import { normalizeEventStatus } from "@/lib/event-status";
import {
  ADMIN_MAX_EVENTS_MESSAGE,
  MAX_ADMIN_EVENTS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types";
import { createEvent } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isAdmin = await isAdminUser(supabase, user.email);

  if (!isAdmin) {
    return (
      <section className="app-card">
        <h1 className="page-title">Admin</h1>
        <p className="mt-3 text-app-text-muted">
          Neturite teisės matyti šio puslapio.
        </p>
      </section>
    );
  }

  const { data: events, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) {
    return (
      <section className="app-card">
        <PageHeader title="Admin" />
        <AlertError>Klaida kraunant renginių sąrašą.</AlertError>
      </section>
    );
  }

  const currentEvents = ((events ?? []) as Event[]).map((event) => ({
    ...event,
    status: normalizeEventStatus(event.status),
  }));
  const eventCount = currentEvents.length;
  const canCreateEvent = eventCount < MAX_ADMIN_EVENTS;

  return (
    <section className="space-y-6">
      <PageHeader title="Admin">
        <p className="page-subtitle">
          Valdykite renginius: peržiūrėkite sąrašą, pridėkite naujus arba redaguokite
          esamus.
        </p>
        <p className="mt-2 text-sm font-medium text-app-text">
          Sukurta renginių: {eventCount} / {MAX_ADMIN_EVENTS}
        </p>
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-app-text">Visi renginiai</h2>

          <AdminEventList events={currentEvents} isAdmin={isAdmin} />
        </div>

        <div className="app-card h-fit">
          <h2 className="text-xl font-semibold text-app-text">Pridėti renginį</h2>
          {canCreateEvent ? (
            <>
              <p className="mt-2 text-sm text-app-text-muted">
                Naujo renginio laisvų vietų skaičius bus lygus bendram vietų
                skaičiui.
              </p>
              <div className="mt-4">
                <AdminEventForm action={createEvent} submitLabel="Pridėti renginį" isAdmin={isAdmin} />
              </div>
            </>
          ) : (
            <p className="mt-3 app-alert-error text-sm" role="alert">
              {ADMIN_MAX_EVENTS_MESSAGE}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
