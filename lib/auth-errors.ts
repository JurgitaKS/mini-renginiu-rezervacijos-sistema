const AUTH_ERROR_MESSAGES_LT: Record<string, string> = {
  "Invalid login credentials":
    "Neteisingas el. paštas arba slaptažodis.",
  "User already registered":
    "Vartotojas su šiuo el. paštu jau užregistruotas.",
  "Email not confirmed":
    "El. paštas dar nepatvirtintas. Patikrink savo pašto dėžutę.",
  "Password should be at least 6 characters":
    "Slaptažodis turi būti bent 6 simbolių.",
  "Signup requires a valid password":
    "Įvesk galiojantį slaptažodį.",
  "Unable to validate email address: invalid format":
    "Neteisingas el. pašto formatas.",
  "Email rate limit exceeded":
    "Per daug bandymų. Palauk kelias minutes ir bandyk dar kartą.",
  "For security purposes, you can only request this after":
    "Saugumo sumetimais palauk ir bandyk vėliau.",
};

export function translateAuthError(message: string): string {
  const exact = AUTH_ERROR_MESSAGES_LT[message];
  if (exact) return exact;

  for (const [key, value] of Object.entries(AUTH_ERROR_MESSAGES_LT)) {
    if (message.includes(key)) return value;
  }

  return message || "Įvyko klaida. Bandyk dar kartą.";
}
