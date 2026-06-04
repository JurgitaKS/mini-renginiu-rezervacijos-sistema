import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { assertAdminEmail } from "@/lib/admin";

function getTextValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function getRequiredTextValue(value: FormDataEntryValue | null, name: string) {
  const text = getTextValue(value);
  if (!text) {
    throw new Error(`${name} yra privaloma.`);
  }

  return text;
}

function parseInteger(value: FormDataEntryValue | null, name: string, min = 0) {
  const parsed = Number(getTextValue(value));
  if (Number.isNaN(parsed) || parsed < min) {
    throw new Error(`${name} turi būti ne mažesnis nei ${min}.`);
  }

  return Math.round(parsed);
}

export async function createEvent(formData: FormData) {
  "use server";

  const title = getRequiredTextValue(formData.get("title"), "Pavadinimas");
  const event_date = getRequiredTextValue(formData.get("event_date"), "Data");
  const event_time = getRequiredTextValue(formData.get("event_time"), "Laikas");
  const location = getRequiredTextValue(formData.get("location"), "Vieta");
  const category = getRequiredTextValue(formData.get("category"), "Kategorija");
  const description = getTextValue(formData.get("description"));
  const price = Number(getTextValue(formData.get("price")) || 0);
  const total_seats = parseInteger(formData.get("total_seats"), "Bendras vietų skaičius", 1);
  const available_seats = parseInteger(
    formData.get("available_seats"),
    "Laisvų vietų skaičius",
    0,
  );

  if (available_seats > total_seats) {
    throw new Error("Laisvų vietų skaičius negali būti didesnis nei bendras vietų skaičius.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  assertAdminEmail(user?.email);

  const { error } = await supabase.from("events").insert([
    {
      title,
      description: description || null,
      event_date,
      event_time,
      location,
      category,
      price,
      total_seats,
      available_seats,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/events");
}

export async function updateEvent(formData: FormData) {
  "use server";

  const eventId = getRequiredTextValue(formData.get("eventId"), "Renginio ID");
  const title = getRequiredTextValue(formData.get("title"), "Pavadinimas");
  const event_date = getRequiredTextValue(formData.get("event_date"), "Data");
  const event_time = getRequiredTextValue(formData.get("event_time"), "Laikas");
  const location = getRequiredTextValue(formData.get("location"), "Vieta");
  const category = getRequiredTextValue(formData.get("category"), "Kategorija");
  const description = getTextValue(formData.get("description"));
  const price = Number(getTextValue(formData.get("price")) || 0);
  const total_seats = parseInteger(formData.get("total_seats"), "Bendras vietų skaičius", 1);
  const available_seats = parseInteger(
    formData.get("available_seats"),
    "Laisvų vietų skaičius",
    0,
  );

  if (available_seats > total_seats) {
    throw new Error("Laisvų vietų skaičius negali būti didesnis nei bendras vietų skaičius.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  assertAdminEmail(user?.email);

  const { error } = await supabase
    .from("events")
    .update({
      title,
      description: description || null,
      event_date,
      event_time,
      location,
      category,
      price,
      total_seats,
      available_seats,
    })
    .eq("id", eventId);

  if (error) {
    throw new Error(error.message);
  }

  redirect("/admin/events");
}

export async function deleteEvent(formData: FormData) {
  "use server";

  const eventId = getRequiredTextValue(formData.get("eventId"), "Renginio ID");

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  assertAdminEmail(user?.email);

  const { error } = await supabase.from("events").delete().eq("id", eventId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/events");
}
