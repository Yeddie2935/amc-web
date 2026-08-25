import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";
const COLORS = ["#818cf8", "#38bdf8", "#f59e0b"];

/** A triangle's 180 degrees is cut into equal ratio tiles, then the tiles are
 * dealt back to its three vertices. Data: { ratio:[a,b,c], angleSum }. */
export function AngleRatioPartsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const ratio = Array.isArray(data.ratio) ? data.ratio.map((v) => Math.round(num(v, 0))) : [];
  const angleSum = num(data.angleSum, 180);
  const parts = ratio.reduce((a, b) => a + b, 0);
  const onePart = angleSum / parts;
  const angles = ratio.map((v) => v * onePart);
  const largest = Math.max(...angles);
  const largestIndex = angles.indexOf(largest);
  const stated = Number(String(problem.shortAnswer ?? "").replace(/[^0-9.-]/g, ""));
  const final = step >= totalSteps - 1;
  const priced = step >= 1 || final;
  const consistent = ratio.length === 3 && Number.isInteger(onePart) && (!problem.shortAnswer || stated === largest);

  const tileW = 30;
  const x0 = 45;
  const owner: number[] = [];
  ratio.forEach((count, group) => Array.from({ length: count }).forEach(() => owner.push(group)));
  const targets = [
    Array.from({ length: ratio[0] }, (_, i) => ({ x: 58 + i * 22, y: 172 - i * 13 })),
    Array.from({ length: ratio[1] }, (_, i) => ({ x: 254 + i * 22, y: 146 + i * 13 })),
    Array.from({ length: ratio[2] }, (_, i) => ({ x: 164 + i * 22, y: 45 + Math.abs(i - 1.5) * 5 })),
  ];

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
    <svg viewBox="0 0 390 238" width="100%" style={{ maxWidth: 430 }}>
      {!final ? <>
        <motion.path d="M 35 90 Q 195 10 355 90" fill="none" stroke={INDIGO} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <line x1="35" y1="90" x2="355" y2="90" stroke={INK} strokeWidth="2" />
        <text x="195" y="25" textAnchor="middle" fontSize="13" fontWeight="900" fill={INDIGO} fontFamily={mono}>triangle angles = {angleSum}°</text>
        {owner.map((group, i) => <motion.g key={i} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 230, damping: 17, delay: 0.12 + i * 0.06 }}>
          <rect x={x0 + i * tileW} y="113" width="27" height="42" rx="5" fill={COLORS[group]} fillOpacity="0.2" stroke={COLORS[group]} strokeWidth="1.5" />
          <text x={x0 + i * tileW + 13.5} y="131" textAnchor="middle" fontSize="9" fontWeight="900" fill={INK} fontFamily={mono}>{i + 1}</text>
          {priced && <motion.text x={x0 + i * tileW + 13.5} y="148" textAnchor="middle" fontSize="8.5" fontWeight="900" fill={COLORS[group]} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + i * 0.04 }}>{onePart}°</motion.text>}
        </motion.g>)}
        <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: priced ? 0.75 : 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="104" y="181" width="182" height="34" rx="17" fill={priced ? "#dcfce7" : "#eef2ff"} stroke={priced ? GREEN : INDIGO} />
          <text x="195" y="203" textAnchor="middle" fontSize="14" fontWeight="900" fill={priced ? GREEN : INDIGO} fontFamily={mono}>{priced ? `${angleSum}° ÷ ${parts} = ${onePart}°` : `${ratio.join(" + ")} = ${parts} parts`}</text>
        </motion.g>
      </> : <>
        <polygon points="55,194 195,32 335,194" fill="#f8fafc" stroke={INK} strokeWidth="2.2" />
        <path d="M 79 194 A 24 24 0 0 1 70 176" fill="none" stroke={COLORS[0]} strokeWidth="4" />
        <path d="M 311 194 A 24 24 0 0 0 320 176" fill="none" stroke={COLORS[1]} strokeWidth="4" />
        <path d="M 181 49 A 20 20 0 0 1 209 49" fill="none" stroke={COLORS[2]} strokeWidth="5" />
        {owner.map((group, i) => {
          const indexInGroup = owner.slice(0, i).filter((g) => g === group).length;
          const t = targets[group][indexInGroup];
          const win = group === largestIndex;
          return <motion.g key={i} initial={{ x: x0 + i * tileW - t.x, y: 210 - t.y, opacity: 0.2 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120, damping: 17, delay: i * 0.07 }}>
            <rect x={t.x - 10} y={t.y - 9} width="20" height="18" rx="5" fill={win ? "#fef3c7" : "#fff"} stroke={COLORS[group]} strokeWidth={win ? 2 : 1.3} />
            <text x={t.x} y={t.y + 4} textAnchor="middle" fontSize="8" fontWeight="900" fill={COLORS[group]} fontFamily={mono}>{onePart}°</text>
          </motion.g>;
        })}
        {angles.map((angle, i) => {
          const pos = [{ x: 72, y: 219 }, { x: 318, y: 219 }, { x: 195, y: 92 }][i];
          const win = i === largestIndex;
          return <motion.g key={i} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.75 + i * 0.14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={pos.x - 42} y={pos.y - 16} width="84" height="27" rx="13" fill={win ? "#dcfce7" : "#eef2ff"} stroke={win ? GREEN : COLORS[i]} />
            <text x={pos.x} y={pos.y + 2} textAnchor="middle" fontSize="11" fontWeight="900" fill={win ? GREEN : COLORS[i]} fontFamily={mono}>{ratio[i]} × {onePart}° = {angle}°</text>
          </motion.g>;
        })}
      </>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {step === 0 ? `${parts} ratio parts share the triangle's ${angleSum}°` : final ? `${ratio[largestIndex]} tiles form the largest angle: ${largest}°` : `each of the ${parts} equal tiles is ${onePart}°`}
    </motion.span>
    {!consistent && <span style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{!Number.isInteger(onePart) ? `${angleSum}° does not split into ${parts} whole-degree parts` : `computed ${largest}°, stored ${problem.shortAnswer}`}</span>}
    <AnimatePresence>{final && consistent && problem.answer && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.25 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
  </div>;
}
