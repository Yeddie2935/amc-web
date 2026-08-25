import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const mono = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const AMBER = "#f59e0b";
const GREEN = "#16a34a";
const RED = "#dc2626";

type ShellProps = { x: number; y: number; w: number; h: number; color: string; label: string; active: boolean };

function Shell({ x, y, w, h, color, label, active }: ShellProps) {
  return <motion.g animate={{ scale: active ? [1, 1.025, 1] : 1 }} transition={{ duration: 0.8, repeat: active ? Infinity : 0 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <rect x={x} y={y} width={w} height={h} rx="13" fill={`${color}18`} stroke={color} strokeWidth={active ? 3 : 1.6} />
    <path d={`M ${x + 10} ${y + 27} l 7 7 8 -19 h ${w - 38}`} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <text x={x + 12} y={y + 15} fontSize="8.5" fontWeight="900" fill={color} fontFamily={mono}>{label}</text>
  </motion.g>;
}

/** Three nested square roots collapse from the center outward. Data:
 * { outerFactor, middleFactor, innerRadicand }. */
export function NestedRadicalCollapseScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const outer = num(data.outerFactor, 0);
  const middle = num(data.middleFactor, 0);
  const innerRadicand = num(data.innerRadicand, 0);
  const inner = Math.sqrt(innerRadicand);
  const middleRadicand = middle * inner;
  const middleResult = Math.sqrt(middleRadicand);
  const outerRadicand = outer * middleResult;
  const result = Math.sqrt(outerRadicand);
  const stated = Number(String(problem.shortAnswer ?? "").replace(/[^0-9.-]/g, ""));
  const rootsIntegral = Number.isInteger(inner) && Number.isInteger(middleResult) && Number.isInteger(result);
  const answerMatches = problem.shortAnswer == null || stated === result;
  const consistent = rootsIntegral && answerMatches;

  const last = totalSteps - 1;
  const final = step >= last;
  const middleDone = step >= 1 || final;
  const innerDone = true;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
    <svg viewBox="0 0 390 224" width="100%" style={{ maxWidth: 430 }}>
      <AnimatePresence mode="wait" initial={false}>
        {!final ? <motion.g key={`nested-${step}`} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} transition={{ type: "spring", stiffness: 180, damping: 18 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <Shell x={25} y={25} w={340} h={170} color={INDIGO} label="OUTER ROOT" active={false} />
          <text x="55" y="78" fontSize="22" fontWeight="900" fill={INK} fontFamily={mono}>{outer} ×</text>
          <Shell x={112} y={55} w={225} h={112} color={AMBER} label="MIDDLE ROOT" active={step === 1} />
          <text x="140" y="108" fontSize="20" fontWeight="900" fill={INK} fontFamily={mono}>{middle} ×</text>

          {!middleDone ? <>
            <Shell x={213} y={79} w={100} h={66} color={GREEN} label="START HERE" active />
            <text x="251" y="124" textAnchor="middle" fontSize="22" fontWeight="900" fill={INK} fontFamily={mono}>{innerRadicand}</text>
          </> : <motion.g initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <rect x="218" y="88" width="86" height="43" rx="12" fill="#dcfce7" stroke={GREEN} strokeWidth="2" />
            <text x="261" y="115" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={mono}>{inner}</text>
          </motion.g>}

          <AnimatePresence>{innerDone && step === 0 && <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <rect x="205" y="158" width="116" height="29" rx="14" fill="#dcfce7" stroke={GREEN} />
            <text x="263" y="177" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={mono}>√{innerRadicand} = {inner}</text>
          </motion.g>}</AnimatePresence>
          <AnimatePresence>{middleDone && <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
            <rect x="118" y="168" width="213" height="30" rx="15" fill="#fffbeb" stroke={AMBER} />
            <text x="224.5" y="188" textAnchor="middle" fontSize="13" fontWeight="900" fill="#b45309" fontFamily={mono}>√({middle} × {inner}) = √{middleRadicand} = {middleResult}</text>
          </motion.g>}</AnimatePresence>
        </motion.g> : <motion.g key="final" initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 170, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <Shell x={54} y={45} w={282} h={120} color={INDIGO} label="LAST SHELL" active />
          <text x="195" y="105" textAnchor="middle" fontSize="25" fontWeight="900" fill={INK} fontFamily={mono}>√({outer} × {middleResult})</text>
          <motion.text x="195" y="143" textAnchor="middle" fontSize="19" fontWeight="900" fill={INDIGO} fontFamily={mono} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>√{outerRadicand}</motion.text>
          {consistent && <motion.g initial={{ opacity: 0, scale: 0.3 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 230, damping: 14, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="195" cy="190" r="25" fill={GREEN} />
            <text x="195" y="198" textAnchor="middle" fontSize="23" fontWeight="900" fill="#fff" fontFamily={mono}>{result}</text>
          </motion.g>}
        </motion.g>}
      </AnimatePresence>
    </svg>

    <motion.span key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: mono, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {step === 0 ? `open the innermost shell: √${innerRadicand} = ${inner}` : final ? `the last shell gives √${outerRadicand} = ${result}` : `${middle} × ${inner} = ${middleRadicand}, so the middle shell becomes ${middleResult}`}
    </motion.span>
    {!consistent && <span style={{ color: RED, fontFamily: mono, fontSize: 11, fontWeight: 800 }}>
      {!rootsIntegral ? `non-integral root: ${inner}, ${middleResult}, ${result}` : `computed ${result}, but stored answer is ${problem.shortAnswer}`}
    </span>}
    <AnimatePresence>{final && consistent && problem.answer && <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 1.15 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 700, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
  </div>;
}
