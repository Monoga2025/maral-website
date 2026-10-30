"use client";
import Link from "next/link";
import { CartProvider, useCart } from "@/components/cart/CartProvider";
import { CartIcon, WaIcon } from "@/components/home/primitives";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import { whatsappUrl } from "@/lib/site";

function MobileBar() {
  const { count } = useCart();
  return <nav className="mx-mbar" aria-label="Acciones rápidas">
    <Link href="/carrito"><CartIcon />Cotización ({count})</Link>
    <a className="is-wa" href={whatsappUrl("Hola, quiero cotizar antenas Maral.")} target="_blank" rel="noreferrer"><WaIcon />WhatsApp</a>
  </nav>;
}

export function RouteChrome({ children }: Readonly<{ children: React.ReactNode }>) {
  return <CartProvider>
    <SiteHeader />
    <div id="contenido" tabIndex={-1} className="mx-content">{children}</div>
    <SiteFooter />
    <MobileBar />
  </CartProvider>;
}
