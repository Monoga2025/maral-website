"use client";
import { useState } from "react";
import type { Product } from "@/lib/catalog";
import { useCart } from "./CartProvider";

export default function QuickAddToQuote({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const { add } = useCart();
  return <div className="quick-add">
    <div className="quantity-control" aria-label={`Cantidad para ${product.name}`}>
      <button type="button" aria-label="Disminuir cantidad" onClick={() => setQuantity((current) => Math.max(1, current - 1))}>−</button>
      <output aria-live="polite">{quantity}</output>
      <button type="button" aria-label="Aumentar cantidad" onClick={() => setQuantity((current) => Math.min(99, current + 1))}>+</button>
    </div>
    <button type="button" className="button primary" onClick={() => { add(product, quantity); setMessage(`${quantity} agregado${quantity === 1 ? "" : "s"} a la cotización`); }}>Agregar</button>
    <span className="quick-add-message" role="status">{message}</span>
  </div>;
}
