"use client";
import { ChevronDown, ChevronLeft, ChevronRight, LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type RefObject } from "react";
import { brands, categoryGroups, categoryLabels, priceOf, products, type CategorySlug } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";
import { ShopHero } from "./ShopHero";
import { FrequencyScale } from "./FrequencyScale";
import { activeCount, bands, bandsOf, emptyFilters, matches, sortOptions, sortProducts, type BandId, type FilterState, type SortId, type ViewId } from "./filters";

const PER_PAGE = 12;
const EASE = "cubic-bezier(.16,1,.3,1)";

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** FLIP: las tarjetas que siguen visibles se deslizan a su nueva posición; las nuevas entran con un desplazamiento corto. */
function useFlip(container: RefObject<HTMLElement | null>, signature: string) {
  const rects = useRef(new Map<string, { x: number; y: number }>());
  useLayoutEffect(() => {
    const root = container.current;
    if (!root) return;
    const origin = root.getBoundingClientRect();
    const reduce = reducedMotion();
    const hadPrevious = rects.current.size > 0;
    const next = new Map<string, { x: number; y: number }>();
    let entering = 0;
    root.querySelectorAll<HTMLElement>("[data-flip]").forEach((el) => {
      const key = el.dataset.flip ?? "";
      const rect = el.getBoundingClientRect();
      const pos = { x: rect.left - origin.left, y: rect.top - origin.top };
      next.set(key, pos);
      if (reduce || !hadPrevious || typeof el.animate !== "function") return;
      const prev = rects.current.get(key);
      if (prev) {
        const dx = prev.x - pos.x;
        const dy = prev.y - pos.y;
        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 560, easing: EASE });
      } else {
        el.animate([{ opacity: 0.4, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 520, easing: EASE, delay: Math.min(entering++, 8) * 28, fill: "backwards" });
      }
    });
    rects.current = next;
  }, [container, signature]);
}

function Checkbox({ checked, indeterminate = false, onChange, label, count, disabled = false }: { checked: boolean; indeterminate?: boolean; onChange: (checked: boolean) => void; label: string; count: number; disabled?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = indeterminate; }, [indeterminate]);
  return <label className={`ms-check${disabled ? " is-disabled" : ""}`}>
    <input ref={ref} type="checkbox" checked={checked} disabled={disabled} onChange={(event) => onChange(event.target.checked)} />
    <span className="ms-check-label">{label}</span>
    <span className="ms-count" aria-label={`${count} productos`}>{count}</span>
  </label>;
}

export type CatalogInitial = Partial<FilterState> & { sort?: SortId };

export function CatalogExplorer({ eyebrow, title, heroCount, initial = {}, syncUrl = false }: { eyebrow: string; title: string; heroCount: number; initial?: CatalogInitial; syncUrl?: boolean }) {
  const [filters, setFilters] = useState<FilterState>({ ...emptyFilters, ...initial });
  const [sort, setSortState] = useState<SortId>(initial.sort ?? "relevance");
  const [view, setView] = useState<ViewId>("grid");
  const [page, setPage] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const ids = useId();

  const update = useCallback((patch: Partial<FilterState>) => { setFilters((current) => ({ ...current, ...patch })); setPage(0); }, []);
  const toggle = <T,>(list: readonly T[], value: T, on: boolean) => (on ? [...list.filter((item) => item !== value), value] : list.filter((item) => item !== value));

  const results = useMemo(() => sortProducts(products.filter((product) => matches(product, filters)), sort, filters.query), [filters, sort]);
  const counts = useMemo(() => ({
    category: (slug: CategorySlug) => products.filter((p) => p.category === slug && matches(p, filters, "categories")).length,
    band: (id: BandId) => products.filter((p) => bandsOf(p).includes(id) && matches(p, filters, "bands")).length,
    brand: (name: string) => products.filter((p) => p.brand === name && matches(p, filters, "brands")).length,
    priced: products.filter((p) => priceOf(p) !== null && matches(p, filters, "pricedOnly")).length,
  }), [filters]);

  const pages = Math.max(1, Math.ceil(results.length / PER_PAGE));
  const current = Math.min(page, pages - 1);
  const visible = results.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);
  const nActive = activeCount(filters);

  useFlip(gridRef, `${view}|${visible.map((p) => p.id).join(",")}`);

  // Estado compartible en /tienda (sin recargar: history nativo, soportado por el App Router).
  useEffect(() => {
    if (!syncUrl) return;
    const params = new URLSearchParams();
    if (filters.query.trim()) params.set("q", filters.query.trim());
    if (filters.brands.length) params.set("marca", filters.brands.join(","));
    if (filters.bands.length) params.set("banda", filters.bands.join(","));
    if (filters.categories.length) params.set("linea", filters.categories.join(","));
    if (filters.pricedOnly) params.set("precio", "1");
    if (sort !== "relevance") params.set("orden", sort);
    const next = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [filters, sort, syncUrl]);

  // Cajón de filtros (móvil): bloqueo de scroll, Escape, foco y cierre al pasar a escritorio.
  useEffect(() => {
    if (!drawer) return;
    const trigger = triggerRef.current;
    const media = window.matchMedia("(min-width: 960px)");
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setDrawer(false); };
    const onMedia = () => { if (media.matches) setDrawer(false); };
    document.documentElement.classList.add("ms-lock");
    window.addEventListener("keydown", onKey);
    media.addEventListener("change", onMedia);
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => {
      window.clearTimeout(focusTimer);
      document.documentElement.classList.remove("ms-lock");
      window.removeEventListener("keydown", onKey);
      media.removeEventListener("change", onMedia);
      trigger?.focus({ preventScroll: true });
    };
  }, [drawer]);

  const goTo = (target: number) => {
    setPage(target);
    const top = resultsRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) resultsRef.current?.scrollIntoView({ behavior: reducedMotion() ? "auto" : "smooth", block: "start" });
  };
  const clearAll = () => { setFilters({ ...emptyFilters }); setPage(0); };

  const chips: { key: string; label: string; remove: () => void }[] = [
    ...(filters.query.trim() ? [{ key: "q", label: `“${filters.query.trim()}”`, remove: () => update({ query: "" }) }] : []),
    ...filters.categories.map((slug) => ({ key: `c-${slug}`, label: categoryLabels[slug], remove: () => update({ categories: filters.categories.filter((c) => c !== slug) }) })),
    ...filters.bands.map((id) => ({ key: `b-${id}`, label: bands.find((b) => b.id === id)!.label, remove: () => update({ bands: filters.bands.filter((b) => b !== id) }) })),
    ...filters.brands.map((name) => ({ key: `m-${name}`, label: name, remove: () => update({ brands: filters.brands.filter((b) => b !== name) }) })),
    ...(filters.pricedOnly ? [{ key: "p", label: "Con precio", remove: () => update({ pricedOnly: false }) }] : []),
  ];

  return <>
    <ShopHero eyebrow={eyebrow} title={title} meta={<><span className="ms-hero-num">{heroCount}</span> referencias</>} aside={<FrequencyScale active={filters.bands} />} />

    <div className="m-wrap ms-catalog">
      <div className={`ms-backdrop${drawer ? " is-open" : ""}`} onClick={() => setDrawer(false)} aria-hidden="true" />
      <aside id={`${ids}-filters`} className={`ms-filters${drawer ? " is-open" : ""}`} aria-label="Filtros del catálogo" role={drawer ? "dialog" : undefined} aria-modal={drawer || undefined}>
        <div className="ms-drawer-head">
          <p className="m-display">Filtros{nActive > 0 && <span className="ms-drawer-n">{nActive}</span>}</p>
          <button ref={closeRef} type="button" className="ms-icon-btn" onClick={() => setDrawer(false)} aria-label="Cerrar filtros"><X size={20} aria-hidden /></button>
        </div>

        <div className="ms-filters-body">
          <fieldset className="ms-facet">
            <legend>Líneas</legend>
            {categoryGroups.map((group) => {
              const cats = group.categories as readonly CategorySlug[];
              const on = cats.filter((slug) => filters.categories.includes(slug));
              const all = on.length === cats.length;
              const count = cats.reduce((sum, slug) => sum + counts.category(slug), 0);
              return <div key={group.slug} className="ms-group">
                <Checkbox label={group.label} count={count} checked={all} indeterminate={on.length > 0 && !all} onChange={(checked) => update({ categories: checked ? [...filters.categories.filter((c) => !cats.includes(c)), ...cats] : filters.categories.filter((c) => !cats.includes(c)) })} />
                {cats.length > 1 && on.length > 0 && <div className="ms-sub">
                  {cats.map((slug) => <Checkbox key={slug} label={categoryLabels[slug]} count={counts.category(slug)} checked={filters.categories.includes(slug)} onChange={(checked) => update({ categories: toggle(filters.categories, slug, checked) })} />)}
                </div>}
              </div>;
            })}
          </fieldset>

          <fieldset className="ms-facet">
            <legend>Banda</legend>
            <div className="ms-band-chips">
              {bands.map((band) => {
                const on = filters.bands.includes(band.id);
                const count = counts.band(band.id);
                return <button key={band.id} type="button" className={`ms-band${on ? " is-on" : ""}`} aria-pressed={on} aria-label={`${band.label} ${band.range}, ${count} productos`} title={band.range} disabled={!on && count === 0} onClick={() => update({ bands: toggle(filters.bands, band.id, !on) })}>{band.label}</button>;
              })}
            </div>
            <p className="ms-band-note">{filters.bands.length ? filters.bands.map((id) => bands.find((b) => b.id === id)!.range).join(" + ") : "Aérea 118–136 · VHF 136–174 · UHF 403–512 MHz"}</p>
          </fieldset>

          <fieldset className="ms-facet">
            <legend>Marca</legend>
            {brands.map((name) => <Checkbox key={name} label={name} count={counts.brand(name)} checked={filters.brands.includes(name)} onChange={(checked) => update({ brands: toggle(filters.brands, name, checked) })} />)}
          </fieldset>

          <fieldset className="ms-facet">
            <legend>Precio</legend>
            <label className="ms-switch">
              <input type="checkbox" role="switch" checked={filters.pricedOnly} onChange={(event) => update({ pricedOnly: event.target.checked })} />
              <span className="ms-switch-track" aria-hidden="true"><span /></span>
              <span className="ms-check-label">Solo con precio</span>
              <span className="ms-count" aria-label={`${counts.priced} productos`}>{counts.priced}</span>
            </label>
          </fieldset>

          {nActive > 0 && <button type="button" className="ms-clear" onClick={() => update({ categories: [], bands: [], brands: [], pricedOnly: false })}>Limpiar filtros ({nActive})</button>}
        </div>

        <div className="ms-drawer-foot">
          <button type="button" className="ms-btn ms-btn-primary" onClick={() => setDrawer(false)}>Ver {results.length} resultado{results.length === 1 ? "" : "s"}</button>
        </div>
      </aside>

      <section className="ms-results" ref={resultsRef} aria-label="Resultados">
        <div className="ms-toolbar">
          <button ref={triggerRef} type="button" className="ms-filter-btn" onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls={`${ids}-filters`}><SlidersHorizontal size={18} aria-hidden />Filtros{nActive > 0 && ` (${nActive})`}</button>
          <div className="ms-search">
            <Search size={20} aria-hidden className="ms-search-icon" />
            <label htmlFor={`${ids}-q`} className="ms-sr">Buscar en el catálogo</label>
            <input id={`${ids}-q`} type="search" value={filters.query} onChange={(event) => update({ query: event.target.value })} placeholder="Buscar en el catálogo" autoComplete="off" />
            {filters.query && <button type="button" className="ms-search-clear" onClick={() => update({ query: "" })} aria-label="Borrar búsqueda"><X size={16} aria-hidden /></button>}
          </div>
          <p className="ms-count-line" aria-live="polite"><span>{results.length}</span> resultado{results.length === 1 ? "" : "s"}</p>
          <label className="ms-sort">
            <span>Ordenar:</span>
            <select value={sort} onChange={(event) => { setSortState(event.target.value as SortId); setPage(0); }}>
              {sortOptions.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}
            </select>
            <ChevronDown size={16} aria-hidden />
          </label>
          <div className="ms-view" role="group" aria-label="Vista">
            <button type="button" aria-pressed={view === "grid"} onClick={() => setView("grid")} aria-label="Vista en cuadrícula"><LayoutGrid size={20} aria-hidden /></button>
            <button type="button" aria-pressed={view === "list"} onClick={() => setView("list")} aria-label="Vista en lista"><List size={20} aria-hidden /></button>
          </div>
        </div>

        {chips.length > 0 && <div className="ms-active">
          {chips.map((chip) => <button key={chip.key} type="button" className="ms-active-chip" onClick={chip.remove} aria-label={`Quitar filtro ${chip.label}`}>{chip.label}<X size={14} aria-hidden /></button>)}
          <button type="button" className="ms-active-clear" onClick={clearAll}>Limpiar todo</button>
        </div>}

        {results.length === 0 ? <div className="ms-empty">
          <p className="ms-empty-code m-mono">0 / {products.length}</p>
          <h2 className="m-display">Sin coincidencias</h2>
          <p>Ninguna referencia cumple todos los filtros. Quita alguno o búscanos por WhatsApp con la frecuencia de tu radio.</p>
          <button type="button" className="ms-btn ms-btn-ghost" onClick={clearAll}>Limpiar filtros</button>
        </div> : <>
          <div ref={gridRef} className={`ms-grid is-${view}`}>
            {visible.map((product, index) => <div key={product.id} data-flip={product.id} className="ms-cell"><ProductCard product={product} priority={current === 0 && index < 3} /></div>)}
          </div>
          {pages > 1 && <nav className="ms-pager" aria-label="Paginación">
            <button type="button" className="ms-pg ms-pg-arrow" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Página anterior"><ChevronLeft size={20} aria-hidden /></button>
            {Array.from({ length: pages }, (_, i) => <button key={i} type="button" className="ms-pg" aria-current={i === current ? "page" : undefined} aria-label={`Página ${i + 1}`} onClick={() => goTo(i)}>{i + 1}</button>)}
            <button type="button" className="ms-pg ms-pg-arrow" onClick={() => goTo(current + 1)} disabled={current === pages - 1} aria-label="Página siguiente"><ChevronRight size={20} aria-hidden /></button>
            <p className="ms-pager-note m-mono">{current * PER_PAGE + 1}–{current * PER_PAGE + visible.length} de {results.length}</p>
          </nav>}
        </>}
      </section>
    </div>
  </>;
}
