import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";

function pointsOnCircle(n: number, cx: number, cy: number, r: number) {
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / n - Math.PI / 2;
    return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
}

/**
 * Two divisions of teams: within-division pairs each play twice, and every
 * team plays every team in the other division once.
 * Data: { teamsPerDivision: 6 }.
 */
export function ConferenceGamesCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const k = num(data.teamsPerDivision, 6);

  const pairsPerDivision = (k * (k - 1)) / 2;
  const gamesPerDivision = pairsPerDivision * 2;
  const withinTotal = gamesPerDivision * 2;
  const crossTotal = k * k;
  const grandTotal = withinTotal + crossTotal;

  const isFinal = step >= totalSteps - 1;
  const showWithin = step >= 1;
  const showCross = step >= 2;

  const leftPts = pointsOnCircle(k, 65, 65, 42);
  const rightPts = pointsOnCircle(k, 195, 65, 42);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `two divisions of ${k} teams each`
          : isFinal
            ? "add within-division and cross-division games"
            : showCross
              ? "every team plays every team in the other division once"
              : "within a division, each pair plays twice"}
      </div>

      <svg viewBox="0 0 260 150" width="100%" style={{ maxWidth: 280 }}>
        {showWithin &&
          leftPts.map((p1, i) => leftPts.slice(i + 1).map((p2, j) => <line key={`l-${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={BLUE} strokeWidth="1" strokeOpacity="0.5" />))}
        {showWithin &&
          rightPts.map((p1, i) => rightPts.slice(i + 1).map((p2, j) => <line key={`r-${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={BLUE} strokeWidth="1" strokeOpacity="0.5" />))}

        <AnimatePresence>
          {showCross && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {leftPts.map((p1, i) => rightPts.map((p2, j) => <line key={`c-${i}-${j}`} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={ORANGE} strokeWidth="0.6" strokeOpacity="0.35" />))}
            </motion.g>
          )}
        </AnimatePresence>

        {leftPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill={BLUE} />
        ))}
        {rightPts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="5" fill={ORANGE} />
        ))}
      </svg>

      {showWithin && (
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: BLUE, fontFamily: FONT }}>
          {pairsPerDivision} pairs × 2 games × 2 divisions = {withinTotal}
        </div>
      )}
      {showCross && (
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: ORANGE, fontFamily: FONT }}>
          {k} × {k} = {crossTotal}
        </div>
      )}

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          {withinTotal} + {crossTotal} = {grandTotal}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 2 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
