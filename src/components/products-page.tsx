import { useSearchParams } from "react-router-dom";
import { filterProducts, parseStock } from "../lib/catalog.ts";
import type { StockFilter } from "../lib/catalog.ts";
import { Icon } from "./icons.tsx";
import { useCatalog } from "../state/catalog-context.tsx";
import { CategoryPanel } from "./category-panel.tsx";
import { EmptyState, ErrorState, ProductSkeleton } from "./feedback.tsx";
import { OrderPanel } from "./order-panel.tsx";
import { ProductList } from "./product-list.tsx";

export function ProductsPage() {
  const { products, status, error, reload } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "all";
  const stock = parseStock(searchParams.get("stock"));
  const filtered = status === "ready" ? filterProducts(products, query, category, stock) : [];
  const filtersActive = query.trim() !== "" || category !== "all" || stock !== "all";

  function setFilters(next: { q?: string; category?: string; stock?: StockFilter }) {
    const q = next.q ?? query;
    const nextCategory = next.category ?? category;
    const nextStock = next.stock ?? stock;
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q);
    if (nextCategory !== "all") params.set("category", nextCategory);
    if (nextStock !== "all") params.set("stock", nextStock);
    setSearchParams(params, { replace: true });
  }

  function clearFilters() {
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  return (
    <div className="catalog">
      <CategoryPanel
        products={products}
        status={status}
        category={category}
        onCategory={(next) => setFilters({ category: next })}
      />

      <section className="catalog-main">
        <div className="toolbar">
          <label className="search">
            <span className="sr-only">Kërko produkte</span>
            <Icon name="search" />
            <input
              type="search"
              value={query}
              placeholder="Kërko emër ose barkod"
              onChange={(event) => setFilters({ q: event.target.value })}
            />
          </label>

          <label className="filter">
            <span>Gjendja</span>
            <select
              value={stock}
              onChange={(event) => setFilters({ stock: parseStock(event.target.value) })}
            >
              <option value="all">Të gjitha</option>
              <option value="in">Në stok</option>
              <option value="low">Stok i ulët</option>
              <option value="out">Pa stok</option>
            </select>
          </label>

          {status === "ready" && (
            <p className="result-count">
              {filtered.length} {filtered.length === 1 ? "produkt" : "produkte"}
            </p>
          )}

          {filtersActive && (
            <button type="button" className="btn btn-text" onClick={clearFilters}>
              Pastro filtrat
            </button>
          )}

          <button type="button" className="btn btn-ghost" onClick={reload} disabled={status === "loading"}>
            Rifresko
          </button>
        </div>

        {status === "loading" && <ProductSkeleton />}
        {status === "error" && error && <ErrorState message={error} onRetry={reload} />}
        {status === "ready" && filtered.length === 0 && (
          <EmptyState
            title="Nuk u gjet asnjë produkt"
            text="Ndryshoni kërkimin, kategorinë ose gjendjen në stok."
            action={
              filtersActive ? (
                <button type="button" className="btn btn-navy" onClick={clearFilters}>
                  Pastro filtrat
                </button>
              ) : undefined
            }
          />
        )}
        {status === "ready" && filtered.length > 0 && <ProductList products={filtered} />}
      </section>

      <aside className="catalog-order">
        <OrderPanel />
      </aside>
    </div>
  );
}
