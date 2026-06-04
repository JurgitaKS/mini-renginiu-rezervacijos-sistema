import Link from "next/link";

export default function NotFound() {
  return (
    <section className="app-card text-center">
      <h1 className="page-title">Puslapis nerastas</h1>
      <p className="page-subtitle">
        Adresas neteisingas arba puslapis nebeegzistuoja.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/" className="app-btn-secondary inline-block">
          Pagrindinis
        </Link>
        <Link href="/login" className="app-btn-primary inline-block">
          Prisijungti
        </Link>
      </div>
    </section>
  );
}
