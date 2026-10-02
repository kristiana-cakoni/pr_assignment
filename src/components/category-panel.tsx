import { categoriesOf } from "../lib/catalog.ts";
import type { CatalogStatus } from "../state/catalog-context.tsx";
import type { Product } from "../types.ts";

export function CategoryPanel({
  products,
  status,
  category,
  onCategory,
}: {
  products: Product[];
  status: CatalogStatus;
  category: string;
  onCategory: (category: string) => void;
}) {
  const categories = categoriesOf(products);

  return (
    <>
      <label className="category-select">
        <span>Kategoria</span>
        <select
          value={categories.some((item) => item.name === category) ? category : "all"}
          onChange={(event) => onCategory(event.target.value)}
          disabled={status !== "ready"}
        >
          <option value="all">Të gjitha ({products.length})</option>
          {categories.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name} ({item.count})
            </option>
          ))}
        </select>
      </label>

      <aside className="category-panel">
        <header>
          <h2>Kategoritë</h2>
        </header>
        {status !== "ready" ? (
          <p className="muted">Kategoritë shfaqen pasi të ngarkohet katalogu.</p>
        ) : (
          <ul className="category-list">
            <li>
              <button
                type="button"
                className={category === "all" ? "is-active" : undefined}
                onClick={() => onCategory("all")}
              >
                <span>Të gjitha</span>
                <small>{products.length}</small>
              </button>
            </li>
            {categories.map((item) => (
              <li key={item.name}>
                <button
                  type="button"
                  className={category === item.name ? "is-active" : undefined}
                  onClick={() => onCategory(item.name)}
                >
                  <span>{item.name}</span>
                  <small>{item.count}</small>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </>
  );
}
