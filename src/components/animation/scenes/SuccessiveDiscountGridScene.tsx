import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const AMBER = "#d97706";
const DIM = "#94a3b8";

function Cell({ index, x, y, color, delay = 0, size = 18 }: { index: number; x: number; y: number; color: string; delay?: number; size?: number }) {
  return <motion.rect key={index} x={x} y={y} width={size} height={size} rx="3" fill={color} stroke="#fff" strokeWidth="1" initial={{ scale: 0.25, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay, type: "spring", stiffness: 220, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />;
}

/** Apply two percentage cuts to a hundred-cell price tag, preserving the second discount's reduced base. */
export function SuccessiveDiscountGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.startPrice, 100);
  const firstPercent = num(data.firstPercentOff, 30);
  const secondPercent = num(data.secondPercentOff, 20);
  const firstCut = start * firstPercent / 100;
  const afterFirst = start - firstCut;
  const secondCut = afterFirst * secondPercent / 100;
  const finalPrice = afterFirst - secondCut;
  const totalCut = firstCut + secondCut;
  const totalPercent = totalCut / start * 100;
  const choice = (problem.choices ?? []).find((item) => item.text.trim() === `${totalPercent}%`)?.label;
  const valid = Number.isInteger(firstCut) && Number.isInteger(secondCut) && totalPercent === Number(String(problem.shortAnswer).replace("%", "")) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const gridX = 42;
  const gridY = 47;
  const gap = 20;

  const colorFor = (index: number) => index < firstCut ? "#fecaca" : index < totalCut ? "#fde68a" : "#bbf7d0";

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="A one-hundred-cell price tag loses thirty cells, then fourteen of the seventy remaining cells, for a total discount of forty-four percent">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "take 30% from a $100 price tag" : phase === 1 ? "the second 20% acts only on the 70 cells left" : "regroup both discounts and compare with the final price"}
        </text>

        {phase < 2 && (
          <>
            <rect x={gridX - 4} y={gridY - 4} width="208" height="208" rx="9" fill="#f8fafc" stroke={INK} strokeWidth="1.5" />
            {Array.from({ length: 100 }, (_, index) => {
              const x = gridX + (index % 10) * gap;
              const y = gridY + Math.floor(index / 10) * gap;
              const color = phase === 0 ? (index < firstCut ? "#fecaca" : "#c7d2fe") : colorFor(index);
              return <Cell key={index} index={index} x={x} y={y} color={color} delay={index * 0.006} />;
            })}
            <g transform="translate(280 55)">
              <path d="M 16 0 H 143 V 55 H 16 L 0 27.5 Z" fill={phase === 0 ? "#eef2ff" : "#ecfdf5"} stroke={phase === 0 ? IND : GREEN} strokeWidth="2" />
              <circle cx="16" cy="27.5" r="3" fill="#fff" stroke={INK} />
              <text x="82" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SALE PRICE</text>
              <motion.text key={phase} x="82" y="44" textAnchor="middle" fontSize="18" fontWeight="950" fill={phase === 0 ? IND : GREEN} fontFamily={FONT} initial={{ scale: 0.5 }} animate={{ scale: 1 }}>${phase === 0 ? afterFirst : finalPrice}</motion.text>
            </g>
          </>
        )}

        {phase === 0 && (
          <>
            <motion.path d="M 34 105 H 253" stroke={RED} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
            <text x="354" y="144" textAnchor="middle" fontSize="14" fontWeight="950" fill={RED} fontFamily={FONT}>30 cells removed</text>
            <text x="354" y="169" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>{start} − {firstCut} = {afterFirst}</text>
            <path d="M 272 184 h 164" stroke={DIM} strokeWidth="1.5" />
            <text x="354" y="208" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>70% of the original remains</text>
          </>
        )}

        {phase === 1 && (
          <>
            <motion.rect x={gridX - 5} y={gridY + 3 * gap - 5} width="208" height="32" rx="6" fill="none" stroke={AMBER} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <motion.rect x={gridX - 5} y={gridY + 4 * gap - 5} width="88" height="32" rx="6" fill="none" stroke={AMBER} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.25 }} />
            <text x="354" y="143" textAnchor="middle" fontSize="13" fontWeight="950" fill={AMBER} fontFamily={FONT}>20% of 70 = {secondCut}</text>
            <text x="354" y="170" textAnchor="middle" fontSize="16" fontWeight="950" fill={GREEN} fontFamily={FONT}>{afterFirst} − {secondCut} = {finalPrice}</text>
            <text x="354" y="200" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>The orange cells leave now:</text>
            <text x="354" y="215" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>14 cells, not 20 original cells.</text>
          </>
        )}

        <AnimatePresence>
          {phase === 2 && (
            <motion.g key="regroup" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="132" y="47" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED}>DISCOUNTED</text>
              <text x="340" y="47" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>FINAL PRICE</text>
              {Array.from({ length: totalCut }, (_, i) => <Cell key={`off-${i}`} index={i} x={64 + (i % 10) * 14} y={62 + Math.floor(i / 10) * 14} size={12} color={i < firstCut ? "#fca5a5" : "#fcd34d"} delay={i * 0.012} />)}
              {Array.from({ length: finalPrice }, (_, i) => <Cell key={`paid-${i}`} index={i} x={278 + (i % 10) * 14} y={62 + Math.floor(i / 10) * 14} size={12} color="#86efac" delay={0.18 + i * 0.008} />)}
              <text x="132" y="156" textAnchor="middle" fontSize="18" fontWeight="950" fill={RED} fontFamily={FONT}>{firstCut} + {secondCut} = {totalCut}</text>
              <text x="340" y="156" textAnchor="middle" fontSize="18" fontWeight="950" fill={GREEN} fontFamily={FONT}>{finalPrice}</text>
              <motion.path d="M 165 185 H 305" stroke={IND} strokeWidth="2" markerEnd="url(#discountArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
              <text x="235" y="211" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>out of the original {start} cells</text>
              <rect x="105" y="228" width="260" height="48" rx="14" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="235" y="258" textAnchor="middle" fontSize="20" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{totalCut} ÷ {start} = {totalPercent}% off</text>
              <text x="195" y="302" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "30 + 14 + 56 = 100 • percent and choice verified" : `check failed: computed ${totalPercent}%, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={427} y={287} width={72} />
            </motion.g>
          )}
        </AnimatePresence>

        <defs><marker id="discountArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={IND} /></marker></defs>
      </svg>
    </div>
  );
}
