import Link from "next/link";

const features = [
  {
    title: "Renginių peržiūra",
    description: "Naršykite visus artėjančius renginius ir jų detales.",
  },
  {
    title: "Vietų rezervacija",
    description: "Užsitikrinkite vietą keliais paspaudimais.",
  },
  {
    title: "Rezervacijų valdymas",
    description: "Peržiūrėkite ir valdykite savo rezervacijas vienoje vietoje.",
  },
] as const;

export default function Home() {
  return (
    <div className="mx-auto w-full max-w-3xl">
      <section className="app-card px-6 py-10 text-center sm:px-10 sm:py-14">
        <p className="mb-4 text-sm font-medium tracking-wide text-app-text-muted uppercase">
          Sveiki atvykę
        </p>
        <h1 className="page-title text-3xl leading-tight sm:text-4xl">
          Renginių rezervacija
        </h1>
        <p className="page-subtitle mx-auto mt-4 max-w-xl text-base leading-relaxed sm:text-lg">
          Peržiūrėkite renginius, rezervuokite vietas ir valdykite savo
          rezervacijas vienoje vietoje.
        </p>
        <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
          <Link
            href="/events"
            className="app-btn-primary inline-flex items-center justify-center px-6 py-3 text-base"
          >
            Peržiūrėti renginius
          </Link>
          <Link
            href="/register"
            className="app-btn-secondary inline-flex items-center justify-center px-6 py-3 text-base"
          >
            Registruotis
          </Link>
        </div>
      </section>

      <ul className="mt-6 grid gap-4 sm:grid-cols-3">
        {features.map((feature) => (
          <li
            key={feature.title}
            className="app-content-card text-center sm:text-left"
          >
            <h2 className="text-base font-semibold text-app-text">
              {feature.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-app-text-muted">
              {feature.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
