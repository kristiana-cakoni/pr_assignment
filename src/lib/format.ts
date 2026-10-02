export function formatLek(value: number): string {
  const formatted = new Intl.NumberFormat("sq-AL", {
    maximumFractionDigits: 0,
  }).format(value);
  return `${formatted} Lekë`;
}

export function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("sq-AL", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
