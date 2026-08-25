import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";

/** Top y (flag tip) of a Capitol drawn with baseY/scale, for dimension lines and labels. */
const capitolTopY = (baseY: number, scale: number) => baseY - scale * 117.45;

/** A domed building silhouette: base block, columns, dome, flag. */
function Capitol({ cx, baseY, scale, fill }: { cx: number; baseY: number; scale: number; fill: string }) {
  const bw = 44 * scale;
  const bh = 66 * scale;
  const domeR = 19 * scale;
  const poleH = 22 * scale;
  const baseX = cx - bw / 2;
  const baseTop = baseY - bh;
  const domeCy = baseTop - domeR * 0.55;
  const poleTop = domeCy - domeR - poleH;
  return (
    <g>
      <rect x={baseX} y={baseTop} width={bw} height={bh} fill={fill} rx={1.5 * scale} />
      {Array.from({ length: 5 }).map((_, i) => (
        <rect
          key={i}
          x={baseX + 6 * scale + (i * (bw - 12 * scale)) / 4 - 1.4 * scale}
          y={baseTop + 5 * scale}
          width={2.8 * scale}
          height={bh - 10 * scale}
          fill="#ffffff33"
        />
      ))}
      <circle cx={cx} cy={domeCy} r={domeR} fill={fill} />
      <rect x={cx - 2.2 * scale} y={poleTop} width={4.4 * scale} height={poleH} fill={fill} />
      <path d={`M ${cx + 2.2 * scale} ${poleTop} l ${9 * scale} ${4 * scale} l ${-9 * scale} ${4 * scale} Z`} fill={BAD} />
    </g>
  );
}

/**
 * A real height shrunk by a fixed scale ratio, then rounded to the nearest
 * whole unit. The real building is drawn at a fixed reference height with a
 * dimension line; a dashed placeholder for the model fills in once the
 * division happens, shown enlarged (not to true scale) so its silhouette
 * stays legible, with its own labeled height. The final step snaps the
 * divided value to the nearer whole-number tick on a small number line and
 * checks the other neighbor against the answer choices for a rounding trap.
 * Data: { realHeight, ratio, subject? }.
 */
export function ScaleModelScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const realHeight = num(data.realHeight, 1);
  const ratio = num(data.ratio, 1) || 1;
  const subject = data.subject != null ? String(data.subject) : "building";
  const modelHeight = realHeight / ratio;
  const rounded = Math.round(modelHeight);
  const floorV = Math.floor(modelHeight);
  const ceilV = Math.ceil(modelHeight);
  const trapValue = rounded === floorV ? ceilV : floorV;

  const picks = (problem.choices ?? [])
    .map((c) => ({ label: c.label, value: Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^0-9.\-]/g, "")) }))
    .filter((c) => Number.isFinite(c.value));
  const trapPick = trapValue !== rounded ? picks.find((p) => p.value === trapValue) : undefined;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showDivide = isFinal || step >= 1;

  const W = 340;
  const H = 270;
  const groundY = 190;
  const realX = 70;
  const modelX = 258;
  const realScale = 1.45;
  const modelScale = 0.62;

  const realTopY = capitolTopY(groundY, realScale);
  const dimX = realX - 44;

  const caption = isFinal
    ? trapPick
      ? `14.45 → 14 ft. Rounding the other way gives ${trapValue} (${trapPick.label}) — but 14.45 is closer to ${rounded}.`
      : `${modelHeight.toFixed(2)} rounds to ${rounded} ft — choice ${problem.answer}.`
    : showDivide
    ? `${realHeight} ÷ ${ratio} = ${modelHeight.toFixed(2)} ft`
    : `The model shrinks every real measurement by a factor of ${ratio}.`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 360 }}>
        <line x1={40} y1={groundY} x2={W - 20} y2={groundY} stroke="#e2e8f0" strokeWidth={2} />

        {/* real building, always shown */}
        <Capitol cx={realX} baseY={groundY} scale={realScale} fill={INK} />

        {/* dimension line for the real height */}
        <line x1={dimX} y1={realTopY} x2={dimX} y2={groundY} stroke="#94a3b8" strokeWidth={1.4} />
        <line x1={dimX - 4} y1={realTopY} x2={dimX + 4} y2={realTopY} stroke="#94a3b8" strokeWidth={1.4} />
        <line x1={dimX - 4} y1={groundY} x2={dimX + 4} y2={groundY} stroke="#94a3b8" strokeWidth={1.4} />
        <text
          x={dimX - 8}
          y={(realTopY + groundY) / 2}
          textAnchor="end"
          fontSize="11"
          fontWeight="800"
          fill={INK}
          fontFamily={numberFont}
          transform={`rotate(-90 ${dimX - 8} ${(realTopY + groundY) / 2})`}
        >
          {realHeight} ft
        </text>
        <text x={realX} y={groundY + 16} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          real {subject}
        </text>

        {/* scale arrow + ratio label */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <line x1={realX + 40} y1={130} x2={modelX - 42} y2={130} stroke={MARK} strokeWidth={1.6} strokeDasharray="4 3" markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={MARK} />
            </marker>
          </defs>
          <text x={(realX + 40 + modelX - 42) / 2} y={122} textAnchor="middle" fontSize="11.5" fontWeight="800" fill={MARK} fontFamily={numberFont}>
            1 : {ratio}
          </text>
        </motion.g>

        {/* model placeholder / filled-in mini building */}
        {!showDivide && (
          <rect
            x={modelX - 20}
            y={groundY - 60}
            width={40}
            height={60}
            fill="none"
            stroke="#cbd5e1"
            strokeWidth={1.6}
            strokeDasharray="4 3"
            rx={4}
          />
        )}
        <AnimatePresence>
          {showDivide && (
            <motion.g
              key="mini"
              initial={{ opacity: 0, scale: 0.3, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 16 }}
              style={{ transformBox: "fill-box", transformOrigin: `${modelX}px ${groundY}px` }}
            >
              <Capitol cx={modelX} baseY={groundY} scale={modelScale} fill={isFinal ? WIN : MARK} />
            </motion.g>
          )}
        </AnimatePresence>
        <text x={modelX} y={groundY + 16} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          {showDivide ? "model (shown enlarged)" : "model?"}
        </text>
        <AnimatePresence>
          {showDivide && (
            <motion.text
              key={`ht-${isFinal}`}
              x={modelX}
              y={capitolTopY(groundY, modelScale) - 14}
              textAnchor="middle"
              fontSize="12.5"
              fontWeight="800"
              fill={isFinal ? WIN : MARK}
              fontFamily={numberFont}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {isFinal ? `${rounded} ft` : `${modelHeight.toFixed(2)} ft`}
            </motion.text>
          )}
        </AnimatePresence>

        {/* rounding number line, final step only */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="numline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <line x1={modelX - 44} y1={218} x2={modelX + 44} y2={218} stroke="#cbd5e1" strokeWidth={1.6} />
              {[floorV, ceilV].map((v) => (
                <g key={v}>
                  <line x1={modelX - 44 + (v - floorV) * 88} y1={213} x2={modelX - 44 + (v - floorV) * 88} y2={223} stroke="#94a3b8" strokeWidth={1.4} />
                  <text x={modelX - 44 + (v - floorV) * 88} y={234} textAnchor="middle" fontSize="9.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
                    {v}
                  </text>
                </g>
              ))}
              <motion.circle
                cx={modelX - 44 + (modelHeight - floorV) * 88}
                cy={218}
                r={4.2}
                fill={BAD}
                animate={{ cx: modelX - 44 + (rounded - floorV) * 88, fill: WIN }}
                transition={{ delay: 0.6, type: "spring", stiffness: 240, damping: 18 }}
              />
            </motion.g>
          )}
        </AnimatePresence>

        <SvgAnswerBadge show={isFinal} answer={problem.answer ?? null} cx={W / 2} y={H - 34} width={92} />
      </svg>

      <motion.span
        key={`${step}-${isFinal}`}
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
    </div>
  );
}
