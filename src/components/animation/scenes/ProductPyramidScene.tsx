import { motion } from "motion/react";
import type { ReactNode } from "react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

const W = 100, H = 76;
const TOP_Y = 30, MID_Y = TOP_Y + H, BOT_Y = MID_Y + H;
const TOP_X = [80, 180, 280], MID_X = [130, 230], BOT_X = [180];

function BoxFrame({ x, y, delay, children }: { x: number; y: number; delay: number; children: ReactNode }) {
  return (
    <g>
      <motion.rect x={x} y={y} width={W} height={H} fill="#fff" stroke={INK} strokeWidth="1.6" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 18, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
      {children}
    </g>
  );
}

function Ring({ x, y, color, delay }: { x: number; y: number; color: string; delay: number }) {
  return (
    <motion.rect x={x - 4} y={y - 4} width={W + 8} height={H + 8} rx="6" fill="none" stroke={color} strokeWidth="3" strokeDasharray="7 5" initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
  );
}

/** A dashed "?" that crossfades to its solved value once the scene resolves it. */
function Cell({ x, y, value, solved, delay, color }: { x: number; y: number; value: number; solved: boolean; delay: number; color: string }) {
  const cx = x + W / 2, cy = y + H / 2 + 8;
  if (!solved) return <text x={cx} y={cy} textAnchor="middle" fontSize="24" fontWeight="800" fill={DIM} fontFamily={FONT}>?</text>;
  return (
    <>
      <motion.text x={cx} y={cy} textAnchor="middle" fontSize="24" fontWeight="800" fill={DIM} fontFamily={FONT} initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ delay }}>?</motion.text>
      <motion.text x={cx} y={cy} textAnchor="middle" fontSize="24" fontWeight="900" fill={color} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>{value}</motion.text>
    </>
  );
}

function Known({ x, y, value, delay }: { x: number; y: number; value: number; delay: number }) {
  return <motion.text x={x + W / 2} y={y + H / 2 + 8} textAnchor="middle" fontSize="24" fontWeight="800" fill={INK} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}>{value}</motion.text>;
}

// Two boxes multiply to make the box below them, all the way down to 600 —
// solved by working back up: the missing middle number from 600, then the
// missing top number from that. Data: { topLeft, topMid, midLeft, bottom }
// (topRight and midRight are the two unknowns the scene derives).
export function ProductPyramidScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const topLeft = num(data.topLeft, 0), topMid = num(data.topMid, 0), midLeft = num(data.midLeft, 0), bottom = num(data.bottom, 0);
  const midRight = midLeft !== 0 ? bottom / midLeft : NaN;
  const topRight = topMid !== 0 ? midRight / topMid : NaN;

  const exampleOk = topLeft * topMid === midLeft;
  const midRightOk = Number.isInteger(midRight) && midLeft * midRight === bottom;
  const topRightOk = Number.isInteger(topRight) && topMid * topRight === midRight;
  const choiceLabel = (problem.choices ?? []).find((c) => String(c.text).trim() === String(topRight))?.label;
  const answerOk = String(topRight) === String(problem.shortAnswer ?? "").trim();
  const ok = exampleOk && midRightOk && topRightOk && answerOk && choiceLabel === problem.answer;
  const failure = !exampleOk ? `given example ${topLeft}×${topMid} ≠ ${midLeft}` : !midRightOk ? `${midLeft}×? = ${bottom} has no whole solution` : !topRightOk ? `${topMid}×? = ${midRight} has no whole solution` : !answerOk ? `computed ${topRight}, stored ${problem.shortAnswer}` : `choice ${choiceLabel ?? "missing"}, stored ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const gridDelay = (row: number, col: number) => 0.05 + row * 0.22 + col * 0.1;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "each box is the product of the two boxes above it — work up from 600" : phase === 1 ? "now the missing top number falls out the same way" : "the missing top number is 4"}
        </text>

        <BoxFrame x={TOP_X[0]} y={TOP_Y} delay={gridDelay(0, 0)}><Known x={TOP_X[0]} y={TOP_Y} value={topLeft} delay={gridDelay(0, 0)} /></BoxFrame>
        <BoxFrame x={TOP_X[1]} y={TOP_Y} delay={gridDelay(0, 1)}><Known x={TOP_X[1]} y={TOP_Y} value={topMid} delay={gridDelay(0, 1)} /></BoxFrame>
        <BoxFrame x={TOP_X[2]} y={TOP_Y} delay={gridDelay(0, 2)}>
          <Cell x={TOP_X[2]} y={TOP_Y} value={topRight} solved={phase >= 1} delay={phase === 1 ? 1.1 : 0} color={phase >= 2 ? GREEN : TEAL} />
        </BoxFrame>

        <BoxFrame x={MID_X[0]} y={MID_Y} delay={gridDelay(1, 0)}><Known x={MID_X[0]} y={MID_Y} value={midLeft} delay={gridDelay(1, 0)} /></BoxFrame>
        <BoxFrame x={MID_X[1]} y={MID_Y} delay={gridDelay(1, 1)}>
          <Cell x={MID_X[1]} y={MID_Y} value={midRight} solved={phase >= 0} delay={phase === 0 ? 1.0 : 0} color={IND} />
        </BoxFrame>

        <BoxFrame x={BOT_X[0]} y={BOT_Y} delay={gridDelay(2, 0)}><Known x={BOT_X[0]} y={BOT_Y} value={bottom} delay={gridDelay(2, 0)} /></BoxFrame>

        {phase === 0 && (
          <>
            <Ring x={MID_X[0]} y={MID_Y} color={IND} delay={0.6} />
            <Ring x={MID_X[1]} y={MID_Y} color={IND} delay={0.6} />
            <Ring x={BOT_X[0]} y={BOT_Y} color={IND} delay={0.6} />
            <motion.text x="230" y="288" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}>
              {midLeft} × x = {bottom}
            </motion.text>
            <motion.text x="230" y="308" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
              x = {bottom} ÷ {midLeft} = <tspan fill={GREEN}>{midRight}</tspan>
            </motion.text>
          </>
        )}

        {phase === 1 && (
          <>
            <Ring x={TOP_X[1]} y={TOP_Y} color={TEAL} delay={0.15} />
            <Ring x={TOP_X[2]} y={TOP_Y} color={TEAL} delay={0.15} />
            <Ring x={MID_X[1]} y={MID_Y} color={TEAL} delay={0.15} />
            <motion.text x="230" y="288" textAnchor="middle" fontSize="15" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
              {topMid} × y = {midRight}
            </motion.text>
            <motion.text x="230" y="308" textAnchor="middle" fontSize="15" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
              y = {midRight} ÷ {topMid} = <tspan fill={GREEN}>{topRight}</tspan>
            </motion.text>
          </>
        )}

        {phase === 2 && (
          <>
            <Ring x={TOP_X[2]} y={TOP_Y} color={GREEN} delay={0.1} />
            <text x="230" y="288" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "given example, both products, and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={296} width={100} />
          </>
        )}
      </svg>
    </div>
  );
}
