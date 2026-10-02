import { formatLek, formatWhen } from "../lib/format.ts";
import { useOrder } from "../state/order-context.tsx";
import { EmptyState } from "./feedback.tsx";
import { OrderPanel } from "./order-panel.tsx";

export function OrdersPage() {
  const { receipts } = useOrder();

  return (
    <div className="orders-layout">
      <OrderPanel />
      <section className="panel">
        <header className="panel-head">
          <h2>Të konfirmuara</h2>
        </header>
        {receipts.length === 0 ? (
          <EmptyState
            title="Ende pa porosi të konfirmuara"
            text="Konfirmo porosinë aktuale që të ruhet këtu për këtë sesion."
          />
        ) : (
          <ul className="receipt-list">
            {receipts.map((receipt) => (
              <li key={receipt.id} className="receipt">
                <header>
                  <strong>{receipt.id}</strong>
                  <span>{formatWhen(receipt.createdAt)}</span>
                </header>
                <ul>
                  {receipt.lines.map((line) => (
                    <li key={line.productId}>
                      <span>
                        {line.name} × {line.quantity}
                      </span>
                      <span>{formatLek(line.unitPrice * line.quantity)}</span>
                    </li>
                  ))}
                </ul>
                <p className="receipt-total">
                  <span>Totali</span>
                  <strong>{formatLek(receipt.total)}</strong>
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
