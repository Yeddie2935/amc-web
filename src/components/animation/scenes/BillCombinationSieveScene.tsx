import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * $17 has to come from stacks of two bill sizes — the scene tries every count
 * of the big bill from 0 up to the most that fit, computes what's left over,
 * and checks whether the small bill divides it evenly. Most tries fail (an odd
 * leftover, or one that isn't a whole number of small bills); a beat is spent
 * on the trap of just counting every try instead of only the ones that work,
 * since that miscount lands on a real answer choice. Data:
 * { total, bigBill, smallBill }.
 */
export function BillCombinationSieveScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, Math.round(num(data.total, 17)));
  const big = Math.max(1, Math.round(num(data.bigBill, 5)));
  const small = Math.max(1, Math.round(num(data.smallBill, 2)));

  const maxBig = Math.floor(total / big);
  const rows = Array.from({ length: maxBig + 1 }, (_, f) => {
    const remainder = total - f * big;
    const t = remainder / small;
    const valid = Number.isInteger(t) && t >= 0;
    return { f, remainder, t, valid };
  });
  const valid = rows.filter((r) => r.valid);
  const answerOk = problem.shortAnswer == null || String(valid.length) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `counted ${valid.length} valid rows, stored answer is ${problem.shortAnswer}` : "";
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(rows.length));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRows = step >= 1;
  const revealCount = showRows ? rows.length : 0;
  const showTrap = step === 2 && !isFinal;

  const W = 300;
  const rowH = 30;
  const H = 40 + (rows.length + 1) * rowH + 10;

  const caption = isFinal
    ? `${valid.length} combinations work`
    : showTrap
    ? trapChoice
      ? `counting every try gives ${rows.length} — choice ${trapChoice.label}, but most leave an odd or negative leftover`
      : `counting every try gives ${rows.length}, not all of them work`
    : showRows
    ? `try every count of $${big} bills from 0 to ${maxBig}`
    : `make $${total} from $${big} and $${small} bills`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={W / 2} y={18} textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={numberFont}>
          {big}f + {small}t = {total}
        </text>

        <text x={16} y={40} fontSize="9.5" fontWeight="800" fill={DIM}>
          f (${big}s)
        </text>
        <text x={70} y={40} fontSize="9.5" fontWeight="800" fill={DIM}>
          left over
        </text>
        <text x={150} y={40} fontSize="9.5" fontWeight="800" fill={DIM}>
          t (${small}s)
        </text>
        <text x={220} y={40} fontSize="9.5" fontWeight="800" fill={DIM}>
          works?
        </text>

        {rows.map((r, i) => {
          const shown = i < revealCount;
          const y = 50 + i * rowH;
          return (
            <AnimatePresence key={r.f}>
              {shown && (
                <motion.g
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", stiffness: 220, damping: 20, delay: i * 0.18 }}
                >
                  <rect x={8} y={y} width={W - 16} height={rowH - 6} rx={6} fill={r.valid ? "#dcfce7" : "#f8fafc"} stroke={r.valid ? WIN : "#e2e8f0"} strokeWidth={1.2} />
                  <text x={30} y={y + 17} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    {r.f}
                  </text>
                  <text x={100} y={y + 17} textAnchor="middle" fontSize="11" fontWeight="700" fill={DIM} fontFamily={numberFont}>
                    {total} − {r.f * big} = {r.remainder}
                  </text>
                  <text x={175} y={y + 17} textAnchor="middle" fontSize="11" fontWeight="800" fill={r.valid ? WIN : BAD} fontFamily={numberFont}>
                    {r.valid ? r.t : "—"}
                  </text>
                  <text x={230} y={y + 17} textAnchor="middle" fontSize="13" fontWeight="800" fill={r.valid ? WIN : BAD}>
                    {r.valid ? "✓" : "✗"}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          );
        })}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
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
