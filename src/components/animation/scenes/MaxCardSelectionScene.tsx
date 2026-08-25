import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";

function combinations(values: number[], count: number): number[][] {
  if (count === 0) return [[]];
  return values.flatMap((value, i) => combinations(values.slice(i + 1), count - 1).map((rest) => [value, ...rest]));
}

/** Enumerate equal card selections, then sieve for a prescribed maximum. */
export function MaxCardSelectionScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cards = (Array.isArray(data.cards) ? data.cards : []).map((v) => Math.round(num(v, 0)));
  const draw = Math.round(num(data.draw, 3));
  const targetMax = Math.round(num(data.targetMax, 4));
  const groups = combinations(cards, draw);
  const favorable = groups.filter((group) => Math.max(...group) === targetMax);
  const stored = String(problem.shortAnswer ?? "").replace(/\s/g, "");
  const fraction = `${favorable.length}/${groups.length}`;
  const choice = (problem.choices ?? []).find((c) => String(c.text).replace(/\s/g, "") === fraction)?.label;
  const uniqueCards = new Set(cards).size === cards.length;
  const ok = uniqueCards && groups.length > 0 && favorable.length > 0 && fraction === stored && choice === problem.answer;
  const failure = !uniqueCards
    ? "the card values are not distinct"
    : groups.length === 0
      ? "no selections were generated"
      : fraction !== stored
        ? `computed ${fraction}, stored answer ${problem.shortAnswer}`
        : `computed choice ${choice ?? "none"}, stored answer ${problem.answer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const Card = ({ x, y, value, small = false, tone = INDIGO }: { x: number; y: number; value: number; small?: boolean; tone?: string }) => {
    const w = small ? 19 : 38;
    const h = small ? 27 : 52;
    return <g>
      <rect x={x} y={y} width={w} height={h} rx={small ? 3 : 6} fill="#fff" stroke={tone} strokeWidth={small ? 1.2 : 2} />
      <text x={x + w / 2} y={y + h / 2 + (small ? 4 : 7)} textAnchor="middle" fontSize={small ? 11 : 20} fontWeight="900" fill={tone} fontFamily={mono}>{value}</text>
    </g>;
  };
  const Group = ({ group, i, verdict = false }: { group: number[]; i: number; verdict?: boolean }) => {
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = 20 + col * 88;
    const y = 43 + row * 77;
    const good = Math.max(...group) === targetMax;
    const hasTarget = group.includes(targetMax);
    const hasTooHigh = group.some((v) => v > targetMax);
    return <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: verdict && !good ? 0.28 : 1, y: 0 }} transition={{ type: "spring", stiffness: 210, damping: 16, delay: i * 0.06 }}>
      <rect x={x - 5} y={y - 6} width="77" height="42" rx="7" fill={verdict && good ? "#dcfce7" : "#f8fafc"} stroke={verdict && good ? GREEN : "#e2e8f0"} strokeWidth={verdict && good ? 2 : 1.2} />
      {group.map((value, k) => <Card key={value} x={x + k * 23} y={y} value={value} small tone={verdict && good ? GREEN : verdict && value > targetMax ? RED : INDIGO} />)}
      {verdict && !good && <motion.line x1={x - 1} y1={y + 15} x2={x + 68} y2={y + 15} stroke={RED} strokeWidth="2.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 + i * 0.04 }} />}
      {verdict && <text x={x + 34} y={y + 49} textAnchor="middle" fontSize="8.5" fontWeight="900" fill={good ? GREEN : RED} fontFamily={mono}>{good ? `max = ${targetMax}` : hasTooHigh ? `contains ${Math.max(...group)}` : hasTarget ? "check" : `no ${targetMax}`}</text>}
    </motion.g>;
  };

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 260" style={{ width: "calc(100vw - 48px)", maxWidth: 480, minWidth: 0, display: "block" }}>
      {phase === 0 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>every 3-card group is equally likely</text>
        {groups.map((group, i) => <Group key={group.join("-")} group={group} i={i} />)}
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="133" y="206" width="194" height="38" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
          <text x="230" y="231" textAnchor="middle" fontSize="17" fontWeight="900" fill={INDIGO} fontFamily={mono}>C({cards.length}, {draw}) = {groups.length}</text>
        </motion.g>
      </g>}

      {phase === 1 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>largest is {targetMax}: keep {targetMax}, block every larger card</text>
        {groups.map((group, i) => <Group key={group.join("-")} group={group} i={i} verdict />)}
        <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}>
          <rect x="85" y="211" width="290" height="35" rx="12" fill="#f0fdf4" stroke="#86efac" />
          <text x="230" y="233" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={mono}>{targetMax} + choose 2 from {`{${cards.filter((v) => v < targetMax).join(",")}}`} = {favorable.length}</text>
        </motion.g>
      </g>}

      {phase === 2 && <g>
        <text x="230" y="18" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>favorable groups over all equally likely groups</text>
        <text x="62" y="55" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>FAVORABLE</text>
        {favorable.map((group, i) => <motion.g key={group.join("-")} initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 190, damping: 16, delay: i * 0.15 }}>
          <rect x="18" y={69 + i * 47} width="88" height="37" rx="8" fill="#dcfce7" stroke={GREEN} strokeWidth="1.5" />
          {group.map((v, k) => <Card key={v} x={27 + k * 25} y={74 + i * 47} value={v} small tone={GREEN} />)}
        </motion.g>)}
        <motion.path d="M 121 119 C 159 119 165 119 189 119" fill="none" stroke="#86efac" strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, delay: 0.65 }} />
        <motion.g initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.85 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <text x="250" y="99" textAnchor="middle" fontSize="31" fontWeight="900" fill={GREEN} fontFamily={mono}>{favorable.length}</text>
          <line x1="211" y1="112" x2="289" y2="112" stroke={INK} strokeWidth="2.5" />
          <text x="250" y="145" textAnchor="middle" fontSize="31" fontWeight="900" fill={INK} fontFamily={mono}>{groups.length}</text>
          <text x="316" y="122" fontSize="20" fontWeight="900" fill={INDIGO} fontFamily={mono}>= {fraction}</text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <rect x="188" y="169" width="124" height="36" rx="10" fill="#eef2ff" stroke={INDIGO} strokeWidth="1.8" />
          <text x="250" y="192" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={mono}>3 of 10 tickets</text>
        </motion.g>
        <text x="250" y="225" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `counted ${favorable.length} favorable out of ${groups.length}` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={250} y={231} width={88} />
      </g>}
    </svg>
    <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
  </div>;
}
