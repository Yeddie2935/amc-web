import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const MARK = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/** The smallest prime factor of n, or n itself if n is prime. */
function smallestFactor(n: number): number {
  if (n < 2) return n;
  for (let i = 2; i * i <= n; i++) if (n % i === 0) return i;
  return n;
}

/**
 * The smallest number that's composite, not a perfect square, and has no
 * prime factor below a threshold. Six beats: (0) the three restrictions;
 * (1) the trap — squaring the smallest usable prime beats every choice on
 * size and clears the factor rule, but it's a perfect square, disqualified;
 * (2) the fix — two *different* smallest primes above the threshold;
 * (3) every answer choice is factored and checked against all three rules;
 * (4) the survivor is confirmed; (5) the badge. Data: { threshold,
 * primeA, primeB }.
 */
export function PrimeFactorGateScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const threshold = Math.round(num(data.threshold, 50));
  const primeA = Math.round(num(data.primeA, 53));
  const primeB = Math.round(num(data.primeB, 59));

  const squareTrap = primeA * primeA;
  const answer = primeA * primeB;

  const rows = (problem.choices ?? []).map((c) => {
    const n = Number(c.text);
    const sf = smallestFactor(n);
    const isPrime = sf === n;
    const isSquare = Number.isInteger(Math.sqrt(n));
    const factorOk = !isPrime && sf >= threshold;
    const valid = !isPrime && !isSquare && factorOk;
    return { label: c.label, n, sf, isPrime, isSquare, factorOk, valid };
  });
  const validRow = rows.find((r) => r.valid);

  const last = totalSteps - 1;
  const isTrapStep = step === 1;
  const showFix = step >= 2;
  const showChoices = step >= 3;
  const showConfirm = step >= 4;
  const isFinal = step >= last;

  const W = 320;
  const rowH = 24;
  const rowsY0 = 20;
  const H = Math.max(130, rowsY0 + rows.length * rowH + 14);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showChoices && (
          <g>
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16 }}>
              <rect x={W / 2 - 70} y={30} width={64} height={40} rx={8} fill="#eef2ff" stroke={MARK} strokeWidth={1.6} />
              <text x={W / 2 - 38} y={54} textAnchor="middle" fontSize="14" fontWeight="900" fill={MARK} fontFamily={FONT}>
                {primeA}
              </text>
            </motion.g>
            <AnimatePresence mode="wait">
              {isTrapStep ? (
                <motion.g key="trap" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}>
                  <rect x={W / 2 + 6} y={30} width={64} height={40} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.6} />
                  <text x={W / 2 + 38} y={54} textAnchor="middle" fontSize="14" fontWeight="900" fill={BAD} fontFamily={FONT}>
                    {primeA}
                  </text>
                  <line x1={W / 2 - 60} y1={90} x2={W / 2 + 60} y2={90} stroke={BAD} strokeWidth={2} />
                  <line x1={W / 2 - 5} y1={83} x2={W / 2 - 5} y2={97} stroke={BAD} strokeWidth={2} />
                  <line x1={W / 2 + 5} y1={83} x2={W / 2 + 5} y2={97} stroke={BAD} strokeWidth={2} />
                </motion.g>
              ) : showFix ? (
                <motion.g key="fix" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.1 }}>
                  <rect x={W / 2 + 6} y={30} width={64} height={40} rx={8} fill="#eef2ff" stroke={MARK} strokeWidth={1.6} />
                  <text x={W / 2 + 38} y={54} textAnchor="middle" fontSize="14" fontWeight="900" fill={MARK} fontFamily={FONT}>
                    {primeB}
                  </text>
                </motion.g>
              ) : null}
            </AnimatePresence>
          </g>
        )}

        {showChoices &&
          rows.map((r, i) => {
            const y = rowsY0 + i * rowH;
            const isTheOne = r.valid;
            return (
              <motion.g key={r.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 240, damping: 18, delay: i * 0.12 }}>
                <text x={8} y={y + 13} fontSize="9.5" fontWeight="800" fill={DIM} fontFamily={FONT}>
                  {r.label}
                </text>
                <text x={24} y={y + 13} fontSize="10.5" fontWeight="900" fill={isFinal && isTheOne ? WIN : "#1f2a44"} fontFamily={FONT}>
                  {r.n}
                </text>
                <text x={82} y={y + 13} fontSize="9.5" fontWeight="800" fill={!r.isPrime ? WIN : BAD} fontFamily={FONT}>
                  {r.isPrime ? "prime" : "composite"}
                </text>
                <text x={148} y={y + 13} fontSize="9.5" fontWeight="800" fill={r.isSquare ? BAD : WIN} fontFamily={FONT}>
                  {r.isSquare ? "square" : "not sq."}
                </text>
                <text x={W - 8} y={y + 13} textAnchor="end" fontSize="9.5" fontWeight="800" fill={r.isPrime ? DIM : r.sf >= threshold ? WIN : BAD} fontFamily={FONT}>
                  {r.isPrime ? "—" : `min ${r.sf}`}
                </text>
                {isFinal && isTheOne && <rect x={2} y={y - 3} width={W - 6} height={rowH - 5} rx={5} fill="none" stroke={WIN} strokeWidth={1.8} />}
              </motion.g>
            );
          })}
      </svg>

      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          fontFamily: FONT,
          fontSize: 11,
          fontWeight: 800,
          textAlign: "center",
          maxWidth: 320,
          color: isFinal ? WIN : showConfirm ? WIN : showChoices ? MARK : isTrapStep ? BAD : showFix ? MARK : DIM,
        }}
      >
        {isFinal
          ? `${validRow?.n} is the smallest`
          : showConfirm
          ? `${validRow?.n} = ${primeA} × ${primeB}: composite, not a square, smallest factor ${validRow?.sf} ≥ ${threshold}`
          : showChoices
          ? `checking every choice against all three rules`
          : showFix
          ? `${primeA} and ${primeB} are the two smallest primes at or above ${threshold} — different primes, so their product isn't a square`
          : isTrapStep
          ? `${primeA}² = ${squareTrap} clears the factor rule and beats every choice on size, but it's a perfect square — not allowed`
          : `the number must be composite, not a perfect square, and have no prime factor below ${threshold}`}
      </motion.div>

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
