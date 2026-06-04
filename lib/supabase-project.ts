/** Supabase projekto ID iš URL (diagnostikai, ne slapta informacija) */
export function getSupabaseProjectRef(url: string | undefined): string | null {
  if (!url) return null;
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  return match?.[1] ?? null;
}
