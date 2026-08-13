import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const RED = "#4338ca";
const DEC = "#0d9488";
const WIN = "#16a34a";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/**
 * A sum of fractions turned into decimals. Each fraction is reduced by its own
 * gcd, converted, then the decimals are stacked in a place-value column aligned
 * on the point so the total can be read column by column. Reductions, decimal
 * values and the sum are all computed from the numerators and denominators.
 * Data: { fractions: [[num,den], ...] }.
 */
export function FractionDecimalSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const fracs = (Array.isArray(data.fractions) ? data.fractions : [])
    .filter((f) => Array.isArray(f) && f.length >= 2)
    .map((f) => {
      const n = Math.round(num((f as number[])[0], 0));
      const d = Math.round(num((f as number[])[1], 1)) || 1;
      const g = gcd(n, d) || 1;
      return { n, d, rn: n / g, rd: d / g, v: n / d };
    });
  const sum = fracs.reduce((s, f) => s + f.v, 0);

  const decs = (v: number) => {
    const s = String(v);
    const i = s.indexOf(".");
    return i < 0 ? 0 : s.length - i - 1;
  };
  const maxDec = Math.max(0, ...fracs.map((f) => decs(f.v)), decs(sum));
  const intW = Math.max(...fracs.map((f) => String(Math.trunc(f.v)).length), String(Math.trunc(sum)).length);
  const fmtCols = (v: number) => {
    const fixed = v.toFixed(maxDec);
    const [ip, dp = ""] = fixed.split(".");
    return { ip: ip.padStart(intW, " "), dp };
  };

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showReduced = step >= 1 || isFinal;
  const showDec = step >= 2 || isFinal;

  // ---- geometry ----
  const W = 340;
  const rowH = 26;
  const topY = 24;
  const listH = fracs.length * rowH;
  const colY = topY + listH + 20;
  const cw = 17;
  const colX = (W - (intW + 1 + maxDec) * cw) / 2 + 40;
  const H = colY + (fracs.length + 2) * 22 + 16;

  const Cols = ({ v, y, big }: { v: number; y: number; big?: boolean }) => {
    const { ip, dp } = fmtCols(v);
    const chars = [...ip.split(""), ".", ...dp.split("")];
    return (
      <g>
        {chars.map((ch, i) => (
          <text
            key={i}
            x={colX + i * cw + cw / 2}
            y={y}
            textAnchor="middle"
            fontSize={big ? "16" : "14"}
            fontWeight="800"
            fill={ch === " " ? "transparent" : big ? WIN : INK}
            fontFamily={numberFont}
          >
            {ch === " " ? "" : ch}
          </text>
        ))}
      </g>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {fracs.map((f, i) => {
          const y = topY + i * rowH;
          const same = f.rn === f.n && f.rd === f.d;
          return (
            <g key={i}>
              <text x={70} y={y} textAnchor="end" fontSize="14" fontWeight="800" fill={INK} fontFamily={numberFont}>
                {f.n}/{f.d}
              </text>
              <AnimatePresence>
                {showReduced && (
                  <motion.g key="r" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.1 }}>
                    <text x={86} y={y} fontSize="13" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                      =
                    </text>
                    <text x={106} y={y} fontSize="14" fontWeight="800" fill={RED} fontFamily={numberFont}>
                      {f.rn}/{f.rd}
                    </text>
                    {!same && (
                      <text x={166} y={y} fontSize="10" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                        ÷{gcd(f.n, f.d)}
                      </text>
                    )}
                  </motion.g>
                )}
              </AnimatePresence>
              <AnimatePresence>
                {showDec && (
                  <motion.g key="d" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.1 }}>
                    <text x={208} y={y} fontSize="13" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                      =
                    </text>
                    <text x={228} y={y} fontSize="15" fontWeight="800" fill={DEC} fontFamily={numberFont}>
                      {f.v}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* stacked in place-value columns, aligned on the point */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="col" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
              {fracs.map((f, i) => (
                <g key={i}>
                  {i > 0 && (
                    <text x={colX - 14} y={colY + i * 22} textAnchor="middle" fontSize="14" fontWeight="800" fill={INK} fontFamily={numberFont}>
                      +
                    </text>
                  )}
                  <Cols v={f.v} y={colY + i * 22} />
                </g>
              ))}
              <line
                x1={colX - 24}
                y1={colY + fracs.length * 22 - 12}
                x2={colX + (intW + 1 + maxDec) * cw}
                y2={colY + fracs.length * 22 - 12}
                stroke={INK}
                strokeWidth={1.6}
              />
              <Cols v={sum} y={colY + fracs.length * 22 + 6} big />
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
          color: isFinal ? "#166534" : showDec ? "#0f766e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showDec ? "#f0fdfa" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showDec ? "#99f6e4" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {!showReduced
          ? `three fractions to add`
          : !showDec
          ? `cancel the common factor in each`
          : !isFinal
          ? `each one becomes a short decimal`
          : `${fracs.map((f) => f.v).join(" + ")} = ${sum}`}
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
