import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

function hasRun(seq: string[], letter: string, runLen: number): boolean {
  let run = 0;
  for (const c of seq) {
    run = c === letter ? run + 1 : 0;
    if (run >= runLen) return true;
  }
  return false;
}

const ROW_X0 = 170, COIN_GAP = 32, COIN_R = 11, ROW_H = 26, GRID_TOP = 46;

function Coin({ x, y, letter, delay }: { x: number; y: number; letter: string; delay: number }) {
  const color = letter === "H" ? IND : DIM;
  return (
    <motion.g initial={{ opacity: 0, scaleY: 0.2 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
      <circle cx={x} cy={y} r={COIN_R} fill={color} stroke={INK} strokeWidth="1" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="900" fill="#fff" fontFamily={FONT}>{letter}</text>
    </motion.g>
  );
}

// Every three-coin sequence is drawn as a row of coins; the rows containing a
// run of heads long enough light up, and their count over all sequences is
// the probability. Data: { tosses, minConsecutiveHeads }.
export function ConsecutiveHeadsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const tosses = Math.round(num(data.tosses, 3));
  const runLen = Math.round(num(data.minConsecutiveHeads, 2));

  const total = 2 ** tosses;
  const sequences: string[][] = [];
  for (let i = 0; i < total; i++) {
    const seq: string[] = [];
    for (let b = tosses - 1; b >= 0; b--) seq.push((i >> b) & 1 ? "H" : "T");
    sequences.push(seq);
  }
  const favorable = sequences.map((seq) => hasRun(seq, "H", runLen));
  const favorableCount = favorable.filter(Boolean).length;

  const d = gcd(favorableCount, total);
  const num_ = favorableCount / d, den = total / d;
  const composed = `${num_}/${den}`;
  const choiceLabel = (problem.choices ?? []).find((c) => String(c.text).trim() === composed)?.label;
  const answerOk = composed === String(problem.shortAnswer ?? "").trim();
  const ok = answerOk && choiceLabel === problem.answer;
  const failure = !answerOk ? `computed ${composed}, stored ${problem.shortAnswer}` : `choice ${choiceLabel ?? "missing"}, stored ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  const rowY = (i: number) => GRID_TOP + i * ROW_H;
  const coinX = (j: number) => ROW_X0 + j * COIN_GAP;
  const rowRight = coinX(tosses - 1) + COIN_R + 22;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 340" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
        <text x="230" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? `every equally likely sequence of ${tosses} tosses` : phase === 1 ? `which sequences run ${runLen}+ heads in a row?` : "favorable sequences over all sequences"}
        </text>

        {sequences.map((seq, i) => (
          <g key={i}>
            {seq.map((letter, j) => (
              <Coin key={j} x={coinX(j)} y={rowY(i)} letter={letter} delay={0.04 * i} />
            ))}
            {phase >= 1 && (
              favorable[i] ? (
                <motion.g initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.15 * i }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={coinX(0) - COIN_R - 5} y={rowY(i) - COIN_R - 4} width={coinX(tosses - 1) - coinX(0) + 2 * COIN_R + 10} height={2 * COIN_R + 8} rx="8" fill="none" stroke={GREEN} strokeWidth="2" />
                  <text x={rowRight} y={rowY(i) + 4} fontSize="13" fontWeight="900" fill={GREEN}>✓</text>
                </motion.g>
              ) : (
                <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0.35 }} transition={{ delay: 0.15 * i }} />
              )
            )}
          </g>
        ))}

        {phase === 0 && (
          <motion.text x="230" y="272" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * total + 0.3 }}>
            2^{tosses} = {total} equally likely sequences
          </motion.text>
        )}

        {phase === 1 && (
          <>
            <text x="230" y="272" textAnchor="middle" fontSize="12" fontWeight="800" fill={DIM} fontFamily={FONT}>{total} sequences total</text>
            <motion.text x="230" y="292" textAnchor="middle" fontSize="14" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 * total + 0.3 }}>
              {favorableCount} favorable sequences
            </motion.text>
          </>
        )}

        {phase === 2 && (
          <>
            <motion.text x="230" y="270" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK} fontFamily={FONT} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <tspan fill={GREEN}>{favorableCount}</tspan> / {total} = <tspan fill={GREEN}>{composed}</tspan>
            </motion.text>
            <text x="230" y="292" textAnchor="middle" fontSize="9.3" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>
              {ok ? "favorable count, total, and choice verified" : failure}
            </text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={300} width={100} />
          </>
        )}
      </svg>
    </div>
  );
}
