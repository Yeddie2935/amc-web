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
 * The birdbath itself decides the graph shape: water enters faster than it
 * drains, so the level climbs at a steady rate — until it hits the rim, where
 * overflow caps it flat. The scene fills a real basin in sync with a traced
 * volume curve, then lines up the five candidate graphs (their actual answer-
 * key paths, not redrawn) and eliminates the four whose shapes contradict that
 * physics one at a time, landing on the one that rises then levels off.
 * Data: { fillRate, drainRate, graphA..graphE (svg path d), axisPath, correct }.
 */
export function BirdbathOverflowGraphScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const fillRate = num(data.fillRate, 20);
  const drainRate = num(data.drainRate, 18);
  const net = fillRate - drainRate;
  const axisPath = String(data.axisPath ?? "M35 140V20 M35 140H145");
  const letters = ["A", "B", "C", "D", "E"] as const;
  const paths: Record<string, string> = {
    A: String(data.graphA ?? "M35 140L92 82H145"),
    B: String(data.graphB ?? "M35 55H70L145 140"),
    C: String(data.graphC ?? "M35 140L145 28"),
    D: String(data.graphD ?? "M35 45H145"),
    E: String(data.graphE ?? "M35 140L90 85L145 140"),
  };
  const correct = String(data.correct ?? "A");
  const answerOk = problem.shortAnswer == null || correct === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `matched graph ${correct}, stored answer is ${problem.shortAnswer}` : "";

  const reasons: Record<string, string> = {
    B: "starts flat then drops — nothing drains the birdbath except overflow",
    C: "keeps climbing forever — but the basin has a rim it can't pass",
    D: "never rises — but filling (20) beats draining (18), so it must climb",
    E: "rises then falls — overflow caps the level, it doesn't drain it back down",
  };

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showOverflow = step >= 1;
  const showEliminate = step >= 2 && !isFinal;

  const W = 300;
  const H = 236;
  const basinX = 40;
  const basinW = 70;
  const basinBottom = 190;
  const rimY = 70;
  const waterFrac = showOverflow ? 1 : 0.55;

  // local graph coordinates span x:35-145 (center 90), y:20-140 (top 20)
  const miniScale = 0.52;
  const miniLocalCx = 90;
  const miniTop = 30;
  const miniLocalTop = 20;

  const MiniGraph = ({ letter, cx, ok }: { letter: string; cx: number; ok: boolean }) => (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 18, delay: 0.1 + letters.indexOf(letter as (typeof letters)[number]) * 0.25 }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <g transform={`translate(${cx - miniLocalCx * miniScale}, ${miniTop - miniLocalTop * miniScale}) scale(${miniScale})`}>
        <path d={axisPath} stroke="#cbd5e1" strokeWidth={3} fill="none" />
        <path d={paths[letter]} stroke={ok ? WIN : BAD} strokeWidth={5} fill="none" strokeLinecap="round" />
      </g>
      <text x={cx} y={116} textAnchor="middle" fontSize="12" fontWeight="800" fill={ok ? WIN : BAD} fontFamily={numberFont}>
        {letter}
      </text>
      {!ok && (
        <text x={cx} y={24} textAnchor="middle" fontSize="16" fontWeight="900" fill={BAD}>
          ✗
        </text>
      )}
    </motion.g>
  );

  const caption = isFinal
    ? `graph ${correct} rises then levels off — the only shape that fits`
    : showEliminate
    ? "eliminate every shape that contradicts the physics"
    : showOverflow
    ? "once full, overflow keeps the volume constant"
    : `${fillRate} − ${drainRate} = ${net} mL/min net inflow — the level climbs steadily`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showEliminate && !isFinal && (
          <g>
            <rect x={basinX} y={rimY} width={basinW} height={basinBottom - rimY} fill="none" stroke={INK} strokeWidth={3} />
            <line x1={basinX - 6} y1={rimY} x2={basinX + basinW + 6} y2={rimY} stroke={DIM} strokeWidth={2} strokeDasharray="4 3" />
            <motion.rect
              x={basinX + 2}
              y={rimY}
              width={basinW - 4}
              height={basinBottom - rimY}
              fill="#38bdf8"
              fillOpacity={0.75}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: waterFrac }}
              transition={{ type: "spring", stiffness: 90, damping: 18 }}
              style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
            />
            {showOverflow && (
              <>
                <motion.circle cx={basinX - 2} cy={rimY + 8} r={3.5} fill="#38bdf8" initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 20 }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.2 }} />
                <motion.circle cx={basinX + basinW + 2} cy={rimY + 8} r={3.5} fill="#38bdf8" initial={{ opacity: 0, y: 0 }} animate={{ opacity: 1, y: 20 }} transition={{ repeat: Infinity, duration: 0.9, delay: 0.5 }} />
              </>
            )}
            <text x={basinX + basinW / 2} y={basinBottom + 20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
              net +{net} mL/min
            </text>

            <g transform={`translate(150, 20) scale(0.85)`}>
              <path d={axisPath} stroke="#cbd5e1" strokeWidth={3} fill="none" />
              <motion.path
                d={showOverflow ? paths[correct] : paths[correct].split("H")[0]}
                stroke={WIN}
                strokeWidth={5}
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8 }}
                key={showOverflow ? "full" : "rise"}
              />
            </g>
          </g>
        )}

        {(showEliminate || isFinal) && (
          <g>
            <text x={W / 2} y={16} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              which graph matches?
            </text>
            {letters.map((l, i) => (
              <MiniGraph key={l} letter={l} cx={30 + i * 60} ok={l === correct} />
            ))}
          </g>
        )}
      </svg>

      {showEliminate && (
        <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "center" }}>
          {(Object.keys(reasons) as Array<keyof typeof reasons>).map((l) => (
            <div key={l} style={{ fontFamily: numberFont, fontSize: 10, fontWeight: 700, color: BAD, textAlign: "center", maxWidth: 300 }}>
              {l}: {reasons[l]}
            </div>
          ))}
        </div>
      )}

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12,
          fontWeight: 800,
          color: isFinal ? "#166534" : IND,
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
