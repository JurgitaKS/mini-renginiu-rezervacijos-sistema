export const THEME_STORAGE_KEY = "theme";

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
