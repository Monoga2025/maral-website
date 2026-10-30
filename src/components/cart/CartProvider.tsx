"use client";
import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import type { Product } from "@/lib/catalog";
export type CartItem = Product & { quantity: number };
type CartContextValue = { items: CartItem[]; count: number; add: (product: Product, quantity?: number) => void; update: (id: string, quantity: number) => void; remove: (id: string) => void; clear: () => void };
const CartContext = createContext<CartContextValue | null>(null);
const key = "maral-quote-v2";
const emptySnapshot: CartItem[] = [];
let snapshot = emptySnapshot;
let initialized = false;
const listeners = new Set<() => void>();
function readSnapshot() {
  if (!initialized && typeof window !== "undefined") {
    initialized = true;
    try {
      const parsed: unknown = JSON.parse(window.localStorage.getItem(key) ?? "[]");
      if (Array.isArray(parsed)) snapshot = parsed as CartItem[];
    } catch { snapshot = emptySnapshot; }
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  if (typeof window !== "undefined") {
    const onStorage = (event: StorageEvent) => {
      if (event.key === key || event.key === null) {
        initialized = false;
        readSnapshot();
        listener();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
  }
  return () => listeners.delete(listener);
}
function publish(next: CartItem[]) {
  snapshot = next;
  initialized = true;
  try { window.localStorage.setItem(key, JSON.stringify(next)); } catch { /* Storage can be unavailable; in-memory cart remains usable. */ }
  listeners.forEach((listener) => listener());
}
export function CartProvider({ children }: { children: React.ReactNode }) {
  const items = useSyncExternalStore(subscribe, readSnapshot, () => emptySnapshot);
  const add = useCallback((product: Product, quantity = 1) => {
    if (!Number.isInteger(quantity) || quantity < 1) return;
    const current = readSnapshot();
    const found = current.find((item) => item.id === product.id);
    publish(found
      ? current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item)
      : [...current, { ...product, quantity }]);
  }, []);
  const update = useCallback((id: string, quantity: number) => publish(quantity > 0
    ? readSnapshot().map((item) => item.id === id ? { ...item, quantity } : item)
    : readSnapshot().filter((item) => item.id !== id)), []);
  const remove = useCallback((id: string) => publish(readSnapshot().filter((item) => item.id !== id)), []);
  const clear = useCallback(() => publish([]), []);
  const value = useMemo(() => ({ items, count: items.reduce((total, item) => total + item.quantity, 0), add, update, remove, clear }), [items, add, update, remove, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
