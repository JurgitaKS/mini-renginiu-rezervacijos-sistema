export function formatEventDate(date: string): string {
  return new Date(date + "T00:00:00").toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatEventTime(time: string): string {
  return time.slice(0, 5);
}

export function formatEventDateTime(date: string, time: string): string {
  return `${formatEventDate(date)}, ${formatEventTime(time)}`;
}

export function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("lt-LT", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
