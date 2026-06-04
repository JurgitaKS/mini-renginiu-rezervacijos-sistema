"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoutButton } from "@/components/auth/LogoutButton";
import {
  AUTHENTICATED_NAV_LINKS,
  PUBLIC_NAV_LINKS,
} from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "./ThemeToggle";

function NavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <Link
      href={href}
      onClick={onClick}
      data-nav-active={isActive ? "true" : undefined}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? "bg-app-nav-active-bg text-app-nav-active-text"
          : "text-app-text hover:bg-app-nav-hover hover:text-app-text"
      }`}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let subscription: { unsubscribe: () => void } | undefined;

    try {
      const supabase = createClient();

      supabase.auth.getUser().then(({ data: { user } }) => {
        setIsLoggedIn(!!user);
        setUserEmail(user?.email ?? null);
      });

      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange((event, session) => {
        setIsLoggedIn(!!session?.user);
        setUserEmail(session?.user?.email ?? null);

        if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
          router.refresh();
        }
      });

      subscription = authSubscription;
    } catch {
      setIsLoggedIn(false);
      setUserEmail(null);
    }

    return () => subscription?.unsubscribe();
  }, [router]);

  const navLinks = isLoggedIn ? AUTHENTICATED_NAV_LINKS : PUBLIC_NAV_LINKS;

  return (
    <header className="sticky top-0 z-50 border-b border-app-border bg-app-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="min-w-0 text-sm font-semibold leading-tight text-app-text sm:text-base"
        >
          <span className="hidden sm:inline">
            Renginių rezervacija
          </span>
          <span className="sm:hidden">Mini renginiai</span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLoggedIn ? (
            <>
              <span className="hidden max-w-[140px] truncate text-xs text-app-text-muted sm:inline">
                {userEmail}
              </span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-app-text hover:bg-app-nav-hover"
              >
                Prisijungti
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-app-btn-tamsi-bg px-3 py-2 text-sm font-medium text-white hover:bg-app-btn-tamsi-hover"
              >
                Registruotis
              </Link>
            </>
          )}
          <ThemeToggle />

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-app-border bg-app-card text-app-text hover:bg-app-nav-hover md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="sr-only">Meniu</span>
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden
              >
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <nav
        className="mx-auto hidden max-w-5xl gap-1 px-4 pb-3 sm:px-6 md:flex"
        aria-label="Pagrindinė navigacija"
      >
        {navLinks.map((link) => (
          <NavLink key={link.href} href={link.href} label={link.label} />
        ))}
      </nav>

      {menuOpen && (
        <nav
          id="mobile-nav"
          className="border-t border-app-border bg-app-surface px-4 py-3 md:hidden"
          aria-label="Mobili navigacija"
        >
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <NavLink
                  href={link.href}
                  label={link.label}
                  onClick={() => setMenuOpen(false)}
                />
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
