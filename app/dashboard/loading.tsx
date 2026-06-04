export default function DashboardLoading() {
  return (
    <section className="space-y-4">
      <div className="app-card animate-pulse">
        <div className="h-8 w-40 rounded bg-app-surface" />
        <div className="mt-3 h-4 w-72 rounded bg-app-surface" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl border border-app-border bg-app-surface p-4"
          >
            <div className="h-4 w-28 rounded bg-app-card" />
            <div className="mt-3 h-9 w-16 rounded bg-app-card" />
          </div>
        ))}
      </div>

      <div className="app-card animate-pulse">
        <div className="h-6 w-56 rounded bg-app-surface" />
        <div className="mt-2 h-4 w-64 rounded bg-app-surface" />
        <div className="mt-6 h-72 rounded-xl bg-app-surface" />
      </div>

      <p className="text-center text-sm text-app-text-muted">
        Kraunama statistika...
      </p>
    </section>
  );
}
