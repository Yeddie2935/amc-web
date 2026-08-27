import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", GOLD = "#d97706", RED = "#dc2626", DIM = "#64748b";
type Pt = { x: number; y: number };
const pts = (values: Pt[]) => values.map(p => `${p.x},${p.y}`).join(" ");
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);

/** Fan a regular octagon into eighths, then split one edge-sector at its midpoint. */
export function OctagonMidpointShadeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.round(num(data.vertexCount, 0)), full = Math.round(num(data.fullTriangles, 0)), half = Math.round(num(data.halfTriangles, 0));
  const denominator = 2 * n, numerator = 2 * full + half, g = gcd(numerator, denominator);
  const fraction = `${numerator / g}/${denominator / g}`;
  const choice = problem.choices?.find(c => c.text.replace(/\s/g, "") === fraction)?.label;
  const stored = String(problem.shortAnswer ?? "").replace(/\s/g, "");
  const ok = fraction === stored && choice === problem.answer;
  const failure = `computed ${fraction}; stored ${stored || "missing"}`;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(step, 1);

  const O: Pt = { x: 185, y: 150 }, radius = 112;
  const vertices = Array.from({ length: n }, (_, i) => { const a = (-90 + i * 360 / n) * Math.PI / 180; return { x: O.x + radius * Math.cos(a), y: O.y + radius * Math.sin(a) }; });
  const labels = ["B", "A", "H", "G", "F", "E", "D", "C"];
  const B = vertices[0], A = vertices[1], X = { x: (A.x+B.x)/2, y: (A.y+B.y)/2 };
  const title = phase === 0 ? "spokes from O split the regular octagon into 8 equal triangles" : phase === 1 ? "the shade covers 3 whole eighths and half of one more" : "trade every eighth for two sixteenths, then count";

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.2" fontWeight="850" fill={INK}>{title}</text>

      {phase >= 1 && <><motion.polygon points={pts([O, vertices[0], vertices[7]])} fill={IND} fillOpacity=".58" initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><motion.polygon points={pts([O, vertices[7], vertices[6]])} fill={IND} fillOpacity=".58" initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .12 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><motion.polygon points={pts([O, vertices[6], vertices[5]])} fill={IND} fillOpacity=".58" initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .24 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><motion.polygon points={pts([O, B, X])} fill={GOLD} fillOpacity=".7" initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .38 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /></>}

      <polygon points={pts(vertices)} fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      {vertices.map((v, i) => <motion.line key={i} x1={O.x} y1={O.y} x2={v.x} y2={v.y} stroke={phase === 0 ? IND : "#94a3b8"} strokeWidth={phase === 0 ? 1.6 : 1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .06 }} />)}
      <line x1={O.x} y1={O.y} x2={X.x} y2={X.y} stroke={GOLD} strokeWidth="2.5" />
      <circle cx={O.x} cy={O.y} r="3.5" fill={INK} /><text x={O.x+8} y={O.y+5} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>O</text>
      {vertices.map((v, i) => { const dx = v.x-O.x, dy=v.y-O.y, m=Math.hypot(dx,dy); return <g key={labels[i]}><circle cx={v.x} cy={v.y} r="3" fill={INK}/><text x={v.x+dx/m*14} y={v.y+dy/m*14+4} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{labels[i]}</text></g>; })}
      <circle cx={X.x} cy={X.y} r="3.5" fill={GOLD} /><text x={X.x+11} y={X.y-5} fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>X</text>

      <g transform="translate(320 57)">
        {phase === 0 && <><rect width="112" height="100" rx="12" fill="#eef2ff" stroke={IND}/><text x="56" y="27" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>8 equal pieces</text><text x="56" y="58" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK} fontFamily={FONT}>each = ⅛</text><text x="56" y="84" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>same base angles</text></>}
        {phase === 1 && <><rect width="112" height="116" rx="12" fill="#fff" stroke="#cbd5e1"/><circle cx="19" cy="26" r="7" fill={IND}/><text x="34" y="30" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{full} × ⅛</text><circle cx="19" cy="59" r="7" fill={GOLD}/><text x="34" y="63" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>½ × ⅛</text><line x1="12" y1="78" x2="100" y2="78" stroke="#cbd5e1"/><text x="56" y="101" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>= ⅜ + ¹⁄₁₆</text></>}
        {phase === 2 && <><rect width="112" height="116" rx="12" fill="#f0fdf4" stroke={ok ? GREEN : RED}/><text x="56" y="25" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{full} × 2/16 = {2*full}/16</text><text x="56" y="51" textAnchor="middle" fontSize="11" fontWeight="900" fill={GOLD} fontFamily={FONT}>half = {half}/16</text><line x1="12" y1="66" x2="100" y2="66" stroke={GREEN}/><motion.text x="56" y="96" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .6 }} animate={{ scale: 1 }}>{fraction}</motion.text></>}
      </g>
      {phase === 1 && <text x="185" y="285" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={IND} fontFamily={FONT}>OBX is half of △OBA because X bisects AB</text>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer} cx={400} y={264} width={82}/>
      <AnimatePresence>{final && !ok && <motion.text x="230" y="294" textAnchor="middle" fontSize="10" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
