import Link from "next/link";
import { brands, categoryGroups, products, type Product } from "@/lib/catalog";
import { whatsappUrl } from "@/lib/site";
import { ArrowIcon, Dot, Eyebrow, RegMarks, WaIcon } from "./primitives";
import { ProductRail } from "./ProductRail";

const G = "/sites/industrias-maral/generated";
type GroupSlug = (typeof categoryGroups)[number]["slug"];

export const inGroup = (slug: GroupSlug): Product[] => {
  const g = categoryGroups.find((x) => x.slug === slug);
  return g ? products.filter((p) => (g.categories as readonly string[]).includes(p.category)) : [];
};

/* 02 / LÍNEAS: bento de cuatro líneas. */
const tiles: { slug: GroupSlug; img: string; alt: string; tone: "photo" | "light"; tag?: string }[] = [
  { slug: "estacion-base", img: `${G}/hero-tower.webp`, alt: "Torre de radiocomunicación con antena Yagi al anochecer", tone: "photo" },
  { slug: "antenas-moviles", img: `${G}/mobile-road.webp`, alt: "Camioneta en carretera de montaña con antena móvil", tone: "photo" },
  { slug: "bases-y-montajes", img: `${G}/brass-base.webp`, alt: "Base de antena en latón mecanizado sobre placa inoxidable", tone: "photo", tag: "Fabricado en Curití" },
  { slug: "kits", img: "/sites/industrias-maral/K-301A.webp", alt: "Kit de instalación con base cromada, cable y conector", tone: "light" },
];

export function LinesBento() {
  return <section className="mh-lines mh-section" aria-labelledby="mh-lines-title">
    <div className="m-wrap">
      <div className="mh-lines-head">
        <div>
          <Eyebrow n="02" label="Líneas" />
          <h2 id="mh-lines-title" className="mh-h2 m-display" data-rv>Cuatro líneas<br />de producto<Dot /></h2>
        </div>
        <p className="mh-note m-mono">{products.length} referencias<br />{brands.length} marcas<br />VHF · UHF · Aérea</p>
      </div>
      <ul className="mh-bento">
        {tiles.map((t, i) => {
          const g = categoryGroups.find((x) => x.slug === t.slug);
          if (!g) return null;
          return <li key={t.slug} className={`mh-tile mh-tile--${i} is-${t.tone}`} data-rv>
            <Link href={`/categoria/${t.slug}`}>
              <img src={t.img} alt={t.alt} loading="lazy" />
              {t.tag && <span className="mh-tile-tag m-mono">{t.tag}</span>}
              <span className="mh-tile-cap">
                <span className="mh-tile-text"><b>{g.label}</b><small className="m-mono">{String(inGroup(t.slug).length).padStart(2, "0")} ref. · {g.description}</small></span>
                <ArrowIcon className="mh-tile-arrow" />
              </span>
            </Link>
          </li>;
        })}
      </ul>
    </div>
  </section>;
}

/* Riel de estaciones base con precio publicado. */
export function StationsRail() {
  const items = inGroup("estacion-base").filter((p) => p.price !== null);
  return <section className="mh-rail-sec mh-section" aria-labelledby="mh-rail-title">
    <RegMarks variant="cross" />
    <div className="m-wrap">
      <div className="mh-rail-head">
        <h2 id="mh-rail-title" className="mh-h2 m-display" data-rv>Estaciones base</h2>
        <Link className="mh-link mh-link--lg" href="/categoria/estacion-base">Ver todas <ArrowIcon /></Link>
      </div>
      <ProductRail items={items} label="Estaciones base">
        <p className="mh-finder-count m-mono"><b>{items.length}</b> referencias con precio publicado</p>
      </ProductRail>
    </div>
  </section>;
}

/* Banda de fabricación: callouts con líneas guía sobre la foto de la base (coordenadas de la foto 1672×941). */
const callouts = [
  { label: "Latón mecanizado", dot: [1062, 452], y: 300 },
  { label: "Aislador de teflón", dot: [1006, 596], y: 520 },
  { label: "Placa inoxidable", dot: [905, 690], y: 740 },
] as const;
const LINE_END = 400;

export function MadeBand() {
  const bases = inGroup("bases-y-montajes").length;
  return <section className="mh-made" aria-labelledby="mh-made-title">
    <RegMarks variant="cross" />
    <div className="mh-made-photo" data-rv="draw">
      <div className="mh-made-stage">
        <img src={`${G}/brass-base.webp`} alt="Base de antena MARAL: cuerpo de latón mecanizado, aislador de teflón y placa de acero inoxidable" loading="lazy" />
        <svg className="mh-lead" viewBox="0 0 1672 941" aria-hidden="true">
          {callouts.map((c, i) => {
            const [x, y] = c.dot;
            const knee = x - 70;
            return <g key={c.label} className={`mh-lead-${i}`}>
              <path pathLength={1} d={`M${x} ${y} H${knee} L${knee - 40} ${c.y} H${LINE_END}`} />
              <circle cx={x} cy={y} r="7" />
            </g>;
          })}
        </svg>
        <ul className="mh-callouts">
          {callouts.map((c, i) => <li key={c.label} className={`mh-callout-${i} m-mono`} style={{ top: `${(c.y / 941) * 100}%`, left: `${(LINE_END / 1672) * 100}%` }}>{c.label}</li>)}
        </ul>
      </div>
    </div>
    <div className="mh-made-copy">
      <p className="mh-made-kicker m-mono">MARAL · {bases} referencias de bases</p>
      <h2 id="mh-made-title" className="m-display" data-rv>Fabricado<br />en Curití<Dot /></h2>
      <p className="mh-made-sub m-mono">Bases mecanizadas<br />en nuestro taller.</p>
      <Link className="mh-btn mh-btn--ghost" href="/categoria/bases-y-montajes">Ver bases y montajes <ArrowIcon /></Link>
    </div>
  </section>;
}

/* 03 / PROCESO */
const steps = [
  ["Elija", "Busque por banda, referencia o línea."],
  ["Agregue", "Arme su lista de cotización."],
  ["Envíe por WhatsApp", "Validamos frecuencia y disponibilidad."],
  ["Reciba", "Despachos a todo Colombia."],
] as const;

export function HowToBuy() {
  return <section className="mh-how mh-section" aria-labelledby="mh-how-title">
    <div className="m-wrap">
      <Eyebrow n="03" label="Proceso" />
      <h2 id="mh-how-title" className="mh-h2 m-display" data-rv>Cómo comprar<Dot /></h2>
    </div>
    <div className="mh-how-rule" data-rv="draw">
      <RegMarks variant="cross" />
      <ol className="m-wrap">
        {steps.map(([t, d], i) => <li key={t}>
          <span className="mh-how-n m-mono">{String(i + 1).padStart(2, "0")}</span>
          <b>{t}</b>
          <small>{d}</small>
          <ArrowIcon className="mh-how-arrow" />
        </li>)}
      </ol>
    </div>
  </section>;
}

/* 04 / MARCAS: wordmarks de texto. */
export function BrandsStrip() {
  return <section className="mh-brands" aria-labelledby="mh-brands-title">
    <div className="m-wrap mh-brands-in">
      <Eyebrow as="h2" id="mh-brands-title" n="04" label="Marcas" />
      <ul>
        {brands.map((b) => <li key={b}><Link href={`/tienda?marca=${encodeURIComponent(b)}`} className={`mh-wordmark is-${b.toLowerCase()}`}>
          <span>{b}</span><small className="m-mono">{products.filter((p) => p.brand === b).length} ref.</small>
        </Link></li>)}
      </ul>
    </div>
  </section>;
}

export function CtaBand() {
  return <section className="mh-cta" aria-labelledby="mh-cta-title">
    <RegMarks variant="cross" />
    <div className="m-wrap mh-cta-in">
      <h2 id="mh-cta-title" className="m-display">¿Necesita asesoría técnica?</h2>
      <a className="mh-btn mh-btn--wa mh-btn--mono" href={whatsappUrl("Hola, necesito asesoría técnica para elegir una antena.")} target="_blank" rel="noreferrer"><WaIcon /> Cotizar por WhatsApp <ArrowIcon /></a>
    </div>
  </section>;
}
