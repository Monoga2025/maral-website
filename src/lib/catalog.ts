import source from '../../docs/research/industrias-maral/catalog.json';

export type Product = {
  id: string;
  slug: string;
  sku: string;
  name: string;
  category: CategorySlug;
  brand: string;
  price: number | null;
  sale: number | null;
  badge: string | null;
  frequency: string | null;
  gain: string | null;
  power: string | null;
  vswr: string | null;
  impedance: string | null;
  connector: string | null;
  description: string;
  specs: [string, string][];
  image: string;
};

export const categoryLabels = {
  'antena-vhf': 'Antena móvil VHF',
  'antena-uhf': 'Antena móvil UHF',
  'otras-bandas': 'Otras bandas',
  'estacion-base': 'Estación base',
  'base-perforar': 'Base de perforar',
  'base-pestana': 'Base de pestaña',
  kit: 'Kit',
} as const;

export type CategorySlug = keyof typeof categoryLabels;

export const categoryGroups = [
  { slug: 'antenas-moviles', label: 'Antenas móviles', description: 'VHF y UHF para vehículos y operación móvil', categories: ['antena-vhf', 'antena-uhf', 'otras-bandas'] },
  { slug: 'estacion-base', label: 'Estaciones base', description: 'Dipolos, Yagi y colineales de alta ganancia', categories: ['estacion-base'] },
  { slug: 'bases-y-montajes', label: 'Bases y montajes', description: 'Bases de perforar y de pestaña', categories: ['base-perforar', 'base-pestana'] },
  { slug: 'kits', label: 'Kits', description: 'Kits completos de instalación', categories: ['kit'] },
] as const satisfies readonly { slug: string; label: string; description: string; categories: readonly CategorySlug[] }[];

type SourceProduct = Omit<Product, 'slug' | 'category' | 'specs'> & { category: string; specs: string[][] };

const slugify = (value: string) => value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const products: Product[] = (source.products as SourceProduct[]).map((product) => ({
  ...product,
  slug: slugify(product.sku),
  category: product.category as CategorySlug,
  specs: product.specs.map(([label, value]) => [label, value] as [string, string]),
}));

export const brands = Array.from(new Set(products.map((product) => product.brand)));

export function productsInGroup(slug: string) {
  const group = categoryGroups.find((item) => item.slug === slug);
  if (group) return { title: group.label, description: group.description, items: products.filter((product) => (group.categories as readonly string[]).includes(product.category)) };
  if (slug in categoryLabels) return { title: categoryLabels[slug as CategorySlug], description: '', items: products.filter((product) => product.category === slug) };
  return null;
}

const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
export const formatPrice = (value: number) => cop.format(value);
export const priceOf = (product: Pick<Product, 'price' | 'sale'>) => product.sale ?? product.price;

// Las fotos de bases traen mucho margen blanco: se amplían en las tarjetas.
export const imageZoom = (product: Pick<Product, 'category'>) => (product.category === 'base-perforar' || product.category === 'base-pestana' ? 'zoom' : '');
