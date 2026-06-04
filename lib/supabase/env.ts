export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return { url, anonKey };
}

export function assertSupabaseEnv(): { url: string; anonKey: string } {
  const { url, anonKey } = getSupabaseEnv();

  if (!url || !anonKey) {
    throw new Error(
      "Trūksta Supabase kintamųjų. Užpildyk NEXT_PUBLIC_SUPABASE_URL ir NEXT_PUBLIC_SUPABASE_ANON_KEY faile .env.local.",
    );
  }

  return { url, anonKey };
}
