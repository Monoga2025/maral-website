"use client";
import { useEffect } from "react";

/**
 * Revelado al hacer scroll. Solo se mueve lo que aún está fuera de pantalla (transform, nunca opacidad 0),
 * así el contenido queda visible aunque este script no corra.
 */
export function RevealController() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-rv]"));
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("rv-in");
        e.target.classList.remove("rv-wait");
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -12% 0px" });
    for (const el of els) {
      if (el.getBoundingClientRect().top > window.innerHeight * 0.9) {
        el.classList.add("rv-wait");
        io.observe(el);
      }
    }
    return () => io.disconnect();
  }, []);
  return null;
}
