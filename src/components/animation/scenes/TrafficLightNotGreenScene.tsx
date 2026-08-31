import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const GREEN = "#16a34a";
const YELLOW = "#f59e0b";
const RED_C = "#dc2626";
const DIM = "#94a3b8";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

/**
 * A traffic light's cycle drawn as a proportional segmented bar (green,
 * yellow, red), matching the light itself rather than an abstract pie —
 * then the yellow and red segments are pulled together into one "not
 * green" block before their combined length is turned into a fraction of
 * the full cycle and reduced.
 * Data: { green, yellow, red }.
 */
export function TrafficLightNotGreenScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const green = Math.round(num(data.green, 25));
  const yellow = Math.round(num(data.yellow, 5));
  const red = Math.round(num(data.red, 30));
  const total = green + yellow + red;
  const notGreen = yellow + red;
  const g = gcd(notGreen, total) || 1;
  const simpNum = notGreen / g;
  const simpDen = total / g;
  const answer = answerOf(problem);
  const valid = `${simpNum}/${simpDen}` === (problem.shortAnswer ?? "").trim();

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: whole bar, 1: split into 3 segments, 2: highlight not-green + sum, 3: form fraction, 4: simplify + answer
  const showSplit = beat >= 1;
  const showNotGreen = beat >= 2;
  const showFraction = beat >= 3;
  const showConclude = beat >= 4;

  const W = 340;
  const H = 216;
  const barX = 20;
  const barY = 70;
  const barW = W - 40;
  const barH = 40;
  const gw = (barW * green) / total;
  const yw = (barW * yellow) / total;
  const rw = (barW * red) / total;

  const caption =
    beat === 0
      ? `a 60-second cycle: green ${green}, yellow ${yellow}, red ${red}`
      : beat === 1
      ? `three segments proportional to their seconds`
      : beat === 2
      ? `not green = yellow + red = ${yellow} + ${red} = ${notGreen}`
      : beat === 3
      ? `probability = ${notGreen}/${total}`
      : `${notGreen}/${total} = ${simpNum}/${simpDen}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380, minWidth: 0, display: "block" }} aria-label="A traffic light cycle drawn as a segmented bar, split into green and not-green">
        {!showSplit && (
          <motion.rect x={barX} y={barY} width={barW} height={barH} rx="8" fill="#eef2ff" stroke={INK} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
        )}
        {!showSplit && (
          <text x={W / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>
            {total}s cycle
          </text>
        )}

        {showSplit && (
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <motion.rect x={barX} y={barY} width={gw} height={barH} fill={GREEN} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
            <motion.rect x={barX + gw} y={barY} width={yw} height={barH} fill={YELLOW} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
            <motion.rect x={barX + gw + yw} y={barY} width={rw} height={barH} fill={RED_C} initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.3 }} style={{ transformBox: "fill-box", transformOrigin: "left" }} />
            <rect x={barX} y={barY} width={barW} height={barH} rx="8" fill="none" stroke={INK} strokeWidth="2" />
            <text x={barX + gw / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily={FONT}>
              {green}
            </text>
            <text x={barX + gw + yw / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize="10" fontWeight="900" fill="#78350f" fontFamily={FONT}>
              {yellow}
            </text>
            <text x={barX + gw + yw + rw / 2} y={barY + barH / 2 + 5} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily={FONT}>
              {red}
            </text>
          </motion.g>
        )}

        {/* not-green bracket under yellow+red */}
        <AnimatePresence>
          {showNotGreen && (
            <motion.g key="bracket" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <path d={`M ${barX + gw} ${barY + barH + 10} H ${barX + gw + yw + rw}`} stroke={INK} strokeWidth="2" />
              <path d={`M ${barX + gw} ${barY + barH + 5} V ${barY + barH + 10}`} stroke={INK} strokeWidth="2" />
              <path d={`M ${barX + gw + yw + rw} ${barY + barH + 5} V ${barY + barH + 10}`} stroke={INK} strokeWidth="2" />
              <text x={barX + gw + (yw + rw) / 2} y={barY + barH + 26} textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>
                not green: {notGreen}s
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        {showFraction && (
          <motion.text x={W / 2} y={barY + barH + 56} textAnchor="middle" fontSize="16" fontWeight="950" fill={showConclude ? (valid ? GREEN : RED_C) : INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }}>
            {showConclude ? `${notGreen}/${total} = ${simpNum}/${simpDen}` : `${notGreen}/${total}`}
          </motion.text>
        )}

        <SvgAnswerBadge show={showConclude} answer={answer} cx={W / 2} y={barY + barH + 68} width={92} />
      </svg>

      <motion.span
        key={step}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: FONT,
          fontSize: 12,
          fontWeight: 800,
          color: showConclude ? (valid ? "#166534" : "#dc2626") : INK,
          background: showConclude ? (valid ? "#dcfce7" : "#fef2f2") : "#eef2ff",
          border: `1px solid ${showConclude ? (valid ? "#bbf7d0" : "#fecaca") : "#c7d2fe"}`,
          padding: "5px 12px",
          borderRadius: 10,
          textAlign: "center",
          maxWidth: 320,
        }}
      >
        {caption}
      </motion.span>
    </div>
  );
}
