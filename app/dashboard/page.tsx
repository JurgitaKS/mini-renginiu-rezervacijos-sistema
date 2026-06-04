import { redirect } from "next/navigation";
import { DashboardError } from "@/components/dashboard/DashboardError";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { translateDashboardError } from "@/lib/dashboard-errors";
import {
  buildCategoryChartData,
  countReservationsByStatus,
} from "@/lib/dashboard-stats";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [eventsResult, reservationsResult] = await Promise.all([
    supabase.from("events").select("category").eq("status", "active"),
    supabase
      .from("reservations")
      .select("status, seats_count, cancelled_seats")
      .eq("user_id", user.id),
  ]);

  if (eventsResult.error || reservationsResult.error) {
    const rawMessage =
      eventsResult.error?.message ?? reservationsResult.error?.message ?? "";
    const context = eventsResult.error
      ? "renginių"
      : reservationsResult.error
        ? "rezervacijų"
        : "duomenų";

    return (
      <DashboardError
        message={`${translateDashboardError(rawMessage)} (klaida kraunant ${context})`}
      />
    );
  }

  const events = eventsResult.data ?? [];
  const reservations = reservationsResult.data ?? [];
  const reservationCounts = countReservationsByStatus(reservations);

  return (
    <DashboardStats
      email={user.email ?? ""}
      stats={{
        ...reservationCounts,
        categoryChartData: buildCategoryChartData(events),
      }}
    />
  );
}
