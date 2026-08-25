import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BELLA = "#0d9488";
const ELLA = "#db2777";
const DIM = "#94a3b8";

const tidy = (n: number) => Number.isInteger(n) ? n.toLocaleString("en-US") : String(Number(n.toFixed(3)));

function Walker() {
  return (
    <g>
      <circle cx="0" cy="-23" r="6" fill="#f5cfa8" stroke={INK} strokeWidth="1.2" />
      <path d="M -5,-16 Q 0,-20 5,-16 L 4,-3 L -4,-3 Z" fill={BELLA} stroke={INK} strokeWidth="1.2" />
      <line x1="-2" y1="-3" x2="-7" y2="8" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <line x1="2" y1="-3" x2="8" y2="8" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <line x1="-4" y1="-12" x2="-10" y2="-5" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="-12" x2="10" y2="-7" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M -4,-27 Q 0,-32 5,-27" fill="#78350f" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function Cyclist() {
  return (
    <g>
      <circle cx="-10" cy="2" r="8" fill="none" stroke={INK} strokeWidth="1.8" />
      <circle cx="12" cy="2" r="8" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M -10,2 L -1,-10 L 5,2 Z M -1,-10 L 12,2 M -4,-6 L 7,-6" fill="none" stroke={ELLA} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="-2" cy="-21" r="5" fill="#f5cfa8" stroke={INK} strokeWidth="1.1" />
      <path d="M -3,-16 L -1,-9 L 7,-6" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
      <path d="M -7,-24 Q -2,-29 3,-23" fill={ELLA} stroke={ELLA} strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

/**
 * Two travellers move toward one another at a 1:5 speed ratio. Six equal road
 * pieces make the meeting position visible: the walker covers one and the
 * cyclist covers five. The walker's piece then becomes a footprint ruler whose
 * 2.5-foot steps compute the answer. Data:
 * { distanceFeet, speedRatio, stepLength, walker?, cyclist? }.
 */
export function RatioMeetStepsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const distance = Math.max(0, num(data.distanceFeet, 0));
  const ratio = Math.max(1, Math.round(num(data.speedRatio, 1)));
  const stepLength = Math.max(0, num(data.stepLength, 0));
  const walker = typeof data.walker === "string" ? data.walker : "Bella";
  const cyclist = typeof data.cyclist === "string" ? data.cyclist : "Ella";
  const parts = ratio + 1;
  const bellaDistance = distance / parts;
  const steps = stepLength > 0 ? bellaDistance / stepLength : 0;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.]/g, ""));
  const answerOk = Number.isFinite(steps) && Number.isInteger(steps) && (!Number.isFinite(stored) || Math.abs(stored - steps) < 1e-9);
  const isFinal = step >= totalSteps - 1;

  const W = 460;
  const X0 = 38;
  const X1 = 422;
  const roadY = 100;
  const partW = (X1 - X0) / parts;
  const meetX = X0 + partW;

  const Footprint = ({ x, y, flip = false }: { x: number; y: number; flip?: boolean }) => (
    <g transform={`translate(${x} ${y}) scale(${flip ? -1 : 1} 1)`}>
      <ellipse cx="0" cy="0" rx="4" ry="7" fill={BELLA} fillOpacity="0.78" transform="rotate(-18)" />
      <circle cx="4" cy="-7" r="1.5" fill={BELLA} />
      <circle cx="1" cy="-9" r="1.3" fill={BELLA} />
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 250`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? `${cyclist} rides 5 parts while ${walker} walks 1` : isFinal ? "turn Bella's distance into footsteps" : "Bella owns one of six equal distance parts"}
        </text>

        <g>
          {Array.from({ length: parts }, (_, i) => (
            <motion.rect
              key={i}
              x={X0 + i * partW}
              y={roadY}
              width={partW}
              height="24"
              fill={i === 0 ? "#ccfbf1" : "#fce7f3"}
              stroke={i === 0 ? BELLA : ELLA}
              strokeWidth="1.2"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.35, delay: i * 0.09 }}
              style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            />
          ))}
          <text x={(X0 + X1) / 2} y="140" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM} fontFamily={FONT}>
            {tidy(distance)} ft total = {parts} equal parts
          </text>
          <line x1={meetX} y1="84" x2={meetX} y2="130" stroke={WIN} strokeWidth="2" strokeDasharray="4 3" />
          <text x={meetX + 20} y="83" textAnchor="middle" fontSize="10" fontWeight="900" fill={WIN}>MEET</text>
        </g>

        <motion.g
          initial={false}
          animate={{ x: step === 0 ? [X0, meetX] : meetX, y: roadY - 3 }}
          transition={{ duration: 1.7, ease: "linear" }}
        >
          <Walker />
        </motion.g>
        <motion.g
          initial={false}
          animate={{ x: step === 0 ? [X1, meetX] : meetX, y: roadY - 29 }}
          transition={{ duration: 1.7, ease: "linear" }}
        >
          <g transform="scale(-1 1)"><Cyclist /></g>
        </motion.g>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="ratio" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.45 }}>
              <text x={X0 + partW / 2} y="164" textAnchor="middle" fontSize="11" fontWeight="900" fill={BELLA} fontFamily={FONT}>1 part</text>
              <text x={meetX + (X1 - meetX) / 2} y="164" textAnchor="middle" fontSize="11" fontWeight="900" fill={ELLA} fontFamily={FONT}>5 parts</text>
              <text x={W / 2} y="192" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>1 : 5 → 6 parts together</text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g key="distance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <motion.path d={`M ${X0} 165 L ${meetX} 165`} stroke={BELLA} strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65 }} />
              <text x={W / 2} y="195" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>
                {tidy(distance)} ÷ {parts} = {tidy(bellaDistance)} ft
              </text>
            </motion.g>
          )}
          {isFinal && (
            <motion.g key="steps" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {Array.from({ length: 8 }, (_, i) => (
                <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 * i }}>
                  <Footprint x={100 + i * 38} y={169 + (i % 2) * 8} flip={i % 2 === 1} />
                </motion.g>
              ))}
              <text x={W / 2} y="202" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>
                {tidy(bellaDistance)} ÷ {tidy(stepLength)} = {tidy(steps)} steps
              </text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="181" y="216" width="98" height="24" rx="12" fill={answerOk ? WIN : "#dc2626"} />
                <text x={W / 2} y="232" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">Answer {answerOk ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
