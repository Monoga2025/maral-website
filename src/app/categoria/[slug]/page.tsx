import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CatalogExplorer } from "@/components/catalog/CatalogExplorer";
import { categoriesForSlug } from "@/components/catalog/filters";
import { categoryGroups, categoryLabels, productsInGroup } from "@/lib/catalog";

export function generateStaticParams() {
  return [...categoryGroups.map((group) => group.slug), ...Object.keys(categoryLabels)].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const group = productsInGroup((await params).slug);
  return group ? { title: `${group.title} | MARAL`, description: group.description || `${group.items.length} referencias de ${group.title}.` } : {};
}

export default async function Category({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const group = productsInGroup(slug);
  if (!group) notFound();
  // Mismo catálogo completo, con la línea/categoría preseleccionada (se puede ampliar desde los filtros).
  return <main className="ms-page">
    <CatalogExplorer eyebrow={categoryGroups.some((item) => item.slug === slug) ? "Catálogo / Línea" : "Catálogo / Categoría"} title={group.title} heroCount={group.items.length} initial={{ categories: categoriesForSlug(slug) }} />
  </main>;
}
