import type { Metadata } from "next";
import { CheckoutView } from "@/components/cart/CheckoutView";

export const metadata: Metadata = { title: "Datos de entrega | MARAL" };

export default function Checkout() {
  return <CheckoutView />;
}
