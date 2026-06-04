import Link from "next/link";

export default function Home() {
  return (
    <section className="app-card flex flex-col items-center justify-center py-12 text-center">
      <h1 className="page-title text-3xl sm:text-4xl">Sveiki atvykę</h1>
      <p className="mt-4 max-w-lg text-app-text-muted">
        Mini renginių rezervacijos sistema — peržiūrėk{" "}
        <Link href="/events" className="app-link">
          renginius
        </Link>
        ,{" "}
        <Link href="/register" className="app-link">
          registruokis
        </Link>{" "}
        ir rezervuok vietas.
      </p>
    </section>
  );
}
