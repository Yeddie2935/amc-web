import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const WIN = "#16a34a";
const BAD = "#dc2626";

/**
 * A triangle with three consecutive-integer side lengths, where the
 * shortest side is a given percent of the perimeter. The perimeter divides
 * cleanly into ten equal tenths — the percent condition directly, no algebra
 * needed to see it — and the shortest side occupies exactly that many
 * tenths, which pins the common difference in one step. The real trap is
 * stopping there: solving for n gives the *shortest* side's own length,
 * which happens to be a real choice, so the scene flags it before adding
 * the +2 that actually answers the question.
 *
 * data: { percent, longestIsAnswer? } — the shortest side's percent of the
 * perimeter; three consecutive integers are derived from it.
 */
export function ConsecutiveTriangleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const percent = num(data.percent, 30);

  // shortest = n, sides n, n+1, n+2, perimeter 3n+3; n·100 = percent·(3n+3)
  // n = (percent/100)(3n+3)  ⇒  100n = 3·percent·n + 3·percent  ⇒  n = 3·percent / (100 − 3·percent)
  const n = (3 * percent) / (100 - 3 * percent);
  const nInt = Math.round(n);
  const mid = nInt + 1;
  const longest = nInt + 2;
  const perimeter = nInt + mid + longest;
  const ok = String(longest) === (problem.shortAnswer ?? "").trim();

  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === nInt && String(c.label) !== problem.answer
  );

  // ---- beats: 0 setup, 1 tenths split, 2 solve n, 3 the trap, 4 add 2, 5 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  const W = 360;
  const H = 260;
  const barX = 30;
  const barW = 300;
  const barY = 70;
  const barH = 40;
  const tenths = Math.round(percent / 10);

  const caption =
    beat === 0
      ? `sides n, n+1, n+2 — shortest is ${percent}% of the perimeter`
      : beat === 1
      ? `perimeter splits into 10 equal tenths, shortest = ${tenths}`
      : beat === 2
      ? `n = ${nInt}`
      : beat === 3
      ? `n = ${nInt} — that's the shortest side, not the longest`
      : beat === 4
      ? `n + 2 = ${nInt} + 2 = ${longest}`
      : `longest side = ${longest}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* beat 0: the three sides as separate bars */}
        {beat === 0 && (
          <g>
            {[
              { label: "n", color: TEAL, w: 70 },
              { label: "n+1", color: IND, w: 90 },
              { label: "n+2", color: AMBER, w: 110 },
            ].map((s, i) => (
              <motion.g key={s.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.2 }}>
                <rect x={40} y={50 + i * 50} width={s.w} height={30} rx={6} fill={s.color} fillOpacity={0.2} stroke={s.color} strokeWidth={1.8} />
                <text x={40 + s.w / 2} y={50 + i * 50 + 20} textAnchor="middle" fontSize="13" fontWeight="800" fill={s.color} fontFamily={FONT}>
                  {s.label}
                </text>
              </motion.g>
            ))}
          </g>
        )}

        {/* beat 1: the perimeter as ten equal tenths, shortest side traced out */}
        {beat === 1 && (
          <g>
            <text x={W / 2} y={30} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={FONT}>
              perimeter = n + (n+1) + (n+2)
            </text>
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.rect
                key={i}
                x={barX + i * (barW / 10)}
                y={barY}
                width={barW / 10 - 2}
                height={barH}
                rx={3}
                fill={i < tenths ? TEAL : "#f1f5f9"}
                fillOpacity={i < tenths ? 0.75 : 1}
                stroke={i < tenths ? TEAL : "#cbd5e1"}
                strokeWidth={1.4}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.06 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            ))}
            <motion.text x={barX + (tenths * (barW / 10)) / 2} y={barY + barH + 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              shortest = {tenths}/10 = {percent}%
            </motion.text>
          </g>
        )}

        {/* beat 2: solve for n */}
        {beat === 2 && (
          <g>
            <text x={W / 2} y={70} textAnchor="middle" fontSize="13" fontWeight="800" fill={INK} fontFamily={FONT}>
              n = {percent}% × (3n + 3)
            </text>
            <motion.text x={W / 2} y={120} textAnchor="middle" fontSize="24" fontWeight="800" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              n = {nInt}
            </motion.text>
          </g>
        )}

        {/* beat 3: the trap — n alone */}
        {beat === 3 && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 60} y={60} width={120} height={40} rx={10} fill="#fee2e2" stroke={BAD} strokeWidth={1.8} />
              <text x={W / 2} y={86} textAnchor="middle" fontSize="18" fontWeight="800" fill={BAD} fontFamily={FONT}>
                {nInt} ✗
              </text>
            </motion.g>
            <motion.text x={W / 2} y={130} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              this is the shortest side, n
            </motion.text>
          </g>
        )}

        {/* beat 4: adding 2 to get the longest side */}
        {beat === 4 && (
          <g>
            <text x={W / 2} y={70} textAnchor="middle" fontSize="18" fontWeight="800" fill={INK} fontFamily={FONT}>
              n = {nInt}
            </text>
            <motion.text x={W / 2} y={110} textAnchor="middle" fontSize="18" fontWeight="800" fill={AMBER} fontFamily={FONT} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.4 }}>
              n + 2 = {longest}
            </motion.text>
          </g>
        )}

        {/* beat 5: all three sides, longest highlighted */}
        {beat === 5 && (
          <g>
            {[
              { v: nInt, color: TEAL, isLongest: false },
              { v: mid, color: IND, isLongest: false },
              { v: longest, color: AMBER, isLongest: true },
            ].map((s, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.15 }}>
                <rect x={70 + i * 80} y={60} width={60} height={s.v * 6} rx={6} fill={s.color} fillOpacity={s.isLongest ? 0.85 : 0.35} stroke={s.color} strokeWidth={s.isLongest ? 2.4 : 1.4} />
                <text x={100 + i * 80} y={60 + s.v * 6 + 18} textAnchor="middle" fontSize="13" fontWeight="800" fill={s.color} fontFamily={FONT}>
                  {s.v}
                </text>
              </motion.g>
            ))}
          </g>
        )}
      </svg>

      <motion.span
        key={`cap${beat}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : beat === 3 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 3 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 3 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 3 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            {trapChoice ? `choice ${trapChoice.label} (${nInt}) is n itself — the question asks for the longest side` : `n is the shortest side, not the longest`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${longest} but stored answer reads "${problem.shortAnswer}"`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
