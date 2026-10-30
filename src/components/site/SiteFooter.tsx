import Link from "next/link";
import { RegMarks } from "@/components/home/primitives";
import { categoryGroups } from "@/lib/catalog";
import { site, whatsappUrl } from "@/lib/site";

const catalog = [...categoryGroups.map((g) => ({ label: g.label, href: `/categoria/${g.slug}` })), { label: "Catálogo completo", href: "/tienda" }];
const help = [
  { label: "Contacto", href: "/contacto" },
  { label: "Arma tu cotización", href: "/carrito" },
];

export function SiteFooter() {
  return <footer className="mx-footer">
    <RegMarks variant="cross" />
    <div className="m-wrap mx-footer-grid">
      <Link href="/" className="mx-footer-brand" aria-label={`${site.name}, inicio`}>
        <img src="/sites/industrias-maral/maral-mark.svg" alt="" width={120} height={100} />
        <span><b className="m-display">{site.name}</b><small className="m-mono">{site.legalName.replace("Maral ", "")}</small></span>
      </Link>
      <nav className="mx-footer-cols" aria-label="Pie de página">
        <div><h2>Catálogo</h2><ul>{catalog.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}</ul></div>
        <div><h2>Ayuda</h2><ul>{help.map((l) => <li key={l.href}><Link href={l.href}>{l.label}</Link></li>)}<li><a href={whatsappUrl("Hola, necesito asesoría técnica.")} target="_blank" rel="noreferrer">Asesoría por WhatsApp</a></li></ul></div>
        <div><h2>Contacto</h2><ul>
          <li><a href={whatsappUrl("Hola, quiero cotizar antenas Maral.")} target="_blank" rel="noreferrer">{site.phone}</a></li>
          <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
          <li><span>{site.location}</span></li>
        </ul></div>
      </nav>
    </div>
    <div className="m-wrap mx-footer-base m-mono">
      <span>© {new Date().getFullYear()} {site.legalName}</span>
      <span>Curití, Santander · 6.6°N 73.1°W</span>
    </div>
  </footer>;
}
