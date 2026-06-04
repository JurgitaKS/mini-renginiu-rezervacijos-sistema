import type { SupabaseClient } from "@supabase/supabase-js";
import { actionError, type ActionResult } from "@/lib/action-result";

export const ADMIN_RLS_MESSAGE =
  "Trūksta Admin RLS leidimų events lentelei.";

export function formatAdminEventsDbError(
  error: { code?: string; message?: string } | null | undefined,
): string {
  if (!error) {
    return "Įvyko nežinoma klaida.";
  }

  if (
    error.code === "42501" ||
    error.message?.toLowerCase().includes("row-level security") ||
    error.message?.toLowerCase().includes("policy")
  ) {
    return ADMIN_RLS_MESSAGE;
  }

  return error.message ?? "Įvyko nežinoma klaida.";
}

export async function isAdminUser(
  supabase: SupabaseClient,
  email: string | null | undefined,
): Promise<boolean> {
  if (!email?.trim()) {
    return false;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (error) {
    return false;
  }

  return !!data;
}

export async function requireAdminUser(
  supabase: SupabaseClient,
  email: string | null | undefined,
): Promise<ActionResult | null> {
  const allowed = await isAdminUser(supabase, email);
  if (!allowed) {
    return actionError("Neturite teisės atlikti šio veiksmo.");
  }

  return null;
}
