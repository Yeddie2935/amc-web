import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MERC = "#ef4444";
const GAPC = "#f59e0b";
const ROOM = "#0284c7";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GLASS = "#e2e8f0";
const MUTE = "#94a3b8";

const W = 360;
const H = 218;
const TX = 58; // tube left
const TW = 26;
const TOP = 30;
const BOT = 172;
const BULB = { x: TX + TW / 2, y: 188, r: 15 };
const PX = 186; // panel left edge

const tidy = (v: number) => String(Number(v.toFixed(4)));

/** A round-ish tick step giving roughly six divisions over the span. */
function niceStep(span: number): number {
  const raw = span / 6;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 2.5, 5, 10]) if (raw <= m * pow) return m * pow;
  return 10 * pow;
}

/** Apply f elementwise so one expression serves both a value and a keyframe run. */
function mapK(v: number | number[], f: (n: number) => number): number | number[] {
  return Array.isArray(v) ? v.map(f) : f(v);
}

/** The cup itself, drawn at the origin; steam wisps die off as it cools. */
function Mug({ wisps, delay }: { wisps: (number | number[])[]; delay: number }) {
  return (
    <g>
      {wisps.map((o, i) => (
        <motion.path
          key={i}
          d={`M ${-5 + i * 5} -9 q 3.5 -4 0 -7.5 q -3.5 -4 0 -7.5`}
          fill="none"
          stroke={MUTE}
          strokeWidth={1.3}
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: o }}
          transition={{ delay: delay + 0.1 * i }}
        />
      ))}
      <path d="M -11 -6 L 11 -6 L 8.5 8 L -8.5 8 Z" fill="#fff" stroke={INK} strokeWidth={1.4} strokeLinejoin="round" />
      <path d="M 10.5 -3 q 6.5 0 6.5 4.5 q 0 4.5 -6.5 4.5" fill="none" stroke={INK} strokeWidth={1.4} />
      <path d="M -9.6 -4.6 L 9.6 -4.6 L 8.9 -0.6 L -8.9 -0.6 Z" fill={MERC} opacity={0.8} />
    </g>
  );
}

/**
 * A cup cooling toward the room it sits in: the *difference* from the room
 * halves every so many minutes, not the temperature. The room temperature is
 * drawn as a floor line across a real thermometer, and everything above it is
 * an amber gap band — so a halving is literally the band losing half its
 * height, and the reading can never fall to the line. The second beat spends
 * itself on the slip the problem is built to catch: halving the *temperature*
 * three times sends a ghost marker straight through the room line into water
 * colder than the room it is standing in. The closing beat adds the floor back
 * on and then prices the off-by-one, since stopping a halving early and going
 * one too far are both answer choices here.
 * Gaps, readings, the naive chain and both slips are computed, and the result
 * is checked against the stored answer.
 * Data: { start, ambient, minutes, period, unit?, timeUnit? }.
 */
export function HalvingGapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 212);
  const ambient = num(data.ambient, 68);
  const period = Math.max(1e-9, num(data.period, 5));
  const minutes = num(data.minutes, 15);
  const unit = data.unit != null ? String(data.unit) : "°F";
  const timeUnit = data.timeUnit != null ? String(data.timeUnit) : "min";

  const n = Math.max(1, Math.round(minutes / period));
  const gap0 = start - ambient;
  const gaps = Array.from({ length: n + 1 }, (_, i) => gap0 / 2 ** i);
  const readings = gaps.map((g) => ambient + g);
  const result = readings[n];

  // the slip the problem is built to catch: halving the temperature itself
  const naiveChain = Array.from({ length: n + 1 }, (_, i) => start / 2 ** i);
  const naive = naiveChain[n];
  const naiveAbsurd = (gap0 > 0 && naive < ambient) || (gap0 < 0 && naive > ambient);

  // off-by-one on the number of halvings — both usually sit in the choice list
  const opts = (problem.choices ?? [])
    .map((c) => ({
      label: c.label,
      value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")),
    }))
    .filter((c) => Number.isFinite(c.value));
  const choiceAt = (v: number) => opts.find((o) => Math.abs(o.value - v) < 1e-9);
  const slips = [
    { label: `stop at ${tidy((n - 1) * period)} ${timeUnit}`, gap: gaps[n - 1], value: ambient + gaps[n - 1] },
    { label: "one halving too many", gap: gap0 / 2 ** (n + 1), value: ambient + gap0 / 2 ** (n + 1) },
  ]
    .map((s) => ({ ...s, choice: choiceAt(s.value) }))
    .filter((s) => s.choice);
  const agrees = !problem.answer || choiceAt(result)?.label === problem.answer;

  // scale: the room line well clear of the bulb, the start just under the top
  const vmin = Math.min(start, ambient, result);
  const vmax = Math.max(start, ambient, result);
  const span = vmax - vmin || 1;
  const sv = niceStep(span);
  const lo = Math.floor((vmin - span * 0.15) / sv) * sv;
  const hi = Math.ceil((vmax + span * 0.05) / sv) * sv;
  const yOf = (t: number) => BOT - ((t - lo) / (hi - lo)) * (BOT - TOP);
  const ticks = Array.from({ length: Math.floor((hi - lo) / sv) + 1 }, (_, i) => lo + i * sv);
  const yRoom = yOf(ambient);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showGhost = !isFinal && totalSteps >= 4 && step === 1;
  const showFall = !isFinal && step >= (totalSteps >= 4 ? 2 : 1);

  // the reading: parked at the start, or falling through every stage
  const times = readings.map((_, i) => i / n);
  const yRead: number | number[] = isFinal ? yOf(result) : showFall ? readings.map(yOf) : yOf(start);
  const fallT = { duration: 0.55 * n, times, ease: "easeInOut" as const, delay: 0.35 };
  const readT = showFall ? fallT : { type: "spring" as const, stiffness: 70, damping: 18, delay: 0.3 };

  const bandTop = mapK(yRead, (y) => Math.min(y, yRoom));
  const bandH = mapK(yRead, (y) => Math.abs(yRoom - y));
  const mercH = mapK(yRead, (y) => BOT + 8 - y);
  const midBand = mapK(yRead, (y) => (y + yRoom) / 2);

  // steam thins out as the gap closes — three wisps at the start, none at the end
  const steamOf = (g: number) => Math.max(0, Math.round(3 * Math.abs(g / (gap0 || 1))));
  const wispOpacity = (i: number): number | number[] =>
    showFall ? gaps.map((g) => (i < steamOf(g) ? 0.85 : 0)) : i < steamOf(isFinal ? gaps[n] : gap0) ? 0.85 : 0;

  const gapNow = isFinal ? gaps[n] : gap0;
  const showGapChip = !showFall;

  const caption = showGhost
    ? `halving the temperature would end at ${tidy(naive)}${unit} — colder than the room it is sitting in`
    : showFall
    ? `${tidy(minutes)} ${timeUnit} ÷ ${tidy(period)} = ${n} halvings of the gap: ${gaps.map((g) => tidy(g)).join(" → ")}`
    : isFinal
    ? `the water ends ${tidy(gaps[n])}${unit} above the room: ${tidy(ambient)} + ${tidy(gaps[n])} = ${tidy(result)}${unit}`
    : `the water starts ${tidy(gap0)}${unit} above the room — that gap is what halves`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {/* scale — marks only; the three levels that matter carry their own labels,
            and the strip to the left belongs to the gap chip and the naive chain */}
        {ticks.map((t) => (
          <motion.line
            key={t}
            x1={TX - 9}
            y1={yOf(t)}
            x2={TX - 2}
            y2={yOf(t)}
            stroke={MUTE}
            strokeWidth={1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          />
        ))}

        {/* glass */}
        <rect x={TX} y={TOP} width={TW} height={BOT - TOP + 12} rx={TW / 2} fill={GLASS} stroke={INK} strokeWidth={1.4} />
        <circle cx={BULB.x} cy={BULB.y} r={BULB.r} fill={GLASS} stroke={INK} strokeWidth={1.4} />

        {/* the mercury — the whole reading */}
        <motion.rect
          x={TX + 3}
          width={TW - 6}
          fill={MERC}
          opacity={showGhost ? 0.22 : 1}
          initial={{ y: BOT + 8, height: 0 }}
          animate={{ y: yRead, height: mercH }}
          transition={readT}
        />
        <circle cx={BULB.x} cy={BULB.y} r={BULB.r - 3} fill={MERC} opacity={showGhost ? 0.22 : 1} />

        {/* everything above the room line is the gap, and it is the gap that halves */}
        <motion.rect
          x={TX + 3}
          width={TW - 6}
          fill={GAPC}
          opacity={showGhost ? 0.2 : 0.95}
          initial={{ y: yRoom, height: 0 }}
          animate={{ y: bandTop, height: bandH }}
          transition={showFall ? fallT : { ...readT, delay: 0.55 }}
        />

        {/* where each halving left the top of the band — dark enough to read both
            against the amber it is cutting and against the glass it leaves behind */}
        {showFall &&
          readings.slice(1).map((r, i) => (
            <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 + 0.55 * (i + 1) }}>
              <line x1={TX - 6} y1={yOf(r)} x2={TX + TW + 6} y2={yOf(r)} stroke="#b45309" strokeWidth={1.2} strokeDasharray="3 3" />
              <text x={TX - 9} y={yOf(r) + 3.5} textAnchor="end" fontSize="9" fontWeight="800" fill="#b45309" fontFamily={numberFont}>
                {tidy(gaps[i + 1])}
              </text>
            </motion.g>
          ))}

        {/* water colder than the room — the region the naive halving lands in */}
        <AnimatePresence>
          {showGhost && (
            <motion.g key="cold" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
              <rect x={TX + 3} y={yRoom} width={TW - 6} height={BOT + 8 - yRoom} fill={BAD} opacity={0.16} />
              {naiveChain.map((v, i) => (
                <motion.text
                  key={i}
                  x={TX - 14}
                  y={yOf(v) + 3.5}
                  textAnchor="end"
                  fontSize="9.5"
                  fontWeight="800"
                  fill={i === n ? BAD : MUTE}
                  fontFamily={numberFont}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.5 }}
                >
                  {tidy(v)}
                </motion.text>
              ))}
              <motion.g
                initial={{ y: yOf(naiveChain[0]) }}
                animate={{ y: naiveChain.map(yOf) }}
                transition={{ duration: 0.55 * n, times, ease: "easeInOut", delay: 0.3 }}
              >
                <line x1={TX - 6} y1={0} x2={TX + TW + 6} y2={0} stroke={BAD} strokeWidth={2} strokeDasharray="4 3" />
                <circle cx={TX + TW + 10} cy={0} r={3.5} fill={BAD} />
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the room is a floor, not a target */}
        <line x1={TX - 14} y1={yRoom} x2={TX + TW + 74} y2={yRoom} stroke={ROOM} strokeWidth={1.6} strokeDasharray="5 4" />
        <text x={TX + TW + 8} y={yRoom + 13} fontSize="9.5" fontWeight="800" fill={ROOM} fontFamily={numberFont}>
          room {tidy(ambient)}{unit}
        </text>

        {/* the cup, riding the reading */}
        <motion.g initial={{ y: BOT }} animate={{ y: yRead }} transition={readT}>
          <g transform={`translate(${TX + TW + 20} 0)`}>
            <Mug wisps={[0, 1, 2].map(wispOpacity)} delay={showFall ? 0.35 : 0.6} />
          </g>
          <rect x={TX + TW + 38} y={-9} width={48} height={18} rx={9} fill="#fff" stroke={isFinal ? WIN : MERC} strokeWidth={1.4} />
          <text
            x={TX + TW + 62}
            y={4}
            textAnchor="middle"
            fontSize="10.5"
            fontWeight="800"
            fill={isFinal ? WIN : MERC}
            fontFamily={numberFont}
          >
            {tidy(isFinal ? result : showFall ? result : start)}{unit}
          </text>
        </motion.g>

        {/* how big the gap is right now */}
        <AnimatePresence>
          {showGapChip && !showGhost && (
            <motion.g key="gapchip" initial={{ y: midBand }} animate={{ y: midBand }} transition={readT}>
              <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.8 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x={2} y={-9} width={46} height={18} rx={5} fill="#fff" stroke={GAPC} strokeWidth={1.4} />
                <line x1={48} y1={0} x2={TX - 10} y2={0} stroke={GAPC} strokeWidth={1.2} />
                <text x={25} y={4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={GAPC} fontFamily={numberFont}>
                  gap {tidy(gapNow)}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the panel */}
        <AnimatePresence mode="wait">
          {showGhost ? (
            <motion.g key="p-ghost" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={PX} y={40} fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                halve the temperature?
              </text>
              {naiveChain.map((v, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.3 + i * 0.5 }}>
                  <text x={PX + 4} y={62 + i * 20} fontSize="11.5" fontWeight="800" fill={i === n ? BAD : INK} fontFamily={numberFont}>
                    {tidy(v)}{unit}
                  </text>
                  {i > 0 && (
                    <text x={PX + 62} y={62 + i * 20} fontSize="10.5" fontWeight="700" fill={MUTE} fontFamily={numberFont}>
                      ÷ 2
                    </text>
                  )}
                </motion.g>
              ))}
              {naiveAbsurd && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 + n * 0.5 }}>
                  <text x={PX} y={72 + n * 20 + 14} fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                    that is colder than the
                  </text>
                  <text x={PX} y={72 + n * 20 + 26} fontSize="9.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                    {tidy(ambient)}{unit} room — impossible
                  </text>
                  <text x={PX} y={72 + n * 20 + 44} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
                    the room is a floor; the
                  </text>
                  <text x={PX} y={72 + n * 20 + 56} fontSize="9.5" fontWeight="800" fill={GAPC} fontFamily={numberFont}>
                    gap above it is what halves
                  </text>
                </motion.g>
              )}
            </motion.g>
          ) : showFall ? (
            <motion.g key="p-fall" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={PX} y={40} fontSize="10.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {tidy(minutes)} ÷ {tidy(period)} = {n} halvings
              </text>
              {gaps.map((g, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.35 + i * 0.55 }}>
                  <rect x={PX} y={54 + i * 22} width={11} height={11} rx={2} fill={GAPC} opacity={0.35 + 0.65 * (i / n)} />
                  <text x={PX + 18} y={64 + i * 22} fontSize="10.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                    {String(tidy(i * period)).padStart(2, " ")} {timeUnit}
                  </text>
                  <text x={PX + 82} y={64 + i * 22} fontSize="11.5" fontWeight="800" fill={GAPC} fontFamily={numberFont}>
                    gap {tidy(g)}
                  </text>
                </motion.g>
              ))}
            </motion.g>
          ) : isFinal ? (
            <motion.g key="p-fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text x={PX} y={44} fontSize="10.5" fontWeight="800" fill={GAPC} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                {tidy(gaps[n])}{unit} above the room
              </motion.text>
              <motion.text
                x={PX}
                y={70}
                fontSize="15"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.8 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {tidy(ambient)} + {tidy(gaps[n])} = {tidy(result)}
              </motion.text>
              {slips.length > 0 && (
                <motion.text x={PX} y={98} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
                  miscount the halvings:
                </motion.text>
              )}
              {slips.map((s, i) => (
                <motion.g key={s.label} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.4 + i * 0.35 }}>
                  <text x={PX} y={116 + i * 30} fontSize="9.5" fontWeight="700" fill={BAD} fontFamily={numberFont}>
                    {s.label}
                  </text>
                  <text x={PX + 8} y={128 + i * 30} fontSize="10.5" fontWeight="800" fill={BAD} fontFamily={numberFont}>
                    {tidy(ambient)} + {tidy(s.gap)} = {tidy(s.value)} ({s.choice!.label})
                  </text>
                </motion.g>
              ))}
            </motion.g>
          ) : (
            <motion.g key="p-set" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.g initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.4 }}>
                <text x={PX} y={48} fontSize="11.5" fontWeight="800" fill={MERC} fontFamily={numberFont}>
                  water {tidy(start)}{unit}
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.7 }}>
                <text x={PX} y={72} fontSize="11.5" fontWeight="800" fill={ROOM} fontFamily={numberFont}>
                  room  {tidy(ambient)}{unit}
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
                <text x={PX} y={104} fontSize="10.5" fontWeight="700" fill={INK} fontFamily={numberFont}>
                  {tidy(start)} − {tidy(ambient)}
                </text>
              </motion.g>
              <motion.text
                x={PX}
                y={130}
                fontSize="16"
                fontWeight="800"
                fill={GAPC}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.2 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                = {tidy(gap0)}{unit}
              </motion.text>
              <motion.text x={PX} y={154} fontSize="9.5" fontWeight="800" fill={MUTE} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
                this gap is what halves
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : showGhost ? "#991b1b" : "#4338ca",
          background: isFinal ? "#dcfce7" : showGhost ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showGhost ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? MUTE : BAD, textAlign: "center" }}
          >
            {agrees
              ? `${n} halvings took the gap ${tidy(gap0)} → ${tidy(gaps[n])}; the water never reaches the room's ${tidy(ambient)}${unit}`
              : `this lands on ${tidy(result)}${unit}, not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 2.1 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
