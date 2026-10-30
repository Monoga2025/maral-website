import test from "node:test";
import assert from "node:assert/strict";
import {
  filterMaralProducts,
  findMaralProductBySku,
} from "../../src/lib/industrias-maral/catalog.mjs";

const products = [
  {
    id: "103",
    sku: "REF-103",
    name: "Antena Tipo MAXRAD VHF 5/8 — 3 dB",
    category: "antena-vhf",
    brand: "MAXANT",
    price: null,
    sale: null,
    frequency: "136–174 MHz",
    gain: "3 dBi",
    power: "200W",
    vswr: "1:1.5",
    impedance: "50Ω",
    connector: "Spring contact",
  },
  {
    id: "P-224-F",
    sku: "P-224-F",
    name: "Antena 4 Dipolos VHF 6/9 dB en Línea",
    category: "estacion-base",
    brand: "ALMOTCOM",
    price: 2327300,
    sale: null,
    frequency: "137–174 MHz",
    gain: "6/9 dBi",
    power: "150W",
    vswr: "1:1.5",
    impedance: "50Ω",
    connector: "N hembra",
  },
  {
    id: "101-1",
    sku: "REF-101-UHF",
    name: "Antena 1/4 de Onda UHF",
    category: "antena-uhf",
    brand: "MAXANT",
    price: null,
    sale: null,
    frequency: "430–512 MHz",
    gain: "0 dBi",
    power: "150W",
    vswr: "1:1.5",
    impedance: "50Ω",
    connector: "Chrome nut",
  },
];

test("search trims and ignores case in SKU, name, and technical fields", () => {
  assert.deepEqual(
    filterMaralProducts(products, { query: "  ref-103  " }),
    [products[0]],
  );
  assert.deepEqual(
    filterMaralProducts(products, { query: "  maxrad " }),
    [products[0]],
  );
  assert.deepEqual(
    filterMaralProducts(products, { query: "  3 DBI " }),
    [products[0]],
  );
});

test("category and exact frequency filters intersect", () => {
  assert.deepEqual(
    filterMaralProducts(products, {
      category: "antena-uhf",
      frequency: "430–512 MHz",
    }),
    [products[2]],
  );
  assert.deepEqual(
    filterMaralProducts(products, {
      category: "estacion-base",
      frequency: "430–512 MHz",
    }),
    [],
  );
});

test("no filters preserve source order and input; unmatched query returns no products", () => {
  const snapshot = structuredClone(products);
  assert.deepEqual(filterMaralProducts(products), products);
  assert.deepEqual(products, snapshot);
  assert.deepEqual(
    filterMaralProducts(products, { query: "not-a-real-product" }),
    [],
  );
});

test("SKU lookup trims and ignores case, and returns null when absent", () => {
  assert.equal(findMaralProductBySku(products, "  ref-103 "), products[0]);
  assert.equal(findMaralProductBySku(products, "missing-sku"), null);
});
