import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const AMBER = "#d97706";

const isPrime = (n: number) => {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d += 1) if (n % d === 0) return false;
  return true;
};

/**
 * Four truth lamps control a street-number sieve. The prime lamp is shown to
 * conflict with two others, so it cannot participate in a set of three truths;
 * the remaining lamps then filter the complete two-digit range.
 * Data: { min, max, divisor, requiredDigit, truthCount }.
 */
export function TruthCountHouseScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const min = Math.round(num(data.min, 10));
  const max = Math.round(num(data.max, 99));
  const divisor = Math.round(num(data.divisor, 7));
  const requiredDigit = Math.round(num(data.requiredDigit, 9));
  const truthCount = Math.round(num(data.truthCount, 3));

  const tests = [
    { key: "prime", label: "PRIME", holds: (n: number) => isPrime(n) },
    { key: "even", label: "EVEN", holds: (n: number) => n % 2 === 0 },
    { key: "divisible", label: `÷ ${divisor}`, holds: (n: number) => n % divisor === 0 },
    { key: "digit", label: `HAS ${requiredDigit}`, holds: (n: number) => String(n).includes(String(requiredDigit)) },
  ];
  const truthFor = (n: number) => tests.filter((test) => test.holds(n)).length;
  const exact = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((n) => truthFor(n) === truthCount);
  const evenMultiples = Array.from({ length: max - min + 1 }, (_, i) => min + i).filter((n) => n % 2 === 0 && n % divisor === 0);
  const survivors = evenMultiples.filter((n) => String(n).includes(String(requiredDigit)));
  const winner = survivors.length === 1 ? survivors[0] : null;
  const units = winner == null ? null : winner % 10;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(c.text) === units)?.label;
  const primeCanJoinThree = Array.from({ length: max - min + 1 }, (_, i) => min + i)
    .some((n) => isPrime(n) && truthFor(n) >= truthCount);
  const ok = !primeCanJoinThree && exact.length === 1 && winner === exact[0] && units === stored && choice === problem.answer;
  const failure = primeCanJoinThree
    ? "a prime candidate can satisfy three statements"
    : exact.length !== 1
      ? `${exact.length} two-digit numbers satisfy exactly ${truthCount} statements`
      : winner !== exact[0]
        ? "the three kept filters miss the exact-truth candidate"
        : `computed units digit ${units ?? "?"}, stored answer ${problem.shortAnswer}`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const Lamp = ({ x, label, on, crossed = false, delay = 0 }: { x: number; label: string; on: boolean; crossed?: boolean; delay?: number }) => (
    <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 210, damping: 16, delay }}>
      <rect x={x - 43} y="48" width="86" height="54" rx="12" fill={on ? "#dcfce7" : "#f8fafc"} stroke={on ? GREEN : crossed ? RED : "#cbd5e1"} strokeWidth={on || crossed ? 2.4 : 1.5} />
      <circle cx={x} cy="65" r="6" fill={on ? GREEN : "#cbd5e1"} />
      <text x={x} y="88" textAnchor="middle" fontSize="11" fontWeight="900" fill={on ? "#166534" : crossed ? RED : INK} fontFamily={mono}>{label}</text>
      {crossed && <motion.path d={`M ${x - 34} 55 L ${x + 34} 95 M ${x + 34} 55 L ${x - 34} 95`} stroke={RED} strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, delay: delay + 0.25 }} />}
    </motion.g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "6px 4px" }}>
      <svg viewBox="-20 0 500 258" width="100%" style={{ maxWidth: 480, display: "block" }}>
        {phase === 0 && <g>
          <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>exactly {truthCount} claim-lamps must be on</text>
          <Lamp x={50} label="PRIME" on={false} crossed delay={0.1} />
          <Lamp x={150} label="EVEN" on={false} delay={0.2} />
          <Lamp x={250} label={`÷ ${divisor}`} on={false} delay={0.3} />
          <Lamp x={350} label={`HAS ${requiredDigit}`} on={false} delay={0.4} />
          <motion.path d="M 71 111 Q 105 150 136 111 M 65 116 Q 155 195 240 116" fill="none" stroke={RED} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.85, delay: 0.75 }} />
          <rect x="67" y="137" width="78" height="16" rx="8" fill="#fff" />
          <text x="106" y="147" textAnchor="middle" fontSize="10" fontWeight="900" fill={RED}>cannot both be true</text>
          <text x="210" y="192" textAnchor="middle" fontSize="10" fontWeight="900" fill={RED}>a two-digit prime cannot be divisible by {divisor}</text>
          <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.35 }}>
            <rect x="99" y="212" width="262" height="32" rx="16" fill="#fef2f2" stroke="#fecaca" />
            <text x="230" y="233" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={mono}>prime on ⇒ at most 2 truths</text>
          </motion.g>
        </g>}

        {phase === 1 && <g>
          <text x="230" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>turn on the only possible set of three</text>
          <Lamp x={50} label="PRIME" on={false} crossed delay={0.05} />
          <Lamp x={150} label="EVEN" on delay={0.18} />
          <Lamp x={250} label={`÷ ${divisor}`} on delay={0.31} />
          <Lamp x={350} label={`HAS ${requiredDigit}`} on delay={0.44} />
          {[150, 250, 350].map((x, i) => <motion.g key={x} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.65 + i * 0.14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx={x} cy="128" r="13" fill={GREEN} />
            <path d={`M ${x - 6} 128 l 4 4 8-9`} fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>)}
          <path d="M 150 145 L 150 171 L 350 171 L 350 145 M 250 145 L 250 171" fill="none" stroke="#86efac" strokeWidth="2" />
          <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}>
            <rect x="94" y="186" width="272" height="48" rx="12" fill="#f0fdf4" stroke="#86efac" />
            <text x="230" y="207" textAnchor="middle" fontSize="12" fontWeight="900" fill="#166534" fontFamily={mono}>even ∩ multiple of {divisor} ∩ digit {requiredDigit}</text>
            <text x="230" y="224" textAnchor="middle" fontSize="10" fontWeight="800" fill="#15803d">the house number must pass all three filters</text>
          </motion.g>
        </g>}

        {phase === 2 && <g>
          <text x="230" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>scan the two-digit even multiples of {divisor}</text>
          {evenMultiples.map((n, i) => {
            const x = 35 + i * (320 / Math.max(1, evenMultiples.length - 1));
            const hasDigit = String(n).includes(String(requiredDigit));
            return <motion.g key={n} initial={{ opacity: 0, y: -14 }} animate={{ opacity: hasDigit ? 1 : 0.38, y: 0 }} transition={{ type: "spring", stiffness: 190, damping: 16, delay: i * 0.1 }}>
              <path d={`M ${x - 22} 91 L ${x} 70 L ${x + 22} 91 V 127 H ${x - 22} Z`} fill={hasDigit ? "#dcfce7" : "#f8fafc"} stroke={hasDigit ? GREEN : "#cbd5e1"} strokeWidth={hasDigit ? 2.8 : 1.4} />
              <rect x={x - 7} y="108" width="14" height="19" fill={hasDigit ? "#86efac" : "#e2e8f0"} />
              <text x={x} y="102" textAnchor="middle" fontSize="13" fontWeight="900" fill={hasDigit ? GREEN : INK} fontFamily={mono}>{n}</text>
              {!hasDigit && <motion.line x1={x - 19} y1="72" x2={x + 19} y2="126" stroke={RED} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 + i * 0.06 }} />}
            </motion.g>;
          })}
          <motion.text x="230" y="153" textAnchor="middle" fontSize="12" fontWeight="900" fill={winner != null ? GREEN : RED} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.15 }}>
            {winner != null ? `only ${winner} contains the digit ${requiredDigit}` : "the filters do not leave one house"}
          </motion.text>
          {winner != null && <motion.g initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.35 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x="155" y="170" width="150" height="45" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
            <text x="199" y="199" textAnchor="middle" fontSize="23" fontWeight="900" fill={INK} fontFamily={mono}>{Math.floor(winner / 10)}</text>
            <rect x="224" y="176" width="41" height="33" rx="7" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
            <text x="245" y="200" textAnchor="middle" fontSize="24" fontWeight="900" fill={GREEN} fontFamily={mono}>{units}</text>
            <text x="281" y="198" textAnchor="middle" fontSize="9" fontWeight="900" fill={AMBER}>units</text>
          </motion.g>}
          <text x="230" y="235" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `${winner} has exactly ${truthCount} true statements` : failure}</text>
          <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={238} width={88} />
        </g>}
      </svg>
      <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
    </div>
  );
}
