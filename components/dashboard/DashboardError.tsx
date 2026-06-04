import { PageHeader } from "@/components/ui/PageHeader";
import { AlertError } from "@/components/ui/Alert";

type DashboardErrorProps = {
  message: string;
};

export function DashboardError({ message }: DashboardErrorProps) {
  return (
    <section className="space-y-4">
      <PageHeader title="Statistika">
        <AlertError>
          <strong>Klaida:</strong> Nepavyko užkrauti statistikos. {message}
        </AlertError>
        <p className="mt-3 text-sm text-app-text-muted">
          Patikrink ar Supabase projektas sutampa su{" "}
          <code className="rounded bg-app-surface px-1.5 py-0.5 text-xs">
            .env.local
          </code>{" "}
          ir ar prisijungęs vartotojas gali skaityti{" "}
          <strong>events</strong> ir <strong>reservations</strong>.
        </p>
      </PageHeader>
    </section>
  );
}
