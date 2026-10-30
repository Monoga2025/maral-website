"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products, type Product } from "@/lib/catalog";
import { Dot, Eyebrow } from "./primitives";
import { ProductRail } from "./ProductRail";

const R_MIN = 100;
const R_MAX = 520;
const bands = [
  { id: "aerea", label: "Banda aérea", range: "118 – 136 MHz", min: 118, max: 136 },
  { id: "vhf", label: "VHF", range: "136 – 174 MHz", min: 136, max: 174 },
  { id: "uhf", label: "UHF", range: "403 – 512 MHz", min: 403, max: 512 },
  { id: "otras", label: "Otras bandas", range: "27–33 · 806–870 MHz", min: 0, max: 0 },
] as const;
type Band = (typeof bands)[number];

function rangeOf(product: Product): [number, number][] {
  return [...(product.frequency ?? "").matchAll(/(\d+)\s*[–-]\s*(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
}

// Solo productos con frecuencia declarada: las bases de bronce no aparecen bajo ninguna banda.
function inBand(product: Product, band: Band) {
  if (band.id === "otras") return product.category === "otras-bandas" && !/118/.test(product.frequency ?? "");
  return rangeOf(product).some(([a, b]) => a < band.max && b > band.min && (band.id !== "vhf" || a >= 136));
}

const pct = (f: number) => ((f - R_MIN) / (R_MAX - R_MIN)) * 100;
const ruler = Array.from({ length: (R_MAX - R_MIN) / 10 + 1 }, (_, i) => R_MIN + i * 10);

function Ticks({ hot = false }: { hot?: boolean }) {
  return <div className={`mh-ruler-ticks ${hot ? "is-hot" : ""}`}>
    {ruler.map((f) => <span key={f} className={`mh-rt ${f % 50 === 0 || f === R_MAX ? "is-major" : ""}`} style={{ left: `${pct(f)}%` }}>
      {!hot && (f % 50 === 0 || f === R_MAX) && <b className="m-mono">{f}</b>}
    </span>)}
  </div>;
}

export function BandFinder() {
  const [active, setActive] = useState<Band["id"]>("vhf");
  const band = bands.find((b) => b.id === active) ?? bands[1];
  const matches = useMemo(() => products.filter((p) => inBand(p, band)), [band]);
  const out = band.id === "otras";
  const left = out ? 0 : pct(band.min);
  const right = out ? 100 : 100 - pct(band.max);
  const href = out ? "/categoria/otras-bandas" : `/tienda?q=${band.id === "aerea" ? "aérea" : band.id.toUpperCase()}`;
  return <section className="mh-finder mh-section" aria-labelledby="mh-finder-title">
    <div className="m-wrap">
      <Eyebrow n="01" label="Buscador" />
      <h2 id="mh-finder-title" className="mh-h2 m-display" data-rv>Buscador por frecuencia<Dot /></h2>
      <p className="mh-finder-sub m-display" data-rv>Elija su banda.</p>

      <div className={`mh-ruler ${out ? "is-out" : ""}`} aria-hidden="true" style={{ "--l": `${left}%`, "--r": `${right}%` } as React.CSSProperties}>
        <Ticks />
        <Ticks hot />
        <span className="mh-ruler-hl"><i className="m-mono">{band.range}</i></span>
        <span className="mh-ruler-edge is-lo m-mono">← 27–33</span>
        <span className="mh-ruler-edge is-hi m-mono">806–870 →</span>
      </div>

      <div className="mh-bands" role="tablist" aria-label="Bandas de frecuencia">
        {bands.map((b) => <button key={b.id} type="button" role="tab" id={`mh-tab-${b.id}`} aria-selected={b.id === active} aria-controls="mh-finder-panel" className={b.id === active ? "is-on" : ""} onClick={() => setActive(b.id)}>
          <b>{b.label}</b><span>{b.range}</span>
        </button>)}
      </div>

      <div id="mh-finder-panel" role="tabpanel" aria-labelledby={`mh-tab-${active}`} className="mh-finder-panel" key={active}>
        <ProductRail items={matches} label={`Productos para ${band.label}`}>
          <p className="mh-finder-count m-mono" aria-live="polite"><b>{String(matches.length).padStart(2, "0")}</b> referencias compatibles · {band.label}</p>
          <Link className="mh-link" href={href}>Ver en catálogo →</Link>
        </ProductRail>
      </div>
    </div>
  </section>;
}
