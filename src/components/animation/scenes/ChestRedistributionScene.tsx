import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Redistribute coins from fuller chests to empty ones and expose the linear equation as motion. */
export function ChestRedistributionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const first = Math.round(num(data.firstPerChest, 0));
  const second = Math.round(num(data.secondPerChest, 0));
  const empty = Math.round(num(data.emptyChests, 0));
  const leftover = Math.round(num(data.leftoverCoins, 0));
  const surplusEach = first - second;
  const surplusNeeded = empty * second + leftover;
  const used = surplusNeeded / surplusEach;
  const chests = used + empty;
  const coins = used * first;
  const stored = Number(problem.shortAnswer);
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === coins)?.label;
  const ok = [first, second, empty, leftover, surplusEach, used, chests, coins].every(Number.isFinite) && surplusEach > 0 && Number.isInteger(used) && used > 0 && used * first === chests * second + leftover && coins === stored && choice === problem.answer;
  const failure = !Number.isInteger(used) ? `${surplusNeeded} cannot split into groups of ${surplusEach}` : used * first !== chests * second + leftover ? "the two distributions have different totals" : `computed ${coins}, stored ${problem.shortAnswer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 4 : Math.min(step, 3);
  const n = Math.max(1, Math.round(chests));
  const gap = 59, startX = 46, chestY = 88;
  const xAt = (i: number) => startX + i * gap;
  const Chest = ({ i }: { i: number }) => {
    const originallyUsed = i < used;
    const count = phase === 0 || phase === 4
      ? (originallyUsed ? first : 0)
      : phase === 2 && originallyUsed
        ? first
        : second;
    return <g>
      <path d={`M ${xAt(i) - 23} ${chestY - 5} Q ${xAt(i)} ${chestY - 26} ${xAt(i) + 23} ${chestY - 5}`} fill="#fef3c7" stroke={GOLD} strokeWidth="2" />
      <rect x={xAt(i) - 25} y={chestY - 5} width="50" height="58" rx="6" fill={count ? "#fff7ed" : "#f8fafc"} stroke={count ? GOLD : DIM} strokeWidth="2" />
      <rect x={xAt(i) - 5} y={chestY + 14} width="10" height="13" rx="2" fill={GOLD} />
      {Array.from({ length: count }).map((_, k) => {
        const surplus = phase === 2 && originallyUsed && k >= second;
        return <motion.circle key={k} cx={xAt(i) - 12 + (k % 3) * 12} cy={chestY + 42 - Math.floor(k / 3) * 11} r="4.2" fill={surplus ? IND : "#fbbf24"} stroke={surplus ? IND : GOLD} strokeWidth="1" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 + k * 0.018, type: "spring", stiffness: 220, damping: 16 }} />;
      })}
      <text x={xAt(i)} y={chestY + 70} textAnchor="middle" fontSize="11" fontWeight="900" fill={phase === 2 && originallyUsed ? IND : count ? INK : DIM} fontFamily={FONT}>{count ? count : "empty"}</text>
    </g>;
  };

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 260" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? `${first} coins in each used chest; ${empty} chests stay empty` : phase === 1 ? `${second} coins move into every chest, with ${leftover} left over` : phase === 2 ? `each donor chest releases ${first} − ${second} = ${surplusEach} coins` : phase === 3 ? `${surplusNeeded} surplus coins reveal the number of donor chests` : "count the same hoard in both arrangements"}</text>
      {Array.from({ length: n }).map((_, i) => <Chest key={i} i={i} />)}

      {phase === 1 && <motion.g initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }}><text x="230" y="190" textAnchor="middle" fontSize="11" fontWeight="850" fill={TEAL}>left over</text>{Array.from({ length: leftover }).map((_, i) => <circle key={i} cx={218 + i * 12} cy="207" r="4.5" fill="#fbbf24" stroke={GOLD} />)}<text x="230" y="231" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{n} × {second} + {leftover}</text></motion.g>}

      {phase === 2 && <><motion.path d={`M ${xAt(used - 1)} 178 Q 310 210 ${xAt(n - 1)} 178`} fill="none" stroke={IND} strokeWidth="2" markerEnd="url(#arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><defs><marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill={IND} /></marker></defs><text x="230" y="211" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{empty}×{second} + {leftover} = {surplusNeeded} coins needed</text><text x="230" y="234" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>each blue group contributes {surplusEach}</text></>}

      {phase === 3 && <><motion.rect x="97" y="188" width="266" height="46" rx="12" fill="#eef2ff" stroke="#c7d2fe" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="208" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{surplusNeeded} ÷ {surplusEach} = {used} donor chests</text><text x="230" y="227" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{used} + {empty} = {chests} chests total</text></>}

      {phase === 4 && <><text x="230" y="188" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{used} × {first} = {coins}</text><text x="230" y="210" textAnchor="middle" fontSize="12" fontWeight="850" fill={TEAL} fontFamily={FONT}>check: {chests} × {second} + {leftover} = {coins}</text><motion.rect x="174" y="221" width="112" height="31" rx="10" fill="#dcfce7" stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: 0.6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="230" y="243" textAnchor="middle" fontSize="17" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{coins} coins</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={224} width={78} /></>}
      {phase === 0 && <text x="230" y="222" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{first}(c − {empty}) coins</text>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="258" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
