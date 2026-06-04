"use client";

import {
  EVENT_LIST_CATEGORY_OPTIONS,
  EVENT_SORT_OPTIONS,
  type EventListCategoryFilter,
  type EventSortOrder,
} from "@/lib/event-filters";

type EventsFiltersProps = {
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  category: EventListCategoryFilter;
  onCategoryChange: (value: EventListCategoryFilter) => void;
  sortOrder: EventSortOrder;
  onSortOrderChange: (value: EventSortOrder) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
};

export function EventsFilters({
  searchQuery,
  onSearchQueryChange,
  category,
  onCategoryChange,
  sortOrder,
  onSortOrderChange,
  hasActiveFilters,
  onClearFilters,
}: EventsFiltersProps) {
  return (
    <div className="app-card space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <p className="text-sm font-medium text-app-text">Paieška ir filtrai</p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="app-btn-secondary py-1.5 text-xs"
          >
            Išvalyti filtrus
          </button>
        )}
      </div>

      <div>
        <label htmlFor="events-search" className="text-sm font-medium text-app-text">
          Paieška
        </label>
        <input
          id="events-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          placeholder="Ieškoti pagal pavadinimą…"
          className="app-input mt-1"
          autoComplete="off"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="events-category"
            className="text-sm font-medium text-app-text"
          >
            Kategorija
          </label>
          <select
            id="events-category"
            value={category}
            onChange={(e) =>
              onCategoryChange(e.target.value as EventListCategoryFilter)
            }
            className="app-input mt-1"
          >
            {EVENT_LIST_CATEGORY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="events-sort"
            className="text-sm font-medium text-app-text"
          >
            Rūšiavimas pagal datą
          </label>
          <select
            id="events-sort"
            value={sortOrder}
            onChange={(e) => onSortOrderChange(e.target.value as EventSortOrder)}
            className="app-input mt-1"
          >
            {EVENT_SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
