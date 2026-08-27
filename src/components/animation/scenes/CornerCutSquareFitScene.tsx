import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

type Pt = { x: number; y: number };
const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const AMBER = "#d97706";
const DIM = "#94a3b8";
const poly = (points: Pt[]) => points.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
const rotateQuarter = (p: Pt, side: number): Pt => ({ x: side - p.y, y: p.x });

export function CornerCutSquareFitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const L = num(data.outerSide, 0);
  const c = num(data.cutSide, 0);
  const cutCount = Math.round(num(data.cutCount, 0));
  // A top vertex at (a,0) and right vertex at (L,a) has a side through
  // the re-entrant corner (L-c,c) exactly when a²-La+cL=0.
  const discriminant = L * L - 4 * c * L;
  const a = (L - Math.sqrt(discriminant)) / 2;
  const fitted = [{ x: a, y: 0 }, { x: L, y: a }, { x: L - a, y: L }, { x: 0, y: L - a }];
  const start = [{ x: c, y: c }, { x: L - c, y: c }, { x: L - c, y: L - c }, { x: c, y: L - c }];
  const innerCorners = [{ x: c, y: c }, { x: L - c, y: c }, { x: L - c, y: L - c }, { x: c, y: L - c }];
  const basePair = [
    [{ x: c, y: 0 }, { x: a, y: 0 }, { x: c, y: c }],
    [{ x: 0, y: c }, { x: 0, y: L - a }, { x: c, y: c }],
  ];
  const gapTriangles: Pt[][] = [];
  for (let turn = 0; turn < 4; turn++) for (const triangle of basePair) {
    let rotated = triangle.map((p) => ({ ...p }));
    for (let k = 0; k < turn; k++) rotated = rotated.map((p) => rotateQuarter(p, L));
    gapTriangles.push(rotated);
  }
  const outerArea = L * L;
  const cutArea = cutCount * c * c;
  const combinedBase = L - 2 * c;
  const pairArea = c * combinedBase / 2;
  const gapArea = cutCount * pairArea;
  const fittedArea = outerArea - cutArea - gapArea;
  const shoelace = Math.abs(fitted.reduce((sum, p, i) => {
    const q = fitted[(i + 1) % fitted.length];
    return sum + p.x * q.y - q.x * p.y;
  }, 0)) / 2;
  const ok = Math.abs(fittedArea - shoelace) < 1e-9 && fittedArea === Number(problem.shortAnswer) && problem.answer === "C";
  const last = totalSteps - 1;
  const phase = step >= last ? 3 : Math.min(step, 2);

  const ox = 55, oy = 27, scale = 47;
  const P = (p: Pt): Pt => ({ x: ox + p.x * scale, y: oy + p.y * scale });
  const boardPoly = fitted.map(P);
  const startPoly = start.map(P);
  const cutOrigins = [{ x: 0, y: 0 }, { x: L - c, y: 0 }, { x: L - c, y: L - c }, { x: 0, y: L - c }];
  const colors = ["#f59e0b", "#0d9488", "#8b5cf6", "#ec4899"];

  return <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 7, padding: "5px 2px" }}>
    <svg viewBox="0 0 470 302" width="100%" style={{ maxWidth: 500 }} aria-label="Largest tilted square inside a five-inch square with unit corners removed">
      <rect x={ox} y={oy} width={L * scale} height={L * scale} fill="#f8fafc" stroke={INK} strokeWidth="2.5" />
      {Array.from({ length: Math.round(L) - 1 }, (_, i) => <g key={i} opacity={phase === 0 ? .45 : .14}>
        <line x1={ox + (i + 1) * scale} y1={oy} x2={ox + (i + 1) * scale} y2={oy + L * scale} stroke={DIM} />
        <line x1={ox} y1={oy + (i + 1) * scale} x2={ox + L * scale} y2={oy + (i + 1) * scale} stroke={DIM} />
      </g>)}

      {phase >= 2 && gapTriangles.map((triangle, i) => <motion.polygon key={i} points={poly(triangle.map(P))} fill={colors[Math.floor(i / 2)]} fillOpacity=".4" stroke={colors[Math.floor(i / 2)]} strokeWidth="1.4" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .06 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}

      {phase >= 1 && <motion.polygon
        points={poly(boardPoly)} fill={phase === 3 ? "#dcfce7" : "#e0e7ff"} fillOpacity={phase === 3 ? .82 : .68} stroke={phase === 3 ? GREEN : IND} strokeWidth="3"
        initial={{ points: poly(startPoly), opacity: .35 }} animate={{ points: poly(boardPoly), opacity: 1 }} transition={{ duration: .9, ease: "easeInOut" }}
      />}

      {cutOrigins.map((p, i) => {
        const q = P(p);
        return <motion.g key={i} initial={phase === 0 ? { opacity: 0, scale: .6 } : false} animate={{ opacity: phase === 3 ? .35 : 1, scale: 1 }} transition={{ delay: i * .1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x={q.x} y={q.y} width={c * scale} height={c * scale} fill="#e5e7eb" stroke={RED} strokeWidth="2" />
          {phase === 0 && <text x={q.x + c * scale / 2} y={q.y + c * scale / 2 + 4} textAnchor="middle" fontSize="10" fontWeight="900" fill={RED} fontFamily={FONT}>1×1</text>}
        </motion.g>;
      })}

      {phase === 0 && <>
        <text x="360" y="59" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>original board</text>
        <text x="360" y="86" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>{L} × {L} = {outerArea}</text>
        <text x="360" y="125" textAnchor="middle" fontSize="11" fontWeight="850" fill={RED}>four corner cuts</text>
        <text x="360" y="150" textAnchor="middle" fontSize="16" fontWeight="900" fill={RED} fontFamily={FONT}>{cutCount} × 1 = {cutArea}</text>
        <text x="360" y="195" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>remaining region</text>
        <text x="360" y="220" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{outerArea} − {cutArea} = {outerArea - cutArea}</text>
      </>}

      {phase === 1 && <>
        {innerCorners.map((p, i) => { const q = P(p); return <motion.circle key={i} cx={q.x} cy={q.y} r="5.5" fill={AMBER} stroke="#fff" strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .75 + i * .08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />; })}
        <g transform="translate(315 69)">
          <rect width="137" height="112" rx="14" fill="#eef2ff" stroke="#c7d2fe" />
          <text x="68.5" y="25" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND}>EXPAND + ROTATE</text>
          <text x="68.5" y="51" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>all four sides touch</text>
          <text x="68.5" y="70" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>inner cut corners</text>
          <text x="68.5" y="94" textAnchor="middle" fontSize="10" fontWeight="850" fill={AMBER}>four blockers → maximal</text>
        </g>
        <text x="383" y="217" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>any larger square crosses</text>
        <text x="383" y="234" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>a missing corner</text>
      </>}

      {phase === 2 && <>
        <g transform="translate(314 49)">
          <rect width="140" height="177" rx="14" fill="#fff7ed" stroke="#fdba74" />
          <text x="70" y="23" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER}>ONE CORNER PAIR</text>
          <text x="70" y="51" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>common height = {c}</text>
          <text x="70" y="76" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>bases together:</text>
          <text x="70" y="99" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{L} − {c} − {c} = {combinedBase}</text>
          <text x="70" y="128" textAnchor="middle" fontSize="14" fontWeight="900" fill={AMBER} fontFamily={FONT}>½ · {c} · {combinedBase} = {pairArea}</text>
          <line x1="17" y1="141" x2="123" y2="141" stroke="#fdba74" />
          <text x="70" y="162" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={FONT}>{cutCount} pairs = {gapArea}</text>
        </g>
        <text x="173" y="282" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>matching colors pair the eight leftover triangles</text>
      </>}

      {phase === 3 && <>
        <g transform="translate(315 54)">
          <rect width="139" height="153" rx="14" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" />
          <text x="69.5" y="25" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>BIG BOARD</text>
          <text x="69.5" y="50" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{outerArea}</text>
          <text x="69.5" y="76" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED} fontFamily={FONT}>− {cutArea} cutouts</text>
          <text x="69.5" y="99" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={FONT}>− {gapArea} triangles</text>
          <line x1="22" y1="111" x2="117" y2="111" stroke={INK} />
          <text x="69.5" y="137" textAnchor="middle" fontSize="21" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {fittedArea}</text>
        </g>
        <text x="384" y="234" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={ok ? "#166534" : RED}>{ok ? `shoelace check = ${shoelace}` : "area check failed"}</text>
        <rect x="326" y="249" width="116" height="30" rx="15" fill={ok ? GREEN : RED} />
        <text x="384" y="269" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {problem.answer}</text>
      </>}
    </svg>
  </div>;
}
