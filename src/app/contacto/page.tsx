import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import { ShopHero } from "@/components/catalog/ShopHero";
import { WhatsAppIcon } from "@/components/product/ProductBuy";
import { site, whatsappUrl } from "@/lib/site";

export const metadata: Metadata = { title: "Contacto | MARAL Tecnología y Comunicaciones" };

const channels = [
  { k: "01", label: "WhatsApp", value: site.phone, note: "Cotizaciones y asesoría técnica", href: whatsappUrl("Hola, quiero hablar con un asesor de Maral."), external: true, icon: <WhatsAppIcon size={22} /> },
  { k: "02", label: "Teléfono", value: site.phone, note: "Atención comercial", href: `tel:${site.phone.replaceAll(" ", "")}`, icon: <Phone size={22} aria-hidden /> },
  { k: "03", label: "Correo", value: site.email, note: "Pedidos y facturación", href: `mailto:${site.email}`, icon: <Mail size={22} aria-hidden /> },
  { k: "04", label: "Planta", value: site.location, note: "Fabricación nacional · despachos a todo el país", icon: <MapPin size={22} aria-hidden /> },
];

export default function Contacto() {
  return <main className="ms-page ms-contact">
    <ShopHero compact eyebrow="Contacto" title="Hablemos" meta={site.legalName} />
    <div className="m-wrap">
      <p className="ms-contact-lead">Fabricamos y distribuimos antenas y accesorios de radiocomunicación desde {site.location}, con despachos a todo el país.</p>
      <ul className="ms-channels">
        {channels.map((item) => {
          const inner = <>
            <span className="ms-channel-top"><span className="ms-channel-k">{item.k}</span><span className="ms-channel-icon">{item.icon}</span></span>
            <span className="ms-channel-label">{item.label}</span>
            <b className="ms-channel-value">{item.value}</b>
            <small>{item.note}</small>
          </>;
          return <li key={item.k}>{item.href ? <a className="ms-channel" href={item.href} {...(item.external ? { target: "_blank", rel: "noreferrer" } : {})}>{inner}<ArrowRight className="ms-channel-go" size={20} aria-hidden /></a> : <div className="ms-channel is-static">{inner}</div>}</li>;
        })}
      </ul>
      <section className="ms-info ms-support" aria-labelledby="ms-support-title">
        <div className="ms-desc">
          <h2 id="ms-support-title" className="m-display">Garantía y soporte</h2>
        </div>
        <div className="ms-techs">
          <p>Antes de despachar confirmamos referencia, frecuencia de operación y tipo de montaje contigo. Si un producto presenta un defecto de fabricación, escríbenos por WhatsApp con la referencia y una foto para gestionar la revisión.</p>
          <div className="ms-support-actions">
            <a className="ms-btn ms-btn-wa" href={whatsappUrl("Hola, necesito soporte con un producto Maral.")} target="_blank" rel="noreferrer"><WhatsAppIcon />Escribir a soporte</a>
            <Link className="ms-btn ms-btn-ghost" href="/tienda">Ver catálogo</Link>
          </div>
        </div>
      </section>
    </div>
  </main>;
}
