import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const TEAL = "#0d9488";
const WIN = "#16a34a";
const BAD = "#dc2626";

const gcd = (x: number, y: number): number => (y ? gcd(y, x % y) : x);

/**
 * A made-up operation a@b = (a×b)/(a+b), evaluated on two given numbers. The
 * product is drawn as a real a×b grid of unit cells (an area, something to
 * count) and the sum as a row of a+b unit chips laid end to end (a length) —
 * two different kinds of quantity feeding one fraction. The real trap is
 * which one goes on top: flipping numerator and denominator gives the
 * fraction's reciprocal, and on this problem that reciprocal reduces to
 * exactly one of the wrong answer choices, so the scene builds it and shows
 * the flag rather than asserting the mistake exists.
 *
 * data: { a, b }
 */
export function CustomOperationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = Math.round(num(data.a, 5));
  const b = Math.round(num(data.b, 10));

  const product = a * b;
  const sum = a + b;
  const g = gcd(product, sum) || 1;
  const numReduced = product / g;
  const denReduced = sum / g;
  const answerStr = `${numReduced}/${denReduced}`;
  const ok = answerStr === (problem.shortAnswer ?? "").trim();

  const tg = gcd(sum, product) || 1;
  const trapStr = `${sum / tg}/${product / tg}`;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).replace(/\s/g, "") === trapStr && String(c.label) !== problem.answer);

  // ---- beats: 0 setup, 1 product area, 2 sum length, 3 form fraction, 4 the trap, 5 reduce+land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 5));
  const isFinal = step >= last;

  // ---- geometry ----
  const W = 380;
  const H = 280;
  const gridX0 = 60;
  const gridY0 = 40;
  const cell = Math.min(20, 220 / Math.max(a, b));
  const chipR = 8;
  const chipPitch = chipR * 2.4;
  const sumRowY = 210;
  const sumRowX0 = (W - sum * chipPitch) / 2;

  const caption =
    beat === 0
      ? `a @ b = (a × b) / (a + b), with a=${a}, b=${b}`
      : beat === 1
      ? `${a} × ${b} = ${product}`
      : beat === 2
      ? `${a} + ${b} = ${sum}`
      : beat === 3
      ? `${product} / ${sum}`
      : beat === 4
      ? `flipped: ${sum} / ${product} = ${trapStr}`
      : `${product}/${sum} = ${answerStr}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 400 }}>
        {/* beat 1: the product as an a×b grid of cells */}
        {beat === 1 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
              {a} × {b} cells
            </text>
            {Array.from({ length: a * b }).map((_, i) => {
              const row = Math.floor(i / b);
              const col = i % b;
              return (
                <motion.rect
                  key={i}
                  x={gridX0 + col * cell}
                  y={gridY0 + row * cell}
                  width={cell - 2}
                  height={cell - 2}
                  fill={IND}
                  fillOpacity={0.5}
                  stroke={IND}
                  strokeWidth={0.8}
                  initial={{ opacity: 0, scale: 0.4 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.006 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              );
            })}
            <text x={gridX0 + (b * cell) / 2} y={gridY0 + a * cell + 22} textAnchor="middle" fontSize="14" fontWeight="800" fill={IND} fontFamily={FONT}>
              = {product}
            </text>
          </g>
        )}

        {/* beat 2: the sum as a+b chips in a row */}
        {beat === 2 && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
              {a} chips + {b} chips, end to end
            </text>
            {Array.from({ length: sum }).map((_, i) => (
              <motion.circle
                key={i}
                cx={sumRowX0 + i * chipPitch + chipR}
                cy={sumRowY}
                r={chipR}
                fill={i < a ? IND : TEAL}
                stroke="#fff"
                strokeWidth={1}
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 18, delay: i * 0.04 }}
              />
            ))}
            <text x={W / 2} y={sumRowY + 28} textAnchor="middle" fontSize="14" fontWeight="800" fill={TEAL} fontFamily={FONT}>
              = {sum}
            </text>
          </g>
        )}

        {/* beat 3: form the real fraction, product over sum */}
        {beat === 3 && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <text x={W / 2} y={110} textAnchor="middle" fontSize="26" fontWeight="800" fill={IND} fontFamily={FONT}>
              {product}
            </text>
            <line x1={W / 2 - 40} y1={124} x2={W / 2 + 40} y2={124} stroke={INK} strokeWidth={2} />
            <text x={W / 2} y={152} textAnchor="middle" fontSize="26" fontWeight="800" fill={TEAL} fontFamily={FONT}>
              {sum}
            </text>
            <text x={W / 2} y={190} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
              product on top, sum on the bottom
            </text>
          </motion.g>
        )}

        {/* beat 4: the flipped trap fraction */}
        {beat === 4 && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <text x={W / 2} y={100} textAnchor="middle" fontSize="24" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {sum}
            </text>
            <line x1={W / 2 - 40} y1={114} x2={W / 2 + 40} y2={114} stroke={BAD} strokeWidth={2} />
            <text x={W / 2} y={142} textAnchor="middle" fontSize="24" fontWeight="800" fill={BAD} fontFamily={FONT}>
              {product}
            </text>
            <text x={W / 2 + 56} y={124} fontSize="18" fontWeight="800" fill={BAD}>
              ✗
            </text>
            <text x={W / 2} y={170} textAnchor="middle" fontSize="14" fontWeight="800" fill={BAD} fontFamily={FONT}>
              = {trapStr}
            </text>
          </motion.g>
        )}

        {/* beat 5: reduce the real fraction, dividing both by the gcd */}
        {beat === 5 && (
          <g>
            <text x={W / 2} y={40} textAnchor="middle" fontSize="18" fontWeight="800" fill={DIM} fontFamily={FONT}>
              {product} / {sum}
            </text>
            <text x={W / 2} y={58} textAnchor="middle" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
              both divisible by {g}
            </text>
            <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.4 }}>
              <text x={W / 2} y={120} textAnchor="middle" fontSize="30" fontWeight="800" fill={WIN} fontFamily={FONT}>
                {numReduced}
              </text>
              <line x1={W / 2 - 34} y1={134} x2={W / 2 + 34} y2={134} stroke={WIN} strokeWidth={2.4} />
              <text x={W / 2} y={164} textAnchor="middle" fontSize="30" fontWeight="800" fill={WIN} fontFamily={FONT}>
                {denReduced}
              </text>
            </motion.g>
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
          color: isFinal ? "#166534" : beat === 4 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 4 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 4 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 4 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${trapStr}) puts the sum on top instead` : `the sum belongs on the bottom, not the top`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${answerStr} but stored answer reads "${problem.shortAnswer}"`}
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
