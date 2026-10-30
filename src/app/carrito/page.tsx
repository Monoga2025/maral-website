import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Tu cotización | MARAL" };

export default function Carrito() {
  return <CartView />;
}
