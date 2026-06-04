import { EVENT_CHART_CATEGORIES } from "@/lib/event-filters";
import {
  parseActiveSeatsDisplay,
  parseCancelledSeats,
} from "@/lib/reservation-seats";

export type CategoryChartDatum = {
  category: string;
  count: number;
};

export type DashboardStats = {
  totalReservations: number;
  activeReservations: number;
  fullyCancelledReservations: number;
  activeSeatsTotal: number;
  cancelledSeatsTotal: number;
  categoryChartData: CategoryChartDatum[];
};

export function countReservationsByStatus(
  reservations: {
    status: string;
    seats_count?: number | null;
    cancelled_seats?: number | null;
  }[],
): Pick<
  DashboardStats,
  | "totalReservations"
  | "activeReservations"
  | "fullyCancelledReservations"
  | "activeSeatsTotal"
  | "cancelledSeatsTotal"
> {
  let activeReservations = 0;
  let fullyCancelledReservations = 0;
  let activeSeatsTotal = 0;
  let cancelledSeatsTotal = 0;

  for (const row of reservations) {
    cancelledSeatsTotal += parseCancelledSeats(row.cancelled_seats);

    if (row.status === "active") {
      activeReservations += 1;
      activeSeatsTotal += parseActiveSeatsDisplay(row.seats_count);
    } else if (row.status === "cancelled") {
      fullyCancelledReservations += 1;
    }
  }

  return {
    totalReservations: reservations.length,
    activeReservations,
    fullyCancelledReservations,
    activeSeatsTotal,
    cancelledSeatsTotal,
  };
}

export function buildCategoryChartData(
  events: { category: string }[],
): CategoryChartDatum[] {
  const counts = new Map<string, number>(
    EVENT_CHART_CATEGORIES.map((category) => [category, 0]),
  );

  for (const event of events) {
    const category = event.category.trim();
    if (counts.has(category)) {
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
  }

  return EVENT_CHART_CATEGORIES.map((category) => ({
    category,
    count: counts.get(category) ?? 0,
  }));
}
