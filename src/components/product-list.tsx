import { formatLek } from "../lib/format.ts";
import { stockMeta } from "../lib/catalog.ts";
import { useOrder } from "../state/order-context.tsx";
import type { Product } from "../types.ts";

export function ProductList({ products }: { products: Product[] }) {
  const { addProduct, quantityOf } = useOrder();

  return (
    <>
      <div className="table-wrap">
        <table className="product-table">
          <caption className="sr-only">Katalogu i produkteve</caption>
          <thead>
            <tr>
              <th>Produkti</th>
              <th>Kategoria</th>
              <th>Çmimi</th>
              <th>Stoku</th>
              <th>
                <span className="sr-only">Veprimi</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const meta = stockMeta(product.stock);
              const inOrder = quantityOf(product.id);
              return (
                <tr key={product.id} className={product.stock === 0 ? "is-out" : undefined}>
                  <td>
                    <span className="product-name">{product.name}</span>
                    <span className="product-barcode">{product.barcode}</span>
                  </td>
                  <td>{product.category}</td>
                  <td className="price">
                    {formatLek(product.price)}
                    <span className="unit"> / {product.unit}</span>
                  </td>
                  <td>
                    <span className={`stock-pill is-${meta.tone}`}>{meta.label}</span>
                  </td>
                  <td>
                    <AddButton
                      product={product}
                      inOrder={inOrder}
                      onAdd={() => addProduct(product)}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="product-cards">
        {products.map((product) => {
          const meta = stockMeta(product.stock);
          const inOrder = quantityOf(product.id);
          return (
            <article key={product.id} className="product-card">
              <header>
                <h3>{product.name}</h3>
                <span className={`stock-pill is-${meta.tone}`}>{meta.label}</span>
              </header>
              <p>{product.category}</p>
              <p className="product-barcode">{product.barcode}</p>
              <footer>
                <strong>
                  {formatLek(product.price)}
                  <span className="unit"> / {product.unit}</span>
                </strong>
                <AddButton product={product} inOrder={inOrder} onAdd={() => addProduct(product)} />
              </footer>
            </article>
          );
        })}
      </div>
    </>
  );
}

function AddButton({
  product,
  inOrder,
  onAdd,
}: {
  product: Product;
  inOrder: number;
  onAdd: () => void;
}) {
  const atLimit = product.stock <= 0 || inOrder >= product.stock;
  const label =
    product.stock <= 0 ? "Pa stok" : inOrder >= product.stock ? "Maksimumi" : "Shto";

  return (
    <button
      type="button"
      className="btn btn-navy"
      disabled={atLimit}
      aria-label={
        atLimit ? `${label}: ${product.name}` : `Shto ${product.name} në porosi`
      }
      onClick={onAdd}
    >
      {label}
      {inOrder > 0 && !atLimit ? ` · ${inOrder}` : ""}
    </button>
  );
}
