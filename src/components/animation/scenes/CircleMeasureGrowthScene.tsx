import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const DIM = "#94a3b8";
const GRID = "#dbe3ee";

const list = (value: unknown) => (Array.isArray(value) ? value.map((v) => num(v, 0)) : []);

/**
 * Turns a row of real circles into their (circumference, area) points. Equal
 * horizontal jumps and growing vertical jumps make the convex graph visible.
 * Data: { radii, circumferenceFactor, areaFactor, choiceLabels, choiceShapes }.
 */
export function CircleMeasureGrowthScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const radii = list(data.radii);
  const cFactor = num(data.circumferenceFactor, 2);
  const aFactor = num(data.areaFactor, 1);
  const labels = Array.isArray(data.choiceLabels) ? data.choiceLabels.map(String) : [];
  const shapes = Array.isArray(data.choiceShapes) ? data.choiceShapes.map(String) : [];
  const points = radii.map((r) => ({ r, c: cFactor * r, a: aFactor * r * r }));
  const verticalGaps = points.slice(1).map((p, i) => p.a - points[i].a);
  const last = totalSteps - 1;
  const final = step >= last;
  const beat = final ? 3 : Math.min(step, 2);
  const plotX = (c: number) => 164 + (c / Math.max(...points.map((p) => p.c), 1)) * 148;
  const plotY = (a: number) => 210 - (a / Math.max(...points.map((p) => p.a), 1)) * 154;
  const answer = String(problem.answer ?? "");
  const computedChoice = points.every((p, i) => i === 0 || p.c - points[i - 1].c === cFactor)
    && verticalGaps.every((g, i) => i === 0 || g > verticalGaps[i - 1]) ? labels[0] : "";
  const check = computedChoice === answer;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "4px" }}>
      <svg viewBox="0 0 340 286" width="100%" style={{ maxWidth: 390 }}>
        {beat < 3 ? (
          <>
            <text x="72" y="18" textAnchor="middle" fontSize="10" fontWeight="800" fill={INK}>five circles</text>
            {radii.map((r, i) => {
              const x = 18 + i * 27;
              const radius = 5 + r * 2.3;
              return <motion.g key={r} initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <circle cx={x} cy={58} r={radius} fill="#eef2ff" stroke={IND} strokeWidth="1.7" />
                <line x1={x} y1={58} x2={x + radius} y2={58} stroke={IND} strokeWidth="1.2" />
                <text x={x} y={88} textAnchor="middle" fontSize="9" fill={INK} fontFamily={FONT}>{r}</text>
              </motion.g>;
            })}
            <rect x="12" y="102" width="124" height="54" rx="9" fill="#f8fafc" stroke={GRID} />
            <text x="74" y="122" textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={FONT}>C = 2πr</text>
            <text x="74" y="144" textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={FONT}>A = πr²</text>

            <line x1="158" y1="214" x2="320" y2="214" stroke={INK} strokeWidth="1.8" />
            <line x1="158" y1="214" x2="158" y2="42" stroke={INK} strokeWidth="1.8" />
            <text x="323" y="218" fontSize="11" fontStyle="italic" fill={INK}>C</text>
            <text x="151" y="39" fontSize="11" fontStyle="italic" fill={INK}>A</text>
            {beat >= 1 && points.map((p, i) => (
              <motion.g key={p.r} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", delay: i * 0.13 }}>
                <circle cx={plotX(p.c)} cy={plotY(p.a)} r="4.7" fill={beat >= 2 ? GREEN : IND} />
                <text x={plotX(p.c) + 6} y={plotY(p.a) - 5} fontSize="8" fill={INK} fontFamily={FONT}>r={p.r}</text>
              </motion.g>
            ))}
            {beat === 1 && <motion.text x="239" y="238" textAnchor="middle" fontSize="9.5" fill={IND} fontWeight="800" fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              (2πr, πr²), r = 1,2,3,4,5
            </motion.text>}
            {beat >= 2 && <>
              <motion.path d={`M ${points.map((p) => `${plotX(p.c)},${plotY(p.a)}`).join(" L ")}`} fill="none" stroke={GREEN} strokeWidth="2" strokeDasharray="4 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
              <text x="239" y="232" textAnchor="middle" fontSize="9.5" fill={INK} fontFamily={FONT}>ΔC: {points.slice(1).map(() => "2π").join("  ")}</text>
              <text x="239" y="249" textAnchor="middle" fontSize="9.5" fill={GREEN} fontWeight="800" fontFamily={FONT}>ΔA: {verticalGaps.map((g) => `${g}π`).join("  ")}</text>
              <text x="239" y="266" textAnchor="middle" fontSize="9.5" fill={IND} fontWeight="800">equal across, farther up</text>
            </>}
          </>
        ) : (
          <>
            <text x="170" y="18" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK}>Which choice rises faster and faster?</text>
            {labels.map((label, i) => <Choice key={label} label={label} shape={shapes[i]} x={15 + (i % 3) * 108} y={40 + Math.floor(i / 3) * 100} winner={label === computedChoice} delay={i * 0.1} />)}
            <text x="170" y="244" textAnchor="middle" fontSize="10" fill={check ? GREEN : "#dc2626"} fontWeight="800" fontFamily={FONT}>
              {check ? "equal x-gaps + growing y-gaps ✓" : `check failed: computed ${computedChoice || "none"}, stored ${answer}`}
            </text>
            <SvgAnswerBadge show={check} answer={answer} cx={170} y={254} width={90} />
          </>
        )}
      </svg>
    </div>
  );
}

function Choice({ label, shape, x, y, winner, delay }: { label: string; shape: string; x: number; y: number; winner: boolean; delay: number }) {
  const ys: Record<string, number[]> = {
    convex: [48, 43, 34, 22, 6], valley: [12, 29, 31, 20, 5], arch: [42, 25, 13, 25, 42], concave: [48, 35, 24, 15, 8], decreasing: [6, 20, 31, 40, 47],
  };
  const values = ys[shape] ?? ys.convex;
  return <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <rect x={x} y={y} width="94" height="78" rx="9" fill={winner ? "#f0fdf4" : "#f8fafc"} stroke={winner ? GREEN : GRID} strokeWidth={winner ? 2.5 : 1.2} />
    <line x1={x + 18} y1={y + 61} x2={x + 84} y2={y + 61} stroke={DIM} />
    <line x1={x + 18} y1={y + 61} x2={x + 18} y2={y + 8} stroke={DIM} />
    {values.map((v, i) => <circle key={i} cx={x + 27 + i * 13} cy={y + v} r="3" fill={winner ? GREEN : INK} />)}
    <text x={x + 8} y={y + 15} fontSize="10" fontWeight="900" fill={winner ? GREEN : INK}>{label}</text>
    {winner && <text x={x + 75} y={y + 15} fontSize="11" fontWeight="900" fill={GREEN}>✓</text>}
  </motion.g>;
}
