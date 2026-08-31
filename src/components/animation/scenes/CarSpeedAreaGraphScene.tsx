import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * On a speed-time graph, distance is the rectangle's area — so doubling
 * speed while keeping the same distance means the time has to shrink to
 * compensate, not stay put. The scene grows car N's rectangle from car M's
 * real one, spends a beat on the trap of only doubling the height (same
 * width, so the area — the distance — doubles too), then correctly halves
 * the width, and finally checks that shape against the five real answer-key
 * graphs to find the one true match.
 * Data: { speedFactor, timeFactor, graphs: [{letter, yN, xEndN}], yM,
 * xStartM, xEndM, xBaseline, correct }.
 */
export function CarSpeedAreaGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const speedFactor = Math.max(1, num(data.speedFactor, 2));
  const timeFactor = Math.max(0.01, num(data.timeFactor, 0.5));
  const correct = String(data.correct ?? "D");

  const yM = num(data.yM, 70);
  const xStartM = num(data.xStartM, 22);
  const xEndM = num(data.xEndM, 70);
  const xBaseline = num(data.xBaseline, 105);
  const graphsRaw = Array.isArray(data.graphs) ? data.graphs : ["A|30|70", "B|30|105", "C|90|70", "D|30|44", "E|90|105"];
  const graphs = graphsRaw.map((s) => {
    const [letter, yN, xEndN] = String(s).split("|");
    return { letter, yN: Number(yN), xEndN: Number(xEndN) };
  });

  const mHeight = xBaseline - yM;
  const mWidth = xEndM - xStartM;
  const mArea = mHeight * mWidth;

  const evalGraph = (g: { yN: number; xEndN: number }) => {
    const h = xBaseline - g.yN;
    const w = g.xEndN - xStartM;
    return { h, w, area: h * w, speedRatio: Math.round((h / mHeight) * 100) / 100, timeRatio: Math.round((w / mWidth) * 100) / 100 };
  };
  const matches = graphs.map((g) => ({ ...g, ...evalGraph(g) }));
  const best = matches.reduce((b, c) => (Math.abs(c.area - mArea) < Math.abs(b.area - mArea) ? c : b), matches[0]);
  const answerOk = problem.shortAnswer == null || `Graph ${best.letter}` === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `closest area match is graph ${best.letter}, stored answer is ${problem.shortAnswer}` : "";

  const trapGraph = matches.find((g) => Math.abs(g.speedRatio - speedFactor) < 0.15 && Math.abs(g.timeRatio - 1) < 0.15);
  const trapChoice = trapGraph ? (problem.choices ?? []).find((c) => String(c.text).trim() === `Graph ${trapGraph.letter}`) : undefined;

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showFix = step >= 2 && !isFinal;

  const W = 300;
  const H = 230;
  const gx = 40;
  const gy = 20;
  const gScale = 1.3;
  const px = (x: number) => gx + (x - xStartM) * gScale;
  const py = (y: number) => gy + (y - 10);

  const trapY = yM - (mHeight * speedFactor - mHeight);
  const trapXEnd = xEndM;
  const fixY = trapY;
  const fixXEnd = xStartM + mWidth * timeFactor;

  const drawY = isFinal || showFix ? fixY : showTrap ? trapY : yM;
  const drawXEnd = isFinal || showFix ? fixXEnd : showTrap ? trapXEnd : xEndM;

  const caption = isFinal
    ? `graph ${correct} matches: same area as M`
    : showFix
    ? `halve the time too: same area, distance unchanged`
    : showTrap
    ? trapChoice
      ? `double the height, same width — area doubles too. choice ${trapChoice.label} looks tempting but doubles the distance`
      : `double the height, same width — the area (distance) doubles too`
    : `M: speed ${mHeight} × time ${mWidth} = distance ${mArea}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!isFinal && (
          <g>
            <line x1={px(xStartM)} y1={py(10)} x2={px(xStartM)} y2={py(xBaseline)} stroke={INK} strokeWidth={1.6} />
            <line x1={px(xStartM)} y1={py(xBaseline)} x2={px(xBaseline + 10)} y2={py(xBaseline)} stroke={INK} strokeWidth={1.6} />
            <text x={px(xStartM) - 10} y={py(50)} fontSize="9.5" fontWeight="800" fill={DIM}>
              speed
            </text>
            <text x={px((xBaseline + 10 + xStartM) / 2)} y={py(xBaseline) + 16} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
              time
            </text>

            <line x1={px(xStartM)} y1={py(yM)} x2={px(xEndM)} y2={py(yM)} stroke={DIM} strokeWidth={2.2} strokeDasharray="5 4" />
            <text x={px(xEndM) + 4} y={py(yM) + 4} fontSize="11" fontWeight="800" fill={DIM} fontFamily={numberFont}>
              M
            </text>
            <rect x={px(xStartM)} y={py(yM)} width={px(xEndM) - px(xStartM)} height={py(xBaseline) - py(yM)} fill={DIM} fillOpacity={0.12} />

            <motion.g animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <motion.line
                x1={px(xStartM)}
                y1={py(drawY)}
                x2={px(drawXEnd)}
                y2={py(drawY)}
                stroke={showFix ? WIN : showTrap ? BAD : IND}
                strokeWidth={2.6}
                animate={{ x2: px(drawXEnd), y1: py(drawY), y2: py(drawY) }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              />
              <text x={px(drawXEnd) + 4} y={py(drawY) + 4} fontSize="11" fontWeight="800" fill={showFix ? WIN : showTrap ? BAD : IND} fontFamily={numberFont}>
                N
              </text>
              <motion.rect
                x={px(xStartM)}
                y={py(drawY)}
                fill={showFix ? WIN : showTrap ? BAD : IND}
                fillOpacity={0.18}
                animate={{ width: px(drawXEnd) - px(xStartM), height: py(xBaseline) - py(drawY) }}
                transition={{ type: "spring", stiffness: 140, damping: 18 }}
              />
            </motion.g>
          </g>
        )}

        {isFinal && (
          <g>
            <text x={W / 2} y={14} textAnchor="middle" fontSize="10" fontWeight="800" fill={INK}>
              matching area to the real answer graphs
            </text>
            {matches.map((m, i) => {
              const cx = 40 + (i % 3) * 90;
              const cy = 40 + Math.floor(i / 3) * 90;
              const ok = m.letter === correct;
              const sh = Math.min(40, m.h * 0.4);
              const sw = Math.min(60, m.w * 0.5);
              return (
                <motion.g key={m.letter} initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay: i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <line x1={cx} y1={cy - 20} x2={cx} y2={cy + 20} stroke="#cbd5e1" strokeWidth={1.4} />
                  <line x1={cx} y1={cy + 20} x2={cx + 70} y2={cy + 20} stroke="#cbd5e1" strokeWidth={1.4} />
                  <line x1={cx} y1={cy + 20 - (xBaseline - yM) * 0.4} x2={cx + mWidth * 0.5} y2={cy + 20 - (xBaseline - yM) * 0.4} stroke={DIM} strokeWidth={1.6} strokeDasharray="3 2" />
                  <line x1={cx} y1={cy + 20 - sh} x2={cx + sw} y2={cy + 20 - sh} stroke={ok ? WIN : BAD} strokeWidth={2.4} />
                  <text x={cx + 35} y={cy + 34} textAnchor="middle" fontSize="10" fontWeight="800" fill={ok ? WIN : BAD} fontFamily={numberFont}>
                    {m.letter}
                  </text>
                  {!ok && (
                    <text x={cx + 35} y={cy - 6} textAnchor="middle" fontSize="13" fontWeight="900" fill={BAD}>
                      ✗
                    </text>
                  )}
                </motion.g>
              );
            })}
          </g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
        }}
      >
        {caption}
      </motion.span>

      {failure && (
        <span style={{ fontFamily: numberFont, fontSize: 11, fontWeight: 800, color: BAD }}>check failed: {failure}</span>
      )}

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
