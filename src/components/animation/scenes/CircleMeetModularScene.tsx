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

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

const CX = 130;
const CY = 90;
const R = 62;

function pointFor(points: number, pos: number) {
  const deg = (360 * (pos % points)) / points - 90;
  const rad = (deg * Math.PI) / 180;
  return { x: CX + R * Math.cos(rad), y: CY + R * Math.sin(rad) };
}

/**
 * Alice and Bob step around a numbered circle in opposite directions; the
 * closing gap per turn is checked against multiples of the circle size to
 * find when they land on the same point.
 * Data: { points: 12, aliceStep: 5, bobStep: 9 }.
 */
export function CircleMeetModularScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const points = num(data.points, 12);
  const aliceStep = num(data.aliceStep, 5);
  const bobStep = num(data.bobStep, 9);

  const combined = aliceStep + bobStep;
  const g = gcd(combined, points);
  const meetTurn = points / g;

  const isFinal = step >= totalSteps - 1;
  const showCombined = step >= 1;
  const showSim = step >= 2;

  const turn = isFinal ? meetTurn : showSim ? Math.min(3, meetTurn) : 0;
  const alicePos = (0 + aliceStep * turn) % points;
  const bobPos = (((0 - bobStep * turn) % points) + points) % points;
  const aliceP = pointFor(points, alicePos);
  const bobP = pointFor(points, bobPos);
  const met = alicePos === bobPos && turn > 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `both start at 12; Alice +${aliceStep} CW, Bob −${bobStep} (CCW) per turn`
          : isFinal
            ? `they land together at turn ${meetTurn}`
            : showSim
              ? "simulate turns until the points match"
              : `combined closing distance = ${aliceStep}+${bobStep}=${combined} per turn`}
      </div>

      <svg viewBox="0 0 260 190" width="100%" style={{ maxWidth: 280 }}>
        <circle cx={CX} cy={CY} r={R} fill="#f8fafc" stroke={INK} strokeWidth="2" />
        {Array.from({ length: points }).map((_, i) => {
          const p = pointFor(points, i + 1);
          const label = i + 1 === points ? points : i + 1;
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r="3" fill={DIM} />
              <text x={p.x + (p.x > CX ? 10 : p.x < CX ? -10 : 0)} y={p.y + (p.y > CY ? 12 : p.y < CY ? -6 : 4)} textAnchor="middle" fontSize="8.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
                {label}
              </text>
            </g>
          );
        })}

        {showSim && (
          <>
            <motion.circle cx={aliceP.x} cy={aliceP.y} r="7" fill={met ? WIN : BLUE} initial={false} animate={{ cx: aliceP.x, cy: aliceP.y }} transition={{ type: "spring", stiffness: 90, damping: 16 }} />
            <motion.circle cx={bobP.x} cy={bobP.y} r="7" fill={met ? WIN : ORANGE} initial={false} animate={{ cx: bobP.x, cy: bobP.y }} transition={{ type: "spring", stiffness: 90, damping: 16 }} fillOpacity={met ? 0.6 : 1} />
          </>
        )}

        <text x={CX} y={CY + R + 28} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={met ? WIN : INK} fontFamily={FONT}>
          {showSim ? (met ? `turn ${turn}: same point!` : `turn ${turn}`) : ""}
        </text>
      </svg>

      <AnimatePresence>
        {showCombined && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: "center", fontSize: 11.5, fontWeight: 800, color: IND, fontFamily: FONT }}>
            meet when {combined}k is a multiple of {points}
          </motion.div>
        )}
      </AnimatePresence>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 12.5, fontWeight: 900, color: WIN, fontFamily: FONT, marginTop: 2 }}>
          gcd({combined},{points})={g}, so k={points}/{g}={meetTurn}
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
