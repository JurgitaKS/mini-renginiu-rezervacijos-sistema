"use server";

import { revalidatePath } from "next/cache";
import {
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/action-result";
import {
  formatAdminEventsDbError,
  requireAdminUser,
} from "@/lib/admin";
import {
  ADMIN_MAX_EVENTS_MESSAGE,
  MAX_ADMIN_EVENTS,
} from "@/lib/constants";
import { EVENT_DELETE_HAS_RESERVATIONS_MESSAGE } from "@/lib/event-status";
import { createClient } from "@/lib/supabase/server";

function revalidateAdminPaths() {
  revalidatePath("/admin");
  revalidatePath("/events");
  revalidatePath("/dashboard");
}

async function getAdminContext(): Promise<
  { supabase: Awaited<ReturnType<typeof createClient>> } | { error: ActionResult }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const denied = await requireAdminUser(supabase, user?.email);
  if (denied) {
    return { error: denied };
  }

  return { supabase };
}

function parseEventId(value: unknown): FieldResult<string> {
  if (typeof value !== "string") {
    return { ok: false, result: actionError("Netinkamas renginio ID.") };
  }
  const id = value.trim();
  if (!id) {
    return { ok: false, result: actionError("Netinkamas renginio ID.") };
  }
  return { ok: true, value: id };
}

function getTextValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

type FieldResult<T> =
  | { ok: true; value: T }
  | { ok: false; result: ActionResult };

function getRequiredTextValue(
  value: FormDataEntryValue | null,
  name: string,
): FieldResult<string> {
  const text = getTextValue(value);
  if (!text) {
    return { ok: false, result: actionError(`${name} yra privaloma.`) };
  }

  return { ok: true, value: text };
}

function parseInteger(
  value: FormDataEntryValue | null,
  name: string,
  min = 0,
): FieldResult<number> {
  const parsed = Number(getTextValue(value));
  if (Number.isNaN(parsed) || parsed < min) {
    return {
      ok: false,
      result: actionError(`${name} turi būti ne mažesnis nei ${min}.`),
    };
  }

  return { ok: true, value: Math.round(parsed) };
}

export async function createEvent(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const titleResult = getRequiredTextValue(formData.get("title"), "Pavadinimas");
  if (!titleResult.ok) return titleResult.result;

  const dateResult = getRequiredTextValue(formData.get("event_date"), "Data");
  if (!dateResult.ok) return dateResult.result;

  const timeResult = getRequiredTextValue(formData.get("event_time"), "Laikas");
  if (!timeResult.ok) return timeResult.result;

  const locationResult = getRequiredTextValue(formData.get("location"), "Vieta");
  if (!locationResult.ok) return locationResult.result;

  const categoryResult = getRequiredTextValue(
    formData.get("category"),
    "Kategorija",
  );
  if (!categoryResult.ok) return categoryResult.result;

  const totalSeatsResult = parseInteger(
    formData.get("total_seats"),
    "Bendras vietų skaičius",
    1,
  );
  if (!totalSeatsResult.ok) return totalSeatsResult.result;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const denied = await requireAdminUser(supabase, user?.email);
  if (denied) {
    return denied;
  }

  const { count: eventCount, error: countError } = await supabase
    .from("events")
    .select("*", { count: "exact", head: true });

  if (countError) {
    return actionError("Nepavyko patikrinti renginių skaičiaus.");
  }

  if ((eventCount ?? 0) >= MAX_ADMIN_EVENTS) {
    return actionError(ADMIN_MAX_EVENTS_MESSAGE);
  }

  const description = getTextValue(formData.get("description"));
  const price = Number(getTextValue(formData.get("price")) || 0);
  const total_seats = totalSeatsResult.value;

  const { error } = await supabase.from("events").insert([
    {
      title: titleResult.value,
      description: description || null,
      event_date: dateResult.value,
      event_time: timeResult.value,
      location: locationResult.value,
      category: categoryResult.value,
      price,
      total_seats,
      available_seats: total_seats,
      status: "active",
    },
  ]);

  if (error) {
    return actionError(formatAdminEventsDbError(error));
  }

  revalidateAdminPaths();

  return actionSuccess("Renginys sėkmingai pridėtas.");
}

export async function updateEvent(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const eventIdResult = getRequiredTextValue(
    formData.get("eventId"),
    "Renginio ID",
  );
  if (!eventIdResult.ok) return eventIdResult.result;

  const titleResult = getRequiredTextValue(formData.get("title"), "Pavadinimas");
  if (!titleResult.ok) return titleResult.result;

  const dateResult = getRequiredTextValue(formData.get("event_date"), "Data");
  if (!dateResult.ok) return dateResult.result;

  const timeResult = getRequiredTextValue(formData.get("event_time"), "Laikas");
  if (!timeResult.ok) return timeResult.result;

  const locationResult = getRequiredTextValue(formData.get("location"), "Vieta");
  if (!locationResult.ok) return locationResult.result;

  const categoryResult = getRequiredTextValue(
    formData.get("category"),
    "Kategorija",
  );
  if (!categoryResult.ok) return categoryResult.result;

  const totalSeatsResult = parseInteger(
    formData.get("total_seats"),
    "Bendras vietų skaičius",
    1,
  );
  if (!totalSeatsResult.ok) return totalSeatsResult.result;

  const ctx = await getAdminContext();
  if ("error" in ctx) {
    return ctx.error;
  }
  const { supabase } = ctx;

  const { data: existing, error: fetchError } = await supabase
    .from("events")
    .select("available_seats")
    .eq("id", eventIdResult.value)
    .single();

  if (fetchError || !existing) {
    return actionError("Renginys nerastas.");
  }

  const total_seats = totalSeatsResult.value;
  const currentAvailable = Number(existing.available_seats);
  const available_seats = Math.min(
    Number.isFinite(currentAvailable) ? currentAvailable : 0,
    total_seats,
  );

  const description = getTextValue(formData.get("description"));
  const price = Number(getTextValue(formData.get("price")) || 0);

  const { error } = await supabase
    .from("events")
    .update({
      title: titleResult.value,
      description: description || null,
      event_date: dateResult.value,
      event_time: timeResult.value,
      location: locationResult.value,
      category: categoryResult.value,
      price,
      total_seats,
      available_seats,
    })
    .eq("id", eventIdResult.value);

  if (error) {
    return actionError(formatAdminEventsDbError(error));
  }

  revalidateAdminPaths();

  return actionSuccess("Renginio pakeitimai išsaugoti.");
}

export async function cancelEvent(eventIdInput: unknown): Promise<ActionResult> {
  const eventIdResult = parseEventId(eventIdInput);
  if (!eventIdResult.ok) {
    return eventIdResult.result;
  }

  const ctx = await getAdminContext();
  if ("error" in ctx) {
    return ctx.error;
  }
  const { supabase } = ctx;

  const { error } = await supabase
    .from("events")
    .update({ status: "cancelled" })
    .eq("id", eventIdResult.value)
    .eq("status", "active");

  if (error) {
    return actionError(formatAdminEventsDbError(error));
  }

  revalidateAdminPaths();

  return actionSuccess("Renginys atšauktas.");
}

export async function restoreEvent(eventIdInput: unknown): Promise<ActionResult> {
  const eventIdResult = parseEventId(eventIdInput);
  if (!eventIdResult.ok) {
    return eventIdResult.result;
  }

  const ctx = await getAdminContext();
  if ("error" in ctx) {
    return ctx.error;
  }
  const { supabase } = ctx;

  const { error } = await supabase
    .from("events")
    .update({ status: "active" })
    .eq("id", eventIdResult.value)
    .eq("status", "cancelled");

  if (error) {
    return actionError(formatAdminEventsDbError(error));
  }

  revalidateAdminPaths();

  return actionSuccess("Renginys atkurtas.");
}

export async function deleteEvent(eventIdInput: unknown): Promise<ActionResult> {
  const eventIdResult = parseEventId(eventIdInput);
  if (!eventIdResult.ok) {
    return eventIdResult.result;
  }

  const ctx = await getAdminContext();
  if ("error" in ctx) {
    return ctx.error;
  }
  const { supabase } = ctx;

  const { count, error: countError } = await supabase
    .from("reservations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", eventIdResult.value);

  if (countError) {
    return actionError("Nepavyko patikrinti renginio rezervacijų.");
  }

  if ((count ?? 0) > 0) {
    return actionError(EVENT_DELETE_HAS_RESERVATIONS_MESSAGE);
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventIdResult.value);

  if (error) {
    return actionError(formatAdminEventsDbError(error));
  }

  revalidateAdminPaths();

  return actionSuccess("Renginys ištrintas.");
}
