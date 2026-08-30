import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const DIM = "#94a3b8";
const COLORS: Record<string, string> = { alice: "#16a34a", chandra: "#2563eb", bob: "#f59e0b" };
const NAMES: Record<string, string> = { alice: "Alice", chandra: "Chandra", bob: "Bob" };

function gcdAll(nums: number[]): number {
  const g2 = (a: number, b: number): number => (b === 0 ? a : g2(b, a % b));
  return nums.reduce((a, b) => g2(a, b));
}

/**
 * Three readers split a book so all three spend equal time; each share is
 * inversely proportional to that reader's seconds-per-page, and every
 * reader's computed time lands on the same number.
 * Data: { pages: 760, rates: { alice: 20, chandra: 30, bob: 45 } }.
 */
export function ThreeWaySplitEqualTimeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const pages = num(data.pages, 760);
  const ratesData = (data.rates as Record<string, number>) ?? { alice: 20, chandra: 30, bob: 45 };
  const keys = ["alice", "chandra", "bob"];
  const rates = keys.map((k) => num(ratesData[k], 0));

  // Common-denominator "pages per unit time" ratio: LCM-based whole numbers.
  const lcm = (a: number, b: number) => (a * b) / gcdAll([a, b]);
  const L = keys.reduce((acc, _k, i) => lcm(acc, rates[i]), 1);
  const rawShares = rates.map((r) => L / r);
  const shareGcd = gcdAll(rawShares);
  const shares = rawShares.map((s) => s / shareGcd);
  const totalShares = shares.reduce((a, b) => a + b, 0);

  const readerPages = shares.map((s) => Math.round((s / totalShares) * pages));
  const readerTimes = readerPages.map((p, i) => p * rates[i]);

  const isFinal = step >= totalSteps - 1;
  const showRatio = step >= 1;
  const showSplit = step >= 2;

  const barW = 260;
  const X0 = 30;

  let acc = 0;
  const segs = keys.map((k, i) => {
    const w = (readerPages[i] / pages) * barW;
    const x = X0 + acc;
    acc += w;
    return { k, x, w };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <div style={{ textAlign: "center", fontSize: 12, fontWeight: 850, color: INK, marginBottom: 4 }}>
        {step === 0
          ? "three readers, three speeds, equal time each"
          : isFinal
            ? "every reader's time comes out the same"
            : showSplit
              ? "split the pages in that ratio"
              : "faster readers get proportionally more pages"}
      </div>

      {!showSplit && (
        <svg viewBox="0 0 320 130" width="100%" style={{ maxWidth: 340 }}>
          {keys.map((k, i) => (
            <g key={k} transform={`translate(85, ${30 + i * 30})`}>
              <text x="-15" y="5" textAnchor="end" fontSize="11" fontWeight="800" fill={COLORS[k]} fontFamily={FONT}>
                {NAMES[k]}
              </text>
              <text x="0" y="5" fontSize="11" fontWeight="700" fill={DIM} fontFamily={FONT}>
                {rates[i]}s/pg
              </text>
              <AnimatePresence>
                {showRatio && (
                  <motion.text x="120" y="5" fontSize="12" fontWeight="900" fill={COLORS[k]} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * i }}>
                    share {shares[i]}
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          ))}
        </svg>
      )}

      {showSplit && (
        <svg viewBox="0 0 320 130" width="100%" style={{ maxWidth: 340 }}>
          <text x={X0} y="20" fontSize="11" fontWeight="800" fill={INK} fontFamily={FONT}>
            {pages} pages
          </text>
          <rect x={X0} y="28" width={barW} height="26" rx="5" fill="#f1f5f9" stroke={INK} strokeWidth="1.2" />
          {segs.map((s, i) => (
            <motion.rect key={s.k} x={s.x} y="28" height="26" fill={COLORS[s.k]} initial={{ width: 0 }} animate={{ width: s.w }} transition={{ duration: 0.6, delay: 0.15 * i }} />
          ))}
          {segs.map((s, i) => (
            <text key={s.k} x={s.x + s.w / 2} y="45" textAnchor="middle" fontSize="10" fontWeight="900" fill="#fff" fontFamily={FONT}>
              {readerPages[i]}
            </text>
          ))}

          {keys.map((k, i) => (
            <g key={k} transform={`translate(80, ${75 + i * 18})`}>
              <text x="-10" y="0" textAnchor="end" fontSize="10.5" fontWeight="800" fill={COLORS[k]} fontFamily={FONT}>
                {NAMES[k]}
              </text>
              <text x="0" y="0" fontSize="10.5" fontWeight="700" fill={DIM} fontFamily={FONT}>
                {readerPages[i]} × {rates[i]} =
              </text>
              <AnimatePresence>
                {isFinal && (
                  <motion.text x="90" y="0" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 + 0.15 * i }}>
                    {readerTimes[i]}s
                  </motion.text>
                )}
              </AnimatePresence>
            </g>
          ))}
        </svg>
      )}

      {isFinal && (
        <svg viewBox="0 0 200 34" width="100%" style={{ maxWidth: 140, marginTop: 4 }}>
          <SvgAnswerBadge show={true} answer={problem.answer != null ? String(problem.answer) : null} cx={100} y={4} />
        </svg>
      )}
    </div>
  );
}
