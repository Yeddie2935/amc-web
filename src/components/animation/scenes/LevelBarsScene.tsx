import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GLASS = "#93c5fd";
const WATER = "#eff6ff";
const BASE = "#2563eb";
const EXTRA = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * Several containers holding a fixed total, each described as holding a few more
 * than the one before. The step-by-step differences have to be *accumulated* into
 * offsets from the first container (a run of +1, +2, +3 means the last is 6 more,
 * not 3), and then the pile levels: lifting every container's surplus out leaves
 * equal shares, so the base is (total - sum of offsets) / n and each container is
 * base + its own offset. Offsets, base, values and the check against the total
 * are all computed, and the answer is checked against the stored one.
 * Data: { total, deltas:[...], labels?, target?, unit?, icon? }.
 */
export function LevelBarsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = num(data.total, 0);
  const deltas = (Array.isArray(data.deltas) ? data.deltas : []).map((d) => num(d, 0));
  const unit = data.unit != null ? String(data.unit) : "";
  const icon = data.icon != null ? String(data.icon) : "";
  const n = deltas.length + 1;
  const labels = (Array.isArray(data.labels) ? data.labels : []).map((l) => String(l));
  const target = Math.min(n - 1, Math.max(0, Math.round(num(data.target, n - 1))));

  // a run of differences is not a run of offsets: they accumulate
  const offsets = [0];
  for (const d of deltas) offsets.push(offsets[offsets.length - 1] + d);
  const surplus = offsets.reduce((a, b) => a + b, 0);
  const base = (total - surplus) / n;
  const values = offsets.map((o) => base + o);
  const sums = values.reduce((a, b) => a + b, 0);
  const whole = Number.isInteger(base) && base >= 0;
  const agrees = whole && Math.abs(sums - total) < 1e-9 && (problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - values[target]) < 1e-9);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showOffsets = isFinal || step >= 1;
  const showFill = isFinal || step >= 2;
  const poured = isFinal;

  // ---- geometry ----
  const W = 340;
  const tankW = Math.min(66, (W - 12) / n - 12);
  const gap = (W - n * tankW) / (n + 1);
  const tankX = (i: number) => gap + i * (tankW + gap);
  const tankTop = 50;
  const tankBot = 132;
  const cols = 5;
  const pitch = Math.min(11.4, (tankW - 10) / cols);
  const dotR = pitch * 0.28;
  const dotX = (i: number, k: number) => tankX(i) + 5 + (k % cols) * pitch + pitch / 2;
  const dotY = (k: number) => tankBot - 4 - Math.floor(k / cols) * pitch - pitch / 2;
  const poolY = 162;
  const poolX = (k: number) => W / 2 - (Math.min(surplus, 18) * 13) / 2 + (k % 18) * 13 + 6;
  const H = 190;

  const caption = isFinal
    ? `${labels[target] ?? `#${target + 1}`} holds ${base} + ${offsets[target]} = ${values[target]}${unit ? ` ${unit}` : ""}`
    : step === 0
    ? `${total}${unit ? ` ${unit}` : ""} in ${n} — each fuller than the last`
    : !showFill
    ? `stacked up, that is ${offsets.map((o) => (o === 0 ? "0" : `+${o}`)).join(", ")} above the first`
    : `lift the ${surplus} extra out: ${total} − ${surplus} = ${total - surplus}, so each base is ${base}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* how much fuller each one is than its neighbour */}
        {deltas.map((d, i) => {
          const x1 = tankX(i) + tankW - 6;
          const x2 = tankX(i + 1) + 6;
          return (
            <motion.g
              key={`d${i}`}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: showOffsets ? 0.3 : 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 17, delay: i * 0.12 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <path d={`M ${x1},34 Q ${(x1 + x2) / 2},22 ${x2},34`} fill="none" stroke={EXTRA} strokeWidth={1.6} />
              <text x={(x1 + x2) / 2} y={20} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                +{d}
              </text>
            </motion.g>
          );
        })}

        {/* the offset each one carries above the first */}
        <AnimatePresence>
          {showOffsets &&
            offsets.map((o, i) => (
              <motion.g
                key={`o${i}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ type: "spring", stiffness: 240, damping: 18, delay: i * 0.12 }}
              >
                <rect x={tankX(i) + tankW / 2 - 18} y={34} width={36} height={14} rx={7} fill={o === 0 ? "#eef2ff" : "#fef3c7"} stroke={o === 0 ? "#c7d2fe" : EXTRA} strokeWidth={1.2} />
                <text x={tankX(i) + tankW / 2} y={44} textAnchor="middle" fontSize="9" fontWeight="800" fill={o === 0 ? "#4338ca" : "#92400e"} fontFamily={numberFont}>
                  {showFill ? (o === 0 ? String(base) : `${base}+${o}`) : o === 0 ? "x" : `x+${o}`}
                </text>
              </motion.g>
            ))}
        </AnimatePresence>

        {/* the tanks */}
        {Array.from({ length: n }).map((_, i) => (
          <g key={`t${i}`}>
            <rect x={tankX(i)} y={tankTop} width={tankW} height={tankBot - tankTop} rx={4} fill={WATER} stroke={GLASS} strokeWidth={1.8} />
            {icon && (
              <text x={tankX(i) + tankW - 9} y={tankTop + 12} textAnchor="middle" fontSize="11">
                {icon}
              </text>
            )}
            <text
              x={tankX(i) + tankW / 2}
              y={tankBot + 13}
              textAnchor="middle"
              fontSize="9"
              fontWeight="800"
              fill={isFinal && i === target ? WIN : "#64748b"}
              fontFamily={numberFont}
            >
              {labels[i] ?? `#${i + 1}`}
            </text>
            {isFinal && (
              <motion.text
                x={tankX(i) + tankW / 2}
                y={tankBot + 25}
                textAnchor="middle"
                fontSize="11.5"
                fontWeight="800"
                fill={i === target ? WIN : INK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 + i * 0.08 }}
              >
                {values[i]}
              </motion.text>
            )}
          </g>
        ))}

        {/* the equal share every tank keeps */}
        <AnimatePresence>
          {showFill &&
            Array.from({ length: n }).map((_, i) => (
              <g key={`f${i}`}>
                {Array.from({ length: Math.max(0, Math.round(base)) }).map((__, k) => (
                  <motion.circle
                    key={k}
                    cx={dotX(i, k)}
                    cy={dotY(k)}
                    r={dotR}
                    fill={BASE}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.2 + i * 0.06 + k * 0.006 }}
                    style={{ transformBox: "fill-box", transformOrigin: "center" }}
                  />
                ))}
              </g>
            ))}
        </AnimatePresence>

        {/* the surplus: pooled while levelled, poured back at the end */}
        <AnimatePresence>
          {showFill &&
            offsets.map((o, i) => {
              const before = offsets.slice(0, i).reduce((a, b) => a + b, 0);
              return Array.from({ length: Math.round(o) }).map((__, j) => {
                const k = Math.round(base) + j;
                const px = poolX(before + j);
                return (
                  <motion.circle
                    key={`s${i}-${j}`}
                    cx={dotX(i, k)}
                    cy={dotY(k)}
                    r={dotR}
                    fill={EXTRA}
                    initial={{ opacity: 0 }}
                    animate={
                      poured
                        ? { opacity: 1, x: 0, y: 0 }
                        : { opacity: 1, x: px - dotX(i, k), y: poolY - dotY(k) }
                    }
                    exit={{ opacity: 0 }}
                    transition={{ type: "spring", stiffness: 140, damping: 18, delay: 0.5 + (before + j) * 0.04 }}
                  />
                );
              });
            })}
        </AnimatePresence>

        {/* what the pooled surplus adds up to */}
        <AnimatePresence>
          {showFill && !poured && (
            <motion.text
              key="pool"
              x={W / 2}
              y={poolY + 20}
              textAnchor="middle"
              fontSize="10"
              fontWeight="800"
              fill="#92400e"
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 1 }}
            >
              {offsets.filter((o) => o > 0).join(" + ")} = {surplus} lifted out
            </motion.text>
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
          color: isFinal ? "#166534" : showFill ? "#92400e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showFill ? "#fef3c7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showFill ? "#fde68a" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showOffsets && !showFill && deltas.length > 1 && (
          <motion.span
            key="warn"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            the last is {deltas.join(" + ")} = {offsets[n - 1]} above the first, not {deltas[deltas.length - 1]}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees ? `check: ${values.join(" + ")} = ${sums}` : `these add to ${sums}, not ${total}`}
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
