import { EventsBrowse } from "@/components/events/EventsBrowse";
import {
  createSupabaseClient,
  isSupabaseConfigured,
} from "@/lib/supabaseClient";
import { getSupabaseProjectRef } from "@/lib/supabase-project";
import { createClient } from "@/lib/supabase/server";
import type { Event } from "@/types";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  if (!isSupabaseConfigured()) {
    return (
      <section className="app-card">
        <h1 className="text-2xl font-bold">Renginiai</h1>
        <p className="mt-2 text-app-text-muted">
          Supabase dar neprijungtas. Sukurk failą{" "}
          <code className="rounded bg-app-card px-1.5 py-0.5 text-sm">
            .env.local
          </code>{" "}
          pagal{" "}
          <code className="rounded bg-app-card px-1.5 py-0.5 text-sm">
            .env.example
          </code>{" "}
          ir paleisk serverį iš naujo (
          <code className="rounded bg-app-card px-1.5 py-0.5 text-sm">
            npm run dev
          </code>
          ).
        </p>
      </section>
    );
  }

  const projectRef = getSupabaseProjectRef(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );

  let events: Event[] = [];
  let errorMessage: string | null = null;
  let errorDetails: string | null = null;
  let isLoggedIn = false;
  const reservedEventIds = new Set<string>();

  try {
    const supabase = createSupabaseClient();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      errorMessage = error.message;
      errorDetails = [error.code, error.hint, error.details]
        .filter(Boolean)
        .join(" · ");
    } else {
      events = (data ?? []) as Event[];
    }

    const supabaseAuth = await createClient();
    const {
      data: { user },
    } = await supabaseAuth.auth.getUser();

    if (user) {
      isLoggedIn = true;
      const { data: reservations } = await supabaseAuth
        .from("reservations")
        .select("event_id")
        .eq("user_id", user.id)
        .eq("status", "active");

      reservations?.forEach((r) => reservedEventIds.add(r.event_id));
    }
  } catch (err) {
    errorMessage =
      err instanceof Error ? err.message : "Nežinoma serverio klaida.";
  }

  if (errorMessage) {
    return (
      <section className="app-card">
        <h1 className="text-2xl font-bold">Renginiai</h1>
        <p className="mt-3 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
          <strong>Klaida:</strong> {errorMessage}
        </p>
        {errorDetails && (
          <p className="mt-2 text-sm text-app-text-muted">
            Detalės: {errorDetails}
          </p>
        )}
        {projectRef && (
          <p className="mt-2 text-sm text-app-text-muted">
            Supabase projektas iš .env.local: <strong>{projectRef}</strong>
          </p>
        )}
      </section>
    );
  }

  if (events.length === 0) {
    return (
      <section className="app-card">
        <h1 className="text-2xl font-bold">Renginiai</h1>
        <p className="mt-3 text-app-text-muted">
          Ryšys su Supabase veikia, bet renginių sąrašas tuščias (0 įrašų).
        </p>
        <div className="mt-4 space-y-2 rounded-lg border border-app-border bg-app-surface p-4 text-sm text-app-text">
          <p className="font-medium">Galimos priežastys:</p>
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              <strong>RLS (Row Level Security)</strong> — dažniausia priežastis.
              Table Editor rodo duomenis, bet svetainė naudoja{" "}
              <code className="rounded bg-app-card px-1">anon</code> raktą.
              Paleisk Supabase SQL Editor faile{" "}
              <code className="rounded bg-app-card px-1">
                supabase/fix-events-rls.sql
              </code>
              .
            </li>
            <li>
              <strong>Kitas Supabase projektas</strong> — .env.local rodo kitą
              projektą nei tas, kuriame įkėlei 4 renginius.
              {projectRef && (
                <>
                  {" "}
                  Dabar naudojamas projektas:{" "}
                  <strong>{projectRef}</strong>
                </>
              )}
            </li>
            <li>
              <strong>Lentelė tuščia</strong> — patikrink Table Editor →{" "}
              <strong>events</strong> tame pačiame projekte.
            </li>
          </ol>
        </div>
      </section>
    );
  }

  return (
    <EventsBrowse
      events={events}
      isLoggedIn={isLoggedIn}
      reservedEventIds={[...reservedEventIds]}
    />
  );
}
