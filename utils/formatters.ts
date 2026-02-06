export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function formatList(items: string[]): string {
  return items.filter(Boolean).join(", ") || "—";
}
