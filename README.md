# MarketOne Operator Dashboard

A working prototype of a dashboard for a store operator using the MarketOne platform.

## Installation

Node.js 20 or newer is required.

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

Other commands:

```bash
npm run lint
npm run build
npm run preview
```

## Demo login

The form opens with the email already filled in.

| Field | Value |
| --- | --- |
| Email | `operator@marketone.local` |
| Password | `marketone` |


## Architecture

```text
src/
  components/   pages and interface pieces
  state/        context for login, the catalog, and the order
  services/     catalog loading via fetch
  lib/          filters, totals, and order rules
public/data/    products.json
```

Flow:

1. `AuthProvider` stores the session in `sessionStorage` after the demo credentials match.
2. `CatalogProvider` loads only after login and reads `/data/products.json`.
3. Catalog filters stay in the URL (`q`, `category`, `stock`), so the Home page can open a stock state.
4. `OrderProvider` keeps the lines with `useReducer`. Quantity cannot exceed stock. The total is price × quantity.
5. Confirmation clears the current order and keeps the invoice only for the session.

## Technical choices

- **React + TypeScript + Vite.** Product, order, and session types are checked at compile time.
- **Plain CSS**, with no UI library, so the styling structure stays readable.
- **React Router** for login, the catalog, and the order.
- **Local JSON through `fetch`**, not a direct import, so loading and error are real data flows.
- **Context + reducer** for login and the order. Quantity cannot exceed stock, and the total is price × quantity.
- Prices are in Albanian lek.
