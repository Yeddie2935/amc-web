import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const ROAD = "#e2e8f0";
const SLOW = "#0891b2";
const FAST = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const W = 340;
const H = 210;
const X0 = 48;
const BW = 44;
const GAP = 6;
const COAST_Y = 46;
const HWY_Y = 118;

/**
 * Two roads, one speed ratio. The coastal road fixes a real-world "chunk":
 * some number of miles in some number of minutes. The highway trap is that a
 * chunk of the *same length* takes a third of that time, and the whole
 * highway is just that chunk repeated — so its total time is the chunk time
 * times the chunk count, not the chunk count times the coastal time. The
 * beats drive a car across the coastal chunk to fix the baseline, drive it
 * across one highway chunk at 3× speed to shrink the time, then tile the
 * highway with that many chunks and add the coastal time back in. Chunk
 * count, unit time, highway time and the total are all computed from the
 * given miles/minutes/ratio, and the scene flags the classic slip of
 * reporting the highway time alone.
 * Data: { coastalMiles, coastalMinutes, highwayMiles, speedRatio, icon? }.
 */
export function RoadChunkPaceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const coastalMiles = num(data.coastalMiles, 0);
  const coastalMinutes = num(data.coastalMinutes, 0);
  const highwayMiles = num(data.highwayMiles, 0);
  const speedRatio = num(data.speedRatio, 0);
  const icon = data.icon != null ? String(data.icon) : "🚗";
  if (coastalMiles <= 0 || coastalMinutes <= 0 || highwayMiles <= 0 || speedRatio <= 1) return null;

  const chunks = Math.round(highwayMiles / coastalMiles);
  if (chunks < 1 || Math.abs(chunks - highwayMiles / coastalMiles) > 1e-6) return null;

  const unitTime = coastalMinutes / speedRatio;
  const highwayMinutes = unitTime * chunks;
  const total = highwayMinutes + coastalMinutes;
  const trapChoice = problem.choices?.find(
    (c) => Math.abs(Number(String(c.text).replace(/[−–—]/g, "-").replace(/[^\d.-]/g, "")) - highwayMinutes) < 1e-6
  );
  const agrees = problem.shortAnswer == null || String(problem.shortAnswer).includes(String(Math.round(total)));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showHighway = step >= 1;
  const showTiles = isFinal;

  const caption =
    step === 0
      ? `${coastalMiles} mi on the coastal road takes ${coastalMinutes} min`
      : step === 1
      ? `${speedRatio}× the speed: the same ${coastalMiles} mi takes ${coastalMinutes} ÷ ${speedRatio} = ${unitTime} min`
      : `${chunks} × ${unitTime} = ${highwayMinutes} min highway, + ${coastalMinutes} min coastal = ${total} min`;

  const tileX = (i: number) => X0 + i * (BW + GAP);
  const roadEndX = tileX(showTiles ? chunks : 1) - GAP;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 350 }}>
        {/* coastal road: one chunk, fixed baseline */}
        <text x={X0} y={COAST_Y - 14} fontSize="8.5" fontWeight="800" fill={SLOW} fontFamily={numberFont}>
          Coastal road
        </text>
        <rect x={X0} y={COAST_Y} width={BW} height={20} rx={3} fill={ROAD} stroke={SLOW} strokeWidth={1.6} />
        <text x={X0 + BW / 2} y={COAST_Y + 33} textAnchor="middle" fontSize="8.5" fontWeight="800" fill={SLOW} fontFamily={numberFont}>
          {coastalMiles} mi
        </text>
        <motion.g
          initial={{ x: X0, y: COAST_Y + 10 }}
          animate={{ x: X0 + BW, y: COAST_Y + 10 }}
          transition={{ duration: 1.3, ease: "linear" }}
        >
          <text x={0} y={4} textAnchor="middle" fontSize="13">
            {icon}
          </text>
        </motion.g>
        <motion.text
          x={X0 + BW + 12}
          y={COAST_Y + 14}
          fontSize="10.5"
          fontWeight="800"
          fill={SLOW}
          fontFamily={numberFont}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
        >
          {coastalMinutes} min
        </motion.text>

        {/* highway: one chunk at 3x speed, then tiled to the full distance */}
        <AnimatePresence>
          {showHighway && (
            <motion.g key="hwy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x={X0} y={HWY_Y - 14} fontSize="8.5" fontWeight="800" fill={FAST} fontFamily={numberFont}>
                Highway ({speedRatio}× speed)
              </text>
              {Array.from({ length: showTiles ? chunks : 1 }).map((_, i) => (
                <motion.g
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 260, damping: 17, delay: i * 0.12 }}
                  style={{ transformBox: "fill-box", transformOrigin: "center" }}
                >
                  <rect x={tileX(i)} y={HWY_Y} width={BW} height={20} rx={3} fill={ROAD} stroke={FAST} strokeWidth={1.6} />
                  <text x={tileX(i) + BW / 2} y={HWY_Y + 33} textAnchor="middle" fontSize="8" fontWeight="800" fill={FAST} fontFamily={numberFont}>
                    {coastalMiles} mi
                  </text>
                  <text x={tileX(i) + BW / 2} y={HWY_Y - 3} textAnchor="middle" fontSize="8" fontWeight="800" fill={FAST} fontFamily={numberFont}>
                    {unitTime}m
                  </text>
                </motion.g>
              ))}
              <motion.g
                key={showTiles ? "car-all" : "car-one"}
                initial={{ x: X0, y: HWY_Y + 10 }}
                animate={{ x: roadEndX, y: HWY_Y + 10 }}
                transition={{ duration: showTiles ? 1.1 : 0.45, ease: "linear" }}
              >
                <text x={0} y={4} textAnchor="middle" fontSize="13">
                  {icon}
                </text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>

        {/* the working */}
        <AnimatePresence>
          {isFinal && (
            <motion.g key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              <motion.text
                x={X0}
                y={172}
                fontSize="12"
                fontWeight="800"
                fill={FAST}
                fontFamily={numberFont}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {chunks} × {unitTime} = {highwayMinutes} min highway
              </motion.text>
              <motion.text
                x={X0}
                y={196}
                fontSize="16"
                fontWeight="800"
                fill={WIN}
                fontFamily={numberFont}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 220, damping: 15, delay: 1.3 }}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {highwayMinutes} + {coastalMinutes} = {total} min
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
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
        {isFinal && (
          <motion.span
            key="chk"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: agrees ? "#94a3b8" : BAD, textAlign: "center" }}
          >
            {agrees
              ? trapChoice
                ? `forgetting the coastal minutes gives ${highwayMinutes} — choice ${trapChoice.label}`
                : `checks out: ${total} min total`
              : `this gives ${total}, which is not the stored answer`}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.7 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
