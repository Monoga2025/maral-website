# memory.md — Sitio web MARAL

Memoria del proyecto para agentes y personas que retomen el trabajo. Detalle completo y pendientes: `docs/HANDOFF_2026-10-09.md`.

## Hechos estables
- Cliente: Maral Tecnología y Comunicaciones S.A.S. — antenas de radiocomunicación, Curití, Santander. WhatsApp 573000000002 · user37@example.com.
- Fuente de verdad del catálogo: `docs/research/industrias-maral/catalog.json` (58 productos, 31 con precio). Solo las bases (marca MARAL) son de fabricación propia.
- Next.js 16 con cambios incompatibles: leer `AGENTS.md` y `node_modules/next/dist/docs/` antes de tocar código.
- `08_MARAL/` no está en git (ignorado en el repo raíz). Hacer respaldo antes de borrar o sobrescribir.
- El equipo se queda sin memoria: el sistema apaga `npm run dev` cuando hay presión. No reiniciarlo sin que el usuario lo pida.

## Preferencias del usuario (Daniel)
- Quiere diseño **brutal / premium**, no "sencillo" ni de plantilla. Rechazó dos veces versiones correctas pero planas.
- Flujo preferido: **Codex `imagegen` genera los diseños (comps) → subagentes construyen el front** copiando el diseño con datos reales → capturas → crítico.
- Habla en español; respuestas cortas y directas.
- Cuando pide un crítico, quiere ver que Maral supera a SYSCOM, pero el crítico debe ser honesto y sus hallazgos se corrigen.
- Paleta disciplinada: tinta #0a1020, blanco, un azul eléctrico (#155dfc / #3d7bff); verde solo para WhatsApp. Le molestaron los colores mezclados (amarillo, lavanda, chips de colores).

## Reglas de contenido
- Nunca inventar precios, medidas, certificaciones, testimonios ni datos de radiación.
- Los diseños de Codex traen datos de relleno: copiar layout y estilo, no los datos.
- Nada de marca ajena en la página (el showreel "CLAUDE" no se usa).

## Convenciones de código
- CSS por capas: `globals.css` (legado) → `src/styles/maral-tokens.css` → `maral-home.css` (`mx-`, `mh-`) → `maral-shop.css` (`ms-`).
- Tarjeta de producto compartida: `src/components/catalog/ProductCard.tsx` (props `{ product, priority? }`).
- Animaciones de scroll: mover con transform, nunca ocultar con opacidad 0. Siempre con `prefers-reduced-motion`.
- Capturas: Chrome headless a 1440 y 520 (no baja de ~500 px de ancho).
