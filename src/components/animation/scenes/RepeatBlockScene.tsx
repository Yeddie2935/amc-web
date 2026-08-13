import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const LEFT = "#4338ca";
const RIGHT = "#0d9488";
const BAD = "#dc2626";
const WIN = "#16a34a";

/**
 * A cryptarithm on a repeated digit block: ABCABC is ABC times a repunit-like
 * factor (1001 for a 3-digit block written twice), and the same factor appears
 * on both sides, so the whole six-digit equation collapses to a plain
 * multiplication of the blocks. The scene cancels that factor, derives the
 * ceiling the other block's digit count imposes, then walks down from it — the
 * first candidate fails only because digits repeat, which is worth seeing — and
 * lands on the best one. The factor, ceiling, every valid block pair and the
 * near miss are all computed, and the six-digit identity is checked at the end.
 * Data: { multiplier, left, right, repeats?, maximize? }.
 */
export function RepeatBlockScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const k = Math.round(num(data.multiplier, 8));
  const leftName = data.left != null ? String(data.left) : "ABC";
  const rightName = data.right != null ? String(data.right) : "DEF";
  const reps = Math.max(2, Math.round(num(data.repeats, 2)));
  const maximize = data.maximize !== false;

  const d = leftName.length;
  const lo = Math.pow(10, d - 1);
  const hi = Math.pow(10, d) - 1;
  // ABCABC = ABC * (1 + 10^d + ...), the same factor on both sides
  let factor = 0;
  for (let i = 0; i < reps; i++) factor += Math.pow(10, d * i);

  const distinct = (a: number, b: number) => new Set((String(a) + String(b)).split("")).size === 2 * d;
  const ceiling = Math.floor(hi / k);
  const sols: { l: number; r: number }[] = [];
  for (let l = lo; l <= Math.min(hi, ceiling); l++) if (k * l >= lo && distinct(l, k * l)) sols.push({ l, r: k * l });
  const best = sols.length ? (maximize ? sols[sols.length - 1] : sols[0]) : null;
  // the candidate that the bound allows but the distinct-digit rule refuses
  const nearMiss = (() => {
    for (let l = Math.min(hi, ceiling); l >= lo; l--) {
      if (best && l === best.l) return null;
      if (k * l >= lo && !distinct(l, k * l)) return { l, r: k * l };
    }
    return null;
  })();

  const sum = best ? best.l + best.r : 0;
  const bigL = best ? Number(String(best.l).repeat(reps)) : 0;
  const bigR = best ? Number(String(best.r).repeat(reps)) : 0;
  const identity = best ? k * bigL === bigR : false;
  const agrees = problem.shortAnswer == null || Number(problem.shortAnswer) === sum;

  // which digits repeat in the rejected candidate
  const dupOf = (a: number, b: number) => {
    const s = (String(a) + String(b)).split("");
    const cnt: Record<string, number> = {};
    s.forEach((c) => (cnt[c] = (cnt[c] ?? 0) + 1));
    return s.map((c) => cnt[c] > 1);
  };

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showCancel = !isFinal && step === 1;
  const showTry = !isFinal && step === 2;
  const collapsed = isFinal || step >= 2;

  // ---- geometry ----
  const W = 340;
  const H = 196;
  const tw = 19;
  const th = 24;

  const Tiles = ({
    chars,
    x,
    y,
    color,
    flags,
    size = tw,
  }: {
    chars: string[];
    x: number;
    y: number;
    color: string;
    flags?: boolean[];
    size?: number;
  }) => (
    <g>
      {chars.map((c, i) => {
        const bad = flags?.[i];
        return (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 17, delay: i * 0.06 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect
              x={x + i * size}
              y={y}
              width={size - 2}
              height={th}
              rx={4}
              fill={bad ? "#fee2e2" : "#f8fafc"}
              stroke={bad ? BAD : color}
              strokeWidth={bad ? 2 : 1.4}
            />
            <text x={x + i * size + (size - 2) / 2} y={y + 17} textAnchor="middle" fontSize="13" fontWeight="800" fill={bad ? BAD : color} fontFamily={numberFont}>
              {c}
            </text>
          </motion.g>
        );
      })}
    </g>
  );

  const eqY = 26;
  const rowX = (W - (2 * d * tw + 22)) / 2;
  const lx = 40;
  const rx = lx + reps * d * tw + 26;

  const caption = isFinal
    ? `${best?.l} + ${best?.r} = ${sum}`
    : step === 0
    ? `both sides are a ${d}-digit block written ${reps === 2 ? "twice" : `${reps} times`}`
    : showCancel
    ? `the ${factor} cancels: ${k} × ${leftName} = ${rightName}`
    : nearMiss
    ? `${rightName} ≤ ${hi} forces ${leftName} ≤ ${ceiling}, but ${nearMiss.l} repeats digits`
    : `${rightName} ≤ ${hi} forces ${leftName} ≤ ${ceiling}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the equation, in whichever form this beat has reached */}
        {!collapsed && !showCancel && (
          <g>
            <text x={12} y={eqY + 17} fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
              {k} ×
            </text>
            <Tiles chars={leftName.repeat(reps).split("")} x={lx} y={eqY} color={LEFT} />
            <text x={rx - 17} y={eqY + 17} fontSize="13" fontWeight="800" fill={INK} fontFamily={numberFont}>
              =
            </text>
            <Tiles chars={rightName.repeat(reps).split("")} x={rx} y={eqY} color={RIGHT} />
            {/* brackets under each repeat, so the block structure is visible */}
            {Array.from({ length: reps }).map((_, b) =>
              [
                { x0: lx + b * d * tw, c: LEFT, nm: leftName },
                { x0: rx + b * d * tw, c: RIGHT, nm: rightName },
              ].map((s, j) => (
                <motion.g key={`${b}-${j}`} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + b * 0.12 }}>
                  <path d={`M ${s.x0 + 1},${eqY + th + 3} v 4 h ${d * tw - 4} v -4`} fill="none" stroke={s.c} strokeWidth={1.3} />
                  <text x={s.x0 + (d * tw) / 2 - 1} y={eqY + th + 18} textAnchor="middle" fontSize="9" fontWeight="800" fill={s.c} fontFamily={numberFont}>
                    {s.nm}
                  </text>
                </motion.g>
              ))
            )}
          </g>
        )}

        {/* the shared factor, then struck out on both sides */}
        <AnimatePresence>
          {showCancel && (
            <motion.g key="cancel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {/* measured segment by segment: a strike has to sit on its own
                  factor, which guessing offsets into one centred string cannot do */}
              {(() => {
                const segs = [
                  { t: `${k} ×`, cut: false },
                  { t: `${factor}`, cut: true },
                  { t: `× ${leftName} =`, cut: false },
                  { t: `${factor}`, cut: true },
                  { t: `× ${rightName}`, cut: false },
                ];
                const cw = 8.4;
                const gap = 7;
                const ws = segs.map((g) => g.t.length * cw);
                const span = ws.reduce((a, b) => a + b, 0) + gap * (segs.length - 1);
                let x = (W - span) / 2;
                return segs.map((g, i) => {
                  const at = x;
                  x += ws[i] + gap;
                  return (
                    <g key={i}>
                      <text x={at} y={eqY + 8} fontSize="14" fontWeight="800" fill={g.cut ? "#94a3b8" : INK} fontFamily={numberFont}>
                        {g.t}
                      </text>
                      {g.cut && (
                        <motion.line
                          x1={at - 2}
                          y1={eqY + 3}
                          x2={at + ws[i] + 2}
                          y2={eqY + 3}
                          stroke={BAD}
                          strokeWidth={2.4}
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.4, delay: 0.5 + i * 0.12 }}
                        />
                      )}
                    </g>
                  );
                });
              })()}
              <motion.text
                x={W / 2}
                y={eqY + 44}
                textAnchor="middle"
                fontSize="16"
                fontWeight="800"
                fill={LEFT}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                {k} × {leftName} = {rightName}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* once collapsed, the short equation heads the picture */}
        {collapsed && (
          <text x={W / 2} y={eqY + 12} textAnchor="middle" fontSize="15" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {k} × {leftName} = {rightName}
          </text>
        )}

        {/* the ceiling, and the candidate it allows that the digits refuse */}
        <AnimatePresence>
          {showTry && nearMiss && (
            <motion.g key="try" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.2 }}>
              <text x={W / 2} y={eqY + 40} textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b" fontFamily={numberFont}>
                {rightName} has {d} digits ⇒ {leftName} ≤ {hi} ÷ {k} = {ceiling}
              </text>
              <Tiles chars={String(nearMiss.l).split("")} x={rowX} y={eqY + 60} color={LEFT} flags={dupOf(nearMiss.l, nearMiss.r).slice(0, d)} />
              <text x={rowX + d * tw + 6} y={eqY + 77} fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                →
              </text>
              <Tiles chars={String(nearMiss.r).split("")} x={rowX + d * tw + 22} y={eqY + 60} color={RIGHT} flags={dupOf(nearMiss.l, nearMiss.r).slice(d)} />
              <motion.text
                x={W / 2}
                y={eqY + 108}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={BAD}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                repeated digits — the letters must be different
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the winner */}
        <AnimatePresence>
          {isFinal && best && (
            <motion.g key="best" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Tiles chars={String(best.l).split("")} x={rowX} y={eqY + 36} color={LEFT} />
              <text x={rowX + d * tw + 6} y={eqY + 53} fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
                →
              </text>
              <Tiles chars={String(best.r).split("")} x={rowX + d * tw + 22} y={eqY + 36} color={RIGHT} />
              <motion.text
                x={W / 2}
                y={eqY + 84}
                textAnchor="middle"
                fontSize="11"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                all {2 * d} digits different ✓
              </motion.text>
              <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.75 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x={W / 2 - 84} y={eqY + 96} width={168} height={22} rx={8} fill={identity ? "#dcfce7" : "#fee2e2"} stroke={identity ? WIN : BAD} strokeWidth={1.5} />
                <text x={W / 2} y={eqY + 111} textAnchor="middle" fontSize="11" fontWeight="800" fill={identity ? "#166534" : BAD} fontFamily={numberFont}>
                  {k} × {bigL} = {bigR}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
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
          color: isFinal ? "#166534" : showTry ? "#991b1b" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTry ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTry ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && identity ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees && identity
              ? `${sols.length} pairs work at all; this is the largest`
              : `computed ${sum}, which does not match the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
