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
 * A constant-rate line read off a real graph, then extended past its plotted
 * points to a target x-value. The rate is derived from the graph's own first
 * segment, re-checked against a later segment (a real constancy check, not an
 * assertion), then the dashed line rides on past the last plotted point to
 * the target, with a bike travelling along it.
 * Data: { points:[[x,y],...], targetX, xUnit, yUnit, icon? }.
 */
export function RateGraphExtrapolateScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const rawPoints = Array.isArray(data.points) ? data.points : [];
  const points = rawPoints
    .map((p) => (Array.isArray(p) ? [num(p[0]), num(p[1])] : [0, 0]))
    .sort((a, b) => a[0] - b[0]) as [number, number][];
  const targetX = Math.max(1, num(data.targetX, 30));
  const xUnit = data.xUnit != null ? String(data.xUnit) : "min";
  const yUnit = data.yUnit != null ? String(data.yUnit) : "";
  const icon = data.icon != null ? String(data.icon) : "🚲";

  const p0 = points[0] ?? [0, 0];
  const p1 = points[1] ?? [1, 1];
  const pN2 = points[points.length - 2] ?? p0;
  const pN1 = points[points.length - 1] ?? p1;

  const rate = (p1[1] - p0[1]) / (p1[0] - p0[0] || 1);
  const checkRate = (pN1[1] - pN2[1]) / (pN1[0] - pN2[0] || 1);
  const consistent = Math.abs(rate - checkRate) < 1e-9;
  const target = rate * targetX;
  const matches = problem.shortAnswer == null || Math.abs(Number(problem.shortAnswer) - target) < 1e-9;
  const failure = !consistent
    ? `check failed: slope ${tidy(rate)} from the first segment does not match ${tidy(checkRate)} from the last segment`
    : !matches
    ? `check failed: ${tidy(target)} does not match the stored answer ${problem.shortAnswer}`
    : "";

  const lastStep = totalSteps - 1;
  const showFirst = step >= 1;
  const showCheck = step >= 2;
  const showExt = step >= 3;
  const isFinal = step >= lastStep;

  // ---- geometry ----
  const W = 380;
  const H = 280;
  const padL = 40;
  const padT = 20;
  const plotH = 170;
  const plotW = W - padL - 16;
  const lastGraphed = pN1[0];
  const lastGraphedY = pN1[1];
  const xMax = Math.max(targetX, lastGraphed) * 1.08;
  const yMax = Math.max(target, lastGraphedY) * 1.15;
  const baseY = padT + plotH;
  const X = (x: number) => padL + (x / xMax) * plotW;
  const Y = (y: number) => baseY - (y / yMax) * plotH;

  const xStep = points.length > 1 ? points[1][0] - points[0][0] : 5;
  const xTicks: number[] = [];
  for (let t = 0; t <= xMax; t += xStep) xTicks.push(Math.round(t));
  const yTicks: number[] = [];
  const yStep = Math.max(1, Math.round(yMax / 6));
  for (let v = 0; v <= yMax; v += yStep) yTicks.push(Math.round(v));

  const caption = isFinal
    ? `${targetX} × ${tidy(rate)} = ${tidy(target)} ${yUnit}`
    : showExt
    ? `extend the line to ${targetX} ${xUnit}`
    : showCheck
    ? `${tidy(checkRate)} matches — the rate really is constant`
    : showFirst
    ? `${p1[0] - p0[0]} ${xUnit} → ${p1[1] - p0[1]} ${yUnit}, so the rate is ${tidy(rate)} ${yUnit}/${xUnit}`
    : `a straight line means a constant rate`;

  const note = failure
    ? failure
    : showExt && !isFinal
    ? `the graph only reaches ${lastGraphed} ${xUnit}, so ${targetX} ${xUnit} is read off the extended line`
    : "";

  // dashed run/rise guide between two points, teal run then amber rise
  const guide = (a: [number, number], b: [number, number], show: boolean, delay: number) => (
    <AnimatePresence>
      {show && (
        <motion.g key={`g-${a.join(",")}-${b.join(",")}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.line
            x1={X(a[0])}
            y1={Y(a[1])}
            x2={X(b[0])}
            y2={Y(a[1])}
            stroke={RUN}
            strokeWidth={2}
            strokeDasharray="4 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay }}
          />
          <motion.line
            x1={X(b[0])}
            y1={Y(a[1])}
            x2={X(b[0])}
            y2={Y(b[1])}
            stroke={RISE}
            strokeWidth={2}
            strokeDasharray="4 3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.35, delay: delay + 0.4 }}
          />
        </motion.g>
      )}
    </AnimatePresence>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        {/* axes */}
        <line x1={padL} y1={padT} x2={padL} y2={baseY} stroke={AXIS} strokeWidth={1.4} />
        <line x1={padL} y1={baseY} x2={padL + plotW} y2={baseY} stroke={AXIS} strokeWidth={1.4} />
        {xTicks.map((t) => (
          <g key={`x${t}`}>
            <line x1={X(t)} y1={baseY} x2={X(t)} y2={baseY + 4} stroke={t > lastGraphed ? MARK : AXIS} strokeWidth={1} />
            <text x={X(t)} y={baseY + 15} textAnchor="middle" fontSize="9" fontWeight="700" fill={t > lastGraphed ? MARK : "#94a3b8"} fontFamily={numberFont}>
              {t}
            </text>
          </g>
        ))}
        {yTicks.map((v) => (
          <g key={`y${v}`}>
            <line x1={padL - 4} y1={Y(v)} x2={padL} y2={Y(v)} stroke={v > lastGraphedY ? MARK : AXIS} strokeWidth={1} />
            <text x={padL - 7} y={Y(v) + 3.5} textAnchor="end" fontSize="9" fontWeight="700" fill={v > lastGraphedY ? MARK : "#94a3b8"} fontFamily={numberFont}>
              {v}
            </text>
          </g>
        ))}
        <text x={W - 8} y={baseY + 15} textAnchor="end" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          {xUnit}
        </text>
        <text x={padL - 30} y={padT} fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          {yUnit}
        </text>

        {/* the graphed line itself, as given */}
        <motion.path
          d={`M ${X(0)},${Y(0)} L ${X(lastGraphed)},${Y(lastGraphedY)}`}
          fill="none"
          stroke={INK}
          strokeWidth={2.6}
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7 }}
        />
        {points.map((p, i) => (
          <motion.circle
            key={i}
            cx={X(p[0])}
            cy={Y(p[1])}
            r={4.5}
            fill={INK}
            stroke="#fff"
            strokeWidth={1.4}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.15 + i * 0.1 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}

        {guide(p0, p1, showFirst && !showCheck, 0.1)}
        <AnimatePresence>
          {showFirst && (
            <motion.text
              x={(X(p0[0]) + X(p1[0])) / 2}
              y={Y(p0[1]) - 6}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill="#0f766e"
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: showCheck ? 0.35 : 1 }}
              transition={{ delay: 0.9 }}
            >
              {p1[0] - p0[0]} {xUnit}
            </motion.text>
          )}
        </AnimatePresence>

        {guide(pN2, pN1, showCheck && !showExt, 0.1)}
        <AnimatePresence>
          {showCheck && (
            <motion.text
              x={(X(pN2[0]) + X(pN1[0])) / 2}
              y={Y(pN2[1]) - 6}
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="800"
              fill="#0f766e"
              fontFamily={numberFont}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              {pN1[0] - pN2[0]} {xUnit}
            </motion.text>
          )}
        </AnimatePresence>

        {/* extend the line, dashed, past the last plotted point to the target */}
        <AnimatePresence>
          {showExt && (
            <motion.g key="ext" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.path
                d={`M ${X(lastGraphed)},${Y(lastGraphedY)} L ${X(targetX)},${Y(target)}`}
                fill="none"
                stroke={MARK}
                strokeWidth={2.4}
                strokeDasharray="6 4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.9 }}
              />
              <motion.g
                initial={{ x: X(lastGraphed) - X(targetX), y: Y(lastGraphedY) - Y(target), opacity: 0 }}
                animate={{ x: 0, y: 0, opacity: 1 }}
                transition={{ duration: 0.9 }}
              >
                <text x={X(targetX)} y={Y(target) - 8} fontSize="16" textAnchor="middle">
                  {icon}
                </text>
                <circle cx={X(targetX)} cy={Y(target)} r={5} fill={MARK} stroke="#fff" strokeWidth={1.6} />
              </motion.g>
              <motion.line
                x1={X(targetX)}
                y1={Y(target)}
                x2={X(targetX)}
                y2={baseY}
                stroke="#cbd5e1"
                strokeWidth={1.2}
                strokeDasharray="3 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              />
              <motion.line
                x1={padL}
                y1={Y(target)}
                x2={X(targetX)}
                y2={Y(target)}
                stroke="#cbd5e1"
                strokeWidth={1.2}
                strokeDasharray="3 3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFinal && (
            <motion.g key="fin" initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 15, delay: 1.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={X(targetX) - 70} y={Y(target) - 26} width={70} height={17} rx={7} fill="#dcfce7" stroke={WIN} strokeWidth={1.6} />
              <text x={X(targetX) - 35} y={Y(target) - 14} textAnchor="middle" fontSize="10" fontWeight="800" fill="#166534" fontFamily={numberFont}>
                {tidy(target)} {yUnit}
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
