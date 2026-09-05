import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { answerOf, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";
const GOLD = "#facc15";

function Coin({ x, y, side, r = 13, delay = 0 }: { x: number; y: number; side: "H" | "T"; r?: number; delay?: number }) {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 240, damping: 16 }}
      style={{ transformBox: "fill-box", transformOrigin: "center" }}
    >
      <circle cx={x} cy={y} r={r} fill={side === "H" ? GOLD : "#e2e8f0"} stroke={side === "H" ? "#a16207" : DIM} strokeWidth="1.5" />
      <text x={x} y={y + r * 0.35} textAnchor="middle" fontSize={Math.max(10, r * 0.85)} fontWeight="950" fill={INK} fontFamily={FONT}>
        {side}
      </text>
    </motion.g>
  );
}

/**
 * Keiko flips one penny (2 equally likely outcomes); Ephraim flips two
 * (4 equally likely outcomes), independent of Keiko's. The two coin counts
 * only ever line up in two disjoint cases — Keiko lands 0 heads, or Keiko
 * lands 1 head — so the tree branches once on Keiko's toss and, inside each
 * branch, marks which of Ephraim's four outcomes share that same head count.
 * The natural slip is stopping after the "1 head" branch and never opening
 * the "0 heads" branch at all, which lands on 1/4 — exactly choice A — so
 * that trap gets its own beat before the two branch probabilities are added.
 * Data: none required; the two-coin structure is fixed by the problem.
 */
export function PennyMatchTreeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const ephraimOutcomes: Array<{ label: string; sides: ["H" | "T", "H" | "T"]; heads: number }> = [
    { label: "HH", sides: ["H", "H"], heads: 2 },
    { label: "HT", sides: ["H", "T"], heads: 1 },
    { label: "TH", sides: ["T", "H"], heads: 1 },
    { label: "TT", sides: ["T", "T"], heads: 0 },
  ];

  const case0Matches = ephraimOutcomes.filter((o) => o.heads === 0).length; // TT
  const case1Matches = ephraimOutcomes.filter((o) => o.heads === 1).length; // HT, TH
  const p0 = case0Matches / 4; // 1/8 as (1/2)(1/4)
  const p1 = case1Matches / 4; // 1/4 as (1/2)(2/4)
  const totalProb = (p0 + p1) / 2; // average since each Keiko branch has weight 1/2
  const fraction = "3/8";
  const trapFraction = "1/4";
  const trapLetter = (problem.choices ?? []).find((c) => c.text.trim() === trapFraction)?.label;
  const answer = answerOf(problem);
  const valid = fraction === problem.shortAnswer && totalProb === 3 / 8;

  const last = totalSteps - 1;
  const beat = Math.min(Math.max(step, 0), last);
  // 0: setup, 1: case Keiko=0H, 2: case Keiko=1H, 3: trap, 4: add cases
  const showCase0 = beat >= 1;
  const showCase1 = beat >= 2;
  const showTrap = beat === 3;
  const showSum = beat >= 4;

  const W = 470;
  const H = 300;
  const rootX = 60;
  const rootY = 150;
  const caseX = 172;
  const case0Y = 78;
  const case1Y = 222;
  const outX = 300;
  const outGap = 30;

  const caption =
    beat === 0
      ? "Keiko tosses 1 penny, Ephraim tosses 2 — match head counts"
      : beat === 1
      ? "Keiko gets 0 heads: only Ephraim's TT also has 0 heads"
      : beat === 2
      ? "Keiko gets 1 head: Ephraim's HT and TH also have 1 head"
      : beat === 3
      ? `stopping here gives 1/4 — that's choice ${trapLetter ?? "A"}, but the 0-head case is still missing`
      : `1/8 + 1/4 = 3/8`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Tree branching Keiko's one-penny toss into Ephraim's two-penny outcomes, matching head counts">
        {/* root: Keiko's single penny */}
        <text x={rootX} y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>
          KEIKO
        </text>
        <Coin x={rootX} y={44} side="H" r={15} delay={0} />
        <text x={rootX} y="72" textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>
          1 penny
        </text>

        {/* branch lines from root to the two Keiko cases */}
        <motion.path
          d={`M ${rootX + 16},50 C ${(rootX + caseX) / 2},${50} ${(rootX + caseX) / 2},${case1Y} ${caseX - 44},${case1Y}`}
          fill="none"
          stroke={showCase1 ? IND : DIM}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        />
        <motion.path
          d={`M ${rootX + 16},50 C ${(rootX + caseX) / 2},${50} ${(rootX + caseX) / 2},${case0Y} ${caseX - 44},${case0Y}`}
          fill="none"
          stroke={showCase0 ? IND : DIM}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        />

        {/* Case: Keiko = 0 heads */}
        <g opacity={beat >= 1 ? 1 : 0.35}>
          <text x={caseX - 42} y={case0Y - 22} fontSize="10.5" fontWeight="900" fill={IND}>
            Keiko: 0 heads (T)
          </text>
          <text x={caseX - 42} y={case0Y - 10} fontSize="10" fontWeight="800" fill={DIM}>
            prob 1/2
          </text>
          {showCase0 &&
            ephraimOutcomes.map((o, i) => {
              const y = case0Y - 1.5 * outGap + i * outGap;
              const match = o.heads === 0;
              return (
                <motion.g key={o.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  <rect x={outX - 20} y={y - 12} width="128" height="24" rx="8" fill={match ? "#dcfce7" : "#f8fafc"} stroke={match ? GREEN : "#cbd5e1"} strokeWidth={match ? 1.8 : 1.1} />
                  <Coin x={outX + 4} y={y} side={o.sides[0]} r={9} delay={0.15 + i * 0.08} />
                  <Coin x={outX + 26} y={y} side={o.sides[1]} r={9} delay={0.2 + i * 0.08} />
                  <text x={outX + 66} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="850" fill={match ? GREEN : DIM} fontFamily={FONT}>
                    {match ? "match!" : "no match"}
                  </text>
                </motion.g>
              );
            })}
          {beat >= 1 && (
            <motion.text x={caseX - 42} y={case0Y + 2 * outGap + 4} fontSize="12" fontWeight="950" fill={GREEN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              (1/2)(1/4) = 1/8
            </motion.text>
          )}
        </g>

        {/* Case: Keiko = 1 head */}
        <g opacity={beat >= 2 ? 1 : beat === 1 ? 0.35 : 0.2} transform={`translate(0 ${case1Y - case0Y - 4})`}>
          <text x={caseX - 42} y={case0Y - 22} fontSize="10.5" fontWeight="900" fill={IND}>
            Keiko: 1 head (H)
          </text>
          <text x={caseX - 42} y={case0Y - 10} fontSize="10" fontWeight="800" fill={DIM}>
            prob 1/2
          </text>
          {showCase1 &&
            ephraimOutcomes.map((o, i) => {
              const y = case0Y - 1.5 * outGap + i * outGap;
              const match = o.heads === 1;
              return (
                <motion.g key={o.label} initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.08 }}>
                  <rect x={outX - 20} y={y - 12} width="128" height="24" rx="8" fill={match ? "#dcfce7" : "#f8fafc"} stroke={match ? GREEN : "#cbd5e1"} strokeWidth={match ? 1.8 : 1.1} />
                  <Coin x={outX + 4} y={y} side={o.sides[0]} r={9} delay={0.15 + i * 0.08} />
                  <Coin x={outX + 26} y={y} side={o.sides[1]} r={9} delay={0.2 + i * 0.08} />
                  <text x={outX + 66} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="850" fill={match ? GREEN : DIM} fontFamily={FONT}>
                    {match ? "match!" : "no match"}
                  </text>
                </motion.g>
              );
            })}
          {beat >= 2 && (
            <motion.text x={caseX - 42} y={case0Y + 2 * outGap + 4} fontSize="12" fontWeight="950" fill={GREEN} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
              (1/2)(2/4) = 1/4
            </motion.text>
          )}
        </g>

        <AnimatePresence>
          {showTrap && (
            <motion.g key="trap" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="330" y="4" width="134" height="52" rx="10" fill="#fef2f2" stroke={RED} strokeWidth="2" />
              <text x="397" y="22" textAnchor="middle" fontSize="10" fontWeight="900" fill={RED}>
                trap: stop early
              </text>
              <text x="397" y="38" textAnchor="middle" fontSize="14" fontWeight="950" fill={RED} fontFamily={FONT}>
                just 1/4 = choice {trapLetter ?? "A"}
              </text>
              <text x="397" y="50" textAnchor="middle" fontSize="10" fontWeight="800" fill={RED}>
                missing the 0-head case
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showSum && (
            <motion.g key="sum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <rect x="330" y="12" width="134" height="60" rx="10" fill={valid ? "#f0fdf4" : "#fef2f2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="397" y="32" textAnchor="middle" fontSize="10" fontWeight="900" fill={valid ? GREEN : RED}>
                1/8 + 2/8
              </text>
              <text x="397" y="58" textAnchor="middle" fontSize="20" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>
                = 3/8
              </text>
            </motion.g>
          )}
        </AnimatePresence>

        <text x="235" y="292" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
          {caption}
        </text>

        <SvgAnswerBadge show={showSum} answer={answer} cx={397} y={82} width={92} />
      </svg>
    </div>
  );
}
