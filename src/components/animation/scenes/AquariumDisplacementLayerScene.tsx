import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", CYAN = "#0891b2", GREEN = "#16a34a", ROCK = "#78716c", GOLD = "#d97706", RED = "#dc2626", DIM = "#94a3b8";
const tidy = (v: number) => Number(v.toFixed(6)).toString();

/** A submerged solid turns into an equal-volume layer over a rectangular base. Data: { length, width, tankHeight, waterDepth, objectVolume }. */
export function AquariumDisplacementLayerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const length = num(data.length, 0), width = num(data.width, 0), tankHeight = num(data.tankHeight, 0);
  const waterDepth = num(data.waterDepth, 0), objectVolume = num(data.objectVolume, 0);
  const baseArea = length * width, rise = objectVolume / baseArea, finalDepth = waterDepth + rise;
  const choice = problem.choices?.find((c) => Number(c.text) === rise)?.label;
  const ok = baseArea > 0 && rise > 0 && finalDepth < tankHeight && String(rise) === String(problem.shortAnswer) && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "5px 3px" }}>
    <svg viewBox="0 0 420 292" width="100%" style={{ maxWidth: 450 }}>
      <text x="210" y="18" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>
        {phase === 0 ? "the water rises across the whole rectangular base" : phase === 1 ? "the submerged rock displaces an equal-volume layer" : "solve the thickness of that layer"}
      </text>

      {phase === 0 && <>
        <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <path d="M 73 86 L 294 55 L 350 116 L 128 149 Z" fill="#ecfeff" stroke={CYAN} strokeWidth="2.4" />
          {Array.from({ length: 5 }, (_, i) => <line key={`v${i}`} x1={73 + i * 44.2} y1={86 - i * 6.2} x2={128 + i * 44.4} y2={149 - i * 6.6} stroke="#a5f3fc" strokeWidth="1" />)}
          {Array.from({ length: 4 }, (_, i) => <line key={`h${i}`} x1={73 + i * 13.8} y1={86 + i * 15.6} x2={294 + i * 14} y2={55 + i * 15.2} stroke="#a5f3fc" strokeWidth="1" />)}
        </motion.g>
        <path d="M 71 165 H 351" stroke={IND} strokeWidth="1.5" />
        <path d="M 71 160 V 170 M 351 160 V 170" stroke={IND} strokeWidth="1.5" />
        <text x="211" y="183" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{length} cm</text>
        <path d="M 57 86 L 112 149" stroke={GOLD} strokeWidth="1.5" />
        <path d="M 54 82 l 1 9 7 -6 M 107 151 l 9 1 -3 -8" fill="none" stroke={GOLD} strokeWidth="1.5" />
        <text x="69" y="132" textAnchor="middle" fontSize="11" fontWeight="900" fill={GOLD} fontFamily={FONT} transform="rotate(49 69 132)">{width} cm</text>
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
          <rect x="102" y="213" width="216" height="48" rx="12" fill="#eef2ff" stroke="#c7d2fe" />
          <text x="210" y="244" textAnchor="middle" fontSize="20" fontWeight="950" fill={IND} fontFamily={FONT}>{length} × {width} = {baseArea} cm²</text>
        </motion.g>
      </>}

      {phase === 1 && <>
        <Tank x={24} y={43} w={226} h={207} tankHeight={tankHeight} waterDepth={waterDepth} rise={rise} rock />
        <motion.path d="M 210 137 C 267 130 269 96 298 91" fill="none" stroke={GOLD} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
        <path d="M 299 91 l -8 -2 5 7 z" fill={GOLD} />
        <g transform="translate(278 49)">
          <rect width="126" height="150" rx="13" fill="#fffbeb" stroke="#fbbf24" strokeWidth="1.8" />
          <text x="63" y="20" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={GOLD}>ZOOM: NEW LAYER</text>
          <rect x="15" y="79" width="96" height="28" fill="#cffafe" stroke={CYAN} strokeWidth="1.5" />
          <motion.rect x="15" y="60" width="96" height="19" fill="#67e8f9" stroke={CYAN} strokeWidth="1.5" initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ type: "spring", delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "bottom" }} />
          <text x="63" y="47" textAnchor="middle" fontSize="11" fontWeight="900" fill={CYAN} fontFamily={FONT}>thickness h</text>
          <text x="63" y="124" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>base {baseArea} cm²</text>
          <text x="63" y="142" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={GREEN} fontFamily={FONT}>{baseArea}h = {objectVolume}</text>
        </g>
        <text x="137" y="278" textAnchor="middle" fontSize="10" fontWeight="850" fill={CYAN} fontFamily={FONT}>main tank: true scale — rise is very thin</text>
      </>}

      {phase === 2 && <>
        <Tank x={20} y={43} w={190} h={201} tankHeight={tankHeight} waterDepth={waterDepth} rise={rise} rock />
        <g transform="translate(230 49)">
          <rect width="172" height="182" rx="14" fill="#f8fafc" stroke="#cbd5e1" />
          <text x="86" y="29" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{baseArea}h = {objectVolume}</text>
          <line x1="32" y1="52" x2="140" y2="52" stroke={DIM} strokeWidth="1.5" />
          <text x="86" y="77" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>h = {objectVolume}/{baseArea}</text>
          <motion.text x="86" y="112" textAnchor="middle" fontSize="25" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.35 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>h = {tidy(rise)} cm</motion.text>
          <text x="86" y="141" textAnchor="middle" fontSize="11" fontWeight="850" fill={CYAN} fontFamily={FONT}>{waterDepth} + {tidy(rise)} = {tidy(finalDepth)} cm</text>
          <text x="86" y="164" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `below the ${tankHeight} cm rim ✓` : "volume/depth check failed"}</text>
        </g>
        <SvgAnswerBadge show={ok} answer={problem.answer == null ? null : String(problem.answer)} cx={316} y={248} width={86} />
      </>}
    </svg>
  </div>;
}

function Tank({ x, y, w, h, tankHeight, waterDepth, rise, rock }: { x: number; y: number; w: number; h: number; tankHeight: number; waterDepth: number; rise: number; rock?: boolean }) {
  const bottom = y + h, waterY = bottom - (waterDepth / tankHeight) * h, finalY = bottom - ((waterDepth + rise) / tankHeight) * h;
  return <g>
    <rect x={x} y={waterY} width={w} height={bottom - waterY} fill="#cffafe" opacity="0.85" />
    <rect x={x} y={finalY} width={w} height={Math.max(1.5, waterY - finalY)} fill="#22d3ee" />
    <path d={`M ${x} ${y} V ${bottom} H ${x + w} V ${y}`} fill="none" stroke={INK} strokeWidth="2.5" />
    <line x1={x} y1={waterY} x2={x + w} y2={waterY} stroke={CYAN} strokeWidth="1.4" strokeDasharray="4 3" />
    <line x1={x} y1={finalY} x2={x + w} y2={finalY} stroke={GREEN} strokeWidth="1.8" />
    <text x={x + 5} y={waterY + 15} fontSize="9.5" fontWeight="850" fill={CYAN} fontFamily={FONT}>{waterDepth} cm</text>
    <text x={x + w - 4} y={finalY - 6} textAnchor="end" fontSize="9.5" fontWeight="850" fill={GREEN} fontFamily={FONT}>+{tidy(rise)} cm</text>
    {rock && <motion.path d={`M ${x + w * .46} ${bottom - 9} l 13 -31 25 -8 24 22 -7 28 z`} fill={ROCK} stroke="#57534e" strokeWidth="1.5" initial={{ y: -100, rotate: -12 }} animate={{ y: 0, rotate: 0 }} transition={{ type: "spring", stiffness: 75, damping: 14, delay: 0.2 }} />}
  </g>;
}
