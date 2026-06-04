import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="mx-auto max-w-md app-card">
      <h1 className="page-title">Prisijungimas</h1>
      <p className="page-subtitle text-sm">
        Įvesk el. paštą ir slaptažodį, kad patektum į sistemą.
      </p>
      <div className="mt-6">
        <LoginForm />
      </div>
    </section>
  );
}
