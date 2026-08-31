import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const DIM = "#94a3b8";
const WIN = "#16a34a";
const BAD = "#dc2626";
const COLORS = ["#a855f7", "#f97316", "#0ea5e9", "#4338ca", "#16a34a"];

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
};
const arcPath = (cx: number, cy: number, r: number, startDeg: number, endDeg: number) => {
  const s = polar(cx, cy, r, startDeg);
  const e = polar(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y} Z`;
};

/**
 * A pie chart's slice sizes have to come from a real remainder, not the raw
 * survey number — after the three named counts are subtracted, only *half*
 * of what's left is cherry. The scene builds the class as a token stack,
 * peels off the three named groups, splits the true leftover in half, and
 * turns cherry's share into a sector — closing with an independent check
 * that every slice's degrees actually add back up to 360°.
 * Data: { total, named (array of counts), namedLabels }.
 */
export function PieChartRemainderDegreeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const total = Math.max(1, Math.round(num(data.total, 36)));
  const named = (Array.isArray(data.named) ? data.named : [12, 8, 6]).map((v) => Math.round(num(v, 0)));
  const namedLabels = (Array.isArray(data.namedLabels) ? data.namedLabels : ["chocolate", "apple", "blueberry"]).map(String);

  const namedSum = named.reduce((s, v) => s + v, 0);
  const remaining = total - namedSum;
  const cherry = remaining / 2;
  const lemon = remaining - cherry;
  const deg = (n: number) => Math.round((n / total) * 3600) / 10;
  const cherryDeg = deg(cherry);
  const answerOk = problem.shortAnswer == null || `${cherryDeg}°` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${cherryDeg}°, stored answer is ${problem.shortAnswer}` : "";

  const slices = [...named.map((v, i) => ({ label: namedLabels[i], v })), { label: "cherry", v: cherry }, { label: "lemon", v: lemon }];
  let acc = 0;
  const arcs = slices.map((s) => {
    const startDeg = acc * (360 / total);
    acc += s.v;
    const endDeg = acc * (360 / total);
    return { ...s, startDeg, endDeg, deg: deg(s.v) };
  });
  const degSum = arcs.reduce((s, a) => s + a.deg, 0);
  const sumOk = Math.abs(degSum - 360) < 0.01;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showSplit = step >= 1;
  const showPie = step >= 2 || isFinal;

  const cx = 90;
  const cy = 100;
  const r = 62;
  const W = 300;
  const H = 220;

  const caption = isFinal
    ? `(${cherry}/${total}) × 360° = ${cherryDeg}°`
    : showPie
    ? `every slice's degrees add to ${degSum}°${sumOk ? " ✓" : " — check failed"}`
    : showSplit
    ? `${remaining} ÷ 2 = ${cherry} cherry, ${lemon} lemon`
    : `${total} − ${named.join(" − ")} = ${remaining} students left`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showPie && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              {total} students
            </text>
            {Array.from({ length: total }).map((_, i) => {
              const col = i % 12;
              const row = Math.floor(i / 12);
              const isNamed = i < namedSum;
              const isCherry = showSplit && i >= namedSum && i < namedSum + cherry;
              const isLemon = showSplit && i >= namedSum + cherry;
              const color = isCherry ? COLORS[3] : isLemon ? COLORS[4] : isNamed ? DIM : "#cbd5e1";
              return (
                <motion.circle
                  key={i}
                  cx={20 + col * 21}
                  cy={36 + row * 20}
                  r={4.6}
                  fill={color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: isNamed && !showSplit ? 0.25 : 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, delay: i * 0.012 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              );
            })}
          </g>
        )}

        {showPie && (
          <g>
            {arcs.map((a, i) => (
              <motion.path
                key={a.label}
                d={arcPath(cx, cy, r, a.startDeg, a.endDeg)}
                fill={a.label === "cherry" ? WIN : COLORS[i % COLORS.length]}
                fillOpacity={a.label === "cherry" ? 0.9 : 0.55}
                stroke="#fff"
                strokeWidth={1.5}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.15 }}
              />
            ))}
            {arcs.map((a) => {
              const mid = polar(cx, cy, r * 0.65, (a.startDeg + a.endDeg) / 2);
              return (
                <text key={`${a.label}-lbl`} x={mid.x} y={mid.y} textAnchor="middle" fontSize="8.5" fontWeight="800" fill="#fff" fontFamily={numberFont}>
                  {a.deg}°
                </text>
              );
            })}
          </g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {caption}
      </motion.span>

      {(failure || !sumOk) && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>
          check failed: {failure || `degree sum ${degSum} ≠ 360`}
        </span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

