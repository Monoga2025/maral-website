import { brands, categoryGroups, categoryLabels, priceOf, type CategorySlug, type Product } from "@/lib/catalog";

/* Lógica pura del catálogo: bandas, búsqueda, facetas y orden. Sin React para poder razonarla y reutilizarla. */

export const bands = [
  { id: "aerea", label: "Aérea", range: "118–136 MHz", min: 118, max: 136 },
  { id: "vhf", label: "VHF", range: "136–174 MHz", min: 136, max: 174 },
  { id: "uhf", label: "UHF", range: "403–512 MHz", min: 403, max: 512 },
  { id: "otras", label: "Otras", range: "27–33 · 806–870 MHz", min: 0, max: 0 },
] as const;

export type BandId = (typeof bands)[number]["id"];
export type SortId = "relevance" | "price-asc" | "price-desc" | "name";
export type ViewId = "grid" | "list";

export const sortOptions: { id: SortId; label: string }[] = [
  { id: "relevance", label: "Relevancia" },
  { id: "price-asc", label: "Menor precio" },
  { id: "price-desc", label: "Mayor precio" },
  { id: "name", label: "Nombre" },
];

export type FilterState = {
  query: string;
  categories: CategorySlug[];
  bands: BandId[];
  brands: string[];
  pricedOnly: boolean;
};

export const emptyFilters: FilterState = { query: "", categories: [], bands: [], brands: [], pricedOnly: false };

export const allCategories = Object.keys(categoryLabels) as CategorySlug[];

export const normalize = (value: string | null | undefined) => (value ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const compact = (value: string) => value.replace(/[^a-z0-9]/g, "");

/** Rangos "a–b" del texto de frecuencia (mismo criterio que BandFinder del inicio). */
export function rangesOf(product: Pick<Product, "frequency">): [number, number][] {
  return [...(product.frequency ?? "").matchAll(/(\d+)\s*[–-]\s*(\d+)/g)].map((m) => [Number(m[1]), Number(m[2])]);
}

function rangeInBand([a, b]: [number, number], id: Exclude<BandId, "otras">) {
  const band = bands.find((item) => item.id === id)!;
  return a < band.max && b > band.min && (id !== "vhf" || a >= 136);
}

/** Bandas que cubre un producto. Sin frecuencia (bases) => ninguna. "Otras" = algún rango fuera de Aérea/VHF/UHF. */
export function bandsOf(product: Pick<Product, "frequency">): BandId[] {
  const ranges = rangesOf(product);
  const named = (["aerea", "vhf", "uhf"] as const).filter((id) => ranges.some((range) => rangeInBand(range, id)));
  const other = ranges.some((range) => !(["aerea", "vhf", "uhf"] as const).some((id) => rangeInBand(range, id)));
  return other ? [...named, "otras"] : named;
}

/** Línea (grupo) a la que pertenece una categoría. */
export const groupOf = (category: CategorySlug) => categoryGroups.find((group) => (group.categories as readonly CategorySlug[]).includes(category))!;

const haystacks = new WeakMap<Product, string>();
function haystackOf(product: Product) {
  let value = haystacks.get(product);
  if (!value) {
    const bandWords = bandsOf(product).map((id) => bands.find((band) => band.id === id)!.label).join(" ");
    value = normalize([product.name, product.sku, compact(normalize(product.sku)), product.frequency, product.gain, product.brand, categoryLabels[product.category], groupOf(product.category).label, bandWords].filter(Boolean).join(" "));
    haystacks.set(product, value);
  }
  return value;
}

export const termsOf = (query: string) => normalize(query).split(/\s+/).filter(Boolean);

type Facet = "categories" | "bands" | "brands" | "pricedOnly" | "query";

/** ¿Pasa el producto todos los filtros? `skip` ignora una faceta (para contar opciones de esa faceta). */
export function matches(product: Product, state: FilterState, skip?: Facet) {
  if (skip !== "query") {
    const hay = haystackOf(product);
    if (!termsOf(state.query).every((term) => hay.includes(term) || hay.includes(compact(term)))) return false;
  }
  if (skip !== "categories" && state.categories.length && !state.categories.includes(product.category)) return false;
  if (skip !== "brands" && state.brands.length && !state.brands.includes(product.brand)) return false;
  if (skip !== "pricedOnly" && state.pricedOnly && priceOf(product) === null) return false;
  if (skip !== "bands" && state.bands.length) {
    const own = bandsOf(product);
    if (!state.bands.some((id) => own.includes(id))) return false;
  }
  return true;
}

function relevance(product: Product, terms: string[]) {
  if (!terms.length) return 0;
  const sku = normalize(product.sku);
  const name = normalize(product.name);
  return terms.reduce((score, term) => score + (sku === term || compact(sku) === compact(term) ? 6 : sku.includes(term) ? 3 : 0) + (name.includes(term) ? 2 : 0), 0);
}

/** Orden estable. Productos sin precio van al final en ambos órdenes de precio. */
export function sortProducts(list: Product[], sort: SortId, query: string) {
  const indexed = list.map((product, index) => ({ product, index }));
  const terms = termsOf(query);
  const byIndex = (a: { index: number }, b: { index: number }) => a.index - b.index;
  if (sort === "name") indexed.sort((a, b) => a.product.name.localeCompare(b.product.name, "es") || byIndex(a, b));
  else if (sort === "relevance") indexed.sort((a, b) => relevance(b.product, terms) - relevance(a.product, terms) || byIndex(a, b));
  else {
    const dir = sort === "price-asc" ? 1 : -1;
    indexed.sort((a, b) => {
      const pa = priceOf(a.product);
      const pb = priceOf(b.product);
      if (pa === null && pb === null) return byIndex(a, b);
      if (pa === null) return 1;
      if (pb === null) return -1;
      return (pa - pb) * dir || byIndex(a, b);
    });
  }
  return indexed.map((item) => item.product);
}

export function activeCount(state: FilterState) {
  return state.categories.length + state.bands.length + state.brands.length + (state.pricedOnly ? 1 : 0);
}

/** Lee un valor de marca de la URL sin importar mayúsculas. */
export function brandFrom(value: string) {
  const wanted = normalize(value);
  return brands.find((brand) => normalize(brand) === wanted);
}

export function bandFrom(value: string) {
  const wanted = normalize(value);
  return bands.find((band) => band.id === wanted || normalize(band.label) === wanted)?.id;
}

/** Categorías que preselecciona un slug de /categoria (grupo o categoría suelta). */
export function categoriesForSlug(slug: string): CategorySlug[] {
  const group = categoryGroups.find((item) => item.slug === slug);
  if (group) return [...group.categories];
  return slug in categoryLabels ? [slug as CategorySlug] : [];
}
