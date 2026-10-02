import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { fetchProducts, isAbortError } from "../services/products.ts";
import type { Product } from "../types.ts";

export type CatalogStatus = "loading" | "error" | "ready";

type CatalogContextValue = {
  products: Product[];
  status: CatalogStatus;
  error: string | null;
  reload: () => void;
};

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<CatalogStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const reload = useCallback(() => {
    setStatus("loading");
    setError(null);
    setRequestId((current) => current + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    fetchProducts(controller.signal)
      .then((next) => {
        setProducts(next);
        setStatus("ready");
      })
      .catch((caught: unknown) => {
        if (isAbortError(caught)) return;
        setProducts([]);
        setStatus("error");
        setError(caught instanceof Error ? caught.message : "Gabim i papritur.");
      });

    return () => controller.abort();
  }, [requestId]);

  const value = useMemo(
    () => ({ products, status, error, reload }),
    [products, status, error, reload],
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog(): CatalogContextValue {
  const value = useContext(CatalogContext);
  if (!value) throw new Error("useCatalog must be used within CatalogProvider");
  return value;
}
