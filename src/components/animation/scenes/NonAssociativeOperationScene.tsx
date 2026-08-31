import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);
const frac = (num: number, den: number) => {
  const sign = num * den < 0 ? "−" : "";
  const n = Math.abs(num);
  const d = Math.abs(den);
  const g = gcd(n, d) || 1;
  return { n: n / g, d: d / g, sign };
};

/**
 * A made-up operation a⊗b = a²/b evaluated with two different bracketings of
 * the same three numbers — the scene evaluates the left bracket for real,
 * spends a beat on the trap of assuming ⊗ is associative (so both
 * bracketings should match, making the difference zero), then evaluates the
 * right bracket independently and shows it lands somewhere else entirely
 * before subtracting the two real results.
 * Data: { a, b, c }.
 */
export function NonAssociativeOperationScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const a = num(data.a, 1);
  const b = num(data.b, 2);
  const c = num(data.c, 3);

  // left: (a ⊗ b) ⊗ c
  const l1 = frac(a * a, b);
  const l2 = frac(l1.n * l1.n, l1.d * l1.d * c);

  // right: a ⊗ (b ⊗ c)
  const r1 = frac(b * b, c);
  const r2 = frac(a * a * r1.d, r1.n);

  // exact fraction subtraction: (±l2.n/l2.d) − (±r2.n/r2.d)
  const signed = (f: { n: number; d: number; sign: string }) => (f.sign ? -1 : 1) * f.n;
  const diffFrac = frac(signed(l2) * r2.d - signed(r2) * l2.d, l2.d * r2.d);
  const answerOk = problem.shortAnswer == null || `${diffFrac.sign}${diffFrac.n}/${diffFrac.d}` === String(problem.shortAnswer).trim().replace(/[−–—]/g, "−");
  const failure = !answerOk ? `computed ${diffFrac.sign}${diffFrac.n}/${diffFrac.d}, stored answer is ${problem.shortAnswer}` : "";

  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === "0");

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showRight = step >= 2 || isFinal;

  const W = 300;
  const H = 190;

  const caption = isFinal
    ? `${l2.sign}${l2.n}/${l2.d} − ${r2.sign || ""}${r2.n}/${r2.d} = ${diffFrac.sign}${diffFrac.n}/${diffFrac.d}`
    : showRight
    ? `right bracket: (${b}⊗${c}) = ${r1.sign}${r1.n}/${r1.d}, then ${a}⊗(${r1.sign}${r1.n}/${r1.d}) = ${r2.sign}${r2.n}/${r2.d}`
    : showTrap
    ? trapChoice
      ? `if ⊗ were associative, both brackets would match and the difference would be 0 — choice ${trapChoice.label}`
      : `⊗ isn't associative, so assuming both brackets match is the trap`
    : `left bracket: (${a}⊗${b}) = ${l1.sign}${l1.n}/${l1.d}, then that ⊗${c} = ${l2.sign}${l2.n}/${l2.d}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK} fontFamily={numberFont}>
          a ⊗ b = a² / b
        </text>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <text x={70} y={55} textAnchor="middle" fontSize="11" fontWeight="800" fill={IND} fontFamily={numberFont}>
            ({a}⊗{b})⊗{c}
          </text>
          <text x={70} y={75} textAnchor="middle" fontSize="15" fontWeight="800" fill={IND} fontFamily={numberFont}>
            = {l2.sign}{l2.n}/{l2.d}
          </text>
        </motion.g>

        {showTrap && (
          <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x={W / 2 - 70} y={90} width={140} height={30} rx={8} fill="#fee2e2" stroke={BAD} strokeWidth={1.3} />
            <text x={W / 2} y={110} textAnchor="middle" fontSize="12" fontWeight="800" fill={BAD} fontFamily={numberFont}>
              same − same = 0?
            </text>
          </motion.g>
        )}

        {showRight && (
          <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <text x={230} y={55} textAnchor="middle" fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              {a}⊗({b}⊗{c})
            </text>
            <text x={230} y={75} textAnchor="middle" fontSize="15" fontWeight="800" fill={WIN} fontFamily={numberFont}>
              = {r2.sign}{r2.n}/{r2.d}
            </text>
          </motion.g>
        )}

        {isFinal && (
          <motion.text x={W / 2} y={145} textAnchor="middle" fontSize="16" fontWeight="800" fill={WIN} fontFamily={numberFont} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.4 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            {l2.sign}{l2.n}/{l2.d} − {r2.sign || ""}{r2.n}/{r2.d} = {diffFrac.sign}{diffFrac.n}/{diffFrac.d}
          </motion.text>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11,
          fontWeight: 800,
          color: isFinal ? "#166534" : showTrap ? BAD : IND,
          background: isFinal ? "#dcfce7" : showTrap ? "#fee2e2" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : showTrap ? "#fecaca" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
          maxWidth: 300,
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
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.5 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
