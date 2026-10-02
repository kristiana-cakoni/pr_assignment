import type { OrderLine, Product, Receipt } from "../types.ts";

export type OrderData = {
  lines: OrderLine[];
  receipts: Receipt[];
};

export type OrderAction =
  | { type: "add"; product: Product }
  | { type: "setQty"; productId: string; quantity: number; stock: number }
  | { type: "remove"; productId: string }
  | { type: "clear" }
  | { type: "confirm"; createdAt: string }
  | { type: "reset" };

export type OrderResult = {
  state: OrderData;
  notice: string | null;
};

export function emptyOrder(): OrderData {
  return { lines: [], receipts: [] };
}

export function orderTotal(lines: readonly OrderLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
}

export function orderCount(lines: readonly OrderLine[]): number {
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export function reduceOrder(state: OrderData, action: OrderAction): OrderResult {
  switch (action.type) {
    case "add":
      return addProduct(state, action.product);
    case "setQty":
      return setQuantity(state, action.productId, action.quantity, action.stock);
    case "remove":
      return {
        state: {
          ...state,
          lines: state.lines.filter((line) => line.productId !== action.productId),
        },
        notice: null,
      };
    case "clear":
      return { state: { ...state, lines: [] }, notice: null };
    case "confirm":
      return confirmOrder(state, action.createdAt);
    case "reset":
      return { state: emptyOrder(), notice: null };
    default:
      return { state, notice: null };
  }
}

function addProduct(state: OrderData, product: Product): OrderResult {
  if (product.stock <= 0) {
    return { state, notice: `${product.name} nuk ka stok.` };
  }

  const existing = state.lines.find((line) => line.productId === product.id);
  if (existing && existing.quantity >= product.stock) {
    return {
      state,
      notice: `Sasia maksimale për ${product.name} është ${product.stock}.`,
    };
  }

  const quantity = existing ? existing.quantity + 1 : 1;
  const lines = existing
    ? state.lines.map((line) =>
        line.productId === product.id ? { ...line, quantity } : line,
      )
    : [
        ...state.lines,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          unitPrice: product.price,
          quantity,
        },
      ];

  return {
    state: { ...state, lines },
    notice: `${product.name} u shtua. Sasia: ${quantity}.`,
  };
}

function setQuantity(
  state: OrderData,
  productId: string,
  quantity: number,
  stock: number,
): OrderResult {
  if (quantity < 1) {
    return {
      state: {
        ...state,
        lines: state.lines.filter((line) => line.productId !== productId),
      },
      notice: null,
    };
  }

  const nextQuantity = Math.min(quantity, Math.max(stock, 0));
  return {
    state: {
      ...state,
      lines: state.lines.map((line) =>
        line.productId === productId ? { ...line, quantity: nextQuantity } : line,
      ),
    },
    notice: nextQuantity === quantity ? null : `Sasia u kufizua në ${nextQuantity}.`,
  };
}

function confirmOrder(state: OrderData, createdAt: string): OrderResult {
  if (state.lines.length === 0) {
    return { state, notice: "Porosia është bosh." };
  }

  const receipt: Receipt = {
    id: `MO-${1041 + state.receipts.length}`,
    createdAt,
    lines: state.lines.map((line) => ({ ...line })),
    total: orderTotal(state.lines),
  };

  return {
    state: {
      lines: [],
      receipts: [receipt, ...state.receipts],
    },
    notice: `Porosia ${receipt.id} u regjistrua.`,
  };
}
