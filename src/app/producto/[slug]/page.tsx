import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { groupOf, normalize } from "@/components/catalog/filters";
import { ProductBuy } from "@/components/product/ProductBuy";
import { ProductStage } from "@/components/product/ProductStage";
import { RelatedRail } from "@/components/product/RelatedRail";
import { categoryLabels, formatPrice, priceOf, products, type Product } from "@/lib/catalog";

const find = (slug: string) => products.find((item) => item.slug === slug.replace(/\.html$/i, ""));

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = find((await params).slug);
  return product ? { title: `${product.name} | MARAL`, description: product.description } : {};
}

/* El nombre trae la ganancia al final ("… — 9.2 dBi"); se muestra aparte en grande. */
function titleOf(product: Product) {
  const [head, ...rest] = product.name.split(" — ");
  return product.gain && rest.length === 1 && /^\d[\d./]*\s*dBi?$/i.test(rest[0]) ? head : product.name;
}

const fieldKey: Record<string, string> = { frecuencia: "frecuencia", ganancia: "ganancia", potencia: "potencia", "potencia max.": "potencia", vswr: "vswr", impedancia: "impedancia", conector: "conector" };

/** Campos principales + especificaciones del catálogo, sin duplicar etiquetas. Todo es dato real. */
function specRows(product: Product): [string, string][] {
  const main: [string, string | null][] = [["Frecuencia", product.frequency], ["Ganancia", product.gain], ["Potencia", product.power], ["VSWR", product.vswr], ["Impedancia", product.impedance], ["Conector", product.connector]];
  const rows = main.filter((row): row is [string, string] => Boolean(row[1]));
  const taken = new Set(rows.map(([label]) => normalize(label)));
  const extra = product.specs.filter(([label]) => !taken.has(fieldKey[normalize(label)] ?? "__"));
  return [...rows, ...extra];
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = find((await params).slug);
  if (!product) notFound();
  const group = groupOf(product.category);
  const price = priceOf(product);
  const rows = specRows(product);
  const tiles = rows.slice(0, 6);
  const sameCategory = products.filter((item) => item.category === product.category && item.id !== product.id);
  const sameGroup = products.filter((item) => item.category !== product.category && (group.categories as readonly string[]).includes(item.category));
  const related = [...sameCategory, ...sameGroup].slice(0, 8);
  const headline = product.gain ?? categoryLabels[product.category];
  const paragraphs = product.description.split(/(?<=\.)\s+/).filter(Boolean);

  return <main className="ms-page ms-product">
    <div className="m-wrap">
      <nav className="ms-crumbs" aria-label="Ruta">
        <ol>
          <li><Link href="/tienda">Catálogo</Link></li>
          <li><Link href={`/categoria/${group.slug}`}>{group.label}</Link></li>
          <li aria-current="page">{product.sku}</li>
        </ol>
        <span className="ms-crumbs-aside">{categoryLabels[product.category]}<i aria-hidden="true" /></span>
      </nav>

      <div className="ms-pdp">
        <ProductStage product={product} />

        <div className="ms-pdp-buy">
          <p className="ms-ref">REF. {product.sku} · {product.brand}</p>
          <h1 className="m-display ms-pdp-title">{titleOf(product)}</h1>
          <p className={`m-display ms-pdp-value${product.gain ? "" : " is-label"}`}>{headline}</p>

          <div className="ms-pricebox">
            {price !== null ? <>
              <p className="ms-price"><span className="ms-sr">Precio: </span>{formatPrice(price)}{product.sale !== null && product.price !== null && <s>{formatPrice(product.price)}</s>}</p>
              <span className="ms-price-cur">COP</span>
            </> : <>
              <p className="ms-price is-quote">Precio a cotizar</p>
              <span className="ms-price-cur is-note">Respuesta por WhatsApp</span>
            </>}
          </div>
          <p className="ms-price-note">{price !== null ? "Precio publicado · confirma disponibilidad y despacho al cotizar." : "Te respondemos con precio y disponibilidad."}</p>

          <ProductBuy product={product} />

          {tiles.length > 0 && <dl className="ms-tiles">
            {tiles.map(([label, value], index) => <div key={`${label}-${index}`} className="ms-tile"><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>}
        </div>
      </div>

      <section className="ms-info" aria-label="Detalles del producto">
        <div className="ms-desc">
          <h2 className="m-display">Descripción</h2>
          {paragraphs.map((text, index) => <p key={index}>{text}</p>)}
        </div>
        {rows.length > 0 && <div className="ms-techs">
          <h2 className="m-display">Especificaciones técnicas</h2>
          <table className="ms-spec-table">
            <caption className="ms-sr">Especificaciones de {product.sku}</caption>
            <tbody>{rows.map(([label, value], index) => <tr key={`${label}-${index}`}><th scope="row">{label}</th><td>{value}</td></tr>)}</tbody>
          </table>
        </div>}
      </section>

      {related.length > 0 && <RelatedRail items={related} />}
    </div>
  </main>;
}
