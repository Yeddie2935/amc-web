import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4f46e5", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

function exactExponent(base: number, value: number) {
  let power = 1;
  for (let exponent = 0; exponent <= 10; exponent += 1, power *= base) if (power === value) return exponent;
  return -1;
}

/** Remove each known addend to unlock three exponents, then feed them into one product tray. */
export function ExponentLockProductScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const bases = (data.unknownBases as unknown[]).map((v) => num(v, 0));
  const known = (data.knownTerms as unknown[]).map((v) => num(v, 0));
  const targets = (data.targets as unknown[]).map((v) => num(v, 0));
  const labels = (data.knownLabels as unknown[]).map(String);
  const symbols = (data.symbols as unknown[]).map(String);
  const remainders = targets.map((target, i) => target - known[i]);
  const exponents = bases.map((base, i) => exactExponent(base, remainders[i]));
  const product = exponents.reduce((value, exponent) => value * exponent, 1);
  const choice = problem.choices?.find((item) => Number(item.text) === product)?.label;
  const ok = exponents.every((value) => value >= 0) && String(product) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const active = Math.min(step, 2);
  const failure = `computed ${exponents.join("×")}=${product}; stored ${problem.shortAnswer ?? "?"} (${problem.answer})`;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 340" width="100%" style={{ width: "100%", maxWidth: "100%", minWidth: 0, display: "block" }}>
      <text x="230" y="19" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>{final ? "send the unlocked exponents into the product tray" : `unlock ${symbols[active]} by removing the known addend`}</text>

      {!final && [0, 1, 2].map((i) => {
        const solved = i <= active, isActive = i === active, y = 38 + i * 83;
        return <motion.g key={symbols[i]} initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .08 }}>
          <rect x="18" y={y} width="424" height="70" rx="13" fill={isActive ? "#eef2ff" : solved ? "#f0fdfa" : "#f8fafc"} stroke={isActive ? INDIGO : solved ? TEAL : "#cbd5e1"} strokeWidth={isActive ? 2.5 : 1.5} />
          <text x="39" y={y + 27} fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{bases[i]}^{symbols[i]} + {labels[i]} = {targets[i]}</text>
          {!solved && <><rect x="336" y={y + 16} width="78" height="34" rx="9" fill="#e2e8f0" /><text x="375" y={y + 38} textAnchor="middle" fontSize="12" fontWeight="800" fill={DIM}>locked</text></>}
          {solved && <>
            <motion.g initial={isActive ? { x: -28, opacity: 0 } : false} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 180, damping: 18 }}>
              <text x="39" y={y + 54} fontSize="12.5" fontWeight="850" fill={TEAL} fontFamily={FONT}>{targets[i]} − {known[i]} = {remainders[i]} = {bases[i]}^{exponents[i]}</text>
            </motion.g>
            <motion.g initial={isActive ? { scale: 0, rotate: -10 } : false} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", stiffness: 220, damping: 13, delay: .25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="354" y={y + 14} width="65" height="42" rx="11" fill={GREEN} />
              <path d={`M346 ${y + 24} l8 11 -8 11`} fill="none" stroke={GREEN} strokeWidth="3" />
              <text x="386.5" y={y + 41} textAnchor="middle" fontSize="17" fontWeight="900" fill="#fff" fontFamily={FONT}>{symbols[i]}={exponents[i]}</text>
            </motion.g>
          </>}
        </motion.g>;
      })}

      {final && <>
        <g transform="translate(55 48)">{exponents.map((value, i) => <motion.g key={symbols[i]} initial={{ opacity: 0, y: -35 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 190, damping: 15, delay: i * .18 }}>
          <rect x={i * 130} y="0" width="90" height="70" rx="15" fill="#f0fdfa" stroke={TEAL} strokeWidth="2" />
          <text x={i * 130 + 45} y="24" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>unlocked {symbols[i]}</text>
          <text x={i * 130 + 45} y="53" textAnchor="middle" fontSize="25" fontWeight="950" fill={INDIGO} fontFamily={FONT}>{value}</text>
        </motion.g>)}</g>
        <path d="M100 121 C100 157 230 144 230 174 M230 121 V174 M360 121 C360 157 230 144 230 174" fill="none" stroke="#a5b4fc" strokeWidth="2.5" />
        <motion.g initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .55 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <rect x="90" y="174" width="280" height="82" rx="18" fill="#eef2ff" stroke={INDIGO} strokeWidth="2.5" />
          <text x="230" y="202" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>PRODUCT TRAY</text>
          <text x="230" y="238" textAnchor="middle" fontSize="25" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{exponents.join(" × ")} = {product}</text>
        </motion.g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={277} width={92} />
        {!ok && <text x="230" y="318" textAnchor="middle" fontSize="10" fontWeight="800" fill={RED}>{failure}</text>}
      </>}
    </svg>
  </div>;
}
