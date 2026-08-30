import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const WIN = "#16a34a";
const DIM = "#94a3b8";

function pointAt(cx: number, cy: number, deg: number, r: number) {
  const rad = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function Spinner({
  cx,
  label,
  values,
  colorFor,
  highlightIndex,
}: {
  cx: number;
  label: string;
  values: number[];
  colorFor: (v: number) => string;
  highlightIndex?: number;
}) {
  const cy = 70;
  const r = 50;
  const n = values.length;
  const step = 360 / n;
  return (
    <g>
      <text x={cx} y={12} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>
        {label}
      </text>
      <circle cx={cx} cy={cy} r={r} fill="#f8fafc" stroke={INK} strokeWidth="2" />
      {values.map((v, i) => {
        const startDeg = -90 + i * step;
        const endDeg = startDeg + step;
        const p1 = pointAt(cx, cy, startDeg, r);
        const p2 = pointAt(cx, cy, endDeg, r);
        const mid = pointAt(cx, cy, startDeg + step / 2, r * 0.6);
        const large = step > 180 ? 1 : 0;
        return (
          <g key={i}>
            <path d={`M ${cx} ${cy} L ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y} Z`} fill={colorFor(v)} fillOpacity={i === highlightIndex ? 0.9 : 0.55} stroke={INK} strokeWidth="1" />
            <text x={mid.x} y={mid.y + 4} textAnchor="middle" fontSize="12" fontWeight="900" fill={i === highlightIndex ? "#fff" : INK} fontFamily={FONT}>
              {v}
            </text>
          </g>
        );
      })}
    </g>
  );
}

/**
 * Spinner Q lands only on evens and R only on odds; even+odd is always odd,
 * so the sum is odd exactly when P lands even — one sector out of three.
 * Data: { p: [1,2,3], q: [2,4,8,6], r: [1,3,5,7,9,11] }.
 */
export function SpinnerParitySumScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const p = Array.isArray(data.p) ? (data.p as number[]).map((v) => num(v, 0)) : [1, 2, 3];
  const q = Array.isArray(data.q) ? (data.q as number[]).map((v) => num(v, 0)) : [2, 4, 8, 6];
  const r = Array.isArray(data.r) ? (data.r as number[]).map((v) => num(v, 0)) : [1, 3, 5, 7, 9, 11];

  const evenCountP = p.filter((v) => v % 2 === 0).length;
  const probability = `${evenCountP}/${p.length}`;

  const isFinal = step >= totalSteps - 1;
  const showParity = step >= 1;
  const showPneeded = step >= 2;

  const neutral = (v: number) => (v % 2 === 0 ? "#dbeafe" : "#fef3c7");
  const parityColor = (v: number) => (v % 2 === 0 ? BLUE : ORANGE);
  const colorForP = (v: number) => (showPneeded ? (v % 2 === 0 ? WIN : "#e2e8f0") : neutral(v));
  const colorForQ = (v: number) => (showParity ? parityColor(v) : neutral(v));
  const colorForR = (v: number) => (showParity ? parityColor(v) : neutral(v));

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "spin P, Q, and R, and add the results"
          : isFinal
            ? "only 1 of P's 3 sectors gives an odd sum"
            : showPneeded
              ? "even + odd is odd, so P must land even too"
              : "Q always lands even, R always lands odd"}
      </div>

      <svg viewBox="0 0 340 150" width="100%" style={{ maxWidth: 360 }}>
        <Spinner cx={60} label="P" values={p} colorFor={colorForP} highlightIndex={showPneeded ? p.findIndex((v) => v % 2 === 0) : undefined} />
        <Spinner cx={170} label="Q" values={q} colorFor={colorForQ} />
        <Spinner cx={280} label="R" values={r} colorFor={colorForR} />
      </svg>

      {showParity && (
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: DIM, fontFamily: FONT, marginTop: 2 }}>
          Q even + R odd = odd
        </div>
      )}

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 4 }}>
          P(even) = {probability}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
