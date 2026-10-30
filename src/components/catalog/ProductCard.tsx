"use client";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart/CartProvider";
import { categoryLabels, formatPrice, imageZoom, priceOf, type Product } from "@/lib/catalog";

// Tarjeta compartida por inicio, catálogo y relacionados (estilo maral-v4: panel gris, SKU mono, chip, precio, "Agregar").
// Props y clases estables: el inicio la usa en paralelo. Estilos base en maral-tokens.css + maral-shop.css.
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const price = priceOf(product);
  const chip = product.frequency ? `${product.frequency}${product.gain ? ` · ${product.gain}` : ""}` : categoryLabels[product.category];
  return <article className="m-card">
    <Link href={`/producto/${product.slug}`} className="m-card-link">
      <div className={`m-card-media ${imageZoom(product)}`}><img src={product.image} alt={product.name} loading={priority ? "eager" : "lazy"} /></div>
      <div className="m-card-body">
        <span className="m-card-sku">{product.sku} · {product.brand}</span>
        <h3 className="m-card-name">{product.name}</h3>
        <span className="m-chip">{chip}</span>
        <span className={`m-card-price ${price === null ? "quote" : ""}`}>{price === null ? "Precio a cotizar" : formatPrice(price)}</span>
      </div>
    </Link>
    <div className="m-card-actions">
      <button type="button" className={`m-card-add ${added ? "done" : ""}`} aria-label={added ? `${product.name} está en tu cotización; agregar otra unidad` : `Agregar ${product.name} a la cotización`} onClick={() => { add(product, 1); setAdded(true); }}>{added ? "✓ En tu cotización" : "Agregar"}</button>
    </div>
  </article>;
}
