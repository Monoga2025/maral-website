"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { CartIcon, WaIcon } from "@/components/home/primitives";
import { categoryGroups } from "@/lib/catalog";
import { site, whatsappUrl } from "@/lib/site";

const menu = [
  ...categoryGroups.map((group) => ({ href: `/categoria/${group.slug}`, label: group.label })),
  { href: "/tienda", label: "Catálogo completo" },
  { href: "/contacto", label: "Contacto" },
];

export function MaralLogo({ size = "md" }: { size?: "md" | "xl" }) {
  return <span className={`mx-logo mx-logo--${size}`}><img src="/sites/industrias-maral/maral-mark.svg" alt="" width={60} height={50} /><b>{site.name}</b></span>;
}

function SearchForm({ id }: { id: string }) {
  return <form className="mx-search" action="/tienda" role="search">
    <button type="submit" aria-label="Buscar"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" strokeWidth="1.8" /><path d="m15.5 15.5 5 5" stroke="currentColor" strokeWidth="1.8" /></svg></button>
    <label htmlFor={id} className="mx-sr">Buscar productos</label>
    <input id={id} name="q" type="search" placeholder="Buscar antena, referencia o frecuencia" autoComplete="off" />
  </form>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { count } = useCart();
  const path = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("mx-locked");
    return () => { document.removeEventListener("keydown", onKey); document.documentElement.classList.remove("mx-locked"); };
  }, [open]);

  const isOn = (href: string) => path === href || (href !== "/tienda" && path.startsWith(`${href}/`));

  return <header className={`mx-header ${scrolled ? "is-scrolled" : ""} ${open ? "is-open" : ""}`}>
    <a className="mx-skip" href="#contenido">Saltar al contenido</a>
    <div className="mx-bar m-wrap">
      <Link href="/" className="mx-home" aria-label={`${site.name}, inicio`} onClick={() => setOpen(false)}><MaralLogo /></Link>
      <SearchForm id="mx-q" />
      <div className="mx-actions">
        <a className="mx-wa" href={whatsappUrl("Hola, quiero cotizar antenas Maral.")} target="_blank" rel="noreferrer"><WaIcon /><span>WhatsApp</span></a>
        <span className="mx-vsep" aria-hidden="true" />
        <Link className="mx-quote" href="/carrito" aria-label={`Cotización, ${count} productos`}><CartIcon /><span className="mx-quote-l">Cotización</span><span className="mx-quote-n">({count})</span></Link>
        <button type="button" className="mx-burger" onClick={() => setOpen(!open)} aria-label={open ? "Cerrar menú" : "Abrir menú"} aria-expanded={open} aria-controls="mx-menu"><i /><i /><i /></button>
      </div>
    </div>
    <nav className="mx-nav" aria-label="Categorías">
      <ul className="m-wrap">
        {menu.map((item) => <li key={item.href}><Link href={item.href} aria-current={isOn(item.href) ? "page" : undefined}>{item.label}</Link></li>)}
        <li className="mx-nav-meta m-mono">Despachos a todo Colombia</li>
      </ul>
    </nav>
    <div id="mx-menu" className="mx-drawer" hidden={!open}>
      <div className="m-wrap">
        <SearchForm id="mx-q-m" />
        <nav aria-label="Menú móvil">
          <ul>{menu.map((item, i) => <li key={item.href}><Link href={item.href} onClick={() => setOpen(false)} aria-current={isOn(item.href) ? "page" : undefined}><span className="m-mono">{String(i + 1).padStart(2, "0")}</span>{item.label}</Link></li>)}</ul>
        </nav>
        <p className="mx-drawer-meta m-mono"><a href={`mailto:${site.email}`}>{site.email}</a><span>{site.location}</span></p>
      </div>
    </div>
  </header>;
}
