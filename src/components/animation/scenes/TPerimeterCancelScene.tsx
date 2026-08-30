import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const RED = "#dc2626";
const DIM = "#94a3b8";

const U = 18; // px per inch

/**
 * Two rectangles trace their own perimeters, then join into a T; the shared
 * inner edge (counted twice while separate) fades out of the final outline.
 * Data: { topW: 4, topH: 2, stemW: 2, stemH: 4 }.
 */
export function TPerimeterCancelScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const topW = num(data.topW, 4);
  const topH = num(data.topH, 2);
  const stemW = num(data.stemW, 2);
  const stemH = num(data.stemH, 4);
  const onePerim = 2 * (topW + topH);
  const separateTotal = 2 * onePerim;
  const shared = stemW;
  const finalPerim = separateTotal - 2 * shared;

  const isFinal = step >= totalSteps - 1;
  const showJoined = step >= 2;
  const showCancel = step === 2;
  const showTrace = isFinal;

  // Top rectangle, centered, separate layout (step 0-1).
  const topX = 40;
  const topY = 30;
  const stemX = topX + (topW * U - stemW * U) / 2;
  const stemY = topY + topH * U + 24;

  // Joined T shape (steps 2-3), sharing the edge.
  const jTopX = 30;
  const jTopY = 30;
  const jStemX = jTopX + (topW * U - stemW * U) / 2;
  const jStemY = jTopY + topH * U;

  const outline = `M ${jTopX} ${jTopY} H ${jTopX + topW * U} V ${jTopY + topH * U} H ${jStemX + stemW * U} V ${jStemY + stemH * U} H ${jStemX} V ${jTopY + topH * U} H ${jTopX} Z`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "two separate 2 × 4 rectangles"
          : step === 1
            ? "each rectangle's own perimeter is 12"
            : showCancel
              ? "join them — the shared edge goes inside"
              : "trace the outline of the T"}
      </div>

      <svg viewBox="0 0 260 300" width="100%" style={{ maxWidth: 300 }}>
        {!showJoined && (
          <>
            <rect x={topX} y={topY} width={topW * U} height={topH * U} fill="#f8fafc" stroke={INK} strokeWidth="2" />
            <rect x={stemX} y={stemY} width={stemW * U} height={stemH * U} fill="#f8fafc" stroke={INK} strokeWidth="2" />
            {step >= 1 && (
              <>
                <motion.rect
                  x={topX}
                  y={topY}
                  width={topW * U}
                  height={topH * U}
                  fill="none"
                  stroke={BLUE}
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7 }}
                />
                <motion.rect
                  x={stemX}
                  y={stemY}
                  width={stemW * U}
                  height={stemH * U}
                  fill="none"
                  stroke={ORANGE}
                  strokeWidth="3"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                />
                <text x={topX + (topW * U) / 2} y={topY + topH * U + 15} textAnchor="middle" fontSize="12" fontWeight="800" fill={BLUE} fontFamily={FONT}>
                  perimeter {onePerim}
                </text>
                <text x={stemX + (stemW * U) / 2} y={stemY + stemH * U + 18} textAnchor="middle" fontSize="12" fontWeight="800" fill={ORANGE} fontFamily={FONT}>
                  perimeter {onePerim}
                </text>
              </>
            )}
          </>
        )}

        {showJoined && (
          <>
            <path d={outline} fill="#f8fafc" stroke={INK} strokeWidth="2" />
            <AnimatePresence>
              {showCancel && (
                <motion.line
                  key="shared"
                  x1={jStemX}
                  y1={jStemY}
                  x2={jStemX + stemW * U}
                  y2={jStemY}
                  stroke={RED}
                  strokeWidth="4"
                  strokeDasharray="4 3"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                />
              )}
            </AnimatePresence>
            {showTrace && (
              <motion.path
                d={outline}
                fill="none"
                stroke={IND}
                strokeWidth="3.4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.1 }}
              />
            )}
          </>
        )}
      </svg>

      {showCancel && (
        <div style={{ textAlign: "center", fontSize: 11, fontWeight: 800, color: RED, marginBottom: 2 }}>
          shared edge = {shared}, counted twice
        </div>
      )}

      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 750, color: DIM, fontFamily: FONT, marginTop: 4 }}>
        {step < 2 && `2 × ${onePerim} = ${separateTotal} if kept separate`}
        {showCancel && `${separateTotal} − 2 × ${shared} = ${finalPerim}`}
        {showTrace && `perimeter = ${finalPerim}`}
      </div>

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 6 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
