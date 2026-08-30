import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * Two same-size sets A and B overlap; the union and intersection sizes are
 * given and the unknown size x of each set is solved via the inclusion-
 * exclusion formula. A beat is spent on the trap of computing
 * |A ∪ B| − |A ∩ B|, which looks like it should give |A| but is really the
 * combined size of the two non-overlapping slivers.
 * Data: { union, intersection }.
 */
export function TwinSetVennScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const union = Math.max(1, Math.round(num(data.union, 2007)));
  const intersection = Math.max(0, Math.round(num(data.intersection, 1001)));

  const x = (union + intersection) / 2;
  const onlyEach = x - intersection;
  const trapValue = union - intersection;
  const trapChoice = (problem.choices ?? []).find((c) => c.text.replace(/[−–—]/g, "-").trim() === String(trapValue));

  const solved = Number.isInteger(x) && onlyEach >= 0;
  const matches = problem.shortAnswer == null || String(x) === String(problem.shortAnswer);
  const failure = !solved
    ? `check failed: (${union} + ${intersection}) / 2 = ${x} is not a valid whole count`
    : !matches
    ? `check failed: solved x = ${x}, stored answer is ${problem.shortAnswer}`
    : "";

  const lastStep = totalSteps - 1;
  const phase = Math.min(step, 4);

  const W = 380;
  const H = 250;
  const cA = { x: 150, y: 125 };
  const cB = { x: 250, y: 125 };
  const r = 78;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        <motion.circle cx={cA.x} cy={cA.y} r={r} fill={`${IND}12`} stroke={IND} strokeWidth={1.8} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <motion.circle cx={cB.x} cy={cB.y} r={r} fill={`${TEAL}12`} stroke={TEAL} strokeWidth={1.8} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.08 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />

        <text x={cA.x - 55} y={cA.y - 55} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={numberFont}>A</text>
        <text x={cB.x + 55} y={cB.y - 55} textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={numberFont}>B</text>

        {phase === 0 && (
          <>
            <motion.text x={W / 2} y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              |A| = |B| = x
            </motion.text>
            <motion.text x={cA.x} y={cA.y - 10} textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              x
            </motion.text>
            <motion.text x={cB.x} y={cB.y - 10} textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              x
            </motion.text>
            <motion.text x={W / 2} y={cA.y + 6} textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              ∩ {intersection}
            </motion.text>
            <motion.text x={W / 2} y={H - 12} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>
              A ∪ B = {union}
            </motion.text>
          </>
        )}

        {phase === 1 && (
          <>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <text x={W / 2} y={H - 12} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={BAD} fontFamily={numberFont}>
                {union} − {intersection} = {trapValue}
              </text>
            </motion.g>
            <text x={cA.x} y={cA.y - 10} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={numberFont}>x</text>
            <text x={cB.x} y={cB.y - 10} textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={numberFont}>x</text>
            <text x={W / 2} y={cA.y + 6} textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN} fontFamily={numberFont}>∩ {intersection}</text>
          </>
        )}

        {phase === 2 && (
          <>
            <text x={cA.x} y={cA.y - 10} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={numberFont}>x</text>
            <text x={cB.x} y={cB.y - 10} textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={numberFont}>x</text>
            <text x={W / 2} y={cA.y + 6} textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN} fontFamily={numberFont}>∩ {intersection}</text>
            <motion.text x={W / 2} y={H - 12} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={numberFont} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              x + x − {intersection} = {union}
            </motion.text>
          </>
        )}

        {phase === 3 && (
          <>
            <text x={cA.x} y={cA.y - 10} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={numberFont}>x</text>
            <text x={cB.x} y={cB.y - 10} textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={numberFont}>x</text>
            <text x={W / 2} y={cA.y + 6} textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN} fontFamily={numberFont}>∩ {intersection}</text>
            <motion.text x={W / 2} y={H - 30} textAnchor="middle" fontSize="12.5" fontWeight="800" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              2x = {union + intersection}
            </motion.text>
            <motion.text x={W / 2} y={H - 10} textAnchor="middle" fontSize="15" fontWeight="900" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              x = {x}
            </motion.text>
          </>
        )}

        {phase === 4 && (
          <>
            <motion.text x={cA.x} y={cA.y - 10} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {onlyEach}
            </motion.text>
            <motion.text x={cB.x} y={cB.y - 10} textAnchor="middle" fontSize="12.5" fontWeight="900" fill={TEAL} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              {onlyEach}
            </motion.text>
            <text x={W / 2} y={cA.y + 6} textAnchor="middle" fontSize="12" fontWeight="900" fill={WIN} fontFamily={numberFont}>∩ {intersection}</text>
            <motion.text x={W / 2} y={H - 24} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              {onlyEach} + {intersection} + {onlyEach} = {onlyEach * 2 + intersection}
            </motion.text>
            <motion.text x={W / 2} y={H - 8} textAnchor="middle" fontSize="14" fontWeight="900" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              |A| = {onlyEach} + {intersection} = {x}
            </motion.text>
          </>
        )}
      </svg>

      <motion.span
        key={`${step}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: phase === 1 ? BAD : phase >= 3 ? "#166534" : IND,
          background: phase === 1 ? "#fee2e2" : phase >= 3 ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${phase === 1 ? "#fecaca" : phase >= 3 ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {phase === 0
          ? "same-size sets, given union and overlap"
          : phase === 1
          ? trapChoice
            ? `tempting: |A ∪ B| − |A ∩ B| = ${trapValue} — matches choice ${trapChoice.label}, but that's both slivers combined, not x`
            : `|A ∪ B| − |A ∩ B| = ${trapValue} is both outer slivers combined, not x`
          : phase === 2
          ? "apply |A| + |B| − |A ∩ B| = |A ∪ B|"
          : phase === 3
          ? `solve: 2x = ${union + intersection}, so x = ${x}`
          : `check: the pieces add back to ${union}`}
      </motion.span>

      <AnimatePresence>
        {failure && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: BAD, textAlign: "center" }}
          >
            {failure}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {step >= lastStep && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
