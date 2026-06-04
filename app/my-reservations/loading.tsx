export default function MyReservationsLoading() {
  return (
    <section className="space-y-4">
      <div className="app-card animate-pulse">
        <div className="h-8 w-48 rounded bg-app-surface" />
        <div className="mt-3 h-4 w-64 rounded bg-app-surface" />
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <li
            key={i}
            className="h-64 animate-pulse rounded-xl border border-app-border bg-app-surface"
          />
        ))}
      </ul>
      <p className="text-center text-sm text-app-text-muted">
        Kraunamos rezervacijos...
      </p>
    </section>
  );
}
