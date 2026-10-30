import type { Metadata } from "next";
import { CatalogExplorer, type CatalogInitial } from "@/components/catalog/CatalogExplorer";
import { allCategories, bandFrom, brandFrom, sortOptions, type BandId, type SortId } from "@/components/catalog/filters";
import { products, type CategorySlug } from "@/lib/catalog";

export const metadata: Metadata = { title: "Catálogo | MARAL Tecnología y Comunicaciones", description: `${products.length} referencias en antenas móviles VHF/UHF, estaciones base, bases y kits de instalación.` };

type Search = Record<string, string | string[] | undefined>;

function initialFrom(query: Search): CatalogInitial {
  const first = (key: string) => { const value = query[key]; return (Array.isArray(value) ? value[0] : value) ?? ""; };
  const list = (key: string) => first(key).split(",").map((item) => item.trim()).filter(Boolean);
  const sort = first("orden");
  return {
    query: first("q"),
    brands: list("marca").map(brandFrom).filter((brand): brand is string => Boolean(brand)),
    bands: list("banda").map(bandFrom).filter((band): band is BandId => Boolean(band)),
    categories: list("linea").filter((slug): slug is CategorySlug => (allCategories as string[]).includes(slug)),
    pricedOnly: first("precio") === "1",
    sort: sortOptions.some((option) => option.id === sort) ? (sort as SortId) : undefined,
  };
}

export default async function Tienda({ searchParams }: { searchParams: Promise<Search> }) {
  const query = await searchParams;
  const initial = initialFrom(query);
  // La clave reinicia el estado cuando el buscador del encabezado navega a /tienda?q=...
  const key = ["q", "marca", "banda", "linea", "precio", "orden"].map((name) => String(query[name] ?? "")).join("|");
  return <main className="ms-page">
    <CatalogExplorer key={key} eyebrow="Catálogo" title="Catálogo" heroCount={products.length} initial={initial} syncUrl />
  </main>;
}
