import type { Metadata } from "next";
import "./globals.css";
import "../styles/maral-tokens.css";
import "../styles/maral-home.css";
import "../styles/maral-shop.css";
import { RouteChrome } from "@/components/site/RouteChrome";
export const metadata: Metadata = { title: "MARAL | Antenas y radiocomunicación — Tecnología y Comunicaciones", description: "Antenas móviles VHF/UHF, estaciones base, bases y kits de instalación. Fabricación nacional en Curití, Santander, con despachos a todo Colombia.", icons: { icon: "/sites/industrias-maral/maral-mark.svg" } };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body><RouteChrome>{children}</RouteChrome></body></html>; }
