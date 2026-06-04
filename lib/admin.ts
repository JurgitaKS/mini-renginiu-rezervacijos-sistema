export function getAdminEmails() {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  return getAdminEmails().includes(email.toLowerCase());
}

export function assertAdminEmail(email: string | null | undefined) {
  if (!isAdminEmail(email)) {
    throw new Error("Unauthorized user");
  }
}
