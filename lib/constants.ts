export const THEME_STORAGE_KEY = "theme";

/** Maksimalus renginių skaičius, kurį admin gali sukurti */
export const MAX_ADMIN_EVENTS = 99;

export const ADMIN_MAX_EVENTS_MESSAGE =
  "Pasiektas maksimalus renginių skaičius: 99.";

export type Theme = "light" | "dark";

/** Reikia prisijungimo */
export const PROTECTED_ROUTES = ["/dashboard", "/my-reservations"] as const;

/** Prisijungus nukreipiama į dashboard */
export const AUTH_ROUTES = ["/login", "/register"] as const;

export const PUBLIC_NAV_LINKS = [
  { href: "/", label: "Pagrindinis" },
  { href: "/events", label: "Renginiai" },
] as const;

export const AUTHENTICATED_NAV_LINKS = [
  { href: "/", label: "Pagrindinis" },
  { href: "/events", label: "Renginiai" },
  { href: "/my-reservations", label: "Mano rezervacijos" },
  { href: "/dashboard", label: "Statistika" },
] as const;
