"use client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/lib/catalog";

/* Fila de relacionados con desplazamiento por pasos (flechas) y scroll-snap. */
export function RelatedRail({ items }: { items: Product[] }) {
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const measure = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const frame = requestAnimationFrame(measure);
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => { cancelAnimationFrame(frame); el.removeEventListener("scroll", measure); window.removeEventListener("resize", measure); };
  }, [measure]);
  const step = (dir: number) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };
  return <section className="ms-related" aria-labelledby="ms-related-title">
    <div className="ms-related-head">
      <h2 id="ms-related-title" className="m-display">Productos relacionados</h2>
      <span className="ms-related-rule" aria-hidden="true" />
      <div className="ms-related-nav">
        <button type="button" className="ms-arrow" onClick={() => step(-1)} disabled={edge.start} aria-label="Anteriores"><ArrowLeft size={22} aria-hidden /></button>
        <button type="button" className="ms-arrow" onClick={() => step(1)} disabled={edge.end} aria-label="Siguientes"><ArrowRight size={22} aria-hidden /></button>
      </div>
    </div>
    <div ref={track} className="ms-related-track ms-shopcards">
      {items.map((item) => <div key={item.id} className="ms-related-cell"><ProductCard product={item} /></div>)}
    </div>
  </section>;
}
