import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

const CX = 150;
const CY = 68;
const R = 54;
const SPOKE_LEN = 44;
const ICON_R = 64;

function pointAt(deg: number, r: number) {
  const t = (deg * Math.PI) / 180;
  return { x: CX + r * Math.sin(t), y: CY - r * Math.cos(t) };
}

/** A tiny swaddled baby: blanket + head. */
function BabyIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <ellipse cx={cx} cy={cy + 2.5} rx={6} ry={4.5} fill="#7dd3fc" stroke="#0284c7" strokeWidth={0.6} />
      <circle cx={cx} cy={cy - 3} r={4} fill="#fde7c9" stroke="#d99a5b" strokeWidth={0.6} />
    </g>
  );
}

/** A tiny tombstone: rounded top + cross. */
function TombIcon({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <path d={`M ${cx - 5} ${cy + 5} L ${cx - 5} ${cy - 1} A 5 5 0 0 1 ${cx + 5} ${cy - 1} L ${cx + 5} ${cy + 5} Z`} fill="#cbd5e1" stroke="#64748b" strokeWidth={0.7} />
      <line x1={cx} y1={cy - 3.5} x2={cx} y2={cy + 1.5} stroke="#64748b" strokeWidth={1.2} />
      <line x1={cx - 2.5} y1={cy - 1} x2={cx + 2.5} y2={cy - 1} stroke="#64748b" strokeWidth={1.2} />
    </g>
  );
}

/**
 * A day-rate compounded into a year, then rounded. Five beats: (0) a 24-hour
 * dial sweeps three spokes into place — one every `hoursPerBirth` — each
 * landing a baby; (1) a tombstone lands and the birth/death ledger nets to
 * +2/day; (2) a "× days" pill compounds that into a year total; (3) a marker
 * slides to the total's spot on a number line built from the answer choices
 * and snaps to the nearest one, with both distances labelled; (4) the badge.
 * Data: { hoursPerBirth, deathsPerDay, days }.
 */
export function NetRateYearScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const hoursPerBirth = num(data.hoursPerBirth, 8);
  const deathsPerDay = num(data.deathsPerDay, 1);
  const days = num(data.days, 365);

  const birthsPerDay = 24 / hoursPerBirth;
  const net = birthsPerDay - deathsPerDay;
  const yearTotal = net * days;

  const choiceVals = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(c.text) }))
    .filter((c) => Number.isFinite(c.value))
    .sort((a, b) => a.value - b.value);
  const lo = choiceVals[0]?.value ?? 0;
  const hi = choiceVals[choiceVals.length - 1]?.value ?? 100;
  const trackX0 = 40;
  const trackX1 = 260;
  const xAt = (v: number) => trackX0 + ((v - lo) / (hi - lo || 1)) * (trackX1 - trackX0);

  let nearest = choiceVals[0] ?? null;
  let bestDiff = Infinity;
  for (const c of choiceVals) {
    const d = Math.abs(c.value - yearTotal);
    if (d < bestDiff) {
      bestDiff = d;
      nearest = c;
    }
  }
  const below = choiceVals.filter((c) => c.value <= yearTotal).slice(-1)[0] ?? choiceVals[0];
  const above = choiceVals.find((c) => c.value >= yearTotal) ?? choiceVals[choiceVals.length - 1];

  const last = totalSteps - 1;
  const showNet = step >= 1;
  const showYear = step >= 2;
  const showLine = step >= 3;
  const isFinal = step >= last;

  const W = 300;
  const H = 300;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {/* 24-hour dial */}
        <circle cx={CX} cy={CY} r={R} fill="#fff" stroke={INK} strokeWidth={2.2} />
        <circle cx={CX} cy={CY} r={2.4} fill={INK} />
        {[0, 1, 2].map((k) => {
          const angle = (k + 1) * (360 / (24 / hoursPerBirth));
          const hourLabel = (k + 1) * hoursPerBirth;
          const iconPos = pointAt(angle, ICON_R);
          const labelPos = pointAt(angle, ICON_R + 11);
          const delay = k * 0.32;
          const spokeTip = pointAt(angle, SPOKE_LEN);
          return (
            <g key={k}>
              <motion.line
                x1={CX}
                y1={CY}
                stroke="#94a3b8"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ x2: CX, y2: CY - SPOKE_LEN, opacity: 0 }}
                animate={{ x2: spokeTip.x, y2: spokeTip.y, opacity: 1 }}
                transition={{ type: "spring", stiffness: 70, damping: 13, delay }}
              />
              <motion.g
                initial={{ opacity: 0, scale: 0.2 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 320, damping: 15, delay: delay + 0.35 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              >
                <BabyIcon cx={iconPos.x} cy={iconPos.y} />
              </motion.g>
              <text x={labelPos.x} y={labelPos.y + 3} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                {hourLabel}h
              </text>
            </g>
          );
        })}
        <motion.text
          x={CX}
          y={140}
          textAnchor="middle"
          fontSize="11"
          fontWeight="800"
          fill={MARK}
          fontFamily={numberFont}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          24 ÷ {hoursPerBirth} = {birthsPerDay} births/day
        </motion.text>

        {/* ledger: births, death, net */}
        <g>
          <rect x={62} y={152} width={38} height={18} rx={9} fill="#eef2ff" stroke={MARK} strokeWidth={1} />
          <text x={81} y={164.5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
            +{birthsPerDay}
          </text>
        </g>
        <AnimatePresence>
          {showNet && (
            <motion.g key="death" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
              <TombIcon cx={116} cy={161} />
              <rect x={128} y={152} width={38} height={18} rx={9} fill="#fee2e2" stroke={BAD} strokeWidth={1} />
              <text x={147} y={164.5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                −{deathsPerDay}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showNet && (
            <motion.g key="net" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.2 }}>
              <rect x={194} y={152} width={62} height={18} rx={9} fill="#dcfce7" stroke={WIN} strokeWidth={1} />
              <text x={225} y={164.5} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                +{net}/day
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* year scaling */}
        <AnimatePresence>
          {showYear && (
            <motion.g key="year" initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <rect x={CX - 42} y={182} width={84} height={16} rx={8} fill="#eef2ff" stroke={MARK} strokeWidth={1} />
              <text x={CX} y={193.5} textAnchor="middle" fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                × {days} days
              </text>
            </motion.g>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showYear && (
            <motion.text
              key="yearTotal"
              x={CX}
              y={213}
              textAnchor="middle"
              fontSize="14"
              fontWeight="800"
              fill={INK}
              fontFamily={numberFont}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.5 }}
            >
              {net} × {days} = {yearTotal}
            </motion.text>
          )}
        </AnimatePresence>

        {/* number line built from the actual choices */}
        <AnimatePresence>
          {showLine && (
            <motion.g key="line" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={trackX0} y1={228} x2={trackX1} y2={228} stroke="#cbd5e1" strokeWidth={2} />
              {choiceVals.map((c) => {
                const x = xAt(c.value);
                const isNearest = isFinal && c.value === nearest?.value;
                return (
                  <g key={c.label}>
                    <line x1={x} y1={223} x2={x} y2={233} stroke={isNearest ? WIN : "#94a3b8"} strokeWidth={isNearest ? 2.6 : 1.6} />
                    <text x={x} y={244} textAnchor="middle" fontSize="8.5" fontWeight={isNearest ? 800 : 700} fill={isNearest ? WIN : "#64748b"} fontFamily={numberFont}>
                      {c.value}
                    </text>
                  </g>
                );
              })}
              <motion.g
                key="marker"
                initial={{ x: xAt(yearTotal), opacity: 0 }}
                animate={{ x: isFinal ? xAt(nearest?.value ?? yearTotal) : xAt(yearTotal), opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 16, delay: isFinal ? 0.5 : 0.1 }}
              >
                <circle cy={228} r={5} fill={MARK} stroke="#fff" strokeWidth={1.2} />
                <text y={218} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                  {yearTotal}
                </text>
              </motion.g>
              {below && above && below.value !== above.value && (
                <text x={(xAt(below.value) + xAt(above.value)) / 2} y={256} textAnchor="middle" fontSize="8.5" fontWeight="700" fill="#64748b" fontFamily={numberFont}>
                  {Math.abs(yearTotal - below.value)} away vs {Math.abs(above.value - yearTotal)} away
                </text>
              )}
            </motion.g>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer ?? answerOf(problem)} cx={CX} y={showLine ? 264 : 234} width={80} />
      </svg>
    </div>
  );
}
