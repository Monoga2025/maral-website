import type { ReactNode } from "react";

/* Banda de título navy compartida por catálogo, categoría, cotización, checkout y contacto. */
export function ShopHero({ eyebrow, title, meta, aside, compact = false }: { eyebrow: string; title: string; meta?: ReactNode; aside?: ReactNode; compact?: boolean }) {
  return <section className={`ms-hero${compact ? " is-compact" : ""}`} aria-labelledby="ms-hero-title">
    <div className="m-wrap ms-hero-inner">
      <div className="ms-hero-copy">
        <p className="ms-hero-eyebrow">{eyebrow}</p>
        <h1 id="ms-hero-title" className="m-display ms-hero-title">{title}</h1>
        {meta && <p className="ms-hero-meta">{meta}</p>}
      </div>
      {aside && <div className="ms-hero-aside">{aside}</div>}
    </div>
  </section>;
}
