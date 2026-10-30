"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { QuoteSummary } from "@/components/cart/CartView";
import { ShopHero } from "@/components/catalog/ShopHero";
import { WhatsAppIcon } from "@/components/product/ProductBuy";
import { formatPrice, imageZoom, priceOf } from "@/lib/catalog";
import { quoteMessage, useHydrated } from "@/lib/quote";
import { whatsappUrl } from "@/lib/site";

const fields = [
  { name: "Nombre", label: "Nombre completo", autoComplete: "name", required: true },
  { name: "Empresa", label: "Empresa", autoComplete: "organization", optional: true },
  { name: "Teléfono", label: "Teléfono", autoComplete: "tel", type: "tel", required: true },
  { name: "Ciudad", label: "Ciudad de entrega", autoComplete: "address-level2", required: true },
] as const;

export function CheckoutView() {
  const { items } = useCart();
  const hydrated = useHydrated();
  const [sentUrl, setSentUrl] = useState("");
  return <main className="ms-page ms-quote">
    <ShopHero compact eyebrow="Solicitud de cotización" title="Datos de entrega" meta="Paso 2 de 2 · WhatsApp" />
    <div className="m-wrap">
      {!hydrated ? <div className="ms-quote-wait" aria-busy="true" /> : !items.length ? <div className="ms-empty ms-quote-empty">
        <p className="ms-empty-code m-mono">0 referencias</p>
        <h2 className="m-display">Agrega productos antes de continuar</h2>
        <p>Tu cotización está vacía. Elige referencias en el catálogo y vuelve aquí para enviar la solicitud.</p>
        <Link className="ms-btn ms-btn-primary" href="/tienda">Ir al catálogo<ArrowRight size={20} aria-hidden /></Link>
      </div> : <form className="ms-quote-grid" onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const contact = Object.fromEntries([...fields.map((field) => field.name), "Notas"].map((name) => [name, String(data.get(name) ?? "")]));
        const url = whatsappUrl(quoteMessage(items, contact));
        setSentUrl(url);
        window.open(url, "_blank", "noopener");
      }}>
        <section className="ms-form" aria-labelledby="ms-form-title">
          <h2 id="ms-form-title" className="m-display">Contacto y entrega</h2>
          <p className="ms-form-lead">Al enviar se abre WhatsApp con tu pedido y estos datos listos para revisar. Este sitio no guarda ni envía tus datos a ningún otro lugar.</p>
          <div className="ms-fields">
            {fields.map((field) => <label key={field.name} className="ms-field">
              <span>{field.label}{"optional" in field && <i> · opcional</i>}{"required" in field && <i aria-hidden="true"> *</i>}</span>
              <input name={field.name} type={"type" in field ? field.type : "text"} autoComplete={field.autoComplete} required={"required" in field} />
            </label>)}
            <label className="ms-field is-wide">
              <span>Notas del proyecto<i> · opcional</i></span>
              <textarea name="Notas" rows={4} placeholder="Frecuencia de operación, tipo de vehículo o torre, fecha requerida…" />
            </label>
          </div>
          <button className="ms-btn ms-btn-wa" type="submit"><WhatsAppIcon />Enviar solicitud por WhatsApp</button>
          <p className="ms-form-status" role="status">{sentUrl && <>Abrimos WhatsApp en otra pestaña. ¿No se abrió? <a href={sentUrl} target="_blank" rel="noreferrer">Ábrelo aquí</a>.</>}</p>
          <Link href="/carrito" className="ms-textlink">← Volver a la cotización</Link>
        </section>
        <aside className="ms-summary" aria-label="Resumen del pedido">
          <QuoteSummary items={items}>
            <ul className="ms-mini">
              {items.map((item) => { const price = priceOf(item); return <li key={item.id}>
                <span className={`ms-mini-media ${imageZoom(item)}`}><img src={item.image} alt="" loading="lazy" /></span>
                <span className="ms-mini-body"><small>{item.quantity} × {item.sku}</small><b>{item.name}</b></span>
                <span className="ms-mini-price">{price !== null ? formatPrice(price * item.quantity) : "A cotizar"}</span>
              </li>; })}
            </ul>
            <p className="ms-privacy">Precios publicados sujetos a confirmación de disponibilidad.</p>
          </QuoteSummary>
        </aside>
      </form>}
    </div>
  </main>;
}
