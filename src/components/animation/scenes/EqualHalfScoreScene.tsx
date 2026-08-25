import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const TEAL = "#0d9488";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const RED = "#dc2626";

/** Equal-sized work halves make each overall score the midpoint of two scores. */
export function EqualHalfScoreScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const chloeAlone = num(data.chloeAlone, 80);
  const chloeOverall = num(data.chloeOverall, 88);
  const zoeAlone = num(data.zoeAlone, 90);
  const shared = 2 * chloeOverall - chloeAlone;
  const zoeOverall = (zoeAlone + shared) / 2;
  const chloeGap = chloeOverall - chloeAlone;
  const zoeGap = shared - zoeAlone;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === zoeOverall)?.label;
  const ok = chloeGap > 0 && chloeOverall + chloeGap === shared && Number.isInteger(zoeOverall) && zoeOverall === stored && choice === problem.answer;
  const failure = chloeOverall + chloeGap !== shared
    ? "Chloe's two halves do not balance around her overall score"
    : zoeOverall !== stored
      ? `computed ${zoeOverall}, stored answer ${problem.shortAnswer}`
      : `computed choice ${choice ?? "none"}, stored answer ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const X = (score: number) => 43 + ((score - 75) / 25) * 334;

  const Axis = ({ values, colors, labels }: { values: number[]; colors: string[]; labels: string[] }) => <g>
    <line x1="43" y1="143" x2="377" y2="143" stroke="#cbd5e1" strokeWidth="2" />
    {[75, 80, 85, 90, 95, 100].map((v) => <g key={v}><line x1={X(v)} y1="137" x2={X(v)} y2="149" stroke="#94a3b8" /><text x={X(v)} y="164" textAnchor="middle" fontSize="9" fill="#64748b" fontFamily={mono}>{v}</text></g>)}
    {values.map((v, i) => <motion.g key={`${labels[i]}-${v}`} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: i * 0.2 }}>
      <circle cx={X(v)} cy="143" r="9" fill={colors[i]} /><text x={X(v)} y="120" textAnchor="middle" fontSize="12" fontWeight="900" fill={colors[i]} fontFamily={mono}>{v}</text><text x={X(v)} y="184" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={colors[i]}>{labels[i]}</text>
    </motion.g>)}
  </g>;
  const HalfCards = ({ left, right, leftLabel, rightLabel, rightUnknown = false }: { left: number; right: number; leftLabel: string; rightLabel: string; rightUnknown?: boolean }) => <g>
    <rect x="78" y="61" width="304" height="58" rx="12" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.6" />
    <motion.rect x="82" y="65" width="148" height="50" rx="9" fill="#e0e7ff" stroke={INDIGO} strokeWidth="1.8" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.55 }} style={{ transformOrigin: "82px center" }} />
    <motion.rect x="230" y="65" width="148" height="50" rx="9" fill="#ccfbf1" stroke={TEAL} strokeWidth="1.8" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.55, delay: 0.18 }} style={{ transformOrigin: "230px center" }} />
    <text x="156" y="84" textAnchor="middle" fontSize="10" fontWeight="900" fill={INDIGO}>{leftLabel}</text><text x="156" y="105" textAnchor="middle" fontSize="18" fontWeight="900" fill={INDIGO} fontFamily={mono}>{left}%</text>
    <text x="304" y="84" textAnchor="middle" fontSize="10" fontWeight="900" fill={TEAL}>{rightLabel}</text><text x="304" y="105" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={mono}>{rightUnknown ? "?" : `${right}%`}</text>
    <text x="230" y="139" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#64748b">equal numbers of problems</text>
  </g>;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "calc(100vw - 48px)", maxWidth: 460, minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 420 275" style={{ width: "calc(100vw - 48px)", maxWidth: 460, minWidth: 0, display: "block" }}>
      {phase === 0 && <g>
        <text x="210" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>half alone + half shared means an ordinary average</text>
        <HalfCards left={chloeAlone} right={shared} leftLabel="CHLOE ALONE" rightLabel="SHARED" rightUnknown />
        <motion.path d="M 156 151 L 156 180 L 210 201 M 304 151 L 304 180 L 210 201" fill="none" stroke="#a5b4fc" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.6 }} />
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="134" y="197" width="152" height="45" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" /><text x="210" y="225" textAnchor="middle" fontSize="16" fontWeight="900" fill={INDIGO} fontFamily={mono}>midpoint = {chloeOverall}%</text></motion.g>
        <text x="210" y="263" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#64748b">equal halves have equal weight</text>
      </g>}

      {phase === 1 && <g>
        <text x="210" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>balance Chloe's two halves around {chloeOverall}</text>
        <Axis values={[chloeAlone, chloeOverall, shared]} colors={[INDIGO, AMBER, TEAL]} labels={["alone", "overall", "shared"]} />
        <motion.path d={`M ${X(chloeAlone)} 104 L ${X(chloeAlone)} 86 L ${X(chloeOverall)} 86 M ${X(chloeOverall)} 86 L ${X(shared)} 86 L ${X(shared)} 104`} fill="none" stroke={AMBER} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.75, delay: 0.65 }} />
        <text x={(X(chloeAlone) + X(chloeOverall)) / 2} y="78" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={mono}>{chloeGap}</text><text x={(X(chloeOverall) + X(shared)) / 2} y="78" textAnchor="middle" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={mono}>{chloeGap}</text>
        <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05 }}><rect x="102" y="211" width="216" height="39" rx="12" fill="#ecfeff" stroke="#5eead4" /><text x="210" y="236" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={mono}>{chloeOverall} + {chloeGap} = {shared}% shared</text></motion.g>
      </g>}

      {phase === 2 && <g>
        <text x="210" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>the shared-half score belongs to Zoe too</text>
        <motion.g initial={{ opacity: 0, x: -45 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 170, damping: 16 }}><HalfCards left={zoeAlone} right={shared} leftLabel="ZOE ALONE" rightLabel="SHARED" /></motion.g>
        <motion.path d="M 304 130 C 304 163 250 175 224 199" fill="none" stroke={TEAL} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.65, delay: 0.6 }} />
        <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="99" y="195" width="222" height="45" rx="12" fill="#f0fdf4" stroke="#86efac" /><text x="210" y="222" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={mono}>average({zoeAlone}, {shared})</text></motion.g>
        <text x="210" y="261" textAnchor="middle" fontSize="10.5" fontWeight="800" fill="#64748b">now Zoe has two equally weighted scores</text>
      </g>}

      {phase === 3 && <g>
        <text x="210" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>move both endpoints equally to their midpoint</text>
        <Axis values={[zoeAlone, zoeOverall, shared]} colors={[INDIGO, GREEN, TEAL]} labels={["alone", "overall", "shared"]} />
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}><path d={`M ${X(zoeAlone)} 104 L ${X(zoeAlone)} 87 L ${X(zoeOverall)} 87 M ${X(zoeOverall)} 87 L ${X(shared)} 87 L ${X(shared)} 104`} fill="none" stroke={GREEN} strokeWidth="2.3" /><text x={(X(zoeAlone) + X(zoeOverall)) / 2} y="79" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={mono}>{zoeGap / 2}</text><text x={(X(zoeOverall) + X(shared)) / 2} y="79" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={mono}>{zoeGap / 2}</text></motion.g>
        <motion.g initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.95 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="113" y="211" width="194" height="39" rx="12" fill="#dcfce7" stroke={GREEN} strokeWidth="2" /><text x="210" y="236" textAnchor="middle" fontSize="16" fontWeight="900" fill={GREEN} fontFamily={mono}>({zoeAlone} + {shared}) ÷ 2 = {zoeOverall}%</text></motion.g>
        <text x="210" y="265" textAnchor="middle" fontSize="10" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `midpoint check: ${zoeOverall - zoeAlone} = ${shared - zoeOverall}` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={365} y={239} width={72} />
      </g>}
    </svg>
    <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
  </div>;
}
