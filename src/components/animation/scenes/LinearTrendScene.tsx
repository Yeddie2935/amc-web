import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const AXIS = "#cbd5e1";
const MARK = "#4338ca";
const RUN = "#0d9488";
const RISE = "#f59e0b";
const WIN = "#16a34a";
const BAD = "#dc2626";

const tidy = (v: number) => (Number.isInteger(v) ? String(v) : String(Number(v.toFixed(4))));

/**
 * A quantity growing at a steady rate per year, read off a real chart: the
 * starting reading is plotted, the span of years is bracketed along the bottom,
 * the trend line climbs at the given rate while the total rise is bracketed up
 * the side, and the endpoint is rounded to the asked precision. It is a slope
 * triangle drawn on the graph the numbers came from — the run is the number of
 * years, the rise is rate x run, and the answer is start + rise. Span, rise, the
 * exact endpoint and its rounding are all computed, and the result is checked
 * against the stored answer.
 * Data: { startYear, startValue, rate, endYear, unit?, label?, icon? }.
 */
export function LinearTrendScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const y0 = Math.round(num(data.startYear, 0));
  const y1 = Math.round(num(data.endYear, y0 + 1));
  const v0 = num(data.startValue, 0);
  const rate = num(data.rate, 0);
  const unit = data.unit != null ? String(data.unit) : "";
  const label = data.label != null ? String(data.label) : "";
  const icon = data.icon != null ? String(data.icon) : "";

  const span = y1 - y0;
  const rise = span * rate;
  const exact = v0 + rise;
  const rounded = Math.round(exact);
  const agrees = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - rounded) < 1e-9;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showRun = isFinal || step >= 1;
  const showLine = isFinal || step >= 2;

  // ---- geometry ----
  const W = 340;
  const H = 200;
  const padL = 44;
  const padR = 20;
  const padT = 26;
  const plotH = 118;
  const plotW = W - padL - padR;
  const lo = Math.min(v0, exact);
  const hi = Math.max(v0, exact);
  const pad = Math.max(6, (hi - lo) * 0.18);
  const yMin = Math.floor((lo - pad) / 10) * 10;
  const yMax = Math.ceil((hi + pad) / 10) * 10;
  const X = (yr: number) => padL + ((yr - y0) / (span || 1)) * plotW;
  const Y = (v: number) => padT + ((yMax - v) / (yMax - yMin || 1)) * plotH;
  const baseY = padT + plotH;

  // ticks on decade boundaries when the span is long enough to want them
  const xStep = span >= 40 ? 10 : span >= 8 ? 5 : 1;
  const xTicks: number[] = [];
  for (let t = y0; t <= y1; t += xStep) xTicks.push(t);
  if (xTicks[xTicks.length - 1] !== y1) xTicks.push(y1);
  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax; v += 20) yTicks.push(v);

  const caption = isFinal
    ? `${tidy(v0)} + ${tidy(rise)} = ${tidy(exact)} → ${rounded} ${unit}`
    : step === 0
    ? `${tidy(v0)} ${unit} in ${y0}`
    : !showLine
    ? `${y1} − ${y0} = ${span} years`
    : `${span} × ${tidy(rate)} = ${tidy(rise)} ${unit} of rise`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        {label && (
          <text x={padL} y={14} fontSize="10.5" fontWeight="800" fill="#94a3b8" fontFamily={numberFont}>
            {label} {unit && `(${unit})`}
          </text>
        )}

        {/* axes */}
        {yTicks.map((v) => (
          <g key={`y${v}`}>
            <line x1={padL} y1={Y(v)} x2={padL + plotW} y2={Y(v)} stroke={AXIS} strokeWidth={0.8} strokeDasharray="2 3" />
            <text x={padL - 6} y={Y(v) + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
              {v}
            </text>
          </g>
        ))}
        <line x1={padL} y1={padT} x2={padL} y2={baseY} stroke={AXIS} strokeWidth={1.4} />
        <line x1={padL} y1={baseY} x2={padL + plotW} y2={baseY} stroke={AXIS} strokeWidth={1.4} />
        {xTicks.map((t) => (
          <text key={`x${t}`} x={X(t)} y={baseY + 13} textAnchor="middle" fontSize="9" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
            {t}
          </text>
        ))}

        {/* the run: how many years the trend has to cover */}
        <AnimatePresence>
          {showRun && (
            <motion.g key="run" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={X(y0)}
                y1={Y(v0)}
                x2={X(y1)}
                y2={Y(v0)}
                stroke={RUN}
                strokeWidth={2.2}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6 }}
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
                <rect x={(X(y0) + X(y1)) / 2 - 32} y={Y(v0) + 4} width={64} height={15} rx={7} fill="#ccfbf1" stroke={RUN} strokeWidth={1.2} />
                <text x={(X(y0) + X(y1)) / 2} y={Y(v0) + 15} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#0f766e" fontFamily={numberFont}>
                  {span} years
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the rise: rate x run, bracketed up the far side */}
        <AnimatePresence>
          {showLine && (
            <motion.g key="rise" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.line
                x1={X(y1)}
                y1={Y(v0)}
                x2={X(y1)}
                y2={Y(exact)}
                stroke={RISE}
                strokeWidth={2.2}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              />
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
                <rect x={X(y1) - 74} y={(Y(v0) + Y(exact)) / 2 - 8} width={68} height={16} rx={7} fill="#fef3c7" stroke={RISE} strokeWidth={1.2} />
                <text x={X(y1) - 40} y={(Y(v0) + Y(exact)) / 2 + 4} textAnchor="middle" fontSize="9.5" fontWeight="800" fill="#92400e" fontFamily={numberFont}>
                  +{tidy(rise)}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the trend itself, climbing at the given rate */}
        <AnimatePresence>
          {showLine && (
            <motion.path
              key="line"
              d={`M ${X(y0)},${Y(v0)} L ${X(y1)},${Y(exact)}`}
              fill="none"
              stroke={MARK}
              strokeWidth={3}
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>

        {/* the reading travelling along the trend */}
        <AnimatePresence>
          {showLine && (
            <motion.g
              key="dot"
              initial={{ x: X(y0) - X(y1), y: Y(v0) - Y(exact), opacity: 0 }}
              animate={{ x: 0, y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
            >
              <circle cx={X(y1)} cy={Y(exact)} r={5} fill={MARK} stroke="#fff" strokeWidth={1.6} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* where the record starts */}
        <motion.g
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 16 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        >
          <circle cx={X(y0)} cy={Y(v0)} r={5} fill={INK} stroke="#fff" strokeWidth={1.6} />
          {icon && (
            <text x={X(y0) + 11} y={Y(v0) - 9} textAnchor="middle" fontSize="13">
              {icon}
            </text>
          )}
          <text x={X(y0) + 8} y={Y(v0) + 13} fontSize="9.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
            {tidy(v0)}
          </text>
        </motion.g>

        {/* the endpoint, exact then rounded */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="end" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={X(y1) - 80} y={Y(exact) - 26} width={80} height={17} rx={7} fill="#dcfce7" stroke={WIN} strokeWidth={1.6} />
              <text x={X(y1) - 40} y={Y(exact) - 14} textAnchor="middle" fontSize="10" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                {tidy(exact)} → {rounded}
              </text>
            </motion.g>
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
          color: isFinal ? "#166534" : showLine ? "#92400e" : showRun ? "#0f766e" : "#4338ca",
          background: isFinal ? "#dcfce7" : showLine ? "#fef3c7" : showRun ? "#ccfbf1" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showLine ? "#fde68a" : showRun ? "#99f6e4" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      <AnimatePresence>
        {showLine && !isFinal && (
          <motion.span
            key="rate"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            the slope is {tidy(rate)} {unit} per year
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees ? `a steady ${tidy(rate)} a year for ${span} years` : `computed ${rounded}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.6 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
