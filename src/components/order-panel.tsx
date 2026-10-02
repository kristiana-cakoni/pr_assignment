import { Link, useLocation } from "react-router-dom";
import { formatLek } from "../lib/format.ts";
import { useCatalog } from "../state/catalog-context.tsx";
import { useOrder } from "../state/order-context.tsx";
import { EmptyState } from "./feedback.tsx";

export function OrderPanel() {
  const { products } = useCatalog();
  const order = useOrder();
  const onProducts = useLocation().pathname === "/products";

  return (
    <section className="order-panel" aria-labelledby="order-heading">
      <header className="order-panel-head">
        <h2 id="order-heading">Porosia</h2>
        <span>{order.itemCount} artikuj</span>
      </header>

      {order.lines.length === 0 ? (
        <EmptyState
          title="Porosia është bosh"
          text="Shtoni produkte nga katalogu. Totali përditësohet sapo shtohet një rresht."
          action={
            onProducts ? undefined : (
              <Link to="/products" className="btn btn-navy">
                Hap katalogun
              </Link>
            )
          }
        />
      ) : (
        <ul className="order-lines">
          {order.lines.map((line) => {
            const stock =
              products.find((product) => product.id === line.productId)?.stock ?? line.quantity;
            return (
              <li key={line.productId} className="order-line">
                <div>
                  <strong>{line.name}</strong>
                  <small>
                    {line.category} · {formatLek(line.unitPrice)}
                  </small>
                </div>
                <span className="line-total">{formatLek(line.unitPrice * line.quantity)}</span>
                <div className="qty">
                  <button
                    type="button"
                    aria-label={`Ul sasinë për ${line.name}`}
                    onClick={() => order.setQuantity(line.productId, line.quantity - 1, stock)}
                  >
                    −
                  </button>
                  <span>{line.quantity}</span>
                  <button
                    type="button"
                    aria-label={`Rrit sasinë për ${line.name}`}
                    disabled={line.quantity >= stock}
                    onClick={() => order.setQuantity(line.productId, line.quantity + 1, stock)}
                  >
                    +
                  </button>
                </div>
                <button
                  type="button"
                  className="btn btn-text"
                  onClick={() => order.removeLine(line.productId)}
                >
                  Hiq
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <footer className="order-foot">
        <div className="order-total">
          <span>Totali</span>
          <strong>{formatLek(order.total)}</strong>
        </div>
        <button
          type="button"
          className="btn btn-brand btn-block"
          disabled={order.lines.length === 0}
          onClick={() => order.confirmOrder()}
        >
          Konfirmo porosinë
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          disabled={order.lines.length === 0}
          onClick={order.clearOrder}
        >
          Pastro
        </button>
      </footer>
    </section>
  );
}

export function OrderDock() {
  const { itemCount, total } = useOrder();

  return (
    <Link to="/orders" className="order-dock">
      <span>
        <strong>Porosia</strong>
        <small>{itemCount === 0 ? "Asnjë artikull" : `${itemCount} artikuj`}</small>
      </span>
      <strong>{formatLek(total)}</strong>
    </Link>
  );
}
