import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const fmt = (v: number) => {
  if (!Number.isFinite(v)) return "undefined";
  if (Number.isInteger(v)) return String(v);
  const sign = v < 0 ? "−" : "";
  const a = Math.abs(v);
  return `${sign}1/${Math.round(1 / a)}`;
};

/**
 * Every candidate gets its real reciprocal computed and placed on a shared
 * number line next to the original value, so "less than its reciprocal" is
 * a direct left-of comparison rather than a memorized rule — with a beat on
 * the trap of flipping a negative reciprocal's sign, which makes a number
 * that actually *equals* its reciprocal look like it's less than it.
 * Data: { values }.
 */
export function ReciprocalCompareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const values = (Array.isArray(data.values) ? data.values : [-2, -1, 0, 1, 2]).map((v) => Number(v));

  const recipOf = (v: number) => (v === 0 ? NaN : 1 / v);
  const rows = values.map((v) => {
    const r = recipOf(v);
    return { v, r, isLess: Number.isFinite(r) && v < r };
  });
  const winner = rows.find((r) => r.isLess);
  const normalize = (s: string) => s.trim().replace(/[−–—]/g, "-");
  const answerOk = problem.shortAnswer == null || (winner ? normalize(fmt(winner.v)) === normalize(String(problem.shortAnswer)) : false);
  const failure = rows.filter((r) => r.isLess).length !== 1 ? `${rows.filter((r) => r.isLess).length} values satisfy v < 1/v, expected exactly 1` : !answerOk ? `winner computed as ${winner ? fmt(winner.v) : "none"}, stored answer is ${problem.shortAnswer}` : "";

  // trap: sign-flip the reciprocal of a negative number
  const trapRow = rows.find((r) => r.v < 0 && r.v !== winner?.v);
  const trapFlippedRecip = trapRow ? -trapRow.r : null;
  const trapLess = trapRow && trapFlippedRecip != null ? trapRow.v < trapFlippedRecip : false;
  const trapChoice = trapRow && trapLess ? (problem.choices ?? []).find((c) => Number(String(c.text).replace(/[−–—]/g, "-")) === trapRow.v) : undefined;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRecip = step >= 1;
  const showTrap = step === 2 && !isFinal;

  const W = 300;
  const H = 200;
  const x0 = 30;
  const x1 = 270;
  const scaleMin = -2.5;
  const scaleMax = 2.5;
  const px = (v: number) => x0 + ((v - scaleMin) / (scaleMax - scaleMin)) * (x1 - x0);

  const caption = isFinal
    ? `only ${fmt(winner?.v ?? 0)} is less than its reciprocal`
    : showTrap
    ? trapChoice
      ? `flip the sign of ${trapRow ? fmt(trapRow.r) : ""} to +${trapRow ? Math.abs(Math.round(1 / trapRow.v)) : ""} and ${trapRow ? trapRow.v : ""} looks less — choice ${trapChoice.label}, but the real reciprocal keeps its sign`
      : `flipping a reciprocal's sign by mistake gives a false comparison`
    : showRecip
    ? `plot each value's real reciprocal alongside it`
    : `list the candidates: ${values.join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <line x1={x0} y1={100} x2={x1} y2={100} stroke="#e2e8f0" strokeWidth={2} />
        {[-2, -1, 0, 1, 2].map((t) => (
          <g key={t}>
            <line x1={px(t)} y1={96} x2={px(t)} y2={104} stroke={DIM} strokeWidth={1.2} />
            <text x={px(t)} y={116} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={numberFont}>
              {t}
            </text>
          </g>
        ))}

        {values.map((v, i) => {
          const isWinner = isFinal && v === winner?.v;
          return (
            <motion.g key={`v-${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={px(v)} cy={100} r={7} fill={isWinner ? WIN : IND} />
              <text x={px(v)} y={90} textAnchor="middle" fontSize="10" fontWeight="800" fill={isWinner ? WIN : IND} fontFamily={numberFont}>
                {v}
              </text>
            </motion.g>
          );
        })}

        {showRecip &&
          rows.map((r, i) => {
            if (!Number.isFinite(r.r)) return null;
            const showFlipped = showTrap && r === trapRow && trapFlippedRecip != null;
            const plotVal = showFlipped ? trapFlippedRecip! : r.r;
            const color = showFlipped ? BAD : r.isLess && (isFinal || showTrap) ? WIN : "#0d9488";
            return (
              <motion.g key={`r-${i}`} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={px(plotVal)} cy={140} r={6} fill={color} fillOpacity={0.8} />
                <text x={px(plotVal)} y={158} textAnchor="middle" fontSize="9" fontWeight="800" fill={color} fontFamily={numberFont}>
                  {fmt(showFlipped ? plotVal : r.r)}
                </text>
              </motion.g>
            );
          })}

        <text x={x0} y={140 - 12} fontSize="8.5" fontWeight="700" fill={DIM}>
          reciprocals ↑
        </text>
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
