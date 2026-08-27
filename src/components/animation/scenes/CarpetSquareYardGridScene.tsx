import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Turn a foot-square floor grid into countable 3×3 square-yard carpet patches. */
export function CarpetSquareYardGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const length = Math.round(num(data.lengthFeet, 0)), width = Math.round(num(data.widthFeet, 0));
  const feetPerYard = Math.round(num(data.feetPerYard, 0));
  const feetArea = length * width, cols = length / feetPerYard, rows = width / feetPerYard, yardsArea = cols * rows;
  const choice = problem.choices?.find(c => Number(c.text) === yardsArea)?.label;
  const stored = parseFloat(String(problem.shortAnswer ?? ""));
  const ok = Number.isInteger(cols) && Number.isInteger(rows) && yardsArea === stored && choice === problem.answer;
  const failure = !Number.isInteger(cols) || !Number.isInteger(rows) ? `${length}×${width} does not split into ${feetPerYard}×${feetPerYard} patches` : `computed ${yardsArea}; stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(step, 1);
  const cell = 20, x0 = (460 - length * cell) / 2, y0 = 52, floorW = length * cell, floorH = width * cell;
  const patches = Array.from({ length: rows * cols }, (_, i) => ({ col: i % cols, row: Math.floor(i / cols) }));

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "tile the 12 ft × 9 ft floor with one-foot squares" : phase === 1 ? "every 3 ft × 3 ft bundle becomes one square yard" : "the floor is now a 4 by 3 grid of square yards"}</text>

      <rect x={x0} y={y0} width={floorW} height={floorH} rx="3" fill="#fee2e2" stroke={INK} strokeWidth="2.5" />
      {phase >= 1 && patches.map((p, i) => <motion.rect key={i} x={x0 + p.col * cell * feetPerYard} y={y0 + p.row * cell * feetPerYard} width={cell * feetPerYard} height={cell * feetPerYard} fill={i % 2 ? "#fecaca" : "#fca5a5"} fillOpacity=".88" stroke={RED} strokeWidth="2.4" initial={{ opacity: 0, scale: .72 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .055 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}
      {Array.from({ length: length - 1 }, (_, i) => i + 1).map(i => <line key={`v${i}`} x1={x0+i*cell} y1={y0} x2={x0+i*cell} y2={y0+floorH} stroke={phase >= 1 && i % feetPerYard ? "#fff" : phase >= 1 ? RED : "#94a3b8"} strokeOpacity={phase >= 1 && i % feetPerYard ? .72 : 1} strokeWidth={phase >= 1 && i % feetPerYard ? .8 : phase >= 1 ? 2.4 : 1} />)}
      {Array.from({ length: width - 1 }, (_, i) => i + 1).map(i => <line key={`h${i}`} x1={x0} y1={y0+i*cell} x2={x0+floorW} y2={y0+i*cell} stroke={phase >= 1 && i % feetPerYard ? "#fff" : phase >= 1 ? RED : "#94a3b8"} strokeOpacity={phase >= 1 && i % feetPerYard ? .72 : 1} strokeWidth={phase >= 1 && i % feetPerYard ? .8 : phase >= 1 ? 2.4 : 1} />)}

      <path d={`M${x0} ${y0-8} V${y0-18} H${x0+floorW} V${y0-8}`} fill="none" stroke={IND} strokeWidth="1.5" />
      <text x="230" y={y0-22} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{phase === 0 ? `${length} feet` : `${cols} yards`}</text>
      <path d={`M${x0-8} ${y0} H${x0-18} V${y0+floorH} H${x0-8}`} fill="none" stroke={IND} strokeWidth="1.5" />
      <text x={x0-25} y={y0+floorH/2} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT} transform={`rotate(-90 ${x0-25} ${y0+floorH/2})`}>{phase === 0 ? `${width} feet` : `${rows} yards`}</text>

      {phase === 0 && <motion.g initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}><rect x="148" y="262" width="164" height="34" rx="10" fill="#eef2ff" stroke={IND} /><text x="230" y="284" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{length} × {width} = {feetArea} ft²</text></motion.g>}
      {phase === 1 && <g><rect x="128" y="258" width="204" height="40" rx="10" fill="#fff7ed" stroke={RED} /><text x="230" y="275" textAnchor="middle" fontSize="11.5" fontWeight="900" fill={INK} fontFamily={FONT}>1 yd² = {feetPerYard} ft × {feetPerYard} ft</text><text x="230" y="291" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={FONT}>= {feetPerYard*feetPerYard} ft² per patch</text></g>}
      {phase === 2 && <><motion.rect x="139" y="258" width="182" height="40" rx="11" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .65 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="284" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{cols} × {rows} = {yardsArea} yd²</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={398} y={274} width={82} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="307" textAnchor="middle" fontSize="9.5" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
