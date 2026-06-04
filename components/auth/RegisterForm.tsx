"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { translateAuthError } from "@/lib/auth-errors";
import { validateRegisterForm } from "@/lib/auth-validation";
import { createClient } from "@/lib/supabase/client";

const inputClassName = "app-input mt-1";

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateRegisterForm(
      email,
      password,
      confirmPassword,
    );
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmedEmail = email.trim();

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      });

      if (authError) {
        setError(translateAuthError(authError.message));
        return;
      }

      if (data.user?.identities?.length === 0) {
        setError("Vartotojas su šiuo el. paštu jau užregistruotas.");
        return;
      }

      if (!data.user) {
        setError(
          "Registracija neįvyko. Patikrink Supabase Authentication nustatymus (ar įjungta registracija).",
        );
        return;
      }

      setSuccess("Registracija sėkminga");

      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      router.push("/login");
      router.refresh();
    } catch (err) {
      setError(
        translateAuthError(
          err instanceof Error
            ? err.message
            : "Nežinoma klaida registruojantis.",
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
          autoComplete="new-password"
          placeholder="Bent 6 simboliai"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={inputClassName}
          disabled={loading}
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="text-sm font-medium text-app-text"
        >
          Pakartok slaptažodį
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="Pakartok slaptažodį"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={inputClassName}
          disabled={loading}
        />
      </div>

      {error && (
        <p className="app-alert-error" role="alert">
          {error}
        </p>
      )}
      {success && (
        <p className="app-alert-success" role="status">
          {success}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="app-btn-primary w-full"
      >
        {loading ? "Kuriama..." : "Registruotis"}
      </button>
      <p className="text-center text-sm text-app-text-muted">
        Jau turi paskyrą?{" "}
        <Link href="/login" className="app-link">
          Prisijunk
        </Link>
      </p>
    </form>
  );
}
