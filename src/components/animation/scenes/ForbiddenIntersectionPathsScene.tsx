import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", AMBER = "#d97706";

type Point = [number, number];

function routeWords(east: number, north: number): string[] {
  const out: string[] = [];
  const visit = (word: string, e: number, n: number) => {
    if (e === east && n === north) out.push(word);
    else {
      if (e < east) visit(`${word}E`, e + 1, n);
      if (n < north) visit(`${word}N`, e, n + 1);
    }
  };
  visit("", 0, 0);
  return out;
}

function pointsOf(word: string): Point[] {
  let x = 0, y = 0;
  const points: Point[] = [[x, y]];
  for (const move of word) {
    if (move === "E") x += 1;
    else y += 1;
    points.push([x, y]);
  }
  return points;
}

/** Complementary counting on a monotone street grid. Data: { eastBlocks, northBlocks, blocked:[x,y] }. */
export function ForbiddenIntersectionPathsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const east = Math.round(num(data.eastBlocks, 3)), north = Math.round(num(data.northBlocks, 2));
  const rawBlocked = Array.isArray(data.blocked) ? data.blocked : [1, 1];
  const blocked: Point = [Math.round(num(rawBlocked[0], 1)), Math.round(num(rawBlocked[1], 1))];
  const routes = routeWords(east, north);
  const dangerous = routes.filter((word) => pointsOf(word).some(([x, y]) => x === blocked[0] && y === blocked[1]));
  const safe = routes.filter((word) => !dangerous.includes(word));
  const toBlocked = routeWords(blocked[0], blocked[1]);
  const fromBlocked = routeWords(east - blocked[0], north - blocked[1]);
  const final = step >= totalSteps - 1;
  const consistent = safe.length === Number(problem.shortAnswer) && problem.choices?.find((c) => Number(c.text) === safe.length)?.label === problem.answer;

  const gx = 55, gy = 132, dx = 78, dy = 56;
  const pathD = (word: string, offset = 0) => pointsOf(word).map(([x, y], i) => `${i ? "L" : "M"} ${gx + x * dx + offset} ${gy - y * dy + offset}`).join(" ");

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 292" width="100%" style={{ maxWidth: 430 }}>
      <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">
        {step === 0 ? "CHOOSE THE 2 NORTH MOVES" : step === 1 ? "ROUTES THROUGH THE DANGER" : "ONLY THE SAFE ROUTES REMAIN"}
      </text>

      {Array.from({ length: east + 1 }, (_, x) => <line key={`v${x}`} x1={gx + x * dx} y1={gy} x2={gx + x * dx} y2={gy - north * dy} stroke="#cbd5e1" strokeWidth="2" />)}
      {Array.from({ length: north + 1 }, (_, y) => <line key={`h${y}`} x1={gx} y1={gy - y * dy} x2={gx + east * dx} y2={gy - y * dy} stroke="#cbd5e1" strokeWidth="2" />)}
      {Array.from({ length: (east + 1) * (north + 1) }, (_, i) => {
        const x = i % (east + 1), y = Math.floor(i / (east + 1)), danger = x === blocked[0] && y === blocked[1];
        return <circle key={i} cx={gx + x * dx} cy={gy - y * dy} r={danger ? 8 : 3.5} fill={danger ? "#fee2e2" : INK} stroke={danger ? RED : "none"} strokeWidth="2.5" />;
      })}
      <text x={gx - 4} y={gy + 20} fontSize="10" fontWeight="900" fill={INK}>Jack</text>
      <text x={gx + east * dx - 16} y={gy - north * dy - 12} fontSize="10" fontWeight="900" fill={GREEN}>Jill</text>
      <text x={gx + blocked[0] * dx + 12} y={gy - blocked[1] * dy + 4} fontSize="10" fontWeight="900" fill={RED}>danger</text>

      {final && safe.map((word, i) => <motion.path key={word} d={pathD(word, (i - 1.5) * 2.3)} fill="none" stroke={[GREEN, "#0d9488", INDIGO, AMBER][i]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.75, delay: i * 0.14 }} />)}

      {step === 0 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <text x="180" y="160" textAnchor="middle" fontSize="15" fontWeight="900" fill={INDIGO} fontFamily={FONT}>C(5,2) = {routes.length}</text>
        {routes.map((word, i) => <motion.g key={word} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.055 }}>
          <rect x={14 + (i % 5) * 68} y={177 + Math.floor(i / 5) * 32} width="60" height="24" rx="6" fill="#eef2ff" stroke="#a5b4fc" />
          <text x={44 + (i % 5) * 68} y={193 + Math.floor(i / 5) * 32} textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{word}</text>
        </motion.g>)}
        <text x="180" y="255" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">every word has 3 E's and 2 N's</text>
      </motion.g>}

      {step === 1 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <path d={`M ${gx} ${gy} L ${gx + dx} ${gy} L ${gx + dx} ${gy - dy}`} fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" />
        <path d={`M ${gx} ${gy} L ${gx} ${gy - dy} L ${gx + dx} ${gy - dy}`} fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" />
        <rect x="25" y="157" width="135" height="78" rx="10" fill="#fff7ed" stroke="#fdba74" />
        <text x="92" y="174" textAnchor="middle" fontSize="10" fontWeight="900" fill={AMBER}>TO DANGER</text>
        {toBlocked.map((w, i) => <text key={w} x={62 + i * 61} y="201" textAnchor="middle" fontSize="14" fontWeight="900" fill={RED} fontFamily={FONT}>{w}</text>)}
        <text x="92" y="224" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>C(2,1) = {toBlocked.length}</text>
        <rect x="200" y="157" width="135" height="78" rx="10" fill="#eef2ff" stroke="#a5b4fc" />
        <text x="267" y="174" textAnchor="middle" fontSize="10" fontWeight="900" fill={INDIGO}>AFTER DANGER</text>
        <text x="267" y="201" textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{fromBlocked.join("  ")}</text>
        <text x="267" y="224" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>C(3,1) = {fromBlocked.length}</text>
        <motion.rect x="102" y="247" width="156" height="36" rx="10" fill="#fee2e2" stroke={RED} initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <text x="180" y="271" textAnchor="middle" fontSize="18" fontWeight="900" fill={RED} fontFamily={FONT}>{toBlocked.length} × {fromBlocked.length} = {dangerous.length}</text>
      </motion.g>}

      {final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {safe.map((word, i) => <g key={word}><rect x={25 + i * 80} y="158" width="70" height="25" rx="6" fill="#dcfce7" stroke={GREEN} /><text x={60 + i * 80} y="175" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>{word}</text></g>)}
        <rect x="90" y="204" width="180" height="46" rx="12" fill="#dcfce7" stroke={consistent ? GREEN : RED} strokeWidth="2.5" />
        <text x="180" y="234" textAnchor="middle" fontSize="22" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{routes.length} − {dangerous.length} = {safe.length}</text>
        <text x="180" y="273" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">check: {safe.length} listed paths avoid the red point</text>
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : step === 1 ? RED : INDIGO, textAlign: "center" }}>
      {step === 0 ? `${routes.length} shortest routes before the restriction` : step === 1 ? `${toBlocked.length} approaches × ${fromBlocked.length} departures = ${dangerous.length} blocked routes` : `${routes.length} total − ${dangerous.length} blocked = ${safe.length} safe routes`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.55 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>route enumeration or stored answer check failed</span>}
  </div>;
}
