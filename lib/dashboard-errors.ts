const DASHBOARD_ERROR_PATTERNS: { pattern: RegExp; message: string }[] = [
  {
    pattern: /jwt|session|not authenticated|invalid.*token/i,
    message: "Sesija pasibaigė. Prisijunkite iš naujo.",
  },
  {
    pattern: /permission|policy|row-level security|rls/i,
    message:
      "Neturite prieigos prie duomenų. Patikrink Supabase RLS taisykles (events, reservations).",
  },
  {
    pattern: /network|fetch|timeout|failed to fetch/i,
    message: "Nepavyko prisijungti prie Supabase. Patikrink internetą ir .env.local.",
  },
];

export function translateDashboardError(message: string): string {
  const trimmed = message.trim();
  if (!trimmed) {
    return "Nežinoma klaida. Bandykite vėliau.";
  }

  for (const { pattern, message: translated } of DASHBOARD_ERROR_PATTERNS) {
    if (pattern.test(trimmed)) {
      return translated;
    }
  }

  return trimmed;
}
