import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { assertSupabaseEnv, getSupabaseEnv } from "@/lib/supabase/env";

/** Ar .env.local turi Supabase reikšmes */
export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseEnv();
  return Boolean(url && anonKey);
}

/**
 * Viešoms užklausoms (pvz. /events) — be auth slapukų.
 * Autentifikacijai naudok @/lib/supabase/client arba server.
 */
export function createSupabaseClient(): SupabaseClient {
  const { url, anonKey } = assertSupabaseEnv();
  return createClient(url, anonKey);
}

let browserClient: SupabaseClient | undefined;

export function getSupabaseBrowserClient(): SupabaseClient {
  if (!browserClient) {
    browserClient = createSupabaseClient();
  }
  return browserClient;
}

/** @deprecated /events naudoja createSupabaseClient(); auth — @/lib/supabase/client */
export function getSupabaseClient(): SupabaseClient {
  if (typeof window !== "undefined") {
    return getSupabaseBrowserClient();
  }
  return createSupabaseClient();
}
