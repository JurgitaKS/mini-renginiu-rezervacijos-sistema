export type ReservationStatus = "active" | "cancelled";

export type Event = {
  id: string;
  title: string;
  description: string | null;
  event_date: string;
  event_time: string;
  location: string;
  category: string;
  price: number;
  total_seats: number;
  available_seats: number;
  created_at: string;
};

export type Reservation = {
  id: string;
  user_id: string;
  event_id: string;
  status: ReservationStatus;
  seats_count: number;
  cancelled_seats: number;
  created_at: string;
};

/** Rezervacija su prijungtu renginiu (Mano rezervacijos puslapiui) */
export type ReservationWithEvent = Reservation & {
  events: Event;
};
