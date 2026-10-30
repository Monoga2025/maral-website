import test from "node:test";
import assert from "node:assert/strict";
import {
  MARAL_QUOTE_STORAGE_KEY,
  normalizeMaralQuoteItems,
  addMaralQuoteItem,
  setMaralQuoteQuantity,
  createMaralWhatsAppUrl,
} from "../../src/lib/industrias-maral/catalog.mjs";

test("quote storage key is namespaced for Industrias Maral", () => {
  assert.match(MARAL_QUOTE_STORAGE_KEY, /industrias-maral/i);
  assert.notEqual(MARAL_QUOTE_STORAGE_KEY, "maral-local-cart");
});

test("quote normalization rejects corrupt input and keeps safe valid records", () => {
  assert.deepEqual(normalizeMaralQuoteItems(null), []);
  assert.deepEqual(normalizeMaralQuoteItems({ sku: "A", quantity: 1 }), []);
  assert.deepEqual(
    normalizeMaralQuoteItems([
      { sku: " A-1 ", name: "Antena", quantity: 2, price: 500, extra: true },
      { sku: "", name: "Sin SKU", quantity: 1 },
      { sku: "B-2", name: "Cantidad cero", quantity: 0 },
      { sku: "C-3", name: "Fraccionaria", quantity: 1.5 },
      { name: "SKU ausente", quantity: 3 },
    ]),
    [{ sku: "A-1", name: "Antena", quantity: 2 }],
  );
});

test("adding merges SKU case and whitespace, caps quantity and preserves prior state", () => {
  const previous = [{ sku: " ab-1 ", name: "Antena", quantity: 98 }];
  const result = addMaralQuoteItem(previous, { sku: "AB-1", name: "Antena nueva" }, 5);
  assert.deepEqual(result, [{ sku: "ab-1", name: "Antena", quantity: 99 }]);
  assert.deepEqual(previous, [{ sku: " ab-1 ", name: "Antena", quantity: 98 }]);
  assert.notEqual(result, previous);
});

test("setting quote quantity updates, removes, or preserves unmatched items", () => {
  const items = [
    { sku: "AB-1", name: "Antena", quantity: 2 },
    { sku: "CD-2", name: "Cable", quantity: 1 },
  ];
  assert.deepEqual(setMaralQuoteQuantity(items, " ab-1 ", 4), [
    { sku: "AB-1", name: "Antena", quantity: 4 },
    { sku: "CD-2", name: "Cable", quantity: 1 },
  ]);
  assert.deepEqual(setMaralQuoteQuantity(items, "AB-1", 0), [
    { sku: "CD-2", name: "Cable", quantity: 1 },
  ]);
  assert.deepEqual(setMaralQuoteQuantity(items, "UNKNOWN", 3), items);
});

test("WhatsApp URL encodes a deliberate quote summary", () => {
  assert.equal(createMaralWhatsAppUrl([]), null);
  const url = createMaralWhatsAppUrl([
    { sku: "ANT-7", name: "Antena móvil", quantity: 2 },
  ]);
  assert.match(url, /^https:\/\/wa\.me\/573000000024\?text=/);
  const decodedText = new URL(url).searchParams.get("text") ?? "";
  assert.match(decodedText, /Antena móvil/);
  assert.match(decodedText, /ANT-7/);
  assert.match(decodedText, /2/);
});
