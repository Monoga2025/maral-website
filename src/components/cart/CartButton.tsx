"use client";
import Link from "next/link";
import { FileText } from "lucide-react";
import { useCart } from "./CartProvider";
export default function CartButton() {
  const { count } = useCart();
  return <Link className="cart-button" href="/carrito" aria-label={`Cotización con ${count} productos`}>
    <FileText size={18} aria-hidden />Cotización<span className="cart-count" aria-hidden="true">{count}</span>
  </Link>;
}
