import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/** Isometric cube of edge `size`, faces drawn as three parallelograms so a
 *  smaller cube reads at a smaller footprint than the base cube next to it. */
function IsoCube({ x, y, size, muted = false }: { x: number; y: number; size: number; muted?: boolean }) {
  const dx = size;
  const dy = size * 0.55;
  const opacity = muted ? 0.35 : 1;
  return (
    <g opacity={opacity}>
      <polygon points={`${x},${y - size} ${x + dx},${y - size - dy} ${x},${y - size - 2 * dy} ${x - dx},${y - size - dy}`} fill="#eef2ff" stroke={INK} strokeWidth="1.6" />
      <polygon points={`${x},${y - size} ${x + dx},${y - size - dy} ${x + dx},${y - dy} ${x},${y}`} fill="#c7d2fe" stroke={INK} strokeWidth="1.6" />
      <polygon points={`${x},${y - size} ${x - dx},${y - size - dy} ${x - dx},${y - dy} ${x},${y}`} fill="#ddd6fe" stroke={INK} strokeWidth="1.6" />
    </g>
  );
}

/**
 * A 1×1×1 cube rests on top of a 2×2×2 cube. The gluing does not cancel two
 * *whole* faces the way unit cubes joining face-to-face would: it hides the
 * small cube's own bottom face (area 1) and only the 1×1 patch of the big
 * cube's top it sits on, leaving 3 of that top face's 4 square units still
 * exposed. So the small cube nets 6 − 2 = 4 new square units, against an
 * original surface of 6 × 2² = 24. The natural slip is adding all 6 of the
 * small cube's faces without hiding any, landing on 6/24 = 25% — exactly
 * choice E — so that gets its own beat before the correct net-4 count.
 * Data: { bigEdge: 2, smallEdge: 1 } (defaults match the fixed problem).
 */
export function CubeStackSurfaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const bigEdge = num(data.bigEdge, 2);
  const smallEdge = num(data.smallEdge, 1);
  const original = 6 * bigEdge * bigEdge;
  const smallFaces = 6 * smallEdge * smallEdge;
  const hiddenPatch = smallEdge * smallEdge; // covered part of the big cube's top
  const hiddenBottom = smallEdge * smallEdge; // small cube's own bottom face
  const netAdd = smallFaces - hiddenPatch - hiddenBottom;
  const percentExact = (netAdd / original) * 100;
  const percentClosest = Math.round(percentExact);
  const naivePercent = Math.round((smallFaces / original) * 100);
  const trapLetter = (problem.choices ?? []).find((c) => Number(c.text) === naivePercent)?.label;
  const answer = answerOf(problem);
  const valid = String(percentClosest) === problem.shortAnswer;

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: original cube, 1: attach + hide, 2: trap (forgot to hide), 3: net add confirmed, 4: percent + answer
  const attached = beat >= 1;
  const showTrap = beat === 2;
  const showNet = beat >= 3;
  const showPercent = beat >= 4;

  const W = 470;
  const H = 300;
  const bigX = 165;
  const bigY = 232;
  const bigSize = 70;
  const smallSize = bigSize * (smallEdge / bigEdge);
  const smallX = bigX;
  const smallY = bigY - 2 * bigSize; // rests on top face

  const caption =
    beat === 0
      ? `original cube: edge ${bigEdge}, surface area 6 × ${bigEdge}² = ${original}`
      : beat === 1
      ? "small cube rests on top — its bottom and the patch under it are hidden"
      : beat === 2
      ? `forgetting to hide those 2 squares gives ${smallFaces}/${original} ≈ ${naivePercent}% — choice ${trapLetter ?? "E"}`
      : beat === 3
      ? `net new area: ${smallFaces} − ${hiddenPatch} − ${hiddenBottom} = ${netAdd}`
      : `${netAdd}/${original} ≈ ${percentExact.toFixed(1)}%, closest to ${percentClosest}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="A unit cube glued atop a larger cube, tracking which faces stay exposed">
        <text x={W / 2} y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {beat === 0 ? "start with the big cube alone" : beat === 1 ? "glue the small cube on top" : beat === 2 ? "a tempting shortcut — check it" : beat === 3 ? "confirm the net gain" : "convert to a percent"}
        </text>

        <IsoCube x={bigX} y={bigY} size={bigSize} />

        {/* face-area label on the big cube's front face */}
        <text x={bigX + bigSize * 0.5} y={bigY - bigSize * 0.55} textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>
          {bigEdge}×{bigEdge}
        </text>

        <AnimatePresence>
          {attached && (
            <motion.g key="small" initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 190, damping: 16 }}>
              <IsoCube x={smallX} y={smallY} size={smallSize} />
              {/* hidden bottom face marker */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: showTrap ? 0 : 1 }} transition={{ delay: 0.5 }}>
                <text x={smallX} y={smallY + smallSize * 0.55} textAnchor="middle" fontSize="9" fontWeight="900" fill={RED}>
                  hidden
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* patch on the big cube's top that's covered, called out with a marker */}
        <AnimatePresence>
          {attached && !showTrap && (
            <motion.g key="patch" initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.35, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <circle cx={bigX} cy={bigY - 2 * bigSize + 6} r="5" fill={RED} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* face ledger: original vs new, growing per beat */}
        <g transform="translate(300 40)">
          <text x="70" y="0" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>
            AREA LEDGER
          </text>
          <rect x="0" y="12" width="140" height="26" rx="7" fill="#eef2ff" stroke={IND} strokeWidth="1.5" />
          <text x="70" y="30" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>
            original {original}
          </text>

          {attached && !showTrap && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x="0" y="46" width="140" height="26" rx="7" fill={showNet ? "#dcfce7" : "#f8fafc"} stroke={showNet ? GREEN : "#cbd5e1"} strokeWidth="1.5" />
              <text x="70" y="64" textAnchor="middle" fontSize="12" fontWeight="900" fill={showNet ? GREEN : DIM} fontFamily={FONT}>
                {showNet ? `net +${netAdd}` : `+${smallFaces} − ${hiddenPatch + hiddenBottom}`}
              </text>
            </motion.g>
          )}

          {showTrap && (
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="0" y="46" width="140" height="26" rx="7" fill="#fef2f2" stroke={RED} strokeWidth="1.8" />
              <text x="70" y="64" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={FONT}>
                naive +{smallFaces}
              </text>
            </motion.g>
          )}

          {showPercent && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <rect x="0" y="80" width="140" height="30" rx="8" fill={valid ? "#f0fdf4" : "#fef2f2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="70" y="100" textAnchor="middle" fontSize="15" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>
                ≈ {percentClosest}%
              </text>
            </motion.g>
          )}
        </g>

        <text x={W / 2} y="278" textAnchor="middle" fontSize="10" fontWeight="800" fill={showTrap ? RED : INK}>
          {caption}
        </text>

        <SvgAnswerBadge show={showPercent} answer={answer} cx={370} y={218} width={92} />
      </svg>
    </div>
  );
}
