import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const BAR = "#4338ca";
const BUMP = "#f59e0b";
const WIN = "#16a34a";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/**
 * Binning an arithmetic run of numbers by their remainder. Stepping by a fixed
 * amount makes the remainders cycle, so the histogram is built in three moves:
 * one cycle puts one in every reachable bin, the whole cycles raise them all
 * equally, and only the leftover tail breaks the tie. Remainders, cycle length,
 * whole cycles, leftovers and the final counts are all computed from the run.
 * Data: { start, end, step, divisor }.
 */
export function RemainderHistogramScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 2);
  const end = num(data.end, 50);
  const st = Math.max(1, num(data.step, 2));
  const d = Math.max(2, Math.round(num(data.divisor, 7)));

  const nums: number[] = [];
  for (let v = start; v <= end; v += st) nums.push(v);
  const rems = nums.map((v) => ((v % d) + d) % d);
  const counts = Array(d).fill(0) as number[];
  rems.forEach((r) => (counts[r] += 1));

  const cycle = d / gcd(st, d); // how many terms before the remainders repeat
  const fullCycles = Math.floor(nums.length / cycle);
  const leftover = nums.length % cycle;
  const tailNums = nums.slice(fullCycles * cycle);
  const tailRems = rems.slice(fullCycles * cycle);

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const heights: number[] = isFinal
    ? counts
    : beat >= 2
    ? Array(d).fill(fullCycles)
    : beat >= 1
    ? Array(d).fill(1)
    : Array(d).fill(0);
  const maxH = Math.max(1, ...counts);

  // ---- geometry ----
  const W = 344;
  const H = 212;
  const baseY = 172;
  const unit = 24;
  const bw = 30;
  const gap = 12;
  const totalW = d * bw + (d - 1) * gap;
  const x0 = (W - totalW) / 2;
  const bx = (r: number) => x0 + r * (bw + gap);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* the repeating cycle of remainders */}
        {nums.slice(0, cycle).map((v, i) => {
          const cw = W / cycle;
          return (
            <motion.g
              key={`c${i}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 18, delay: i * 0.07 }}
            >
              <text x={cw * (i + 0.5)} y={22} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                {v}
              </text>
              <text x={cw * (i + 0.5)} y={35} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={BAR} fontFamily={numberFont}>
                ↓{rems[i]}
              </text>
            </motion.g>
          );
        })}

        {/* axis */}
        <line x1={x0 - 14} y1={baseY} x2={x0 + totalW + 14} y2={baseY} stroke={INK} strokeWidth={1.6} />

        {/* bars grow as the cycles accumulate */}
        {Array.from({ length: d }).map((_, r) => {
          const h = heights[r] * unit;
          const bumped = isFinal && counts[r] > fullCycles;
          return (
            <g key={`b${r}`}>
              <motion.rect
                x={bx(r)}
                width={bw}
                rx={2}
                fill={bumped ? BUMP : BAR}
                initial={{ height: 0, y: baseY }}
                animate={{ height: h, y: baseY - h }}
                transition={{ type: "spring", stiffness: 120, damping: 18, delay: r * 0.05 }}
              />
              <AnimatePresence>
                {heights[r] > 0 && (
                  <motion.text
                    key={`v${r}-${heights[r]}`}
                    x={bx(r) + bw / 2}
                    y={baseY - h - 6}
                    textAnchor="middle"
                    fontSize="12"
                    fontWeight="800"
                    fill={bumped ? "#92400e" : BAR}
                    fontFamily={numberFont}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.15 + r * 0.05 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  >
                    {heights[r]}
                  </motion.text>
                )}
              </AnimatePresence>
              <text x={bx(r) + bw / 2} y={baseY + 14} textAnchor="middle" fontSize="11.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                {r}
              </text>
            </g>
          );
        })}
        <text x={W / 2} y={baseY + 30} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          Remainder
        </text>
      </svg>

      {/* caption */}
      <motion.span
        key={`${beat}-${isFinal}`}
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
        {beat === 0
          ? `the first ${cycle} hit every remainder once, then repeat`
          : beat === 1
          ? `1 cycle → 1 in every bin`
          : !isFinal
          ? `${fullCycles} whole cycles = ${fullCycles * cycle} numbers → ${fullCycles} each`
          : `counts: ${counts.join(", ")}`}
      </motion.span>

      <AnimatePresence>
        {isFinal && leftover > 0 && (
          <motion.span
            key="tail"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#92400e", textAlign: "center" }}
          >
            {leftover} left over — {tailNums.join(", ")} — add one to remainders {tailRems.join(", ")}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
