export const MIN_RESERVATION_SEATS = 1;
export const MAX_RESERVATION_SEATS = 11;

export function parseSeatsCount(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < MIN_RESERVATION_SEATS) {
    return MIN_RESERVATION_SEATS;
  }
  return Math.min(MAX_RESERVATION_SEATS, n);
}

/** Aktyvių vietų skaičius rodymui (gali būti 0 visiškai atšaukus rezervaciją) */
export function parseActiveSeatsDisplay(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) {
    return 0;
  }
  return Math.min(MAX_RESERVATION_SEATS, n);
}

export function parseCancelledSeats(value: unknown): number {
  const n = Math.floor(Number(value));
  if (!Number.isFinite(n) || n < 0) {
    return 0;
  }
  return n;
}

/** Maksimalus pasirinkimas UI: nuo 1 iki 11, bet ne daugiau nei liko laisvų vietų */
export function getMaxSelectableSeats(availableSeats: number): number {
  const available = Math.floor(Number(availableSeats));
  if (!Number.isFinite(available) || available <= 0) {
    return 0;
  }
  return Math.min(MAX_RESERVATION_SEATS, available);
}

export function isValidSeatsCount(
  seatsCount: number,
  availableSeats: number,
): boolean {
  const seats = parseSeatsCount(seatsCount);
  const max = getMaxSelectableSeats(availableSeats);
  return seats >= MIN_RESERVATION_SEATS && seats <= max && max > 0;
}
