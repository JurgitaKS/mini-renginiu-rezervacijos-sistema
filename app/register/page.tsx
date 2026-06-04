import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <section className="mx-auto max-w-md app-card">
      <h1 className="page-title">Registracija</h1>
      <p className="page-subtitle text-sm">
        Sukurk paskyrą renginių rezervacijoms.
      </p>
      <div className="mt-6">
        <RegisterForm />
      </div>
    </section>
  );
}
