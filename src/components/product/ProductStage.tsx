"use client";
import { useRef, useState, type PointerEvent } from "react";
import { imageZoom, type Product } from "@/lib/catalog";

type Callout = { key: string; label: string; value: string; pos: "tl" | "r" | "bl" };

/* Panel de estudio: cruces en las esquinas, zoom que sigue al puntero y llamadas con datos reales. */
export function ProductStage({ product }: { product: Product }) {
  const ref = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(false);
  const callouts: Callout[] = [
    product.frequency ? { key: "f", label: "Frecuencia", value: product.frequency, pos: "tl" as const } : null,
    product.connector ? { key: "c", label: "Conector", value: product.connector, pos: "r" as const } : null,
    product.gain ? { key: "g", label: "Ganancia", value: product.gain, pos: "bl" as const } : null,
  ].filter((item): item is Callout => item !== null);

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || event.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--zx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--zy", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  };

  return <figure className="ms-stage">
    <div ref={ref} className={`ms-stage-frame ${imageZoom(product)}${zoom ? " is-zoom" : ""}`} onPointerEnter={(e) => { if (e.pointerType !== "touch") setZoom(true); }} onPointerLeave={() => setZoom(false)} onPointerMove={move}>
      <span className="ms-cross tl" aria-hidden="true" /><span className="ms-cross tr" aria-hidden="true" /><span className="ms-cross bl" aria-hidden="true" /><span className="ms-cross br" aria-hidden="true" />
      <img src={product.image} alt={product.name} fetchPriority="high" />
      {callouts.map((item) => <div key={item.key} className={`ms-callout is-${item.pos}`} aria-hidden="true">
        <span className="ms-callout-text"><small>{item.label}</small><b>{item.value}</b></span>
        <i className="ms-callout-leader" />
      </div>)}
    </div>
    <figcaption className="ms-stage-cap"><span>FIG. 01 — {product.sku}</span><span>{product.brand}</span></figcaption>
  </figure>;
}
