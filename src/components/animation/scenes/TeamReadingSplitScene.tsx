import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const BLUE = "#2563eb";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * A page-count book bar splits between two readers so both spend equal time;
 * the faster reader (Chandra) gets the larger share, in ratio bobRate:chandraRate.
 * Data: { pages: 760, chandraRate: 30, bobRate: 45 }.
 */
export function TeamReadingSplitScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pages = num(data.pages, 760);
  const chandraRate = num(data.chandraRate, 30);
  const bobRate = num(data.bobRate, 45);

  const g = gcd(bobRate, chandraRate);
  const chandraShare = bobRate / g;
  const bobShare = chandraRate / g;
  const totalShares = chandraShare + bobShare;
  const chandraPages = Math.round((chandraShare / totalShares) * pages);

  const isFinal = step >= totalSteps - 1;
  const showRatio = step >= 1;
  const showSplit = step >= 2;

  const X0 = 20;
  const barW = 280;
  const splitX = X0 + (chandraPages / pages) * barW;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? `split ${pages} pages so both spend equal time reading`
          : isFinal
            ? "compute Chandra's page count"
            : showSplit
              ? "Chandra reads 3 of every 5 pages"
              : "faster reader gets more pages — ratio 3 : 2"}
      </div>

      <svg viewBox="0 0 320 120" width="100%" style={{ maxWidth: 340 }}>
        {!showSplit && (
          <>
            <rect x={X0} y="40" width={barW} height="30" rx="5" fill="#f8fafc" stroke={INK} strokeWidth="1.6" />
            <text x={X0 + barW / 2} y="60" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK} fontFamily={FONT}>
              {pages} pages
            </text>
            <AnimatePresence>
              {showRatio && (
                <motion.g key="ratio" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <text x={X0 + barW / 2 - 40} y="90" textAnchor="middle" fontSize="12" fontWeight="900" fill={BLUE} fontFamily={FONT}>
                    Chandra : Bob
                  </text>
                  <text x={X0 + barW / 2 + 60} y="90" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>
                    {chandraShare} : {bobShare}
                  </text>
                </motion.g>
              )}
            </AnimatePresence>
          </>
        )}

        {showSplit && (
          <>
            <rect x={X0} y="40" width={barW} height="30" rx="5" fill="#f8fafc" stroke={INK} strokeWidth="1.6" />
            <motion.rect x={X0} y="40" height="30" fill={BLUE} initial={{ width: 0 }} animate={{ width: splitX - X0 }} transition={{ duration: 0.7 }} style={{ borderRadius: "5px 0 0 5px" }} />
            <motion.rect x={splitX} y="40" height="30" fill={ORANGE} initial={{ width: 0 }} animate={{ width: X0 + barW - splitX }} transition={{ duration: 0.7, delay: 0.15 }} />
            <rect x={X0} y="40" width={barW} height="30" rx="5" fill="none" stroke={INK} strokeWidth="1.6" />

            <text x={X0 + (splitX - X0) / 2} y="60" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily={FONT}>
              Chandra
            </text>
            <text x={splitX + (X0 + barW - splitX) / 2} y="60" textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily={FONT}>
              Bob
            </text>

            <line x1={splitX} y1="30" x2={splitX} y2="80" stroke={IND} strokeDasharray="3 3" strokeWidth="1.4" />
            <text x={splitX} y="96" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>
              page {chandraPages}
            </text>
          </>
        )}
      </svg>

      {isFinal && (
        <div style={{ textAlign: "center", fontSize: 13, fontWeight: 900, color: IND, fontFamily: FONT, marginTop: 2 }}>
          {chandraShare}/{totalShares} × {pages} = {chandraPages}
        </div>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
