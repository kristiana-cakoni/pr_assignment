import type { Product } from "../types.ts";

const CATALOG_URL = "/data/products.json";
const LOAD_DELAY_MS = 800;

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  await wait(LOAD_DELAY_MS, signal);

  let response: Response;
  try {
    response = await fetch(CATALOG_URL, { signal });
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new Error("Nuk u arrit lidhja me katalogun. Kontrolloni lidhjen dhe provoni përsëri.");
  }

  if (!response.ok) {
    throw new Error("Katalogu i produkteve nuk u ngarkua.");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch (error) {
    if (isAbortError(error)) throw error;
    throw new Error("Përgjigjja e katalogut nuk është JSON i vlefshëm.");
  }

  if (!Array.isArray(payload) || !payload.every(isProduct)) {
    throw new Error("Të dhënat e katalogut kanë format të pavlefshëm.");
  }

  return payload;
}

export function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

function isProduct(value: unknown): value is Product {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    item.id.trim() !== "" &&
    typeof item.name === "string" &&
    item.name.trim() !== "" &&
    typeof item.category === "string" &&
    item.category.trim() !== "" &&
    typeof item.barcode === "string" &&
    typeof item.unit === "string" &&
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0 &&
    typeof item.stock === "number" &&
    Number.isInteger(item.stock) &&
    item.stock >= 0
  );
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);

    const onAbort = () => {
      window.clearTimeout(timeoutId);
      reject(new DOMException("Aborted", "AbortError"));
    };

    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
