import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const parseChoice = (text: string) => Number(String(text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, ""));

/**
 * A fixed ratio (per batch) scaled up to a target count of the first item.
 * The unit batch is drawn once as real icons, then stamped into a row of
 * batch slots — the count of slots is the scale factor, found by dividing the
 * target by the batch's first count — and each slot's second-item count is
 * revealed and summed for the answer, with a beat spent on the flip-the-ratio
 * trap (target × per-batch-first instead of ÷).
 * Data: { perA, perB, targetA, labelA, labelB, iconA, iconB }.
 */
export function RatioBatchScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const perA = Math.max(1, Math.round(num(data.perA, 4)));
  const perB = Math.max(1, Math.round(num(data.perB, 7)));
  const targetA = Math.max(perA, Math.round(num(data.targetA, 28)));
  const labelA = data.labelA != null ? String(data.labelA) : "A";
  const labelB = data.labelB != null ? String(data.labelB) : "B";
  const iconA = data.iconA != null ? String(data.iconA) : "🚗";
  const iconB = data.iconB != null ? String(data.iconB) : "🚙";

  const batches = Math.round(targetA / perA);
  const totalB = batches * perB;
  const evenSplit = batches * perA === targetA;
  const matches = problem.shortAnswer == null || String(totalB) === String(problem.shortAnswer);
  const failure = !evenSplit
    ? `check failed: ${targetA} is not a whole multiple of ${perA}`
    : !matches
    ? `check failed: ${batches} × ${perB} = ${totalB}, stored answer is ${problem.shortAnswer}`
    : "";

  const flipTrap = targetA * perA;
  const trapChoice = (problem.choices ?? []).find((c) => parseChoice(c.text) === flipTrap);

  const lastStep = totalSteps - 1;
  const scaled = step >= 1;
  const showTrap = step >= 2;
  const showB = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 360;
  const H = 280;
  const slotW = 42;
  const gap = 4;
  const x0 = 18;
  const trackY = 128;
  const slotH = 76;
  const slotX = (i: number) => x0 + i * (slotW + gap);

  const caption = isFinal
    ? `${labelA} scales ${batches}×, so ${labelB} scales ${batches}× too: ${totalB} ${labelB}`
    : showB
    ? `${batches} batches × ${perB} ${labelB} = ${totalB}`
    : showTrap
    ? `flipping the ratio gives ${targetA} × ${perA} = ${flipTrap} — wrong direction`
    : scaled
    ? `${targetA} ÷ ${perA} = ${batches} batches needed`
    : `1 batch: ${perA} ${labelA} → ${perB} ${labelB}`;

  const note = failure
    ? failure
    : isFinal
    ? `${batches} × ${perA} = ${targetA} ${labelA} checks out`
    : showTrap && !showB
    ? trapChoice
      ? `choice ${trapChoice.label} is ${trapChoice.text} — that's ${targetA} × ${perA}, multiplying by the wrong number`
      : ""
    : "";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* the base ratio, drawn once as real icons */}
        <rect x={x0} y={10} width={126} height={68} rx={10} fill="#f8fafc" stroke={INK} strokeWidth={1.4} strokeDasharray="4 3" />
        <text x={x0 + 63} y={24} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
          1 batch
        </text>
        {Array.from({ length: perA }).map((_, i) => (
          <text key={`a${i}`} x={x0 + 14 + i * 22} y={44} fontSize="15" textAnchor="middle" dominantBaseline="central">
            {iconA}
          </text>
        ))}
        {Array.from({ length: perB }).map((_, i) => (
          <text key={`b${i}`} x={x0 + 12 + i * 16} y={64} fontSize="12" textAnchor="middle" dominantBaseline="central">
            {iconB}
          </text>
        ))}

        {/* the target count of item A we're scaling up to */}
        <text x={W - 10} y={24} textAnchor="end" fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
          target: {targetA} {labelA}
        </text>

        {/* the batch track: empty slots, then stamped full once the scale is found */}
        {Array.from({ length: batches }).map((_, i) => (
          <rect
            key={`slot${i}`}
            x={slotX(i)}
            y={trackY}
            width={slotW}
            height={slotH}
            rx={6}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={1.2}
            strokeDasharray="4 3"
          />
        ))}

        <AnimatePresence>
          {scaled &&
            Array.from({ length: batches }).map((_, i) => (
              <motion.g
                key={`fill${i}`}
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 17, delay: i * 0.08 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={slotX(i)} y={trackY} width={slotW} height={slotH} rx={6} fill="#eef2ff" stroke={IND} strokeWidth={1.6} />
                <text x={slotX(i) + slotW / 2} y={trackY + 20} textAnchor="middle" fontSize="14" dominantBaseline="central">
                  {iconA}
                </text>
                <text x={slotX(i) + slotW / 2} y={trackY + 34} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={IND} fontFamily={numberFont}>
                  {perA}
                </text>
                <AnimatePresence>
                  {showB && (
                    <motion.g
                      key="b"
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 17, delay: 0.15 + i * 0.08 }}
                      style={{ transformBox: "fill-box", transformOrigin: "center" }}
                    >
                      <text x={slotX(i) + slotW / 2} y={trackY + 54} textAnchor="middle" fontSize="14" dominantBaseline="central">
                        {iconB}
                      </text>
                      <text x={slotX(i) + slotW / 2} y={trackY + 68} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                        {perB}
                      </text>
                    </motion.g>
                  )}
                </AnimatePresence>
              </motion.g>
            ))}
        </AnimatePresence>

        <AnimatePresence>
          {scaled && (
            <motion.text
              x={x0}
              y={trackY - 8}
              fontSize="10.5"
              fontWeight="800"
              fill={IND}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {targetA} ÷ {perA} = {batches} batches
            </motion.text>
          )}
        </AnimatePresence>

        {/* trap: the answer choices, with the flip-the-ratio value called out */}
        <AnimatePresence>
          {showTrap && !showB && (
            <motion.g key="choices" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              {(problem.choices ?? []).map((c, i) => {
                const isTrap = trapChoice?.label === c.label;
                const cx = 46 + i * 62;
                return (
                  <g key={c.label}>
                    <rect
                      x={cx - 24}
                      y={216}
                      width={48}
                      height={20}
                      rx={10}
                      fill={isTrap ? "#fee2e2" : "#f8fafc"}
                      stroke={isTrap ? BAD : "#cbd5e1"}
                      strokeWidth={isTrap ? 1.6 : 1}
                    />
                    <text x={cx} y={230} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={isTrap ? BAD : "#64748b"} fontFamily={numberFont}>
                      {c.label}: {c.text}
                    </text>
                  </g>
                );
              })}
            </motion.g>
          )}
        </AnimatePresence>

        {/* running sedan total, once each batch's second item is revealed */}
        <AnimatePresence>
          {showB && (
            <motion.text
              x={x0}
              y={trackY + slotH + 20}
              fontSize="12"
              fontWeight="800"
              fill={WIN}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.5 }}
              style={{ transformBox: "fill-box", transformOrigin: "left" }}
            >
              {batches} × {perB} = {totalB} {labelB}
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
          color: isFinal ? "#166534" : showTrap && !showB ? "#dc2626" : "#4338ca",
          background: isFinal ? "#dcfce7" : showTrap && !showB ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap && !showB ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {note && (
          <motion.span
            key={`note-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            style={{
              fontFamily: numberFont,
              fontSize: 11.5,
              fontWeight: 700,
              color: failure ? BAD : "#94a3b8",
              textAlign: "center",
            }}
          >
            {note}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
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
