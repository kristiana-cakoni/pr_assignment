import type { Product } from "../types.ts";

export const LOW_STOCK_MAX = 5;

export const CATEGORY_ORDER = [
  "Të freskëta",
  "Produkte ushqimore",
  "Bulmet",
  "Mish dhe produkte mishi",
  "Të thata",
  "Jo ushqimore",
  "Pije",
  "Të konservuara",
] as const;

export type StockFilter = "all" | "in" | "low" | "out";
export type StockTone = "ok" | "low" | "out";

export type CategoryCount = {
  name: string;
  count: number;
};

export function parseStock(value: string | null): StockFilter {
  if (value === "in" || value === "low" || value === "out") return value;
  return "all";
}

export function normalizeSearch(value: string): string {
  return value
    .toLocaleLowerCase("sq")
    .replaceAll("ë", "e")
    .replaceAll("ç", "c");
}

export function filterProducts(
  products: readonly Product[],
  query: string,
  category: string,
  stock: StockFilter,
): Product[] {
  const needle = normalizeSearch(query.trim());
  const barcodeNeedle = query.trim();

  return products.filter((product) => {
    const matchesQuery =
      needle.length === 0 ||
      normalizeSearch(product.name).includes(needle) ||
      normalizeSearch(product.category).includes(needle) ||
      product.barcode.includes(barcodeNeedle);

    const matchesCategory = category === "all" || product.category === category;

    const matchesStock =
      stock === "all" ||
      (stock === "in" && product.stock > 0) ||
      (stock === "low" && product.stock > 0 && product.stock <= LOW_STOCK_MAX) ||
      (stock === "out" && product.stock === 0);

    return matchesQuery && matchesCategory && matchesStock;
  });
}

export function categoriesOf(products: readonly Product[]): CategoryCount[] {
  const counts = new Map<string, number>();
  for (const product of products) {
    counts.set(product.category, (counts.get(product.category) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((left, right) => rank(left[0]) - rank(right[0]))
    .map(([name, count]) => ({ name, count }));
}

export function stockMeta(stock: number): { label: string; tone: StockTone } {
  if (stock <= 0) return { label: "Pa stok", tone: "out" };
  if (stock <= LOW_STOCK_MAX) return { label: `${stock} · stok i ulët`, tone: "low" };
  return { label: `${stock} në stok`, tone: "ok" };
}

function rank(category: string): number {
  const index = CATEGORY_ORDER.findIndex((item) => item === category);
  return index === -1 ? CATEGORY_ORDER.length : index;
}
