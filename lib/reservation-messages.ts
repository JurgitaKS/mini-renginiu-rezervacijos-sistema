export const RESERVATION_MESSAGES = {
  success: "Rezervacija sėkminga",
  alreadyReserved: "Šį renginį jau rezervavote",
  noSeats: "Nebėra pakankamai laisvų vietų",
  tooManySeats: "Pasirinkta per daug vietų",
  loginRequired: "Norėdami rezervuoti, prisijungite",
  eventCancelled: "Renginys atšauktas",
  unknown: "Nepavyko rezervuoti. Bandyk dar kartą.",
  rlsUpdateBlocked:
    "Nepavyko atnaujinti laisvų vietų: trūksta Supabase RLS policy. Paleisk SQL failą supabase/fix-events-update-rls.sql (policy: events_update_authenticated).",
  updateFailed: "Nepavyko atnaujinti renginio duomenų. Bandyk dar kartą.",
  cancelSuccess: "Rezervacija atšaukta",
  cancelOneSeatSuccess: "Viena vieta atšaukta",
  cancelOneSeatFailed: "Nepavyko atšaukti vienos vietos",
  cancelFailed: "Rezervacijos atšaukti nepavyko",
  alreadyCancelled: "Ši rezervacija jau atšaukta",
  rlsReservationUpdateBlocked:
    "Nepavyko atnaujinti rezervacijos: trūksta Supabase RLS policy. Paleisk SQL failą supabase/fix-cancel-reservation-rls.sql (policy: reservations_update_own).",
} as const;

export function formatReservationDbError(
  message: string,
  code?: string,
  context: "reserve" | "cancel" = "reserve",
): string {
  if (code === "42501" || message.toLowerCase().includes("policy")) {
    return context === "cancel"
      ? RESERVATION_MESSAGES.rlsReservationUpdateBlocked
      : RESERVATION_MESSAGES.rlsUpdateBlocked;
  }
  if (message) {
    return message;
  }
  return context === "cancel"
    ? RESERVATION_MESSAGES.cancelFailed
    : RESERVATION_MESSAGES.unknown;
}
