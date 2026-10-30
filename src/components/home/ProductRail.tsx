"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ProductCard } from "@/components/catalog/ProductCard";
import type { Product } from "@/lib/catalog";
import { ArrowIcon } from "./primitives";

// Riel deslizable: scroll-snap nativo (táctil en móvil) más flechas reales en escritorio.
export function ProductRail({ items, label, children }: { items: Product[]; label: string; children?: React.ReactNode }) {
  const track = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: items.length <= 4 });
  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4 });
  }, []);
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    el.scrollLeft = 0;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => { el.removeEventListener("scroll", sync); window.removeEventListener("resize", sync); };
  }, [sync, items]);
  const go = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: reduce ? "auto" : "smooth" });
  };
  return <div className="mh-rail">
    <div className="mh-rail-bar">
      <div className="mh-rail-meta">{children}</div>
      <div className="mh-rail-nav">
        <button type="button" aria-label={`Anteriores: ${label}`} disabled={edge.start} onClick={() => go(-1)}><ArrowIcon className="is-back" /></button>
        <button type="button" aria-label={`Siguientes: ${label}`} disabled={edge.end} onClick={() => go(1)}><ArrowIcon /></button>
      </div>
    </div>
    <ul ref={track} className="mh-rail-track" aria-label={label}>
      {items.map((p, i) => <li key={p.id} className="mh-rail-item" style={{ "--i": Math.min(i, 6) } as React.CSSProperties}><ProductCard product={p} /></li>)}
    </ul>
  </div>;
}
