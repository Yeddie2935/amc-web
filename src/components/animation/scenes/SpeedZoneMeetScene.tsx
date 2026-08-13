import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const CARA = "#4338ca";
const CARB = "#be123c";
const WIN = "#16a34a";
const ZONE = ["#e0e7ff", "#dcfce7", "#fef3c7", "#fae8ff"];

const fmt = (v: number) => (Number.isInteger(v) ? `${v}` : `${Math.round(v * 1000) / 1000}`);

/**
 * Two cars start at opposite ends of a road whose speed limit changes by zone
 * and drive toward each other. Positions are integrated zone by zone, the
 * meeting time is found by bisection, and the beats land on the moments a car
 * crosses a zone boundary — so the "both in the fast zone, closing at the sum of
 * the speeds" step is shown rather than assumed.
 * Data: { zones:[{len,speed},...], unit? }.
 */
export function SpeedZoneMeetScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = data.unit != null ? String(data.unit) : "mi";
  const zones = (Array.isArray(data.zones) ? data.zones : []).map((z) => {
    const o = (z ?? {}) as Record<string, unknown>;
    return { len: Math.max(0.0001, num(o.len, 1)), speed: Math.max(0.0001, num(o.speed, 1)) };
  });
  const total = zones.reduce((s, z) => s + z.len, 0);

  // position of each car at time t
  const posA = (t: number) => {
    let x = 0;
    let rem = t;
    for (const z of zones) {
      const tt = z.len / z.speed;
      if (rem <= tt) return x + z.speed * rem;
      rem -= tt;
      x += z.len;
    }
    return total;
  };
  const posB = (t: number) => {
    let x = total;
    let rem = t;
    for (const z of [...zones].reverse()) {
      const tt = z.len / z.speed;
      if (rem <= tt) return x - z.speed * rem;
      rem -= tt;
      x -= z.len;
    }
    return 0;
  };
  // meeting time by bisection
  let lo = 0;
  let hi = 1;
  while (posA(hi) < posB(hi)) hi *= 2;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (posA(m) < posB(m)) lo = m;
    else hi = m;
  }
  const tMeet = (lo + hi) / 2;
  const xMeet = posA(tMeet);

  // beats: the boundary crossings that happen before they meet
  const cross: number[] = [];
  let acc = 0;
  for (const z of zones.slice(0, -1)) {
    acc += z.len / z.speed;
    if (acc < tMeet - 1e-9) cross.push(acc);
  }
  acc = 0;
  for (const z of [...zones].reverse().slice(0, -1)) {
    acc += z.len / z.speed;
    if (acc < tMeet - 1e-9) cross.push(acc);
  }
  const keys = [0, ...Array.from(new Set(cross.map((v) => +v.toFixed(9)))).sort((a, b) => a - b), tMeet];

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const t = isFinal ? tMeet : keys[Math.min(step, keys.length - 1)];
  const ax = posA(t);
  const bx = posB(t);
  const gap = Math.max(0, bx - ax);

  // ---- geometry ----
  const W = 340;
  const H = 150;
  const x0 = 18;
  const px = (W - 2 * x0) / total;
  const X = (mi: number) => x0 + mi * px;
  const roadY = 74;
  const roadH = 22;

  const Car = ({ x, color, flip }: { x: number; color: string; flip: boolean }) => (
    <g transform={`translate(${x},0) scale(${flip ? -1 : 1},1)`}>
      <rect x={-10} y={-8} width={13} height={9} rx={1.5} fill="#fff" stroke={color} strokeWidth={1.4} />
      <path d="M 3,-8 L 8,-8 L 10,-4 L 10,1 L 3,1 Z" fill={color} opacity={0.28} stroke={color} strokeWidth={1.4} />
      <circle cx={-5} cy={2} r={2.3} fill={color} />
      <circle cx={6} cy={2} r={2.3} fill={color} />
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* zones */}
        {zones.map((z, i) => {
          const s = zones.slice(0, i).reduce((a, b) => a + b.len, 0);
          return (
            <g key={i}>
              <rect x={X(s)} y={roadY} width={z.len * px} height={roadH} fill={ZONE[i % ZONE.length]} stroke={INK} strokeWidth={1.2} />
              <text x={X(s + z.len / 2)} y={roadY - 8} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {z.speed} mph
              </text>
              <text x={X(s + z.len / 2)} y={roadY + roadH + 13} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                {z.len} {unit}
              </text>
            </g>
          );
        })}
        <text x={X(0) - 6} y={roadY + 15} textAnchor="end" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>A</text>
        <text x={X(total) + 6} y={roadY + 15} fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>B</text>

        {/* cars */}
        <motion.g animate={{ x: X(ax), y: roadY - 2 }} transition={{ type: "spring", stiffness: 90, damping: 16 }}>
          <Car x={0} color={CARA} flip={false} />
        </motion.g>
        <motion.g animate={{ x: X(bx), y: roadY - 2 }} transition={{ type: "spring", stiffness: 90, damping: 16 }}>
          <Car x={0} color={CARB} flip />
        </motion.g>

        {/* the closing gap */}
        <AnimatePresence>
          {gap > 1e-9 && (
            <motion.g key="gap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <line x1={X(ax)} y1={roadY + roadH + 26} x2={X(bx)} y2={roadY + roadH + 26} stroke="#64748b" strokeWidth={1.4} />
              <text x={X((ax + bx) / 2)} y={roadY + roadH + 39} textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
                gap {fmt(gap)}
              </text>
            </motion.g>
          )}
          {gap <= 1e-9 && (
            <motion.text key="met" x={X(xMeet)} y={roadY + roadH + 34} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              meet at {fmt(xMeet)} {unit}
            </motion.text>
          )}
        </AnimatePresence>

        <text x={W - 6} y={14} textAnchor="end" fontSize="10.5" fontWeight="800" fill="#4338ca" fontFamily={numberFont}>
          t = {fmt(t)} h
        </text>
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {isFinal
          ? `they meet ${fmt(xMeet)} ${unit} from A`
          : step === 0
          ? `both start, ${fmt(total)} ${unit} apart`
          : `t = ${fmt(t)} h → A at ${fmt(ax)}, B at ${fmt(bx)}, gap ${fmt(gap)}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
