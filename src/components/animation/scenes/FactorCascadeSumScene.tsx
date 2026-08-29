import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const COLORS = ["#0d9488", "#4338ca", "#d97706", "#dc2626", "#7c3aed", "#0891b2"];

function factorize(value: number): number[] {
  const factors: number[] = [];
  let remaining = value;
  for (let p = 2; p * p <= remaining; p += 1) while (remaining % p === 0) {
    factors.push(p);
    remaining /= p;
  }
  if (remaining > 1) factors.push(remaining);
  return factors;
}

/**
 * A number pulled apart one prime at a time, cascading down until every
 * remaining piece is itself prime. Each division peels off the smallest
 * available prime and leaves a smaller number to keep dividing — a real,
 * checkable step (the running product always equals the original) — until
 * the chain bottoms out at a largest prime factor. The real trap is
 * stopping there: that final, biggest prime looks like the answer to "sum
 * of the prime factors" on its own, so the scene flags it before actually
 * adding every factor found along the way.
 *
 * data: { number }
 */
export function FactorCascadeSumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const number = Math.round(num(data.number, 2010));
  const factors = factorize(number);
  const n = factors.length;
  const reconstructed = factors.reduce((a, b) => a * b, 1);

  const chain = [number];
  factors.forEach((f) => chain.push(chain[chain.length - 1] / f));

  const sum = factors.reduce((a, b) => a + b, 0);
  const ok = reconstructed === number && String(sum) === (problem.shortAnswer ?? "").trim();

  const largest = Math.max(...factors);
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === largest && String(c.label) !== problem.answer
  );

  // Dividing out the first n-1 primes leaves the last prime itself as the
  // remainder, so all n factors are visible after n-1 division beats.
  // ---- beats: 0..cascadeBeats-1 divisions, cascadeBeats the trap, +1 land ----
  const cascadeBeats = Math.max(n - 1, 1);
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, cascadeBeats + 1));
  const isFinal = step >= last;
  const inCascade = beat < cascadeBeats;
  const revealCount = inCascade ? beat + 1 : cascadeBeats;

  const W = 340;
  const H = 300;
  const rowH = 38;
  const topPad = 24;

  const caption = inCascade
    ? `${chain[beat]} = ${factors[beat]} × ${chain[beat + 1]}`
    : beat === cascadeBeats
    ? `${largest} — that's just the largest factor`
    : `${factors.join(" + ")} = ${sum}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* the cascade: each row divides the previous remainder by the next prime */}
        {beat < cascadeBeats && (
          <g>
            {Array.from({ length: revealCount }).map((_, i) => (
              <motion.g key={i} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i === beat ? 0 : 0 }}>
                <text x={30} y={topPad + i * rowH + 14} fontSize="14" fontWeight="800" fill={i === 0 ? INK : DIM} fontFamily={FONT}>
                  {chain[i]}
                </text>
                <text x={110} y={topPad + i * rowH + 14} fontSize="12" fontWeight="700" fill={DIM} fontFamily={FONT}>
                  ÷ {factors[i]}
                </text>
                <text x={160} y={topPad + i * rowH + 14} fontSize="14" fontWeight="800" fill={IND} fontFamily={FONT}>
                  =
                </text>
                <text x={180} y={topPad + i * rowH + 14} fontSize="14" fontWeight="800" fill={i === cascadeBeats - 1 ? WIN : INK} fontFamily={FONT}>
                  {chain[i + 1]}
                </text>
                <motion.circle
                  cx={280}
                  cy={topPad + i * rowH + 10}
                  r={11}
                  fill={COLORS[i % COLORS.length]}
                  fillOpacity={0.18}
                  stroke={COLORS[i % COLORS.length]}
                  strokeWidth={1.8}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
                <text x={280} y={topPad + i * rowH + 14} textAnchor="middle" fontSize="11" fontWeight="800" fill={COLORS[i % COLORS.length]} fontFamily={FONT}>
                  {factors[i]}
                </text>
              </motion.g>
            ))}
            {beat === cascadeBeats - 1 && (
              <motion.text x={W / 2} y={topPad + cascadeBeats * rowH + 14} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={WIN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                fully factored: {number} = {factors.join(" × ")}
              </motion.text>
            )}
          </g>
        )}

        {/* the largest-factor trap, isolated */}
        {beat === cascadeBeats && (
          <g>
            <text x={W / 2} y={30} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
              {number} = {factors.join(" × ")}
            </text>
            <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={W / 2 - 60} y={70} width={120} height={44} rx={10} fill="#fee2e2" stroke={BAD} strokeWidth={1.8} />
              <text x={W / 2} y={98} textAnchor="middle" fontSize="20" fontWeight="800" fill={BAD} fontFamily={FONT}>
                {largest} ✗
              </text>
            </motion.g>
            <motion.text x={W / 2} y={140} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              only the largest prime factor
            </motion.text>
          </g>
        )}

        {/* every factor added */}
        {beat === cascadeBeats + 1 && (
          <g>
            {factors.map((f, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.2 }}>
                <circle cx={40 + i * 60} cy={50} r={20} fill={COLORS[i % COLORS.length]} />
                <text x={40 + i * 60} y={56} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={FONT}>
                  {f}
                </text>
                {i < n - 1 && (
                  <text x={70 + i * 60} y={57} textAnchor="middle" fontSize="16" fontWeight="800" fill={INK}>
                    +
                  </text>
                )}
              </motion.g>
            ))}
            <motion.text x={W / 2} y={110} textAnchor="middle" fontSize="18" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              = {sum}
            </motion.text>
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
          color: isFinal ? "#166534" : beat === cascadeBeats ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === cascadeBeats ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === cascadeBeats ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === cascadeBeats && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 260 }}>
            {trapChoice ? `choice ${trapChoice.label} (${largest}) is only one of the ${n} prime factors` : `every prime factor counts, not just the biggest one`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${sum} but stored answer reads "${problem.shortAnswer}"`}
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
