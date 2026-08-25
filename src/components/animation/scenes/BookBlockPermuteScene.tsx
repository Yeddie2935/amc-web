import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const DIM = "#94a3b8";

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));

type BookProps = {
  x: number;
  y: number;
  color: string;
  code: string;
  index: number;
  delay?: number;
};

function Book({ x, y, color, code, index, delay = 0 }: BookProps) {
  return (
    <motion.g
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 16, delay }}
    >
      <rect x={x} y={y} width="25" height="52" rx="3" fill={color} stroke={INK} strokeWidth="1.4" />
      <rect x={x + 4} y={y + 7} width="17" height="18" rx="2" fill="#fff" fillOpacity="0.88" />
      <text x={x + 12.5} y={y + 20} textAnchor="middle" fontSize="10" fontWeight="900" fill={INK} fontFamily={FONT}>
        {code}{index}
      </text>
      <circle cx={x + 9} cy={y + 36} r="1.6" fill={INK} />
      <circle cx={x + 16} cy={y + 36} r="1.6" fill={INK} />
      <path d={`M ${x + 8} ${y + 42} Q ${x + 12.5} ${y + 46} ${x + 17} ${y + 42}`} fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
    </motion.g>
  );
}

/**
 * Nine distinct language books become five shelf units: one Arabic block, one
 * Spanish block, and three individual German books. The units visibly shuffle,
 * then the books inside the two blocks swap to expose the independent factors
 * 5!, 2!, and 4!. Data: { groups: ["Arabic|A|2|#...", ...], grouped: ["Arabic", "Spanish"] }.
 */
export function BookBlockPermuteScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const groups = (Array.isArray(data.groups) ? data.groups : []).map((raw) => {
    const [name, code, countRaw, color] = String(raw).split("|");
    return { name, code, count: Math.max(0, Math.round(num(countRaw, 0))), color: color || DIM };
  });
  const grouped = new Set((Array.isArray(data.grouped) ? data.grouped : []).map(String));
  const loose = groups.filter((g) => !grouped.has(g.name));
  const unitCount = grouped.size + loose.reduce((sum, g) => sum + g.count, 0);
  const internal = groups.filter((g) => grouped.has(g.name)).reduce((product, g) => product * factorial(g.count), 1);
  const total = factorial(unitCount) * internal;
  const answerOk = problem.shortAnswer == null || String(total) === String(problem.shortAnswer).replace(/[^\d]/g, "");
  const isFinal = step >= totalSteps - 1;

  const arabic = groups.find((g) => g.name === "Arabic");
  const german = groups.find((g) => g.name === "German");
  const spanish = groups.find((g) => g.name === "Spanish");
  const W = 460;
  const shelfY = 143;

  const Block = ({ x, group, shuffle = false }: { x: number; group: typeof groups[number]; shuffle?: boolean }) => (
    <motion.g
      initial={false}
      animate={shuffle ? { x: [0, 5, -4, 0] } : { x: 0 }}
      transition={{ duration: 0.75, times: [0, 0.3, 0.65, 1] }}
    >
      <rect x={x - 5} y="68" width={group.count * 29 + 6} height="66" rx="8" fill={group.color} fillOpacity="0.12" stroke={group.color} strokeWidth="2" strokeDasharray="5 3" />
      {Array.from({ length: group.count }, (_, i) => (
        <motion.g
          key={`${group.name}-${i}`}
          initial={false}
          animate={shuffle && group.count > 1 ? { x: (group.count - 1 - 2 * i) * 29 } : { x: 0 }}
          transition={{ type: "spring", stiffness: 170, damping: 17, delay: 0.16 + i * 0.06 }}
        >
          <Book x={x + i * 29} y={76} color={group.color} code={group.code} index={i + 1} delay={0.08 * i} />
        </motion.g>
      ))}
      <text x={x + (group.count * 29 - 4) / 2} y="59" textAnchor="middle" fontSize="10" fontWeight="800" fill={group.color}>
        {group.name} block
      </text>
    </motion.g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 250`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="19" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? "bundle the books that must stay together" : isFinal ? "independent choices multiply" : "arrange five shelf units"}
        </text>

        <line x1="18" y1={shelfY} x2={W - 18} y2={shelfY} stroke={INK} strokeWidth="5" strokeLinecap="round" />
        <line x1="28" y1={shelfY + 8} x2={W - 28} y2={shelfY + 8} stroke="#cbd5e1" strokeWidth="2" />

        {arabic && <Block x={step === 1 ? 178 : 24} group={arabic} shuffle={isFinal} />}
        {spanish && <Block x={step === 1 ? 284 : 290} group={spanish} shuffle={isFinal} />}
        {german && Array.from({ length: german.count }, (_, i) => {
          const start = [107, 194, 252][i] ?? 107 + i * 58;
          const arranged = [24, 105, 250][i] ?? 24 + i * 70;
          return <Book key={`G-${i}`} x={step === 1 ? arranged : start} y={76} color={german.color} code={german.code} index={i + 1} delay={0.15 + i * 0.08} />;
        })}

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="units" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: 0.75 }}>
              <text x={W / 2} y="177" textAnchor="middle" fontSize="12" fontWeight="800" fill={IND} fontFamily={FONT}>
                [A block] + G₁ + G₂ + G₃ + [S block] = 5 units
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g key="permute" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <motion.path d="M 105 174 C 160 205, 300 205, 355 174" fill="none" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
              <text x={W / 2} y="205" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT}>5! = 120</text>
            </motion.g>
          )}
          {isFinal && (
            <motion.g key="multiply" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <text x={W / 2} y="177" textAnchor="middle" fontSize="11" fontWeight="800" fill={INK}>shuffle the distinct books inside each block</text>
              <text x={W / 2} y="202" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>
                5! · 2! · 4! = {total.toLocaleString("en-US")}
              </text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.45 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="182" y="215" width="96" height="24" rx="12" fill={answerOk ? WIN : "#dc2626"} />
                <text x={W / 2} y="231" textAnchor="middle" fontSize="12" fontWeight="800" fill="#fff">Answer {answerOk ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
