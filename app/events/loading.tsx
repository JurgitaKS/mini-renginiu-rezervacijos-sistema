export default function EventsLoading() {
  return (
    <section className="space-y-4">
      <div className="app-card animate-pulse">
        <div className="h-8 w-36 rounded bg-app-surface" />
        <div className="mt-3 h-4 w-40 rounded bg-app-surface" />
      </div>
      <div className="app-card animate-pulse space-y-4">
        <div className="h-10 w-full rounded-lg bg-app-surface" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-10 rounded-lg bg-app-surface" />
          <div className="h-10 rounded-lg bg-app-surface" />
        </div>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <li
            key={i}
            className="h-64 animate-pulse rounded-xl border border-app-border bg-app-surface"
          />
        ))}
      </ul>
      <p className="text-center text-sm text-app-text-muted">
        Kraunami renginiai...
      </p>
    </section>
  );
}
