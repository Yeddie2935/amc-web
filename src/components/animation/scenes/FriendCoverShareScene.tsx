import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";
const GOLD = "#eab308", GOLD_TOP = "#fde047", GOLD_EDGE = "#a16207";

function fmtMoney(value: number): string {
  const v = Math.round(value * 100) / 100;
  return `$${v % 1 === 0 ? v.toFixed(0) : v.toFixed(2)}`;
}

const ROW_Y = 42;
const FACE_R = 13;
const JUDI = 0;

/** One friend around the table: dashed/neutral while unpaid, solid/happy once their share is settled. */
function Face({ x, dashed, delay }: { x: number; dashed: boolean; delay: number }) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay }}>
      <circle cx={x} cy={ROW_Y} r={FACE_R} fill={dashed ? "#f8fafc" : "#eef2ff"} stroke={dashed ? DIM : IND} strokeWidth={dashed ? 1.6 : 1.8} strokeDasharray={dashed ? "3 3" : undefined} />
      <circle cx={x - 5} cy={ROW_Y - 3} r="1.6" fill={dashed ? DIM : IND} />
      <circle cx={x + 5} cy={ROW_Y - 3} r="1.6" fill={dashed ? DIM : IND} />
      <path d={`M ${x - 5} ${ROW_Y + 4} Q ${x} ${dashed ? ROW_Y + 3 : ROW_Y + 9} ${x + 5} ${ROW_Y + 4}`} fill="none" stroke={dashed ? DIM : IND} strokeWidth="1.6" />
    </motion.g>
  );
}

// Seven friends each chip in an extra $2.50 to cover the eighth friend's
// forgotten share; those seven chips stack into exactly one share ($17.50),
// which reveals that every one of the eight equal shares is $17.50 — so the
// bill is eight of them. Data: { friendCount, extraPayers, extraAmount }.
export function FriendCoverShareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const friendCount = Math.round(num(data.friendCount, 8));
  const extraPayers = Math.round(num(data.extraPayers, 7));
  const extraAmount = num(data.extraAmount, 2.5);

  const judiShare = extraPayers * extraAmount;
  const total = friendCount * judiShare;

  const choiceLabel = (problem.choices ?? []).find((c) => Math.abs(Number(String(c.text).replace(/[^0-9.]/g, "")) - total) < 0.005)?.label;
  const storedTotal = Number(String(problem.shortAnswer ?? "").replace(/[^0-9.]/g, ""));
  const payersOk = extraPayers === friendCount - 1;
  const totalOk = Math.abs(total - storedTotal) < 0.005;
  const ok = payersOk && totalOk && choiceLabel === problem.answer;
  const failure = !payersOk ? `need ${friendCount - 1} payers, got ${extraPayers}` : !totalOk ? `computed ${fmtMoney(total)}, stored ${problem.shortAnswer}` : `choice ${choiceLabel ?? "missing"}, stored ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const margin = 38;
  const xs = Array.from({ length: friendCount }, (_, i) => margin + (i * (460 - 2 * margin)) / (friendCount - 1));

  // Phase 0: the seven coins stacking into the pile
  const pileX = 230, pileBase = 172, coinH = 8, coinW = 30;
  const payerXs = xs.filter((_, i) => i !== JUDI);
  const landDelay = 0.25 + extraPayers * 0.11;

  // Phase 1+: eight equal bars, one per friend
  const barBase = 200, barH = 118, barTop = barBase - barH;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? `${extraPayers} friends each chip in an extra ${fmtMoney(extraAmount)} to cover the missing share` : phase === 1 ? "that pile equals one full share — so all eight shares are equal" : `${friendCount} equal shares make the whole bill`}
        </text>

        {xs.map((x, i) =>
          phase === 0 && i === JUDI ? (
            <g key={i}>
              <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay: landDelay }}>
                <Face x={x} dashed delay={i * 0.05} />
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: landDelay }}>
                <Face x={x} dashed={false} delay={i * 0.05} />
              </motion.g>
            </g>
          ) : (
            <Face key={i} x={x} dashed={false} delay={i * 0.05} />
          )
        )}

        {phase === 0 && (
          <>
            {payerXs.map((x, i) => (
              <motion.g key={i} initial={{ x: x - pileX, y: ROW_Y + FACE_R + 6 - (pileBase - (i + 1) * coinH), opacity: 0 }} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 240, damping: 20, delay: 0.25 + i * 0.11 }}>
                <rect x={pileX - coinW / 2} y={pileBase - (i + 1) * coinH} width={coinW} height={coinH} rx="4" fill={GOLD} stroke={GOLD_EDGE} strokeWidth="1" />
                <ellipse cx={pileX} cy={pileBase - (i + 1) * coinH} rx={coinW / 2} ry="3.2" fill={GOLD_TOP} stroke={GOLD_EDGE} strokeWidth="0.75" />
              </motion.g>
            ))}
            <motion.text x={pileX} y="192" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: landDelay }}>
              {extraPayers} × {fmtMoney(extraAmount)} = {fmtMoney(judiShare)}
            </motion.text>
          </>
        )}

        {phase >= 1 && (
          <>
            <line x1="20" y1={barTop} x2="440" y2={barTop} stroke={IND} strokeWidth="1.3" strokeDasharray="5 4" />
            <text x="438" y={barTop - 6} textAnchor="end" fontSize="11" fontWeight="850" fill={IND} fontFamily={FONT}>{fmtMoney(judiShare)} each</text>
            {xs.map((x, i) => (
              <motion.rect key={i} x={x - 14} y={barTop} width="28" height={barH} rx="6" fill="#eef2ff" stroke={IND} strokeWidth="1.6" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: 0.15 + i * 0.05 }} style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }} />
            ))}
          </>
        )}

        {phase === 2 && (
          <>
            <text x="230" y="228" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>
              {friendCount} × {fmtMoney(judiShare)} = <tspan fill={GREEN}>{fmtMoney(total)}</tspan>
            </text>
            <text x="230" y="248" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "share, payer count, and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={258} width={110} />
          </>
        )}
      </svg>
    </div>
  );
}
