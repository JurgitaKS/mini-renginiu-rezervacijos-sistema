export function validateRegisterForm(
  email: string,
  password: string,
  confirmPassword: string,
): string | null {
  if (!email.trim()) {
    return "Įvesk el. paštą.";
  }
  if (!password) {
    return "Įvesk slaptažodį.";
  }
  if (!confirmPassword) {
    return "Pakartok slaptažodį.";
  }
  if (password !== confirmPassword) {
    return "Slaptažodžiai nesutampa.";
  }
  if (password.length < 6) {
    return "Slaptažodis turi būti bent 6 simbolių.";
  }
  return null;
}
