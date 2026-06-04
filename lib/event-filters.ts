import type { Event } from "@/types";

export const EVENT_LIST_CATEGORY_OPTIONS = [
  { value: "all", label: "Visos kategorijos" },
  { value: "Mokymai", label: "Mokymai" },
  { value: "Muzika", label: "Muzika" },
  { value: "Pramogos", label: "Pramogos" },
  { value: "Senjorams", label: "Senjorams" },
  { value: "Sportas", label: "Sportas" },
  { value: "Vaikams", label: "Vaikams" },
  { value: "Verslui", label: "Verslui" },
] as const;

/** Dashboard grafikas ir /events filtras — tos pačios kategorijos */
export const EVENT_CHART_CATEGORIES = EVENT_LIST_CATEGORY_OPTIONS.filter(
  (option) => option.value !== "all",
).map((option) => option.label);

export const EVENT_SORT_OPTIONS = [
  { value: "asc", label: "Artimiausi pirmiausia" },
  { value: "desc", label: "Vėliausi pirmiausia" },
] as const;

export type EventListCategoryFilter =
  (typeof EVENT_LIST_CATEGORY_OPTIONS)[number]["value"];

export type EventSortOrder = (typeof EVENT_SORT_OPTIONS)[number]["value"];

export function filterAndSortEvents(
  events: Event[],
  {
    searchQuery,
    category,
    sortOrder,
  }: {
    searchQuery: string;
    category: EventListCategoryFilter;
    sortOrder: EventSortOrder;
  },
): Event[] {
  const query = searchQuery.trim().toLowerCase();

  let result = events.filter((event) => {
    if (query && !event.title.toLowerCase().includes(query)) {
      return false;
    }
    if (category !== "all" && event.category !== category) {
      return false;
    }
    return true;
  });

  result = [...result].sort((a, b) => {
    const byDate = a.event_date.localeCompare(b.event_date);
    if (byDate !== 0) {
      return sortOrder === "asc" ? byDate : -byDate;
    }
    const byTime = a.event_time.localeCompare(b.event_time);
    return sortOrder === "asc" ? byTime : -byTime;
  });

  return result;
}
