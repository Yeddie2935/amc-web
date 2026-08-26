import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", ORANGE = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#94a3b8";

/** Pair exponent factors into two identical bundles, exposing any unpaired base factor. */
export function PowerSquareParityScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const bases = (Array.isArray(data.bases) ? data.bases : []).map((value) => Math.round(num(value, 0)));
  const exponents = (Array.isArray(data.exponents) ? data.exponents : []).map((value) => Math.round(num(value, 0)));
  const entries = bases.map((base, i) => {
    const exponent = exponents[i];
    const root = Math.round(Math.sqrt(base));
    const squareBase = root * root === base;
    const square = exponent % 2 === 0 || squareBase;
    return { base, exponent, root, squareBase, square, text: `${base}^${exponent}`, label: problem.choices?.[i]?.label ?? "?" };
  });
  const exceptions = entries.filter((entry) => !entry.square);
  const exception = exceptions[0];
  const normalized = (value: string) => value.replace(/\s/g, "").replace(/[−–—]/g, "-");
  const ok = exceptions.length === 1 && !!exception && normalized(exception.text) === normalized(problem.shortAnswer ?? "") && exception.label === problem.answer;
  const failure = exceptions.length !== 1 ? `found ${exceptions.length} non-squares` : normalized(exception.text) !== normalized(problem.shortAnswer ?? "") ? `computed ${exception.text}, stored ${problem.shortAnswer}` : `choice ${exception.label}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 295" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "an even exponent splits into two identical factor bundles" : phase === 1 ? "an odd exponent is still safe when the base itself is a square" : "2^2017 leaves one factor of 2 outside all the pairs"}</text>

      <g transform="translate(25 42)">{entries.map((entry, i) => {
        const y = i * 43;
        const evenSafe = entry.exponent % 2 === 0;
        const baseSafe = entry.squareBase && !evenSafe;
        const shownSafe = evenSafe || (phase >= 1 && baseSafe);
        const bad = phase === 2 && !entry.square;
        const inactive = (phase === 0 && !evenSafe) || (phase === 1 && !evenSafe && !baseSafe);
        const half = entry.exponent / 2;
        return <motion.g key={entry.text} initial={{ opacity: 0, x: -18 }} animate={{ opacity: inactive ? 0.45 : 1, x: 0 }} transition={{ delay: i * 0.09 }}>
          <rect x="0" y={y} width="410" height="34" rx="9" fill={bad ? "#fee2e2" : shownSafe ? "#dcfce7" : "#f8fafc"} stroke={bad ? RED : shownSafe ? GREEN : "#cbd5e1"} strokeWidth={bad || shownSafe ? 2 : 1.2} />
          <text x="14" y={y + 22} fontSize="11" fontWeight="900" fill={bad ? RED : shownSafe ? GREEN : INK} fontFamily={FONT}>{entry.label}</text>
          <text x="46" y={y + 22} fontSize="14" fontWeight="900" fill={bad ? RED : IND} fontFamily={FONT}>{entry.base}^{entry.exponent}</text>
          {evenSafe && <><motion.path d={`M 142 ${y + 17} H 172`} stroke={GREEN} strokeWidth="2" markerEnd="url(#pair-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x="187" y={y + 22} fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>({entry.base}^{half})²</text><text x="374" y={y + 22} textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>paired ✓</text></>}
          {phase >= 1 && baseSafe && <><motion.path d={`M 142 ${y + 17} H 172`} stroke={GREEN} strokeWidth="2" markerEnd="url(#pair-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x="187" y={y + 22} fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>({entry.root}^{entry.exponent})²</text><text x="374" y={y + 22} textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>base pairs ✓</text></>}
          {bad && <><text x="168" y={y + 22} fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>({entry.base}^{Math.floor(entry.exponent / 2)})²</text><motion.rect x="315" y={y + 5} width="34" height="24" rx="7" fill="#fff" stroke={RED} strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} /><text x="332" y={y + 22} textAnchor="middle" fontSize="13" fontWeight="900" fill={RED} fontFamily={FONT}>×{entry.base}</text><text x="385" y={y + 22} textAnchor="middle" fontSize="9.5" fontWeight="900" fill={RED}>left over</text></>}
        </motion.g>;
      })}</g>
      <defs><marker id="pair-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={GREEN} /></marker></defs>

      {phase === 0 && <g transform="translate(117 262)"><text x="113" y="0" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>A, C, and E fold immediately into squares</text></g>}
      {phase === 1 && <g transform="translate(120 258)"><text x="110" y="0" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>4^2019 = (2²)^2019 = (2^2019)²</text></g>}
      {phase === 2 && <><g transform="translate(118 257)"><rect x="0" y="0" width="224" height="29" rx="10" fill="#fee2e2" stroke={ok ? RED : DIM} /><text x="112" y="20" textAnchor="middle" fontSize="12" fontWeight="900" fill={RED} fontFamily={FONT}>{exception?.text}: one unpaired factor</text></g><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={259} width={78} /></>}
      <AnimatePresence>{final && !ok && <motion.text x="230" y="292" textAnchor="middle" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
