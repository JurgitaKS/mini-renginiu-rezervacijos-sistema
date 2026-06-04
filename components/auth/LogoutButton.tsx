"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="rounded-lg border border-app-border bg-app-card px-3 py-2 text-sm font-medium text-app-text hover:bg-app-nav-hover disabled:opacity-60"
    >
      {loading ? "Atsijungiama..." : "Atsijungti"}
    </button>
  );
}
