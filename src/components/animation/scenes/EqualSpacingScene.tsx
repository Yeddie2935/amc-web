import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const COAT = "#4338ca";
const WIN = "#16a34a";

/**
 * Items placed in a row of slots with equal gaps everywhere, including before
 * the first and after the last. With n items and gap g, n + (n+1)g = total, so
 * (n+1)(g+1) = total + 1 — the count of items is governed by the divisors of
 * total + 1. Every valid n is found by searching the row itself, then drawn.
 * Data: { total, itemIcon? }.
 */
export function EqualSpacingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(2, Math.round(num(data.total, 35)));

  // find every (n, g) that fills the row exactly, with at least one of each
  const valid: { n: number; g: number }[] = [];
  for (let n = 1; n <= total; n++) {
    const rest = total - n;
    if (rest < 1) continue;
    if (rest % (n + 1) === 0) valid.push({ n, g: rest / (n + 1) });
  }
  const M = total + 1;
  const divisors = valid.map((v) => v.n + 1);

  const demo = valid[Math.min(3, valid.length - 1)] ?? { n: 1, g: 1 };
  const posOf = (n: number, g: number) => Array.from({ length: n }, (_, i) => (i + 1) * (g + 1));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showDemo = step >= 1 || isFinal;
  const showAlg = step >= 2 || isFinal;

  // ---- geometry ----
  const W = 340;
  const x0 = 10;
  const dx = (W - 2 * x0) / total;
  const railY = 34;
  const rowH = 22;
  const H = isFinal ? 44 + valid.length * rowH + 10 : 108;

  const Rail = ({ y, n, g, small, label }: { y: number; n: number; g: number; small?: boolean; label?: string }) => {
    const coats = new Set(posOf(n, g));
    const r = small ? 2.6 : 4;
    return (
      <g>
        <line x1={x0} y1={y} x2={W - x0} y2={y} stroke={INK} strokeWidth={small ? 1.2 : 1.8} />
        {Array.from({ length: total }).map((_, i) => {
          const h = i + 1;
          const on = coats.has(h);
          return (
            <motion.circle
              key={i}
              cx={x0 + (i + 0.5) * dx}
              cy={y + (small ? 6 : 9)}
              r={on ? r + 1.2 : r}
              fill={on ? COAT : "#e2e8f0"}
              stroke={on ? COAT : "#cbd5e1"}
              strokeWidth={0.8}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 16, delay: i * 0.004 }}
            />
          );
        })}
        {label && (
          <text x={W - x0} y={y - 3} textAnchor="end" fontSize="9.5" fontWeight="800" fill={COAT} fontFamily={numberFont}>
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {!isFinal && (
          <>
            <text x={x0} y={20} fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              {total} hooks — equal gaps at both ends and between
            </text>
            <Rail y={railY} n={showDemo ? demo.n : 0} g={demo.g} />
            {showDemo && (
              <text x={x0} y={railY + 34} fontSize="11" fontWeight="800" fill={COAT} fontFamily={numberFont}>
                {demo.n} coats + {demo.n + 1} gaps of {demo.g} = {demo.n + (demo.n + 1) * demo.g}
              </text>
            )}
          </>
        )}
        {isFinal && (
          <>
            <text x={x0} y={16} fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              every layout that works
            </text>
            {valid.map((v, i) => (
              <g key={i}>
                <Rail y={30 + i * rowH} n={v.n} g={v.g} small label={`${v.n} coats, gap ${v.g}`} />
              </g>
            ))}
          </>
        )}
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
        {!showDemo
          ? `n coats leave n + 1 equal gaps`
          : !showAlg
          ? `n + (n + 1)g = ${total}`
          : !isFinal
          ? `add one per gap: (n + 1)(g + 1) = ${M}`
          : `${valid.length} possible numbers of coats`}
      </motion.span>

      <AnimatePresence>
        {showAlg && (
          <motion.span
            key="div"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            n + 1 divides {M}: {divisors.join(", ")} → n = {valid.map((v) => v.n).join(", ")}
          </motion.span>
        )}
      </AnimatePresence>

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
