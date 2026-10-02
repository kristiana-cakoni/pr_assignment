import { Link } from "react-router-dom";
import { LOW_STOCK_MAX } from "../lib/catalog.ts";
import { formatLek } from "../lib/format.ts";
import { useAuth } from "../state/auth-context.tsx";
import { useCatalog } from "../state/catalog-context.tsx";
import { useOrder } from "../state/order-context.tsx";
import { EmptyState, ErrorState } from "./feedback.tsx";

export function HomePage() {
  const { session } = useAuth();
  const { products, status, error, reload } = useCatalog();
  const { itemCount, total } = useOrder();
  const lowStock = products
    .filter((product) => product.stock > 0 && product.stock <= LOW_STOCK_MAX)
    .sort((left, right) => left.stock - right.stock);
  const outCount = products.filter((product) => product.stock === 0).length;
  const inCount = products.filter((product) => product.stock > 0).length;

  return (
    <section className="home">
      <p className="eyebrow">MarketOne</p>
      <h2>Mirë se vjen, {displayName(session?.email ?? "")}</h2>
      <p className="lede">
        Zgjidh produkte nga katalogu dhe ndërto porosinë e operatorit.
      </p>

      {status === "loading" && (
        <div className="stat-grid" aria-busy="true" aria-live="polite">
          <p className="sr-only">Duke ngarkuar përmbledhjen…</p>
          {["a", "b", "c", "d"].map((key) => (
            <div className="stat-card" key={key}>
              <span className="skeleton" />
              <span className="skeleton skeleton-sm" />
            </div>
          ))}
        </div>
      )}

      {status === "error" && error && <ErrorState message={error} onRetry={reload} />}

      {status === "ready" && (
        <>
          <div className="stat-grid">
            <article className="stat-card">
              <span>Produkte</span>
              <strong>{products.length}</strong>
            </article>
            <Link className="stat-card stat-link" to="/products?stock=in">
              <span>Në stok</span>
              <strong>{inCount}</strong>
            </Link>
            <Link className="stat-card stat-link" to="/products?stock=low">
              <span>Stok i ulët</span>
              <strong>{lowStock.length}</strong>
            </Link>
            <Link className="stat-card stat-link" to="/products?stock=out">
              <span>Pa stok</span>
              <strong>{outCount}</strong>
            </Link>
          </div>

          <div className="home-grid">
            <section className="panel">
              <header className="panel-head">
                <h3>Stok i ulët</h3>
                <Link to="/products?stock=low">Shiko të gjitha</Link>
              </header>
              {lowStock.length === 0 ? (
                <EmptyState
                  title="Asnjë stok i ulët"
                  text="Produktet me 1 deri në 5 njësi do të shfaqen këtu."
                />
              ) : (
                <ul className="low-list">
                  {lowStock.slice(0, 5).map((product) => (
                    <li key={product.id}>
                      <div>
                        <strong>{product.name}</strong>
                        <small>{product.category}</small>
                      </div>
                      <span className="stock-pill is-low">
                        {product.stock} {product.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="panel">
              <header className="panel-head">
                <h3>Porosia aktuale</h3>
              </header>
              <p className="order-snapshot">
                <strong>{formatLek(total)}</strong>
                <span>{itemCount === 0 ? "Ende pa artikuj" : `${itemCount} artikuj`}</span>
              </p>
              <div className="button-row">
                <Link to="/products" className="btn btn-navy">
                  Hap katalogun
                </Link>
                <Link to="/orders" className="btn btn-ghost">
                  Hap porosinë
                </Link>
              </div>
            </section>
          </div>
        </>
      )}
    </section>
  );
}

function displayName(email: string): string {
  const local = email.split("@")[0] ?? "operator";
  return local.charAt(0).toUpperCase() + local.slice(1);
}
