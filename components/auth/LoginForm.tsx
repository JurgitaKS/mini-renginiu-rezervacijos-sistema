"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { translateAuthError } from "@/lib/auth-errors";
import { createClient } from "@/lib/supabase/client";

const inputClassName = "app-input mt-1";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError("Įvesk el. paštą.");
      return;
    }
    if (!password) {
      setError("Įvesk slaptažodį.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (authError) {
        setError(translateAuthError(authError.message));
        return;
      }

      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      setError(
        translateAuthError(
          err instanceof Error ? err.message : "Nepavyko prisijungti.",
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-app-text">
          El. paštas
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="pvz. vardas@pastas.lt"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputClassName}
          disabled={loading}
        />
      </div>
      <div>
        <label htmlFor="password" className="text-sm font-medium text-app-text">
          Slaptažodis
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="Įvesk slaptažodį"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClassName}
          disabled={loading}
        />
      </div>
      {error && (
        <p className="app-alert-error" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="app-btn-primary w-full"
      >
        {loading ? "Jungiama..." : "Prisijungti"}
      </button>
      <p className="text-center text-sm text-app-text-muted">
        Neturi paskyros?{" "}
        <Link href="/register" className="app-link">
          Registruokis
        </Link>
      </p>
    </form>
  );
}
