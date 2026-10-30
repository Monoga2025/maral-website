import { notFound, redirect } from 'next/navigation';

// Rutas heredadas del clon de SYSCOM (/principal/...) redirigidas a sus equivalentes de Maral.
type Props = { params: Promise<{ segments?: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function Principal({ params, searchParams }: Props) {
  const [{ segments = [] }, query] = await Promise.all([params, searchParams]);
  const path = segments.join('/').toLowerCase();
  const search = query.global_search;
  if (path === 'shopping_cart') redirect('/carrito');
  if (path === 'consultarproductosazul') redirect(`/tienda?q=${encodeURIComponent(Array.isArray(search) ? search[0] ?? '' : search ?? '')}`);
  if (path === 'contactoazul' || path === 'garantias2') redirect('/contacto');
  if (path === 'brands' || path.startsWith('listado')) redirect('/tienda');
  if (segments[0]?.toLowerCase() === 'marca' && segments[1]) redirect(`/tienda?marca=${encodeURIComponent(decodeURIComponent(segments[1]))}`);
  notFound();
}
