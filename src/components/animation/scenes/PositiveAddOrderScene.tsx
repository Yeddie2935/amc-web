import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const DIM = "#94a3b8";

/**
 * A symbolic order line where a positive segment is copied onto a larger
 * quantity. The translated endpoint must move right, proving an inequality
 * that contradicts one answer choice. No numerical spacing is asserted.
 * Data: { order, positiveTerm, addTo, compareTo, targetChoice }.
 */
export function PositiveAddOrderScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const order = Array.isArray(data.order) ? data.order.map(String) : [];
  const positive = String(data.positiveTerm ?? "a");
  const addTo = String(data.addTo ?? "c");
  const compareTo = String(data.compareTo ?? "b");
  const targetChoice = String(data.targetChoice ?? "");
  const last = totalSteps - 1;
  const final = step >= last;
  const beat = final ? 2 : Math.min(step, 1);

  // These are diagram positions only: they preserve exactly the supplied
  // strict order. The copied 0→a segment is then translated to begin at c.
  const xs = [40, 88, 164, 236];
  const x = (symbol: string) => xs[Math.max(0, order.indexOf(symbol))] ?? xs[0];
  const lineY = 126;
  const positiveLength = x(positive) - x(order[0]);
  const sumX = x(addTo) + positiveLength;
  const choice = problem.choices?.find((item) => item.label === targetChoice);
  const normalized = String(choice?.text ?? "").replace(/\s+/g, "").replace(/[·×]/g, "*");
  const expectedChoice = `${positive}+${addTo}<${compareTo}`;
  const orderOk = order.join("|") === "0|a|b|c";
  const proofOk = orderOk && positiveLength > 0 && x(addTo) > x(compareTo) && sumX > x(addTo);
  const answerOk = targetChoice === String(problem.answer ?? "") && normalized === expectedChoice;
  const ok = proofOk && answerOk;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "6px 4px" }}>
      <svg viewBox="0 0 340 250" width="100%" style={{ maxWidth: 410 }}>
        <text x="170" y="19" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK} fontFamily={FONT}>
          {beat === 0 ? "read the strict order from left to right" : beat === 1 ? `copy the positive ${positive}-length onto ${addTo}` : `${addTo} + ${positive} lands even farther right`}
        </text>

        <line x1="25" y1={lineY} x2="316" y2={lineY} stroke={DIM} strokeWidth="2" />
        <path d={`M 316 ${lineY} l -8 -5 v 10 z`} fill={DIM} />
        {order.map((symbol, i) => (
          <motion.g key={symbol} initial={{ opacity: 0, scale: 0.4 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: i * 0.15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <line x1={xs[i]} y1={lineY - 6} x2={xs[i]} y2={lineY + 6} stroke={INK} strokeWidth="1.5" />
            <circle cx={xs[i]} cy={lineY} r="4" fill={i === 0 ? INK : IND} />
            <text x={xs[i]} y={lineY + 23} textAnchor="middle" fontSize="13" fontStyle={i ? "italic" : undefined} fontWeight="800" fill={INK}>{symbol}</text>
          </motion.g>
        ))}
        <text x={(x("a") + x("b")) / 2} y={lineY + 22} textAnchor="middle" fontSize="12" fill={DIM}>&lt;</text>
        <text x={(x("b") + x("c")) / 2} y={lineY + 22} textAnchor="middle" fontSize="12" fill={DIM}>&lt;</text>

        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <line x1={x("0")} y1="83" x2={x(positive)} y2="83" stroke={IND} strokeWidth="5" strokeLinecap="round" />
          <path d={`M ${x(positive)} 83 l -7 -5 v 10 z`} fill={IND} />
          <text x={(x("0") + x(positive)) / 2} y="73" textAnchor="middle" fontSize="11" fontWeight="850" fill={IND} fontFamily={FONT}>+{positive}</text>
          <text x={(x("0") + x(positive)) / 2} y="54" textAnchor="middle" fontSize="9.5" fontWeight="750" fill={GREEN}>positive length</text>
        </motion.g>

        <AnimatePresence>
          {beat >= 1 && <motion.g key="translated" initial={{ x: x("0") - x(addTo), opacity: 0.25 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 90, damping: 15 }}>
            <line x1={x(addTo)} y1="99" x2={sumX} y2="99" stroke={GREEN} strokeWidth="5" strokeLinecap="round" />
            <path d={`M ${sumX} 99 l -7 -5 v 10 z`} fill={GREEN} />
            <line x1={sumX} y1="93" x2={sumX} y2={lineY + 6} stroke={GREEN} strokeWidth="1.4" strokeDasharray="3 3" />
            <circle cx={sumX} cy={lineY} r="5" fill={GREEN} />
            <text x={sumX} y={lineY + 23} textAnchor="middle" fontSize="12" fontWeight="850" fill={GREEN} fontFamily={FONT}>{addTo}+{positive}</text>
          </motion.g>}
        </AnimatePresence>

        {beat === 1 && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <path d={`M ${x(compareTo)} 163 v 12 H ${sumX} v -12`} fill="none" stroke={GREEN} strokeWidth="1.7" />
          <text x={(x(compareTo) + sumX) / 2} y="191" textAnchor="middle" fontSize="12" fontWeight="850" fill={GREEN} fontFamily={FONT}>{compareTo} &lt; {addTo} &lt; {addTo}+{positive}</text>
        </motion.g>}

        {final && <g>
          <rect x="77" y="163" width="186" height="39" rx="9" fill="#fef2f2" stroke="#fecaca" />
          <text x="170" y="188" textAnchor="middle" fontSize="17" fontWeight="900" fill={RED} fontFamily={FONT}>{positive}+{addTo} &lt; {compareTo}</text>
          <motion.line x1="89" y1="194" x2="251" y2="171" stroke={RED} strokeWidth="3.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.65 }} />
          <text x="170" y="220" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok ? GREEN : RED} fontFamily={FONT}>
            {ok ? `impossible: actually ${compareTo} < ${addTo}+${positive}` : "self-check failed: order or stored choice disagrees"}
          </text>
          <SvgAnswerBadge show={ok} answer={targetChoice} cx={170} y={225} width={88} />
        </g>}
      </svg>
    </div>
  );
}
