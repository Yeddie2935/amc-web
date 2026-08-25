import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, num } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const PALETTE = ["#1f2a44", "#4338ca", "#0891b2", "#ca8a04", "#db2777", "#059669", "#7c3aed", "#0d9488"];

const isSpecial = (n: number) => /7/.test(String(n)) || n % 7 === 0;
const isMultipleOnly = (n: number) => n % 7 === 0;

interface SimEvent {
  count: number;
  name: string;
  origIndex: number;
  eliminated: boolean;
}

/** Counts around a shrinking circle, removing whoever says a number that is special. */
function runSim(names: string[], special: (n: number) => boolean): { events: SimEvent[]; winner: string | null } {
  let remaining = names.map((name, i) => ({ name, i }));
  let pointer = 0;
  let count = 0;
  const events: SimEvent[] = [];
  while (remaining.length > 1 && count < 400) {
    count++;
    const person = remaining[pointer];
    const eliminated = special(count);
    events.push({ count, name: person.name, origIndex: person.i, eliminated });
    if (eliminated) {
      remaining.splice(pointer, 1);
      if (pointer >= remaining.length) pointer = 0;
    } else {
      pointer = (pointer + 1) % remaining.length;
    }
  }
  return { events, winner: remaining[0]?.name ?? null };
}

/**
 * People arranged in a circle, counting off; whoever lands on a number with a
 * 7 digit or a multiple of 7 leaves. The circle is drawn once at fixed seats;
 * a token walks seat to seat following the real simulation, pausing to remove
 * whoever it lands on at a special count. Re-runs with the "multiple of 7
 * only" rule (dropping the digit-7 clause) as the classic slip, and reports it
 * only if it actually lands on a different answer choice.
 * Data: { names, eliminationCounts?, winner? } — the latter two are checked,
 * not assumed.
 */
export function CountOutCircleScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = (Array.isArray(data.names) ? data.names : []).map((n) => String(n));
  const storedElim = Array.isArray(data.eliminationCounts) ? data.eliminationCounts.map((v) => num(v, 0)) : [];
  const storedWinner = data.winner != null ? String(data.winner) : null;

  const { events, winner } = runSim(names, isSpecial);
  const elimEvents = events.filter((e) => e.eliminated);
  const mismatch =
    (!!storedWinner && storedWinner !== winner) ||
    (storedElim.length > 0 && JSON.stringify(storedElim) !== JSON.stringify(elimEvents.map((e) => e.count)));

  const { winner: trapWinner } = runSim(names, isMultipleOnly);
  const trapChoice =
    trapWinner && trapWinner !== winner
      ? (problem.choices ?? []).find((c) => String(c.text).trim().toLowerCase() === trapWinner.trim().toLowerCase())
      : undefined;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const isSetup = step === 0;
  const isSimulate = !isSetup && !isFinal;

  const W = 340;
  const H = 300;
  const cx0 = W / 2;
  const cy0 = 128;
  const R = 84;
  const n = Math.max(names.length, 1);
  const seat = (i: number) => {
    const rad = ((-90 + (i * 360) / n) * Math.PI) / 180;
    return { x: cx0 + R * Math.cos(rad), y: cy0 + R * Math.sin(rad) };
  };

  // walking token timing: quick hops, longer pause on an elimination
  const durations = events.map((e) => (e.eliminated ? 0.5 : 0.09));
  const totalDur = durations.reduce((a, b) => a + b, 0) || 1;
  let acc = 0;
  const startTimes = durations.map((d) => {
    const t = acc;
    acc += d;
    return t;
  });
  const elimDelay = new Map<number, { delay: number; count: number }>();
  events.forEach((e, k) => {
    if (e.eliminated) elimDelay.set(e.origIndex, { delay: startTimes[k] + durations[k] * 0.45, count: e.count });
  });

  const winnerIndex = names.findIndex((nm) => nm === winner);

  const caption = mismatch
    ? `check: simulation gives ${winner}, expected ${storedWinner}`
    : isFinal
    ? `${winner} is the only student left`
    : isSimulate
    ? "walk the circle, removing whoever lands on a special count"
    : `special counts contain a 7 or are a multiple of 7: ${elimEvents.map((e) => e.count).join(", ")}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {names.map((nm, i) => {
          const p = seat(i);
          const elim = elimDelay.get(i);
          const showEliminated = (isSimulate && !!elim) || (isFinal && i !== winnerIndex);
          const isWinner = isFinal && i === winnerIndex;
          return (
            <g key={nm}>
              <motion.g
                initial={{ opacity: 1, scale: 1 }}
                animate={
                  isSetup
                    ? { opacity: 1, scale: 1 }
                    : showEliminated
                    ? { opacity: 0.18, scale: 0.82 }
                    : isWinner
                    ? { opacity: 1, scale: 1.15 }
                    : { opacity: 1, scale: 1 }
                }
                transition={isSimulate && elim ? { delay: elim.delay, duration: 0.35 } : { type: "spring", stiffness: 240, damping: 18 }}
                style={{ transformBox: "fill-box", transformOrigin: `${p.x}px ${p.y}px` }}
              >
                {isWinner && (
                  <motion.circle
                    cx={p.x}
                    cy={p.y}
                    r={22}
                    fill="none"
                    stroke={WIN}
                    strokeWidth={2.4}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 220, damping: 14 }}
                    style={{ transformBox: "fill-box", transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                )}
                <circle cx={p.x} cy={p.y} r={16} fill={PALETTE[i % PALETTE.length]} />
                <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                  {nm[0]}
                </text>
              </motion.g>
              <text x={p.x} y={p.y + 30} textAnchor="middle" fontSize="10" fontWeight="700" fill={isWinner ? WIN : "#94a3b8"} fontFamily={numberFont}>
                {nm}
              </text>
              <AnimatePresence>
                {isSimulate && elim && (
                  <motion.g key={`tag-${nm}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: elim.delay }}>
                    <text x={p.x} y={p.y - 24} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                      out @ {elim.count}
                    </text>
                  </motion.g>
                )}
              </AnimatePresence>
            </g>
          );
        })}

        {/* the counting token, walking seat to seat */}
        <AnimatePresence>
          {isSimulate && events.length > 0 && (
            <motion.circle
              key="token"
              r={7}
              fill={MARK}
              stroke="#fff"
              strokeWidth={1.6}
              initial={{ cx: seat(events[0].origIndex).x, cy: seat(events[0].origIndex).y, opacity: 0 }}
              animate={{
                cx: events.map((e) => seat(e.origIndex).x),
                cy: events.map((e) => seat(e.origIndex).y),
                opacity: 1,
              }}
              transition={{ duration: totalDur, times: startTimes.map((t) => t / totalDur), ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* elimination-number chips, setup step only */}
        {isSetup && (
          <g>
            {elimEvents.map((e, i) => (
              <motion.g
                key={e.count}
                initial={{ opacity: 0, scale: 0.4, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.3 + i * 0.12 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <rect x={30 + i * 58} y={252} width={48} height={26} rx={13} fill="#fee2e2" stroke={BAD} strokeWidth={1.4} />
                <text x={30 + i * 58 + 24} y={252 + 17} textAnchor="middle" fontSize="12" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                  {e.count}
                </text>
              </motion.g>
            ))}
          </g>
        )}
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: mismatch ? "#991b1b" : isFinal ? "#166534" : "#4338ca",
          background: mismatch ? "#fee2e2" : isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${mismatch ? "#fecaca" : isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && trapChoice && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 10.5, fontWeight: 700, color: BAD, textAlign: "center", maxWidth: 320 }}
          >
            Forgetting the "contains a 7" rule (using only multiples of 7) eliminates {winner} too, leaving {trapWinner} ({trapChoice.label}) instead.
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.35 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
