import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const WOOD = "#c98a3c";
const WOOD_LINE = "#92400e";
const AMBER = "#f59e0b";

/**
 * A photograph in a picture frame: the border area is the outer rectangle
 * minus the photo. Six beats: (0) the bare photograph with its dimensions;
 * (1) the wood frame grows around it, outer dimensions revealed; (2) the
 * outer area is computed; (3) the frame decomposes into 4 amber bands and
 * the photo area is subtracted out; (4) a naive shortcut — perimeter of the
 * photo times border width — is checked against the choices, and the 4
 * corner squares it silently drops are highlighted; (5) the badge. Data:
 * { photoWidth, photoHeight, borderWidth, unit? }.
 */
export function PhotoFrameBorderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const photoWidth = num(data.photoWidth, 10);
  const photoHeight = num(data.photoHeight, 8);
  const b = num(data.borderWidth, 2);
  const unit = data.unit != null ? String(data.unit) : "in";

  const outerW = photoWidth + 2 * b;
  const outerH = photoHeight + 2 * b;
  const outerArea = outerW * outerH;
  const photoArea = photoWidth * photoHeight;
  const borderArea = outerArea - photoArea;

  const naive = 2 * (photoWidth + photoHeight) * b;
  const cornerLoss = 4 * b * b;
  const trap = (problem.choices ?? []).find((c) => c.text.trim() === String(naive));

  const last = totalSteps - 1;
  const showFrame = step >= 1;
  const showOuterArea = step >= 2;
  const showSubtract = step >= 3;
  const showTrap = step >= 4;
  const isFinal = step >= last;

  const s = Math.min(210 / outerW, 168 / outerH);
  const ox = 50;
  const oy = 30;
  const opW = outerW * s;
  const opH = outerH * s;
  const bs = b * s;
  const pW = photoWidth * s;
  const pH = photoHeight * s;

  const svgW = ox + opW + 40;
  const svgH = oy + opH + 34;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} style={{ maxWidth: 320 }}>
        {/* frame: 4 wood bands (or amber once subtracting) */}
        <AnimatePresence>
          {showFrame && (
            <motion.g key="frame" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x={ox} y={oy} width={opW} height={bs} fill={showSubtract ? AMBER : WOOD} stroke={WOOD_LINE} strokeWidth={1} />
              <rect x={ox} y={oy + opH - bs} width={opW} height={bs} fill={showSubtract ? AMBER : WOOD} stroke={WOOD_LINE} strokeWidth={1} />
              <rect x={ox} y={oy + bs} width={bs} height={opH - 2 * bs} fill={showSubtract ? AMBER : WOOD} stroke={WOOD_LINE} strokeWidth={1} />
              <rect x={ox + opW - bs} y={oy + bs} width={bs} height={opH - 2 * bs} fill={showSubtract ? AMBER : WOOD} stroke={WOOD_LINE} strokeWidth={1} />
            </motion.g>
          )}
        </AnimatePresence>

        {/* the 4 corner squares the naive perimeter formula misses */}
        <AnimatePresence>
          {showTrap && (
            <motion.g key="corners" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                [ox, oy],
                [ox + opW - bs, oy],
                [ox, oy + opH - bs],
                [ox + opW - bs, oy + opH - bs],
              ].map(([cx, cy], i) => (
                <motion.rect
                  key={i}
                  x={cx}
                  y={cy}
                  width={bs}
                  height={bs}
                  fill="none"
                  stroke={BAD}
                  strokeWidth={2.2}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 280, damping: 16, delay: i * 0.08 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                />
              ))}
            </motion.g>
          )}
        </AnimatePresence>

        {/* the photograph */}
        <g transform={`translate(${ox + bs} ${oy + bs})`}>
          <rect width={pW} height={pH} fill="#bae6fd" stroke="#0369a1" strokeWidth={1.5} />
          <circle cx={pW * 0.76} cy={pH * 0.26} r={Math.min(pW, pH) * 0.09} fill="#fde047" stroke="#ca8a04" strokeWidth={0.8} />
          <polygon points={`0,${pH} ${pW * 0.32},${pH * 0.42} ${pW * 0.55},${pH * 0.68} ${pW * 0.62},${pH * 0.56} ${pW * 0.9},${pH} `} fill="#4ade80" stroke="#16a34a" strokeWidth={0.8} />
        </g>

        {/* photo dimension labels */}
        <text x={ox + bs + pW / 2} y={oy + bs + pH + 14} textAnchor="middle" fontSize="10" fontWeight={700} fill="#334155" fontFamily={numberFont}>
          {photoWidth} {unit}
        </text>
        <text
          x={ox + bs - 8}
          y={oy + bs + pH / 2}
          textAnchor="middle"
          fontSize="10"
          fontWeight={700}
          fill="#334155"
          fontFamily={numberFont}
          transform={`rotate(-90 ${ox + bs - 8} ${oy + bs + pH / 2})`}
        >
          {photoHeight} {unit}
        </text>

        {/* outer dimension labels + border-width marker */}
        <AnimatePresence>
          {showFrame && (
            <motion.g key="outerlabels" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={ox + opW / 2} y={oy + opH + 20} textAnchor="middle" fontSize="11" fontWeight={800} fill={MARK} fontFamily={numberFont}>
                {outerW} {unit}
              </text>
              <text
                x={16}
                y={oy + opH / 2}
                textAnchor="middle"
                fontSize="11"
                fontWeight={800}
                fill={MARK}
                fontFamily={numberFont}
                transform={`rotate(-90 16 ${oy + opH / 2})`}
              >
                {outerH} {unit}
              </text>
              <line x1={ox + 8} y1={oy} x2={ox + 8} y2={oy + bs} stroke={WOOD_LINE} strokeWidth={1.4} />
              <text x={ox + 12} y={oy + bs / 2 + 3} fontSize="8.5" fontWeight={700} fill={WOOD_LINE} fontFamily={numberFont}>
                {b}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <div style={{ minHeight: 16, textAlign: "center" }}>
        {!showFrame && (
          <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: "#94a3b8" }}>
            photo: {photoWidth} × {photoHeight} = {photoArea} {unit}²
          </span>
        )}
      </div>

      <AnimatePresence>
        {showFrame && !showOuterArea && (
          <motion.span
            key="outerdims"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 700, color: MARK, textAlign: "center" }}
          >
            {photoWidth} + {b} + {b} = {outerW},  {photoHeight} + {b} + {b} = {outerH}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showOuterArea && (
          <motion.div
            key="outerarea"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            style={{ fontFamily: numberFont, fontSize: 12, fontWeight: 800, color: MARK, textAlign: "center" }}
          >
            outer area: {outerW} × {outerH} = {outerArea}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSubtract && (
          <motion.div
            key="subtract"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 16 }}
            style={{ fontFamily: numberFont, fontSize: 13, fontWeight: 800, color: WIN, textAlign: "center" }}
          >
            border = {outerArea} − {photoArea} = {borderArea}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTrap && (
          <motion.div
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ fontFamily: numberFont, fontSize: 9.5, fontWeight: 700, color: BAD, textAlign: "center", lineHeight: 1.4 }}
          >
            <div>
              perimeter × border: 2({photoWidth}+{photoHeight}) × {b} = {naive}
              {trap ? ` → choice ${trap.label}` : ""}
            </div>
            <div>misses 4 corner squares of {b}×{b}: {naive} + {cornerLoss} = {borderArea}</div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.3 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
