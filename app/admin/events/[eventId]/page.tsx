import { redirect } from "next/navigation";
import { EventForm } from "@/components/admin/EventForm";
import { createClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";
import type { Event } from "@/types";
import { updateEvent } from "@/app/admin/events/actions";

export const dynamic = "force-dynamic";

export default async function AdminEditEventPage({
  params,
}: {
  params: { eventId: string };
}) {
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

  const { data: event, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.eventId)
    .single();

  if (error || !event) {
    return (
      <section className="app-card">
        <h1 className="page-title">Renginio redagavimas</h1>
        <p className="mt-3 text-app-text-muted">Renginys nerastas.</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="app-card">
        <h1 className="page-title">Redaguoti renginį</h1>
        <p className="mt-2 text-app-text-muted">
          Koreguokite renginio duomenis ir išsaugokite pakeitimus.
        </p>
      </div>

      <div className="app-card">
        <EventForm event={event as Event} action={updateEvent} submitLabel="Išsaugoti pakeitimus" />
      </div>
    </section>
  );
}
