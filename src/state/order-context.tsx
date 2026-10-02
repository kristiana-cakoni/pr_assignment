import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import type { ReactNode } from "react";
import { ORDER_KEY, SESSION_KEY } from "../lib/session.ts";
import { emptyOrder, orderCount, orderTotal, reduceOrder } from "../lib/order-model.ts";
import type { OrderAction, OrderData } from "../lib/order-model.ts";
import { useAuth } from "./auth-context.tsx";
import type { OrderLine, Product, Receipt } from "../types.ts";

type UiState = OrderData & { notice: string | null };
type UiAction = OrderAction | { type: "dismiss" };

type OrderContextValue = {
  lines: OrderLine[];
  receipts: Receipt[];
  notice: string | null;
  total: number;
  itemCount: number;
  addProduct: (product: Product) => void;
  setQuantity: (productId: string, quantity: number, stock: number) => void;
  removeLine: (productId: string) => void;
  clearOrder: () => void;
  confirmOrder: () => void;
  dismissNotice: () => void;
  quantityOf: (productId: string) => number;
};

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const sessionId = session?.email ?? null;
  const [trackedSession, setTrackedSession] = useState(sessionId);
  const [state, dispatch] = useReducer(uiReducer, undefined, readInitialOrder);

  if (trackedSession !== sessionId) {
    setTrackedSession(sessionId);
    if (!sessionId) dispatch({ type: "reset" });
  }

  useEffect(() => {
    if (!session) return;
    sessionStorage.setItem(
      ORDER_KEY,
      JSON.stringify({ lines: state.lines, receipts: state.receipts }),
    );
  }, [session, state.lines, state.receipts]);

  const addProduct = useCallback((product: Product) => {
    dispatch({ type: "add", product });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number, stock: number) => {
    dispatch({ type: "setQty", productId, quantity, stock });
  }, []);

  const removeLine = useCallback((productId: string) => {
    dispatch({ type: "remove", productId });
  }, []);

  const clearOrder = useCallback(() => {
    dispatch({ type: "clear" });
  }, []);

  const confirmOrder = useCallback(() => {
    dispatch({
      type: "confirm",
      createdAt: new Date().toISOString(),
    });
  }, []);

  const dismissNotice = useCallback(() => {
    dispatch({ type: "dismiss" });
  }, []);

  const quantityOf = useCallback(
    (productId: string) =>
      state.lines.find((line) => line.productId === productId)?.quantity ?? 0,
    [state.lines],
  );

  const value = useMemo<OrderContextValue>(
    () => ({
      lines: state.lines,
      receipts: state.receipts,
      notice: state.notice,
      total: orderTotal(state.lines),
      itemCount: orderCount(state.lines),
      addProduct,
      setQuantity,
      removeLine,
      clearOrder,
      confirmOrder,
      dismissNotice,
      quantityOf,
    }),
    [
      state,
      addProduct,
      setQuantity,
      removeLine,
      clearOrder,
      confirmOrder,
      dismissNotice,
      quantityOf,
    ],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder(): OrderContextValue {
  const value = useContext(OrderContext);
  if (!value) throw new Error("useOrder must be used within OrderProvider");
  return value;
}

function uiReducer(state: UiState, action: UiAction): UiState {
  if (action.type === "dismiss") return { ...state, notice: null };
  const result = reduceOrder({ lines: state.lines, receipts: state.receipts }, action);
  return { ...result.state, notice: result.notice };
}

function readInitialOrder(): UiState {
  return { ...readStoredOrder(), notice: null };
}

function readStoredOrder(): OrderData {
  try {
    if (!sessionStorage.getItem(SESSION_KEY)) return emptyOrder();
    const raw = sessionStorage.getItem(ORDER_KEY);
    if (!raw) return emptyOrder();
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return emptyOrder();
    const record = parsed as Record<string, unknown>;
    const lines = Array.isArray(record.lines) ? record.lines.filter(isOrderLine) : [];
    const receipts = Array.isArray(record.receipts) ? record.receipts.filter(isReceipt) : [];
    return { lines, receipts };
  } catch {
    return emptyOrder();
  }
}

function isOrderLine(value: unknown): value is OrderLine {
  if (!value || typeof value !== "object") return false;
  const line = value as Record<string, unknown>;
  return (
    typeof line.productId === "string" &&
    typeof line.name === "string" &&
    typeof line.category === "string" &&
    typeof line.unitPrice === "number" &&
    Number.isFinite(line.unitPrice) &&
    typeof line.quantity === "number" &&
    Number.isInteger(line.quantity) &&
    line.quantity > 0
  );
}

function isReceipt(value: unknown): value is Receipt {
  if (!value || typeof value !== "object") return false;
  const receipt = value as Record<string, unknown>;
  return (
    typeof receipt.id === "string" &&
    typeof receipt.createdAt === "string" &&
    typeof receipt.total === "number" &&
    Array.isArray(receipt.lines) &&
    receipt.lines.every(isOrderLine)
  );
}
