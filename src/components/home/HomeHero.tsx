import Link from "next/link";
import { whatsappUrl } from "@/lib/site";
import { ArrowIcon, Dot, RegMarks, WaIcon } from "./primitives";

const IMG = "/sites/industrias-maral/generated/hero-tower.webp";
// Escala VHF a la derecha del héroe: un trazo por MHz entre 174 y 136.
const ticks = Array.from({ length: 39 }, (_, i) => 174 - i);
const majors: Record<number, string> = { 174: "174 MHz", 155: "155", 136: "136" };

export function HomeHero() {
  return <section className="mh-hero" aria-labelledby="mh-hero-title">
    <div className="mh-hero-media" aria-hidden="true">
      <img className="mh-hero-img" src={IMG} alt="" fetchPriority="high" />
      <div className="mh-hero-shade" />
      {/* Anillos de ganancia anclados a la antena Yagi de la foto (coordenadas de imagen en CSS). */}
      <div className="mh-rings">
        <svg viewBox="-460 -460 920 920">
          <circle className="mh-ring" r="92" pathLength={1} />
          <circle className="mh-ring" r="164" pathLength={1} />
          <circle className="mh-ring is-dash" r="246" pathLength={1} />
          <circle className="mh-ring" r="336" pathLength={1} />
          <circle className="mh-ring is-faint" r="430" pathLength={1} />
          <circle className="mh-pulse" r="440" />
          <circle className="mh-pulse" r="440" />
          <circle className="mh-pulse" r="440" />
          <circle className="mh-core" r="5" />
        </svg>
      </div>
    </div>
    <RegMarks />
    <div className="mh-hero-inner m-wrap">
      <p className="mh-coord m-mono"><span className="mh-coord-br" aria-hidden="true" />Curití, Santander · 6.6°N 73.1°W</p>
      <h1 id="mh-hero-title" className="mh-hero-title m-display">
        <span className="mh-line"><span>Señal que</span></span>
        <span className="mh-line"><span>llega lejos<Dot /></span></span>
      </h1>
      <p className="mh-hero-sub">Antenas VHF y UHF, estaciones base, bases y kits. Despachos a todo Colombia.</p>
      <div className="mh-hero-cta">
        <Link className="mh-btn mh-btn--blue" href="/tienda">Ver catálogo <ArrowIcon /></Link>
        <a className="mh-btn mh-btn--wa" href={whatsappUrl("Hola, quiero cotizar antenas Maral.")} target="_blank" rel="noreferrer"><WaIcon /> Cotizar por WhatsApp</a>
      </div>
    </div>
    <div className="mh-scale" aria-hidden="true">
      <span className="mh-scale-band m-mono">VHF</span>
      <div className="mh-scale-track">
        {ticks.map((f, i) => <span key={f} className={`mh-scale-tick ${majors[f] ? "is-major" : ""}`} style={{ "--i": i } as React.CSSProperties}>{majors[f] && <b className="m-mono">{majors[f]}</b>}</span>)}
        <span className="mh-scale-cursor" />
      </div>
    </div>
  </section>;
}
