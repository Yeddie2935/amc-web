import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const TEAL = "#0d9488";
const GREEN = "#16a34a";
const RED = "#dc2626";

/**
 * A repeated three-digit block is first shown as two physical copies. The
 * copies ride on their place-value weights (1000 and 1), regroup around the
 * common block, and leave 1001 to split into its prime factors.
 * Data: { blockDigits: number, shift: number, factors: number[] }.
 */
export function RepeatedBlockFactorScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const blockDigits = Math.round(num(data.blockDigits, 3));
  const shift = Math.round(num(data.shift, 1000));
  const factors = (Array.isArray(data.factors) ? data.factors : []).map(Number);
  const multiplier = shift + 1;
  const product = factors.reduce((a, b) => a * b, 1);
  const choiceValues = (problem.choices ?? []).map((choice) => ({
    label: choice.label,
    value: Number(String(choice.text).replace(/[^\d-]/g, "")),
  }));
  const listedFactors = choiceValues.filter(({ value }) => Number.isInteger(value) && multiplier % value === 0);
  const answerValue = choiceValues.find(({ label }) => label === problem.answer)?.value;
  const ok = blockDigits === 3 && shift === 10 ** blockDigits && factors.length === 3 && product === multiplier &&
    listedFactors.length === 1 && answerValue === listedFactors[0]?.value && String(answerValue) === problem.shortAnswer;
  const failure = shift !== 10 ** blockDigits
    ? `shift ${shift} does not match ${blockDigits} digits`
    : product !== multiplier
      ? `${factors.join(" · ")} does not equal ${multiplier}`
      : listedFactors.length !== 1
        ? `${listedFactors.length} listed choices divide ${multiplier}`
        : `computed factor ${listedFactors[0]?.value ?? "?"} does not match the stored answer`;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const Block = ({ x, y, tone = INDIGO }: { x: number; y: number; tone?: string }) => (
    <g>
      <rect x={x} y={y} width="108" height="46" rx="10" fill={tone} fillOpacity="0.12" stroke={tone} strokeWidth="2" />
      {["a", "b", "c"].map((letter, i) => (
        <g key={letter}>
          {i > 0 && <line x1={x + i * 36} y1={y + 5} x2={x + i * 36} y2={y + 41} stroke={tone} strokeOpacity="0.35" />}
          <text x={x + 18 + i * 36} y={y + 30} textAnchor="middle" fontSize="21" fontWeight="900" fill={tone} fontFamily={mono}>{letter}</text>
        </g>
      ))}
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "6px 4px" }}>
      <svg viewBox="0 0 420 248" width="100%" style={{ maxWidth: 470 }}>
        {phase === 0 && (
          <g>
            <text x="210" y="20" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>the same three-digit block appears twice</text>
            {[72, 240].map((x, i) => (
              <motion.g key={x} initial={{ opacity: 0, x: i ? 45 : -45 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 170, damping: 16, delay: 0.15 + i * 0.18 }}>
                <Block x={x} y={58} tone={i ? TEAL : INDIGO} />
                <text x={x + 54} y="124" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={i ? TEAL : INDIGO} fontFamily={mono}>{i ? "last abc" : "first abc"}</text>
              </motion.g>
            ))}
            <motion.path d="M 128 145 C 128 178, 292 178, 292 145" fill="none" stroke="#a5b4fc" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.7 }} />
            <motion.text x="210" y="188" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}>abcabc</motion.text>
            <text x="210" y="217" textAnchor="middle" fontSize="11" fontWeight="700" fill="#64748b">copy the block without changing its order</text>
          </g>
        )}

        {phase === 1 && (
          <g>
            <text x="210" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>place value gives each copy its weight</text>
            <motion.g initial={{ x: -38, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 170, damping: 17 }}>
              <Block x={38} y={47} />
              <rect x="50" y="105" width="84" height="28" rx="14" fill="#eef2ff" stroke="#a5b4fc" />
              <text x="92" y="124" textAnchor="middle" fontSize="14" fontWeight="900" fill={INDIGO} fontFamily={mono}>× {shift}</text>
            </motion.g>
            <text x="176" y="82" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK}>+</text>
            <motion.g initial={{ x: 38, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 170, damping: 17, delay: 0.18 }}>
              <Block x={220} y={47} tone={TEAL} />
              <rect x="232" y="105" width="84" height="28" rx="14" fill="#ecfeff" stroke="#5eead4" />
              <text x="274" y="124" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={mono}>× 1</text>
            </motion.g>
            <motion.g initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 16, delay: 0.65 }}>
              <path d="M 92 144 L 92 163 L 210 182 M 274 144 L 274 163 L 210 182" fill="none" stroke="#94a3b8" strokeWidth="2" />
              <rect x="58" y="178" width="304" height="40" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
              <text x="210" y="204" textAnchor="middle" fontSize="16" fontWeight="900" fill={INDIGO} fontFamily={mono}>({shift} + 1) · abc = {multiplier} · abc</text>
            </motion.g>
          </g>
        )}

        {phase === 2 && (
          <g>
            <text x="210" y="19" textAnchor="middle" fontSize="12" fontWeight="800" fill={INK}>split the fixed multiplier into factors</text>
            <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="151" y="38" width="118" height="44" rx="12" fill="#eef2ff" stroke={INDIGO} strokeWidth="2" />
              <text x="210" y="66" textAnchor="middle" fontSize="20" fontWeight="900" fill={INDIGO} fontFamily={mono}>{multiplier}</text>
            </motion.g>
            <path d="M 210 82 L 210 102 M 99 102 L 321 102 M 99 102 L 99 122 M 210 102 L 210 122 M 321 102 L 321 122" fill="none" stroke="#94a3b8" strokeWidth="2" />
            {factors.map((factor, i) => {
              const x = 99 + i * 111;
              const chosen = factor === answerValue;
              return (
                <motion.g key={factor} initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.28 + i * 0.16 }}>
                  <circle cx={x} cy="148" r={chosen ? 29 : 25} fill={chosen ? "#dcfce7" : "#f8fafc"} stroke={chosen ? GREEN : "#cbd5e1"} strokeWidth={chosen ? 3 : 2} />
                  <text x={x} y="155" textAnchor="middle" fontSize="20" fontWeight="900" fill={chosen ? GREEN : INK} fontFamily={mono}>{factor}</text>
                  {chosen && <text x={x} y="191" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>IN THE CHOICES</text>}
                </motion.g>
              );
            })}
            <text x="210" y="219" textAnchor="middle" fontSize="12" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={mono}>{ok ? `${multiplier} = ${factors.join(" · ")}  ⇒  ${answerValue} always divides Z` : failure}</text>
            <SvgAnswerBadge show={ok} answer={problem.answer} cx={210} y={224} width={88} />
          </g>
        )}
      </svg>
      <AnimatePresence>{final && !ok && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>{failure}</motion.div>}</AnimatePresence>
    </div>
  );
}
