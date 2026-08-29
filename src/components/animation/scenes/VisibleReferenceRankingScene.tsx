import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Use one mutually visible score as the reference for two hidden-score comparisons. */
export function VisibleReferenceRankingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = (Array.isArray(data.names) ? data.names : []).map(String);
  const visible = String(data.visibleScoreOwner ?? "");
  const comparisons = (Array.isArray(data.comparisons) ? data.comparisons : []).map(String);
  const edges = comparisons.map((s) => s.split(">")).filter((p) => p.length === 2);
  const score = new Map(names.map((n) => [n, 0]));
  for (let pass = 0; pass < names.length; pass++) for (const [hi, lo] of edges) score.set(hi, Math.max(score.get(hi) ?? 0, (score.get(lo) ?? 0) + 1));
  const order = [...names].sort((a, b) => (score.get(b) ?? 0) - (score.get(a) ?? 0));
  const ranking = order.join(", ");
  const choice = (problem.choices ?? []).find((c) => c.text === ranking)?.label;
  const ok = ranking === problem.shortAnswer && choice === problem.answer && new Set(order).size === names.length;
  const failure = ranking !== problem.shortAnswer ? `derived ${ranking}; stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}; stored ${problem.answer}`;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(Math.max(step, 0), 1);
  const cassie = names.find((n) => n === "Cassie") ?? names[0], bridget = names.find((n) => n === "Bridget") ?? names[1], hannah = visible;

  const Card = ({ name, x, y, color, shown, note }: { name: string; x: number; y: number; color: string; shown: boolean; note?: string }) => <motion.g initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0, y }} transition={{ type: "spring", stiffness: 170, damping: 18 }}>
    <rect x={x} y="0" width="118" height="48" rx="10" fill={shown ? `${color}18` : "#f8fafc"} stroke={shown ? color : "#cbd5e1"} strokeWidth="2" strokeDasharray={shown ? undefined : "5 3"} />
    <text x={x + 15} y="20" fontSize="16">{shown ? "📝" : "🔒"}</text><text x={x + 38} y="20" fontSize="12" fontWeight="900" fill={INK}>{name}</text>
    <text x={x + 59} y="38" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={shown ? color : DIM}>{note ?? (shown ? "score shown" : "score hidden")}</text>
  </motion.g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 420 320" width="100%" style={{ maxWidth: 460, minWidth: 0, display: "block" }}>
      <text x="210" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "Cassie compares her hidden score with Hannah's visible score" : phase === 1 ? "Bridget uses the same visible score as her reference" : "the two comparisons lock into one ranking"}</text>

      {phase < 2 && <g>
        <rect x="158" y="38" width="104" height="34" rx="9" fill="#dcfce7" stroke={GREEN} /><text x="210" y="52" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>everyone can see</text><text x="210" y="66" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN}>{hannah}'s test</text>
        <path d="M 210 74 V 90" stroke={GREEN} strokeWidth="2" />
        <line x1="62" y1="145" x2="358" y2="145" stroke="#cbd5e1" strokeWidth="2" />
        <text x="45" y="106" fontSize="9" fontWeight="900" fill={DIM}>higher</text><text x="45" y="190" fontSize="9" fontWeight="900" fill={DIM}>lower</text>
        <path d="M 54 181 V 110" stroke={DIM} strokeWidth="1.5" /><path d="M 49 116 L 54 108 L 59 116" fill="none" stroke={DIM} strokeWidth="1.5" />
        <Card name={hannah} x={151} y={121} color={GREEN} shown note="visible reference" />
        <Card name={cassie} x={278} y={phase === 0 ? 85 : 85} color={IND} shown={false} note="known only to Cassie" />
        <Card name={bridget} x={24} y={phase === 1 ? 166 : 166} color={GOLD} shown={false} note="known only to Bridget" />
        {phase === 0 && <motion.path d="M 278 123 C 252 108, 246 102, 236 105" fill="none" stroke={IND} strokeWidth="3" markerEnd="url(#arrowInd)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
        {phase === 1 && <motion.path d="M 142 188 C 166 180, 173 174, 180 169" fill="none" stroke={GOLD} strokeWidth="3" markerEnd="url(#arrowGold)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />}
        <defs><marker id="arrowInd" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7Z" fill={IND} /></marker><marker id="arrowGold" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7Z" fill={GOLD} /></marker></defs>
      </g>}

      {phase === 0 && <g transform="translate(57 229)"><rect width="306" height="57" rx="12" fill="#eef2ff" stroke={IND} /><text x="153" y="20" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>“I didn't get the lowest.”</text><text x="153" y="43" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{cassie} &gt; {hannah}</text></g>}
      {phase === 1 && <g transform="translate(57 229)"><rect width="306" height="57" rx="12" fill="#fff7ed" stroke={GOLD} /><text x="153" y="20" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>“I didn't get the highest.”</text><text x="153" y="43" textAnchor="middle" fontSize="17" fontWeight="900" fill={GOLD} fontFamily={FONT}>{hannah} &gt; {bridget}</text></g>}

      {phase === 2 && <g>
        <text x="210" y="48" textAnchor="middle" fontSize="12" fontWeight="900" fill={DIM}>highest score</text>
        {order.map((name, i) => { const color = [IND, GREEN, GOLD][i]; return <motion.g key={name} initial={{ opacity: 0, x: i % 2 ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 190, damping: 18, delay: i * .14 }}><rect x="112" y={60 + i * 61} width="196" height="46" rx="11" fill={`${color}18`} stroke={color} strokeWidth="2.5" /><circle cx="137" cy={83 + i * 61} r="15" fill={color} /><text x="137" y={88 + i * 61} textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">{i + 1}</text><text x="165" y={88 + i * 61} fontSize="15" fontWeight="900" fill={INK}>{name}</text>{i < order.length - 1 && <text x="210" y={119 + i * 61} textAnchor="middle" fontSize="18" fontWeight="900" fill={DIM}>›</text>}</motion.g>; })}
        <text x="210" y="252" textAnchor="middle" fontSize="12" fontWeight="900" fill={DIM}>lowest score</text>
        <rect x="38" y="266" width="270" height="38" rx="11" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" /><text x="173" y="290" textAnchor="middle" fontSize="12" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{order.join(" > ")}</text>
      </g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={359} y={273} width={76} />
      <AnimatePresence>{final && !ok && <motion.text x="210" y="319" textAnchor="middle" fontSize="8.5" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
