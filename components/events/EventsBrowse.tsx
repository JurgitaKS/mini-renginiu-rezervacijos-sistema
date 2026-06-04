"use client";

import { useCallback, useMemo, useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import type { Event } from "@/types";
import {
  filterAndSortEvents,
  type EventListCategoryFilter,
  type EventSortOrder,
} from "@/lib/event-filters";
import { EventCard } from "./EventCard";
import { EventsFilters } from "./EventsFilters";

type EventsBrowseProps = {
  events: Event[];
  isLoggedIn: boolean;
  reservedEventIds: string[];
};

export function EventsBrowse({
  events,
  isLoggedIn,
  reservedEventIds,
}: EventsBrowseProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<EventListCategoryFilter>("all");
  const [sortOrder, setSortOrder] = useState<EventSortOrder>("asc");

  const reservedSet = useMemo(
    () => new Set(reservedEventIds),
    [reservedEventIds],
  );

  const hasActiveFilters =
    searchQuery.trim() !== "" || category !== "all" || sortOrder !== "asc";

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setCategory("all");
    setSortOrder("asc");
  }, []);

  const filteredEvents = useMemo(
    () =>
      filterAndSortEvents(events, {
        searchQuery,
        category,
        sortOrder,
      }),
    [events, searchQuery, category, sortOrder],
  );

  return (
    <section className="space-y-4">
      <PageHeader title="Renginiai">
        <p className="page-subtitle">
          Rodoma: {filteredEvents.length} iš {events.length}
        </p>
      </PageHeader>

      <EventsFilters
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        hasActiveFilters={hasActiveFilters}
        onClearFilters={clearFilters}
      />

      {filteredEvents.length === 0 ? (
        <p className="app-card text-center text-app-text-muted">
          Renginių nerasta
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {filteredEvents.map((event) => (
            <li key={event.id}>
              <EventCard
                event={event}
                isLoggedIn={isLoggedIn}
                alreadyReserved={reservedSet.has(event.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
