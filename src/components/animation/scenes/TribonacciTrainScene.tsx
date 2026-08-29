import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const SEED = "#94a3b8";
const BAD = "#dc2626";

/**
 * A sequence where each new term is the sum of the previous three, built one
 * car at a time on a train: each step brackets the three cars that feed the
 * next one, sums them live, and the new car slides in — one generated term
 * per step, exactly the recurrence the problem describes.
 * Data: { seed:[1,2,3], count:8 }.
 */
export function TribonacciTrainScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const seed = (Array.isArray(data.seed) ? data.seed : [1, 2, 3]).map((v) => Math.round(num(v, 0)));
  const count = Math.max(seed.length + 1, Math.round(num(data.count, 8)));

  const seq = [...seed];
  while (seq.length < count) {
    const n = seq.length;
    seq.push(seq[n - 1] + seq[n - 2] + seq[n - 3]);
  }
  const target = seq[count - 1];
  const matches = problem.shortAnswer == null || String(target) === String(problem.shortAnswer);
  const failure = !matches ? `check failed: term ${count} computed as ${target}, stored answer is ${problem.shortAnswer}` : "";

  const lastStep = totalSteps - 1;
  const shown = Math.min(count, seed.length + step);
  const isFinal = step >= lastStep;
  const justAdded = shown > seed.length ? shown - 1 : -1;
  const bracket = justAdded >= 0 ? [justAdded - 3, justAdded - 2, justAdded - 1] : [];

  // ---- geometry ----
  const tileW = 38;
  const tileH = 32;
  const gap = 8;
  const x0 = 12;
  const rowY = 56;
  const W = x0 * 2 + count * tileW + (count - 1) * gap;
  const H = 148;
  const tileX = (i: number) => x0 + i * (tileW + gap);

  const caption = isFinal
    ? `${bracket.map((i) => seq[i]).join(" + ")} = ${target} — term #${count}`
    : justAdded >= 0
    ? `${bracket.map((i) => seq[i]).join(" + ")} = ${seq[justAdded]}`
    : `the sequence starts ${seed.join(", ")}`;

  const note = failure || (isFinal ? `${seq.slice(0, count).join(", ")}` : "");

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 420 }}>
        <text x={W / 2} y={16} textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          each new term = sum of the previous three
        </text>

        {/* the bracket over the three feeder terms */}
        <AnimatePresence>
          {bracket.length === 3 && (
            <motion.g key={`bk-${justAdded}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect
                x={tileX(bracket[0]) - 4}
                y={rowY - tileH / 2 - 8}
                width={tileX(bracket[2]) + tileW - tileX(bracket[0]) + 8}
                height={tileH + 16}
                rx={8}
                fill="none"
                stroke={IND}
                strokeWidth={1.6}
                strokeDasharray="4 3"
              />
            </motion.g>
          )}
        </AnimatePresence>

        {/* the train of tiles, seed dimmed, generated terms in ink, newest highlighted */}
        {Array.from({ length: shown }).map((_, i) => {
          const isSeed = i < seed.length;
          const isNew = i === justAdded;
          return (
            <motion.g
              key={i}
              initial={isNew ? { opacity: 0, scale: 0.3, y: -10 } : false}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: isNew ? 0.5 : 0 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <rect
                x={tileX(i)}
                y={rowY - tileH / 2}
                width={tileW}
                height={tileH}
                rx={7}
                fill={isNew ? "#dcfce7" : isSeed ? "#f8fafc" : "#eef2ff"}
                stroke={isNew ? WIN : isSeed ? SEED : IND}
                strokeWidth={isNew ? 1.8 : 1.3}
              />
              <text
                x={tileX(i) + tileW / 2}
                y={rowY + 4}
                textAnchor="middle"
                fontSize={seq[i] >= 100 ? "10.5" : "12.5"}
                fontWeight="800"
                fill={isNew ? "#166534" : isSeed ? "#64748b" : INK}
                fontFamily={numberFont}
              >
                {seq[i]}
              </text>
              <text x={tileX(i) + tileW / 2} y={rowY + tileH / 2 + 13} textAnchor="middle" fontSize="8" fontWeight="700" fill="#cbd5e1" fontFamily={numberFont}>
                #{i + 1}
              </text>
            </motion.g>
          );
        })}

        {/* the sum arrow: three feeders converging to the new tile */}
        <AnimatePresence>
          {bracket.length === 3 && justAdded >= 0 && (
            <motion.g key={`arrow-${justAdded}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.15 }}>
              <motion.path
                d={`M ${tileX(bracket[0]) + (tileX(bracket[2]) + tileW - tileX(bracket[0])) / 2},${rowY - tileH / 2 - 8}
                    L ${tileX(justAdded) + tileW / 2},${rowY + tileH / 2 + 24}`}
                fill="none"
                stroke={IND}
                strokeWidth={1.6}
                strokeDasharray="3 3"
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.35 }}
              />
            </motion.g>
          )}
        </AnimatePresence>
        <defs>
          <marker id="arrowhead" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
            <polygon points="0 0, 7 3.5, 0 7" fill={IND} />
          </marker>
        </defs>
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
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
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
