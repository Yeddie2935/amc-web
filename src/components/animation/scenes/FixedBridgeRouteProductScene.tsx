import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
type Pt = [number, number];

function words(east: number, north: number): string[] {
  const out: string[] = [];
  const go = (word: string, e: number, n: number) => {
    if (e === east && n === north) out.push(word);
    else { if (e < east) go(`${word}E`, e + 1, n); if (n < north) go(`${word}N`, e, n + 1); }
  };
  go("", 0, 0); return out;
}

/** Enumerate shortest routes on each side of one fixed connector, then take their product. */
export function FixedBridgeRouteProductScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const before = (Array.isArray(data.beforeMoves) ? data.beforeMoves : []).map((v) => Math.round(num(v, 0)));
  const after = (Array.isArray(data.afterMoves) ? data.afterMoves : []).map((v) => Math.round(num(v, 0)));
  const fixed = Math.round(num(data.fixedConnectorCount, 0));
  const leftRoutes = words(before[0] ?? 0, before[1] ?? 0), rightRoutes = words(after[0] ?? 0, after[1] ?? 0);
  const total = leftRoutes.length * fixed * rightRoutes.length;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === total)?.label;
  const ok = stored === total && choice === problem.answer;
  const failure = stored !== total ? `computed ${total}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(Math.max(step, 0), 1);

  const home: Pt = [32, 151], sw: Pt = [122, 111], ne: Pt = [278, 53], school: Pt = [354, 17];
  const path = (word: string, start: Pt, dx: number, dy: number) => {
    let [x, y] = start; const ps: Pt[] = [[x, y]];
    for (const move of word) { if (move === "E") x += dx; else y -= dy; ps.push([x, y]); }
    return ps.map((p, i) => `${i ? "L" : "M"} ${p[0]} ${p[1]}`).join(" ");
  };
  const colors = [IND, "#0d9488", "#7c3aed", GOLD, "#be123c", "#0369a1"];

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 410 325" width="100%" style={{ maxWidth: 455, minWidth: 0, display: "block" }}>
      <text x="205" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "list every shortest route from home to the park" : phase === 1 ? "list every shortest route from the park to school" : "pair any approach with any departure"}</text>

      {/* street grids on the two independent sides */}
      {[0, 1, 2].map((e) => <line key={`lv${e}`} x1={home[0] + e * 45} y1={home[1]} x2={home[0] + e * 45} y2={sw[1]} stroke="#cbd5e1" />)}
      {[0, 1].map((n) => <line key={`lh${n}`} x1={home[0]} y1={home[1] - n * 40} x2={sw[0]} y2={home[1] - n * 40} stroke="#cbd5e1" />)}
      {[0, 1, 2].map((e) => <line key={`rv${e}`} x1={ne[0] + e * 38} y1={ne[1]} x2={ne[0] + e * 38} y2={school[1]} stroke="#cbd5e1" />)}
      {[0, 1, 2].map((n) => <line key={`rh${n}`} x1={ne[0]} y1={ne[1] - n * 18} x2={school[0]} y2={ne[1] - n * 18} stroke="#cbd5e1" />)}
      <rect x={sw[0]} y={ne[1]} width={ne[0] - sw[0]} height={sw[1] - ne[1]} rx="5" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
      <motion.line x1={sw[0]} y1={sw[1]} x2={ne[0]} y2={ne[1]} stroke={GREEN} strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <text x="200" y="90" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>fixed diagonal</text>

      {phase === 0 && leftRoutes.map((w, i) => <motion.path key={w} d={path(w, home, 45, 40)} fill="none" stroke={colors[i]} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .16 }} />)}
      {phase === 1 && rightRoutes.map((w, i) => <motion.path key={w} d={path(w, ne, 38, 18)} fill="none" stroke={colors[i]} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .1 }} />)}
      {phase === 2 && <><path d={path(leftRoutes[0], home, 45, 40)} fill="none" stroke={IND} strokeWidth="3" /><path d={path(rightRoutes[0], ne, 38, 18)} fill="none" stroke={GOLD} strokeWidth="3" /></>}

      <circle cx={home[0]} cy={home[1]} r="5" fill={INK} /><circle cx={school[0]} cy={school[1]} r="5" fill={INK} />
      <text x={home[0] - 5} y={home[1] + 17} fontSize="9.5" fontWeight="900" fill={INK}>home</text><text x={school[0] + 8} y={school[1] + 4} fontSize="9.5" fontWeight="900" fill={INK}>school</text>
      <text x={sw[0] - 10} y={sw[1] + 15} fontSize="9" fontWeight="900" fill={GREEN}>SW</text><text x={ne[0] - 6} y={ne[1] - 7} fontSize="9" fontWeight="900" fill={GREEN}>NE</text>

      {phase === 0 && <g>
        <text x="205" y="182" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>2 E + 1 N → choose the N position</text>
        {leftRoutes.map((w, i) => <motion.g key={w} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .12 }}><rect x={112 + i * 66} y="195" width="54" height="28" rx="7" fill="#eef2ff" stroke={colors[i]} /><text x={139 + i * 66} y="214" textAnchor="middle" fontSize="12" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{w}</text></motion.g>)}
        <text x="205" y="247" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>C(3,1) = {leftRoutes.length}</text>
      </g>}
      {phase === 1 && <g>
        <text x="205" y="176" textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>2 E + 2 N → choose 2 of 4 positions</text>
        {rightRoutes.map((w, i) => <motion.g key={w} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .07 }}><rect x={80 + (i % 3) * 92} y={188 + Math.floor(i / 3) * 36} width="78" height="27" rx="7" fill="#fff7ed" stroke={colors[i]} /><text x={119 + (i % 3) * 92} y={206 + Math.floor(i / 3) * 36} textAnchor="middle" fontSize="11" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{w}</text></motion.g>)}
        <text x="205" y="274" textAnchor="middle" fontSize="17" fontWeight="900" fill={GOLD} fontFamily={FONT}>C(4,2) = {rightRoutes.length}</text>
      </g>}
      {phase === 2 && <g transform="translate(72 172)">
        <text x="133" y="0" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>each cell is one complete route</text>
        {leftRoutes.map((l, r) => rightRoutes.map((q, c) => <motion.g key={`${l}-${q}`} initial={{ opacity: 0, scale: .4 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: (r * rightRoutes.length + c) * .035 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={c * 43} y={12 + r * 30} width="37" height="24" rx="6" fill="#dcfce7" stroke={GREEN} /><text x={c * 43 + 18.5} y={28 + r * 30} textAnchor="middle" fontSize="8" fontWeight="900" fill={INK} fontFamily={FONT}>{l}·{q}</text></motion.g>))}
        <rect x="10" y="110" width="246" height="43" rx="11" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="133" y="127" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>approach × fixed diagonal × departure</text><text x="133" y="146" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{leftRoutes.length} × {fixed} × {rightRoutes.length} = {total}</text>
      </g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={205} y={298} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="205" y="323" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
