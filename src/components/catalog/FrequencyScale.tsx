import { bands, type BandId } from "./filters";

/* Regla logarítmica 25–1000 MHz. Las bandas reales del catálogo se marcan; las activas en azul. */
const W = 660;
const MIN = Math.log10(25);
const MAX = Math.log10(1000);
const x = (mhz: number) => ((Math.log10(mhz) - MIN) / (MAX - MIN)) * W;
const labels = [30, 50, 100, 200, 400, 800, 1000];
const minor = Array.from({ length: 111 }, (_, i) => (i / 110) * W);
const segments: { id: BandId; from: number; to: number }[] = [
  { id: "otras", from: 27, to: 33 },
  { id: "aerea", from: 118, to: 136 },
  { id: "vhf", from: 136, to: 174 },
  { id: "uhf", from: 403, to: 512 },
  { id: "otras", from: 806, to: 870 },
];

export function FrequencyScale({ active = [] }: { active?: readonly BandId[] }) {
  return <svg className="ms-scale" viewBox={`-8 0 ${W + 64} 62`} role="img" aria-label={`Escala de frecuencia 25 a 1000 MHz${active.length ? `; bandas activas: ${active.map((id) => bands.find((b) => b.id === id)!.label).join(", ")}` : ""}`}>
    {segments.map((s, i) => {
      const on = active.includes(s.id);
      return <rect key={i} className={`ms-scale-band${on ? " is-on" : ""}`} x={x(s.from)} y={2} width={Math.max(3, x(s.to) - x(s.from))} height={30} />;
    })}
    <line x1={0} x2={W} y1={32} y2={32} className="ms-scale-axis" />
    {minor.map((pos, i) => <line key={i} x1={pos} x2={pos} y1={i % 5 === 0 ? 14 : 22} y2={32} className="ms-scale-tick" />)}
    {labels.map((mhz) => <g key={mhz}>
      <line x1={x(mhz)} x2={x(mhz)} y1={6} y2={32} className="ms-scale-major" />
      <text x={x(mhz)} y={54} textAnchor="middle" className="ms-scale-label">{mhz}</text>
    </g>)}
    <text x={W + 56} y={54} textAnchor="end" className="ms-scale-label">MHz</text>
  </svg>;
}
