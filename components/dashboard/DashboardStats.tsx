import { PageHeader } from "@/components/ui/PageHeader";
import type { DashboardStats as DashboardStatsData } from "@/lib/dashboard-stats";
import { EventsByCategoryChart } from "./EventsByCategoryChart";
import { StatCard } from "./StatCard";

type DashboardStatsProps = {
  email: string;
  stats: DashboardStatsData;
};

export function DashboardStats({ email, stats }: DashboardStatsProps) {
  return (
    <section className="space-y-4">
      <PageHeader title="Statistika">
        <p className="page-subtitle">
          Sveiki, prisijungę kaip{" "}
          <span className="font-medium text-app-text">{email}</span>
        </p>
      </PageHeader>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard label="Mano rezervacijos" value={stats.totalReservations} />
        <StatCard label="Aktyvios rezervacijos" value={stats.activeReservations} />
        <StatCard
          label="Visiškai atšauktos rezervacijos"
          value={stats.fullyCancelledReservations}
        />
        <StatCard
          label="Aktyvios vietos (suma)"
          value={stats.activeSeatsTotal}
        />
        <StatCard
          label="Atšauktos pavienės vietos"
          value={stats.cancelledSeatsTotal}
        />
      </div>

      <div className="app-card">
        <h2 className="text-lg font-semibold">Renginiai pagal kategoriją</h2>
        <p className="mt-1 text-sm text-app-text-muted">
          Renginių skaičius pagal kategorijas (Mokymai, Muzika, Pramogos, Senjorams, Sportas, Vaikams, Verslui)
        </p>
        <div className="mt-4">
          <EventsByCategoryChart data={stats.categoryChartData} />
        </div>
      </div>
    </section>
  );
}
