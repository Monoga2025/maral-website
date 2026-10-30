"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/catalog";
export default function AddToCartButton({ product, quantity = 1 }: { product: Product; quantity?: number }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return <button className="button primary add" onClick={() => { add(product, quantity); setAdded(true); }}>{added ? "✓ Agregado" : "Agregar a cotización"}</button>;
}
