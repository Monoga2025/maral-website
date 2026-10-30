import { useSyncExternalStore } from 'react';
import { formatPrice, priceOf } from '@/lib/catalog';
import type { CartItem } from '@/components/cart/CartProvider';

export function quoteTotals(items: CartItem[]) {
  const priced = items.filter((item) => priceOf(item) !== null);
  return {
    units: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: priced.reduce((sum, item) => sum + (priceOf(item) ?? 0) * item.quantity, 0),
    pending: items.length - priced.length,
  };
}

export function quoteMessage(items: CartItem[], contact?: Record<string, string>) {
  const { subtotal, pending } = quoteTotals(items);
  const lines = ['Hola, quisiera cotizar estos productos:', ...items.map((item) => {
    const price = priceOf(item);
    return `- ${item.quantity} × ${item.sku} — ${item.name}${price !== null ? ` (${formatPrice(price)} c/u)` : ''}`;
  })];
  if (subtotal > 0) lines.push('', `Subtotal publicado: ${formatPrice(subtotal)}${pending ? ` + ${pending} referencia(s) por cotizar` : ''}`);
  const filled = Object.entries(contact ?? {}).filter(([, value]) => value.trim());
  if (filled.length) lines.push('', ...filled.map(([label, value]) => `${label}: ${value.trim()}`));
  return lines.join('\n');
}

const noop = () => () => {};
/** true solo en el cliente tras hidratar: evita mostrar "cotización vacía" antes de leer localStorage. */
export function useHydrated() {
  return useSyncExternalStore(noop, () => true, () => false);
}
