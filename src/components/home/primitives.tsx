// Piezas gráficas compartidas del inicio MARAL v4: marcas de registro, cejas "01 / X", punto azul y glifos.

export function RegMarks({ variant = "corner" }: { variant?: "corner" | "cross" }) {
  return <span className={`mh-reg mh-reg--${variant}`} aria-hidden="true"><i /><i /><i /><i /></span>;
}

export function Eyebrow({ n, label, as: Tag = "p", id }: { n: string; label: string; as?: "p" | "h2"; id?: string }) {
  return <Tag id={id} className="mh-eyebrow"><span className="mh-eyebrow-n">{n}</span><span aria-hidden="true">/</span><span>{label}</span></Tag>;
}

/** Punto final cuadrado en azul eléctrico, firma de los titulares. */
export function Dot() {
  return <span className="mh-dot" aria-hidden="true" />;
}

export function ArrowIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M3 10h13M11 4.5 16.5 10 11 15.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="square" /></svg>;
}

export function WaIcon({ className }: { className?: string }) {
  return <svg className={className} width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2.8a9.2 9.2 0 0 0-7.9 13.9L2.8 21.2l4.6-1.2A9.2 9.2 0 1 0 12 2.8Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    <path d="M8.6 7.4c.3-.3.8-.3 1 .1l.9 1.9c.1.3.1.6-.1.8l-.6.7c.6 1.3 1.6 2.3 2.9 2.9l.7-.6c.2-.2.5-.2.8-.1l1.9.9c.4.2.4.7.1 1l-.6.7c-.5.5-1.3.7-2 .4-2.6-1-4.6-3-5.6-5.6-.3-.7-.1-1.5.4-2Z" fill="currentColor" />
  </svg>;
}

export function CartIcon({ className }: { className?: string }) {
  return <svg className={className} width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M3 4h2.6l2.1 10.2h10.1L20 7.4H7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="square" /><circle cx="9" cy="19" r="1.5" fill="currentColor" /><circle cx="17" cy="19" r="1.5" fill="currentColor" /></svg>;
}
