"use client";

import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        theme === "light" ? "Įjungti tamsią temą" : "Įjungti šviesią temą"
      }
      className="rounded-lg transition-colors"
    >
      <span className="inline-block rounded-lg bg-app-btn-tamsi-bg px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-app-btn-tamsi-hover dark:hidden">
        Tamsi
      </span>
      <span className="hidden rounded-lg bg-app-btn-sviesi-bg px-3 py-2 text-sm font-medium text-app-btn-sviesi-text shadow-sm hover:bg-app-btn-sviesi-hover dark:inline-block">
        Šviesi
      </span>
    </button>
  );
}
