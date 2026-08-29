import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const DIM = "#94a3b8";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const SEAT = "#e2e8f0";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/** A seated person: head and shoulders, so an occupied seat reads at a glance. */
function Person({ cx, cy, r, fill }: { cx: number; cy: number; r: number; fill: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy - r * 0.5} r={r * 0.42} fill={fill} />
      <path d={`M ${cx - r * 0.8},${cy + r * 0.7} a ${r * 0.8} ${r * 0.75} 0 0 1 ${r * 1.6} 0 Z`} fill={fill} />
    </g>
  );
}

/**
 * Four people seated at random around a square table, one to a side, asking
 * the chance two named people land opposite each other. Once the first
 * person's seat is fixed, the second person's seat is equally likely to be
 * any of the *remaining* chairs — the real trap is counting all n chairs,
 * including the one already taken, which divides by n instead of n − 1 and
 * lands exactly on a listed wrong answer.
 *
 * data: { names: ["Angie","Bridget","Carlos","Diego"], fixedIndex, targetIndex }
 */
export function OppositeSeatScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = (Array.isArray(data.names) ? data.names : ["A", "B", "C", "D"]).map((v) => String(v));
  const fixedIndex = Math.round(num(data.fixedIndex, 0));
  const targetIndex = Math.round(num(data.targetIndex, 2));
  const seatCount = names.length;

  const remaining = seatCount - 1;
  const favorable = 1;
  const g = gcd(favorable, remaining) || 1;
  const probStr = `${favorable / g}/${remaining / g}`;
  const ok = probStr === (problem.shortAnswer ?? "").trim();

  const trapG = gcd(favorable, seatCount) || 1;
  const trapStr = `${favorable / trapG}/${seatCount / trapG}`;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).replace(/\s/g, "") === trapStr && String(c.label) !== problem.answer);

  // ---- beats: 0 setup, 1 fix the first seat, 2 the trap, 3 the real denominator, 4 land ----
  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), Math.max(last, 4));
  const isFinal = step >= last;

  // ---- geometry: seats around a square table, compass positions ----
  const W = 340;
  const H = 280;
  const cx0 = 170;
  const cy0 = 140;
  const half = 58;
  const seatR = 20;
  const positions = [
    { x: cx0, y: cy0 - half - seatR - 4 }, // N
    { x: cx0 + half + seatR + 4, y: cy0 }, // E
    { x: cx0, y: cy0 + half + seatR + 4 }, // S
    { x: cx0 - half - seatR - 4, y: cy0 }, // W
  ];
  const oppositeIndex = (fixedIndex + 2) % 4;
  const colors = [IND, "#0d9488", "#d97706", "#7c3aed"];

  const caption =
    beat === 0
      ? `${names.join(", ")} take random seats`
      : beat === 1
      ? `fix ${names[fixedIndex]}'s seat`
      : beat === 2
      ? `1 of ${seatCount} seats is opposite → ${trapStr}`
      : beat === 3
      ? `${remaining} seats are actually free for ${names[targetIndex]}`
      : `1 of ${remaining} free seats is opposite → ${probStr}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <rect x={cx0 - half} y={cy0 - half} width={half * 2} height={half * 2} rx={8} fill="#f8fafc" stroke={INK} strokeWidth={1.6} />

        {positions.map((p, i) => {
          const isFixedSeat = i === fixedIndex;
          const isOpposite = i === oppositeIndex;
          const occupiedByFixed = beat >= 1 && isFixedSeat;
          const showTrapAvailable = beat === 2;
          const showRealAvailable = beat >= 3 && !isFixedSeat;
          return (
            <g key={i}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={seatR}
                fill={
                  occupiedByFixed
                    ? "#eef2ff"
                    : beat === 4 && isOpposite
                    ? "#dcfce7"
                    : showRealAvailable
                    ? "#fff"
                    : showTrapAvailable
                    ? "#fff"
                    : SEAT
                }
                stroke={beat === 3 && isFixedSeat ? BAD : occupiedByFixed ? IND : beat === 4 && isOpposite ? WIN : INK}
                strokeWidth={occupiedByFixed || (beat === 4 && isOpposite) ? 2.4 : 1.4}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.08 }}
              />
              {occupiedByFixed && (
                <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <Person cx={p.x} cy={p.y} r={seatR * 0.85} fill={IND} />
                </motion.g>
              )}
              {beat === 3 && isFixedSeat && (
                <motion.text x={p.x} y={p.y - seatR - 6} textAnchor="middle" fontSize="8" fontWeight="800" fill={BAD} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  not free
                </motion.text>
              )}
              {beat === 4 && isOpposite && (
                <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <Person cx={p.x} cy={p.y} r={seatR * 0.85} fill={WIN} />
                </motion.g>
              )}
              {beat === 2 && (
                <motion.text x={p.x} y={p.y + 32} textAnchor="middle" fontSize="8" fontWeight="800" fill={isOpposite ? WIN : DIM} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + i * 0.1 }}>
                  {isOpposite ? "opposite" : isFixedSeat ? "(taken!)" : "empty"}
                </motion.text>
              )}
            </g>
          );
        })}

        {/* the people waiting to be seated, before anyone sits */}
        {beat === 0 &&
          names.map((nm, i) => {
            const px = 40 + i * 70;
            return (
              <motion.g key={`intro-${nm}`} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: 0.2 + i * 0.1 }}>
                <Person cx={px} cy={252} r={16} fill={colors[i]} />
                <text x={px} y={276} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={colors[i]} fontFamily={FONT}>
                  {nm}
                </text>
              </motion.g>
            );
          })}
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
          color: isFinal ? "#166534" : beat === 2 ? "#b91c1c" : IND,
          background: isFinal ? "#dcfce7" : beat === 2 ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : beat === 2 ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {beat === 2 && (
          <motion.span key="trap-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: DIM, textAlign: "center", maxWidth: 270 }}>
            {trapChoice ? `choice ${trapChoice.label} (${trapStr}) counts ${names[fixedIndex]}'s own seat as an option` : `${names[fixedIndex]}'s own seat isn't really an option`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && !ok && (
          <motion.span key="fail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} style={{ fontFamily: FONT, fontSize: 11, fontWeight: 700, color: BAD, textAlign: "center" }}>
            {`check failed: computed ${probStr} but stored answer reads "${problem.shortAnswer}"`}
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
