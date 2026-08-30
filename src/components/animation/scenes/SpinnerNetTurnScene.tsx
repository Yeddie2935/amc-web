import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const WIN = "#16a34a";
const DIM = "#94a3b8";

const CX = 230;
const CY = 128;
const R = 70;

// Compass angle in degrees measured clockwise from north (N=0, E=90, S=180, W=270).
function pointAt(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}
function dirName(deg: number) {
  const d = ((deg % 360) + 360) % 360;
  if (Math.abs(d - 0) < 1) return "N";
  if (Math.abs(d - 90) < 1) return "E";
  if (Math.abs(d - 180) < 1) return "S";
  if (Math.abs(d - 270) < 1) return "W";
  return `${d}°`;
}
function fracLabel(rev: number) {
  const whole = Math.floor(rev);
  const frac = rev - whole;
  const fracStr = Math.abs(frac - 0.25) < 1e-9 ? "1/4" : Math.abs(frac - 0.5) < 1e-9 ? "1/2" : Math.abs(frac - 0.75) < 1e-9 ? "3/4" : "";
  if (whole === 0) return `${fracStr} rev`.trim();
  return `${whole} ${fracStr} rev`.trim();
}

/**
 * A compass arrow starts west, spins clockwise then counterclockwise by the
 * given revolution counts, and lands on the net direction.
 * Data: { startDeg: 270, cwRevolutions: 2.25, ccwRevolutions: 3.75 }.
 */
export function SpinnerNetTurnScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const startDeg = num(data.startDeg, 270);
  const cwRev = num(data.cwRevolutions, 2.25);
  const ccwRev = num(data.ccwRevolutions, 3.75);

  const afterCw = startDeg + cwRev * 360;
  const afterCcw = afterCw - ccwRev * 360;
  const netCcwRev = ccwRev - cwRev;

  const isFinal = step >= totalSteps - 1;
  const angle = step === 0 ? startDeg : step === 1 ? afterCw : afterCcw;
  const tip = pointAt(angle, R - 10);

  const arcPath = (from: number, to: number, r: number) => {
    const p1 = pointAt(from, r);
    const p2 = pointAt(to, r);
    const large = Math.abs(to - from) % 360 > 180 ? 1 : 0;
    const sweep = to > from ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} ${sweep} ${p2.x} ${p2.y}`;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox="0 0 460 300" width="100%" style={{ maxWidth: 470 }}>
        <text x={CX} y="16" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0
            ? "the spinner starts pointing west"
            : step === 1
              ? `clockwise ${fracLabel(cwRev)}`
              : step === 2
                ? `counterclockwise ${fracLabel(ccwRev)}`
                : "check the net turn, then confirm"}
        </text>

        <circle cx={CX} cy={CY} r={R} fill="#f8fafc" stroke={INK} strokeWidth="2.2" />
        {[0, 90, 180, 270].map((d) => {
          const p = pointAt(d, R + 15);
          const label = d === 0 ? "N" : d === 90 ? "E" : d === 180 ? "S" : "W";
          return (
            <text key={d} x={p.x} y={p.y + 5} textAnchor="middle" fontSize="14" fontWeight="800" fill={DIM} fontFamily={FONT}>
              {label}
            </text>
          );
        })}
        <circle cx={CX} cy={CY} r="4" fill={INK} />

        {step === 1 && (
          <motion.path
            d={arcPath(startDeg, afterCw, R - 22)}
            fill="none"
            stroke={BLUE}
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.9 }}
          />
        )}
        {step === 2 && (
          <>
            <path d={arcPath(startDeg, afterCw, R - 22)} fill="none" stroke={BLUE} strokeWidth="2" strokeOpacity="0.35" />
            <motion.path
              d={arcPath(afterCw, afterCcw, R - 22)}
              fill="none"
              stroke={ORANGE}
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9 }}
            />
          </>
        )}

        <motion.line
          x1={CX}
          y1={CY}
          stroke={WIN}
          strokeWidth="4"
          strokeLinecap="round"
          initial={false}
          animate={{ x2: tip.x, y2: tip.y }}
          transition={{ type: "spring", stiffness: 90, damping: 14 }}
        />

        <AnimatePresence>
          {step >= 1 && (
            <motion.text
              key={`label-${step}`}
              x={CX}
              y="232"
              textAnchor="middle"
              fontSize="12"
              fontWeight="800"
              fill={step === 2 ? ORANGE : BLUE}
              fontFamily={FONT}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {step === 1 ? `after the clockwise turn → points ${dirName(afterCw)}` : `after the counterclockwise turn → points ${dirName(afterCcw)}`}
            </motion.text>
          )}
        </AnimatePresence>

        {isFinal && (
          <text x={CX} y="254" textAnchor="middle" fontSize="11.5" fontWeight="750" fill={IND} fontFamily={FONT}>
            net turn = {fracLabel(ccwRev)} − {fracLabel(cwRev)} = {fracLabel(netCcwRev)} counterclockwise
          </text>
        )}

        <SvgAnswerBadge show={isFinal} answer={problem.answer != null ? String(problem.answer) : null} cx={CX} y={266} />
      </svg>
    </div>
  );
}
