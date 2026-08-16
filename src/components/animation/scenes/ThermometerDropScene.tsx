import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MERC = "#ef4444";
const GUST = "#f59e0b";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const GLASS = "#e2e8f0";

const W = 340;
const H = 205;
const TX = 60; // tube left
const TW = 24;
const TOP = 26;
const BOT = 166;
const BULB = { x: TX + TW / 2, y: 182, r: 15 };

const tidy = (v: number) => String(Number(v.toFixed(4)));

/** One wind swoosh, drawn at the origin. */
function Gust({ w = 13, color = GUST }: { w?: number; color?: string }) {
  return (
    <g>
      <path d={`M 0 0 q ${w / 3} -3 ${(w * 2) / 3} 0 q ${w / 3} 3 ${w / 3} 0`} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
      <path d={`M 1 4.5 q ${w / 3} -3 ${(w * 2) / 3} 0`} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  );
}

/**
 * A reading pulled down at a fixed rate per unit of something else — the wind
 * chill shape: what you feel is the air temperature minus 0.7° for every mph of
 * wind. Drawn as a real thermometer, so the multiplication is repeated
 * subtraction you can watch: one gust arrives and bites 0.7° off the column,
 * then the rest arrive and the drop band ends up striped into exactly as many
 * slices as there are mph. The closing beat swaps the plain scale for the answer
 * choices as ticks and measures the gap to the two nearest, because the question
 * asks which is *closest* — the rounding is the last step, not an afterthought.
 * The drop, the result, the nearest choice and its margin are all computed, and
 * the scene flags a tie or a mismatch with the stored answer.
 * Data: { base, rate, amount, unit?, amountUnit?, baseLabel?, amountLabel? }.
 */
export function ThermometerDropScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const base = num(data.base, 36);
  const rate = num(data.rate, 0.7);
  const amount = Math.round(num(data.amount, 18));
  const unit = data.unit != null ? String(data.unit) : "°F";
  const amountUnit = data.amountUnit != null ? String(data.amountUnit) : "mph";
  const baseLabel = data.baseLabel != null ? String(data.baseLabel) : "air temperature";
  const amountLabel = data.amountLabel != null ? String(data.amountLabel) : "wind";

  const drop = Number((rate * amount).toFixed(6));
  const result = Number((base - drop).toFixed(6));

  // the answer choices themselves are the scale at the end
  const opts = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[^\d.-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const ranked = [...opts].sort((a, b) => Math.abs(a.value - result) - Math.abs(b.value - result));
  const best = ranked[0];
  const runnerUp = ranked[1];
  const tied = best && runnerUp && Math.abs(Math.abs(best.value - result) - Math.abs(runnerUp.value - result)) < 1e-9;
  const agrees = !best || !problem.answer || best.label === problem.answer;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const gustsIn = isFinal ? amount : step === 0 ? 0 : step === 1 ? 1 : amount;
  const shown = Number((base - rate * gustsIn).toFixed(6));

  // scale: wide enough for every choice and both readings
  const vals = [base, result, ...opts.map((o) => o.value)];
  const lo = Math.floor((Math.min(...vals) - 3) / 5) * 5;
  const hi = Math.ceil((Math.max(...vals) + 3) / 5) * 5;
  const yOf = (t: number) => BOT - ((t - lo) / (hi - lo)) * (BOT - TOP);

  const ticks: { v: number; label: string; hot?: boolean }[] = isFinal
    ? opts.map((o) => ({ v: o.value, label: `${o.label}) ${o.value}`, hot: o.label === best?.label }))
    : Array.from({ length: Math.floor((hi - lo) / 5) + 1 }, (_, i) => ({ v: lo + i * 5, label: String(lo + i * 5) }));

  const caption =
    step === 0
      ? `the ${baseLabel} is ${base}${unit}, but the ${amountLabel} is blowing at ${amount} ${amountUnit}`
      : step === 1
      ? `every ${amountUnit.replace(/s$/, "")} of ${amountLabel} takes ${rate}${unit} off what you feel`
      : !isFinal
      ? `all ${amount} of them: ${amount} × ${rate} = ${tidy(drop)}${unit} gone`
      : `the air is ${base}${unit}, but the ${amountLabel} makes it feel like ${tidy(result)}${unit}`;

  const panelX = 142; // clear of the reading chip, which rides the column

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* scale */}
        {ticks.map((t) => (
          <motion.g key={`${isFinal}-${t.v}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: isFinal ? 0.9 : 0.1 }}>
            <line x1={TX - 12} y1={yOf(t.v)} x2={TX - 2} y2={yOf(t.v)} stroke={t.hot ? WIN : "#94a3b8"} strokeWidth={t.hot ? 2 : 1} />
            <text
              x={TX - 15}
              y={yOf(t.v) + 3.5}
              textAnchor="end"
              fontSize={t.hot ? 10.5 : 9}
              fontWeight={t.hot ? 800 : 700}
              fill={t.hot ? WIN : "#94a3b8"}
              fontFamily={numberFont}
            >
              {t.label}
            </text>
          </motion.g>
        ))}

        {/* glass */}
        <rect x={TX} y={TOP} width={TW} height={BOT - TOP + 10} rx={TW / 2} fill={GLASS} stroke={INK} strokeWidth={1.4} />
        <circle cx={BULB.x} cy={BULB.y} r={BULB.r} fill={GLASS} stroke={INK} strokeWidth={1.4} />

        {/* what the wind took, striped one slice per unit */}
        <AnimatePresence>
          {gustsIn > 0 && (
            <motion.g key="band" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.rect
                x={TX + 3}
                width={TW - 6}
                fill={GUST}
                opacity={0.85}
                initial={{ y: yOf(base), height: 0 }}
                animate={{ y: yOf(base), height: yOf(shown) - yOf(base) }}
                transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.3 }}
              />
              {Array.from({ length: gustsIn }).map((_, i) => (
                <motion.line
                  key={i}
                  x1={TX + 3}
                  y1={yOf(base - rate * (i + 1))}
                  x2={TX + TW - 3}
                  y2={yOf(base - rate * (i + 1))}
                  stroke="#fff"
                  strokeWidth={0.7}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + i * 0.035 }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the mercury */}
        <motion.rect
          x={TX + 3}
          width={TW - 6}
          fill={MERC}
          initial={{ y: yOf(base), height: BOT + 8 - yOf(base) }}
          animate={{ y: yOf(shown), height: BOT + 8 - yOf(shown) }}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.3 }}
        />
        <circle cx={BULB.x} cy={BULB.y} r={BULB.r - 3} fill={MERC} />

        {/* the reading, riding the top of the column */}
        <motion.g
          initial={{ y: yOf(base) }}
          animate={{ y: yOf(shown) }}
          transition={{ type: "spring", stiffness: 70, damping: 18, delay: 0.3 }}
        >
          <rect x={TX + TW + 4} y={-9} width={46} height={18} rx={9} fill="#fff" stroke={isFinal ? WIN : MERC} strokeWidth={1.4} />
          <text x={TX + TW + 27} y={4} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={isFinal ? WIN : MERC} fontFamily={numberFont}>
            {tidy(shown)}{unit}
          </text>
        </motion.g>

        {/* the gusts arriving, one per unit of wind */}
        <AnimatePresence>
          {step >= 1 && !isFinal && (
            <motion.g key="gusts" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={panelX} y={40} fontSize="10" fontWeight="800" fill={MARK} fontFamily={numberFont}>
                {gustsIn} {amountUnit} of {amountLabel}
              </text>
              {Array.from({ length: gustsIn }).map((_, i) => (
                <motion.g
                  key={i}
                  initial={{ x: 150, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 160, damping: 18, delay: 0.35 + i * 0.045 }}
                >
                  <g transform={`translate(${panelX + (i % 9) * 17} ${56 + Math.floor(i / 9) * 22})`}>
                    <Gust />
                    {gustsIn === 1 && (
                      <text x={6.5} y={18} textAnchor="middle" fontSize="8" fontWeight="700" fill={GUST} fontFamily={numberFont}>
                        {rate}
                      </text>
                    )}
                  </g>
                </motion.g>
              ))}
              <motion.text
                x={panelX}
                y={gustsIn > 9 ? 112 : 96}
                fontSize="13"
                fontWeight="800"
                fill={GUST}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 15, delay: 0.4 + gustsIn * 0.045 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {gustsIn} × {rate} = {tidy(Number((rate * gustsIn).toFixed(6)))}{unit}
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* how close the choices are */}
        <AnimatePresence>
          {isFinal && best && (
            <motion.g key="fin" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.text
                x={panelX}
                y={44}
                fontSize="12.5"
                fontWeight="800"
                fill={MARK}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {base} − {tidy(drop)} = {tidy(result)}
              </motion.text>
              {ranked.slice(0, 2).map((o, i) => (
                <motion.g key={o.label} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18, delay: 1.1 + i * 0.3 }}>
                  <text x={panelX} y={72 + i * 20} fontSize="11" fontWeight="800" fill={i === 0 ? WIN : "#94a3b8"} fontFamily={numberFont}>
                    ({o.label}) {o.value} is {tidy(Math.abs(o.value - result))} away
                  </text>
                </motion.g>
              ))}
              <motion.text
                x={panelX}
                y={118}
                fontSize="12"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.8 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                closest: {best.value}
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
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees && !tied ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {tied
              ? `${tidy(result)} sits exactly between two choices`
              : agrees
              ? `${amount} bites of ${rate} came to ${tidy(drop)}; ${tidy(result)} beats the runner-up by ${tidy(Math.abs(runnerUp.value - result) - Math.abs(best.value - result))}`
              : `this lands on (${best.label}), not the stored answer`}
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
