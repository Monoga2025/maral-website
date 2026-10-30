"use client";
import { useEffect, useRef, useState } from "react";
import { brands, products } from "@/lib/catalog";

const priced = products.filter((p) => p.price !== null).length;
const stats = [
  { value: products.length, label: "referencias" },
  { value: priced, label: "con precio publicado" },
  { value: brands.length, label: "marcas" },
] as const;

// Cuenta ascendente al entrar en pantalla. El HTML del servidor ya trae el número final.
function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - k, 4))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [to]);
  return <b ref={ref} className="mh-stat-n m-display">{n}</b>;
}

export function StatBand() {
  return <section className="mh-stats" aria-label="MARAL en cifras">
    <ul className="m-wrap">
      {stats.map((s) => <li key={s.label}><Counter to={s.value} /><span className="m-mono">{s.label}</span></li>)}
      <li><b className="mh-stat-n mh-stat-word m-display">Despachos</b><span className="m-mono">nacionales</span></li>
    </ul>
  </section>;
}
