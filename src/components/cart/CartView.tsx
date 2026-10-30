"use client";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart, type CartItem } from "@/components/cart/CartProvider";
import { ShopHero } from "@/components/catalog/ShopHero";
import { WhatsAppIcon } from "@/components/product/ProductBuy";
import { categoryLabels, formatPrice, imageZoom, priceOf } from "@/lib/catalog";
import { quoteMessage, quoteTotals, useHydrated } from "@/lib/quote";
import { whatsappUrl } from "@/lib/site";

const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

function Row({ item, update, remove }: { item: CartItem; update: (id: string, quantity: number) => void; remove: (id: string) => void }) {
  const price = priceOf(item);
  const set = (value: number) => update(item.id, Math.min(99, Math.max(1, value)));
  const chip = item.frequency ? `${item.frequency}${item.gain ? ` · ${item.gain}` : ""}` : categoryLabels[item.category];
  return <li className="ms-line">
    <Link href={`/producto/${item.slug}`} className={`ms-line-media ${imageZoom(item)}`} tabIndex={-1} aria-hidden="true"><img src={item.image} alt="" loading="lazy" /></Link>
    <div className="ms-line-body">
      <span className="ms-line-sku">{item.sku} · {item.brand}</span>
      <h2 className="ms-line-name"><Link href={`/producto/${item.slug}`}>{item.name}</Link></h2>
      <span className="m-chip">{chip}</span>
    </div>
    <p className="ms-line-unit"><span className="ms-line-k">Unitario</span>{price !== null ? formatPrice(price) : "A cotizar"}</p>
    <div className="ms-qty" role="group" aria-label={`Cantidad de ${item.sku}`}>
      <button type="button" onClick={() => set(item.quantity - 1)} disabled={item.quantity <= 1} aria-label="Disminuir cantidad"><Minus size={16} aria-hidden /></button>
      <input inputMode="numeric" aria-label="Cantidad" value={item.quantity} onChange={(e) => set(Number(e.target.value.replace(/\D/g, "")) || 1)} />
      <button type="button" onClick={() => set(item.quantity + 1)} disabled={item.quantity >= 99} aria-label="Aumentar cantidad"><Plus size={16} aria-hidden /></button>
    </div>
    <p className="ms-line-total"><span className="ms-line-k">Total</span>{price !== null ? formatPrice(price * item.quantity) : <em>Por cotizar</em>}</p>
    <button type="button" className="ms-line-remove" onClick={() => remove(item.id)} aria-label={`Quitar ${item.name} de la cotización`}><Trash2 size={18} aria-hidden /></button>
  </li>;
}

export function QuoteSummary({ items, children }: { items: CartItem[]; children?: React.ReactNode }) {
  const { units, subtotal, pending } = quoteTotals(items);
  return <div className="ms-summary-card">
    <h2 className="m-display">Resumen</h2>
    <dl className="ms-sum">
      <div><dt>Referencias</dt><dd>{items.length}</dd></div>
      <div><dt>Unidades</dt><dd>{units}</dd></div>
      <div><dt>Subtotal publicado</dt><dd>{subtotal > 0 ? formatPrice(subtotal) : "—"}</dd></div>
      {pending > 0 && <div><dt>Por cotizar</dt><dd>{plural(pending, "referencia", "referencias")}</dd></div>}
    </dl>
    <p className="ms-sum-total"><span>Total</span><b>Se confirma con el asesor</b></p>
    {children}
  </div>;
}

export default function CartView() {
  const { items, update, remove, clear } = useCart();
  const hydrated = useHydrated();
  const [confirm, setConfirm] = useState(false);
  const { units } = quoteTotals(items);
  const message = quoteMessage(items);
  return <main className="ms-page ms-quote">
    <ShopHero compact eyebrow="Tu cotización" title="Cotización" meta={hydrated ? `${plural(items.length, "referencia", "referencias")} · ${plural(units, "unidad", "unidades")}` : " "} />
    <div className="m-wrap">
      {!hydrated ? <div className="ms-quote-wait" aria-busy="true" /> : !items.length ? <div className="ms-empty ms-quote-empty">
        <p className="ms-empty-code m-mono">0 referencias</p>
        <h2 className="m-display">Tu cotización está vacía</h2>
        <p>Agrega antenas, bases o kits desde el catálogo y envía la solicitud por WhatsApp. Un asesor confirma precio, disponibilidad y despacho.</p>
        <Link className="ms-btn ms-btn-primary" href="/tienda">Explorar catálogo<ArrowRight size={20} aria-hidden /></Link>
      </div> : <div className="ms-quote-grid">
        <section aria-label="Productos en la cotización">
          <div className="ms-lines-head" aria-hidden="true"><span>Producto</span><span>Unitario</span><span>Cantidad</span><span>Total</span><span /></div>
          <ul className="ms-lines">{items.map((item) => <Row key={item.id} item={item} update={update} remove={remove} />)}</ul>
          <div className="ms-lines-foot">
            <Link href="/tienda" className="ms-textlink">← Seguir agregando productos</Link>
            <button type="button" className="ms-textlink is-danger" onClick={() => { if (confirm) { clear(); setConfirm(false); } else setConfirm(true); }} onBlur={() => setConfirm(false)}>{confirm ? "¿Seguro? Vaciar cotización" : "Vaciar cotización"}</button>
          </div>
        </section>
        <aside className="ms-summary" aria-label="Resumen de la cotización">
          <QuoteSummary items={items}>
            <a className="ms-btn ms-btn-wa ms-btn-block" href={whatsappUrl(message)} target="_blank" rel="noreferrer"><WhatsAppIcon />Enviar por WhatsApp</a>
            <Link className="ms-btn ms-btn-ghost ms-btn-block" href="/checkout">Agregar datos de entrega</Link>
            <details className="ms-preview">
              <summary>Vista previa del mensaje</summary>
              <pre>{message}</pre>
            </details>
            <p className="ms-privacy">La solicitud se abre en WhatsApp; este sitio no envía ni guarda tus datos. La lista solo vive en este navegador.</p>
          </QuoteSummary>
        </aside>
      </div>}
    </div>
  </main>;
}
