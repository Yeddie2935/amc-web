import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const SEAT = "#4338ca";
const NEW = "#16a34a";

interface Round {
  players: number;
  per: number;
}

/** A player figure; newcomers are drawn in green with a "new" tag. */
function Person({ isNew }: { isNew: boolean }) {
  const c = isNew ? NEW : SEAT;
  return (
    <g>
      <circle cx={0} cy={-8} r={6.5} fill="none" stroke={c} strokeWidth={2.2} />
      <path d="M -9,10 C -9,1 -4.5,-1 0,-1 C 4.5,-1 9,1 9,10" fill="none" stroke={c} strokeWidth={2.2} strokeLinecap="round" />
    </g>
  );
}

/**
 * Equal sharing where the *total stays fixed* but the number of shares changes:
 * a deck is dealt to n players, pooled back together, then re-dealt after more
 * players join. The total is computed from the first round (players × per) and
 * every later round's share is total ÷ players — so the inverse relationship is
 * derived, never asserted. Cards are individually animated between layouts.
 * Data: { rounds:[{players,per},{players}], unit?, icon? }.
 */
export function ShareOutScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const unit = data.unit != null ? String(data.unit) : "cards";
  const raw = Array.isArray(data.rounds) ? data.rounds : [];
  const first = (raw[0] ?? {}) as Record<string, unknown>;
  const initPlayers = Math.max(1, Math.round(num(first.players, 1)));
  const initPer = Math.max(0, Math.round(num(first.per, 0)));
  const total = initPlayers * initPer;

  const rounds: Round[] = raw.map((r) => {
    const o = (r ?? {}) as Record<string, unknown>;
    const players = Math.max(1, Math.round(num(o.players, 1)));
    const per = o.per != null ? Math.round(num(o.per, 0)) : total / players;
    return { players, per };
  });
  const finalRound = rounds[rounds.length - 1] ?? { players: initPlayers, per: initPer };
  const finalPlayers = finalRound.players;
  const finalPer = finalRound.per;
  const joined = finalPlayers - initPlayers;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  // initial deal → pooled deck (middle beats) → re-deal on the last step.
  const phase: "initial" | "deck" | "final" = isFinal ? "final" : step >= 1 ? "deck" : "initial";
  // the newcomers take their seats one beat before the re-deal
  const seats = step >= 2 || isFinal ? finalPlayers : initPlayers;

  // ---- geometry ----
  const W = 420;
  const H = 204;
  const margin = 26;
  const pileBase = 168;
  const peopleY = 40;
  const seatX = (p: number, n: number) => margin + ((p + 0.5) * (W - 2 * margin)) / n;

  const cardPos = (i: number) => {
    if (phase === "deck") return { x: W / 2, y: pileBase - i * 0.85 };
    const n = phase === "final" ? finalPlayers : initPlayers;
    const p = i % n; // dealt round-robin, the way you actually deal
    const k = Math.floor(i / n);
    return { x: seatX(p, n), y: pileBase - k * 3 };
  };

  const perNow = phase === "final" ? finalPer : phase === "initial" ? initPer : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 460 }}>
        {/* seats */}
        {Array.from({ length: seats }).map((_, p) => {
          const isNew = p >= initPlayers;
          return (
            <motion.g
              key={`p${p}`}
              initial={isNew ? { opacity: 0, scale: 0.4 } : false}
              animate={{ opacity: 1, scale: 1, x: seatX(p, seats), y: peopleY }}
              transition={{ type: "spring", stiffness: 180, damping: 16, delay: isNew ? 0.15 : 0 }}
            >
              <Person isNew={isNew} />
              {isNew && (
                <text x={0} y={24} textAnchor="middle" fontSize="9" fontWeight="800" fill={NEW} fontFamily={numberFont}>
                  new
                </text>
              )}
            </motion.g>
          );
        })}

        {/* the cards — the same deck throughout, just re-positioned */}
        {Array.from({ length: total }).map((_, i) => {
          const pos = cardPos(i);
          return (
            <motion.g
              key={i}
              initial={{ opacity: 0, x: W / 2, y: pileBase }}
              animate={{ opacity: 1, x: pos.x, y: pos.y }}
              transition={{
                opacity: { duration: 0.2, delay: i * 0.008 },
                default: { type: "spring", stiffness: 120, damping: 18, delay: i * 0.008 },
              }}
            >
              <rect x={-9} y={-13} width={18} height={26} rx={3} fill="#eef2ff" stroke={SEAT} strokeWidth={1.2} />
              <rect x={-6} y={-10} width={12} height={20} rx={2} fill="none" stroke={SEAT} strokeWidth={0.7} opacity={0.55} />
            </motion.g>
          );
        })}

        {/* per-pile counts, or the pooled total */}
        <AnimatePresence>
          {phase === "deck" ? (
            <motion.text
              key="deck-total"
              x={W / 2}
              y={pileBase + 28}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={SEAT}
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              {total} {unit}
            </motion.text>
          ) : (
            Array.from({ length: seats }).map((_, p) => (
              <motion.text
                key={`c${p}`}
                x={seatX(p, seats)}
                y={pileBase + 28}
                textAnchor="middle"
                fontSize="13"
                fontWeight="800"
                fill={phase === "final" ? NEW : SEAT}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.45 + p * 0.05 }}
              >
                {perNow}
              </motion.text>
            ))
          )}
        </AnimatePresence>
      </svg>

      {/* running caption */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
        <motion.span
          key={phase + seats}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 15 }}
          style={{
            fontFamily: numberFont,
            fontSize: 13,
            fontWeight: 800,
            color: phase === "final" ? "#166534" : "#4338ca",
            background: phase === "final" ? "#dcfce7" : "#eef2ff",
            border: `1px solid ${phase === "final" ? "#bbf7d0" : "#c7d2fe"}`,
            padding: "4px 12px",
            borderRadius: 999,
          }}
        >
          {phase === "initial"
            ? `${initPlayers} players × ${initPer} ${unit}`
            : phase === "deck"
            ? seats > initPlayers
              ? `${joined} more join → ${seats} players`
              : `${initPlayers} × ${initPer} = ${total} ${unit} in all`
            : `${total} ÷ ${finalPlayers} = ${finalPer} each`}
        </motion.span>
      </div>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: "#16a34a", color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            {finalPer} {unit} each → Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
