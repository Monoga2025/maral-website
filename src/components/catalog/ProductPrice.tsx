import { formatPrice, priceOf, type Product } from "@/lib/catalog";

export function ProductPrice({ product }: { product: Pick<Product, "price" | "sale"> }) {
  const price = priceOf(product);
  if (price === null) return <><strong>Precio a cotizar</strong><span>Te respondemos por WhatsApp con precio y disponibilidad</span></>;
  return <><strong className="price">{formatPrice(price)}{product.sale !== null && product.price !== null && <s>{formatPrice(product.price)}</s>}</strong><span>Precio publicado · confirma disponibilidad al cotizar</span></>;
}
