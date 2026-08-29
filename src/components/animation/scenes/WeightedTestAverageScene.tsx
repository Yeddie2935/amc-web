import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const COLORS = ["#4338ca", "#0d9488", "#d97706"];

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(1))));

/**
 * Three tests, each with its own problem count and percent correct, asked
 * for the overall percent correct across all of them. The tests aren't the
 * same size, so the real trap is averaging the three percentages directly —
 * that plain average happens to land exactly on one of the wrong choices.
 * The scene draws each test as a real grid of problems, shades the correct
 * ones, and only combines the raw correct/total counts once every test's
 * grid has been counted, so the weighting by size is visible rather than
 * assumed.
 *
 * data: { tests: ["25|80","40|90","10|70"] } — count|percent per test.
 */
export function WeightedTestAverageScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const tests = (Array.isArray(data.tests) ? data.tests : []).map((raw) => {
    const [countStr, pctStr] = String(raw).split("|");
    const count = Math.round(num(countStr, 0));
    const pct = num(pctStr, 0);
    const correct = Math.round((count * pct) / 100);
    return { count, pct, correct };
  });
  const n = tests.length;

  const totalCorrect = tests.reduce((a, t) => a + t.correct, 0);
  const totalCount = tests.reduce((a, t) => a + t.count, 0);
  const realPercent = (totalCorrect / totalCount) * 100;
  const ok = tidy(Math.round(realPercent)) === (problem.shortAnswer ?? "").trim();

  const trapPercent = tests.reduce((a, t) => a + t.pct, 0) / n;
  const trapChoice = (problem.choices ?? []).find(
    (c) => Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) === Math.round(trapPercent) && String(c.label) !== problem.answer
  );

  // ---- beats: 0..n-1 one test each, n the trap, n+1 sum correct, n+2 sum total, n+3 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, n + 3));
  const isFinal = step >= last;
  const inTests = beat < n;

  const W = 380;
  const H = 300;
  const cols = 10;
  const cell = 18;
  const gap = 3;

  const caption = inTests
    ? `test ${beat + 1}: ${tests[beat].count} problems, ${tidy(tests[beat].pct)}% correct → ${tests[beat].correct} right`
    : beat === n
    ? `(${tests.map((t) => tidy(t.pct)).join("+")}) / ${n} = ${tidy(trapPercent)}% — ignores test size`
    : beat === n + 1
    ? `${tests.map((t) => t.correct).join(" + ")} = ${totalCorrect} correct`
    : beat === n + 2
    ? `${tests.map((t) => t.count).join(" + ")} = ${totalCount} total`
    : `${totalCorrect} / ${totalCount} = ${tidy(Math.round(realPercent))}%`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* beats 0..n-1: each test as a grid of problems, correct ones shaded */}
        {inTests &&
          (() => {
            const t = tests[beat];
            const rows = Math.ceil(t.count / cols);
            const gridW = cols * (cell + gap) - gap;
            const gx0 = (W - gridW) / 2;
            const gy0 = 30;
            return (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
                  test {beat + 1}: {t.count} problems
                </text>
                {Array.from({ length: t.count }).map((_, i) => {
                  const r = Math.floor(i / cols);
                  const c = i % cols;
                  const isCorrect = i < t.correct;
                  return (
                    <motion.rect
                      key={i}
                      x={gx0 + c * (cell + gap)}
                      y={gy0 + r * (cell + gap)}
                      width={cell}
                      height={cell}
                      rx={3}
                      fill={isCorrect ? COLORS[beat % COLORS.length] : "#f1f5f9"}
                      fillOpacity={isCorrect ? 0.75 : 1}
                      stroke={isCorrect ? COLORS[beat % COLORS.length] : "#cbd5e1"}
                      strokeWidth={1.2}
                      initial={{ opacity: 0, scale: 0.4 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.02 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    />
                  );
                })}
                <motion.text
                  x={W / 2}
                  y={gy0 + rows * (cell + gap) + 22}
                  textAnchor="middle"
                  fontSize="14"
                  fontWeight="800"
                  fill={COLORS[beat % COLORS.length]}
                  fontFamily={FONT}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 240, damping: 15, delay: t.count * 0.02 + 0.2 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  {t.correct} / {t.count} correct
                </motion.text>
              </g>
            );
          })()}

        {/* beat n: the trap, averaging plain percentages */}
        {beat === n && (
          <g>
            <text x={W / 2} y={26} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
              averaging the percentages directly
            </text>
            {tests.map((t, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.2 }}>
                <rect x={40 + i * 110} y={60} width={90} height={40} rx={9} fill="#fff" stroke={COLORS[i % COLORS.length]} strokeWidth={1.8} />
                <text x={85 + i * 110} y={78} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={COLORS[i % COLORS.length]} fontFamily={FONT}>
                  test {i + 1}
                </text>
                <text x={85 + i * 110} y={94} textAnchor="middle" fontSize="14" fontWeight="800" fill={COLORS[i % COLORS.length]} fontFamily={FONT}>
                  {tidy(t.pct)}%
                </text>
              </motion.g>
            ))}
            <motion.rect x={W / 2 - 60} y={150} width={120} height={36} rx={9} fill="#fee2e2" stroke={BAD} strokeWidth={1.8} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            <motion.text x={W / 2} y={173} textAnchor="middle" fontSize="15" fontWeight="800" fill={BAD} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              {tidy(trapPercent)}% ✗
            </motion.text>
          </g>
        )}

        {/* beat n+1: sum the correct counts */}
        {beat === n + 1 && (
          <g>
            {tests.map((t, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.2 }}>
                <text x={W / 2} y={40 + i * 30} textAnchor="middle" fontSize="14" fontWeight="800" fill={COLORS[i % COLORS.length]} fontFamily={FONT}>
                  test {i + 1}: {t.correct} correct
                </text>
              </motion.g>
            ))}
            <motion.text x={W / 2} y={150} textAnchor="middle" fontSize="17" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {tests.map((t) => t.correct).join(" + ")} = {totalCorrect}
            </motion.text>
          </g>
        )}

        {/* beat n+2: sum the total counts */}
        {beat === n + 2 && (
          <g>
            {tests.map((t, i) => (
              <motion.g key={i} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: i * 0.2 }}>
                <text x={W / 2} y={40 + i * 30} textAnchor="middle" fontSize="14" fontWeight="800" fill={COLORS[i % COLORS.length]} fontFamily={FONT}>
                  test {i + 1}: {t.count} problems
                </text>
              </motion.g>
            ))}
            <motion.text x={W / 2} y={150} textAnchor="middle" fontSize="17" fontWeight="800" fill={IND} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              {tests.map((t) => t.count).join(" + ")} = {totalCount}
            </motion.text>
          </g>
        )}

        {/* beat n+3: the real weighted percent */}
        {beat === n + 3 && (
          <g>
            <text x={W / 2} y={50} textAnchor="middle" fontSize="24" fontWeight="800" fill={WIN} fontFamily={FONT}>
              {totalCorrect}
            </text>
            <line x1={W / 2 - 40} y1={64} x2={W / 2 + 40} y2={64} stroke={INK} strokeWidth={2} />
            <text x={W / 2} y={92} textAnchor="middle" fontSize="24" fontWeight="800" fill={INK} fontFamily={FONT}>
              {totalCount}
            </text>
            <motion.text x={W / 2} y={140} textAnchor="middle" fontSize="20" fontWeight="800" fill={WIN} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              = {tidy(Math.round(realPercent))}%
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
          color: isFinal ? "#166534" : beat === n ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === n ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === n ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === n && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${Math.round(trapPercent)}) treats every test as the same size` : `the tests aren't the same size, so a plain average is wrong`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${tidy(Math.round(realPercent))}% but stored answer reads "${problem.shortAnswer}"`}
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
