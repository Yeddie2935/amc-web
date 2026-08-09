import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const HOP = "#4338ca";
const WIN = "#16a34a";
const WARN = "#d97706";

/** The counter walking the line. */
function Walker() {
  return (
    <g>
      <circle cx={0} cy={-7} r={5.5} fill="none" stroke={HOP} strokeWidth={2} />
      <path d="M -7.5,9 C -7.5,1 -3.5,-0.5 0,-0.5 C 3.5,-0.5 7.5,1 7.5,9" fill="none" stroke={HOP} strokeWidth={2} strokeLinecap="round" />
    </g>
  );
}

/**
 * An arithmetic sequence walked out on a number line: start at a, add the common
 * difference d each time, find the nth term. Counting backward (d < 0) really is
 * moving left, and the point the scene makes visible is that the nth term is
 * only **n − 1 hops** away — the classic off-by-one, whose near-miss term is
 * highlighted. Terms, hop count and the nth term are all computed from a/d/n.
 * Data: { start, step, n, given?, unit? }.
 */
export function ArithmeticHopScene({ problem, step: beat, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const start = num(data.start, 0);
  const d = num(data.step, 1);
  const n = Math.max(2, Math.round(num(data.n, 2)));
  const given = Math.min(n, Math.max(2, Math.round(num(data.given, 3))));

  const terms = Array.from({ length: n }, (_, i) => start + d * i);
  const hops = n - 1;
  const delta = Math.abs(d) * hops;
  const nth = terms[n - 1];
  const prev = terms[n - 2];

  const last = totalSteps - 1;
  const isFinal = beat >= last;
  const showAll = beat >= 1 || isFinal;
  const showCount = beat >= 2 || isFinal;
  const shown = showAll ? n : given;

  // ---- geometry: a true number line, values increasing to the right ----
  const W = 420;
  const H = 142;
  const leftX = 28;
  const rightX = 392;
  const lineY = 104;
  const lo = Math.min(...terms);
  const hi = Math.max(...terms);
  const X = (v: number) => (hi === lo ? (leftX + rightX) / 2 : leftX + ((v - lo) / (hi - lo)) * (rightX - leftX));

  const walkerX = X(terms[shown - 1]);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 460 }}>
        {/* the walker slides to whichever term we have reached */}
        <motion.g
          animate={{ x: walkerX, y: 28 }}
          transition={{ type: "spring", stiffness: 90, damping: 15, delay: 0.2 }}
        >
          <Walker />
        </motion.g>

        {/* number line */}
        <line x1={leftX - 12} y1={lineY} x2={rightX + 12} y2={lineY} stroke="#cbd5e1" strokeWidth={2} />

        {/* hops */}
        {terms.slice(0, Math.max(0, shown - 1)).map((v, i) => {
          const x1 = X(v);
          const x2 = X(terms[i + 1]);
          const mx = (x1 + x2) / 2;
          return (
            <motion.g
              key={`h${i}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: i * 0.09 }}
            >
              <path
                d={`M ${x1},${lineY - 26} Q ${mx},52 ${x2},${lineY - 26}`}
                fill="none"
                stroke={HOP}
                strokeWidth={1.6}
                strokeDasharray="3 2.5"
                opacity={0.75}
              />
              <text x={mx} y={48} textAnchor="middle" fontSize="8" fontWeight="700" fill={HOP} fontFamily={numberFont}>
                {d < 0 ? "−" : "+"}
                {Math.abs(d)}
              </text>
            </motion.g>
          );
        })}

        {/* terms: dot on the line, index above, value below */}
        {terms.slice(0, shown).map((v, i) => {
          const x = X(v);
          const isLast = i === n - 1;
          const isNearMiss = showCount && i === n - 2;
          const col = isLast && showCount ? WIN : isNearMiss ? WARN : HOP;
          return (
            <motion.g
              key={`t${i}`}
              initial={{ opacity: 0, scale: 0.4 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 16, delay: i * 0.09 }}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
            >
              <circle cx={x} cy={lineY} r={isLast && showCount ? 5.5 : 3.5} fill={col} />
              <circle cx={x} cy={lineY - 18} r={7.5} fill={isLast && showCount ? WIN : "#eef2ff"} stroke={col} strokeWidth={1.3} />
              <text
                x={x}
                y={lineY - 15}
                textAnchor="middle"
                fontSize="8.5"
                fontWeight="800"
                fill={isLast && showCount ? "#fff" : col}
                fontFamily={numberFont}
              >
                {i + 1}
              </text>
              <text x={x} y={lineY + 17} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={isLast && showCount ? WIN : INK} fontFamily={numberFont}>
                {v}
              </text>
            </motion.g>
          );
        })}

        {/* brace spanning the hops actually taken */}
        <AnimatePresence>
          {showCount && (
            <motion.g key="brace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.35 }}>
              <line x1={X(terms[0])} y1={lineY + 26} x2={X(nth)} y2={lineY + 26} stroke={WIN} strokeWidth={1.5} />
              <line x1={X(terms[0])} y1={lineY + 22} x2={X(terms[0])} y2={lineY + 30} stroke={WIN} strokeWidth={1.5} />
              <line x1={X(nth)} y1={lineY + 22} x2={X(nth)} y2={lineY + 30} stroke={WIN} strokeWidth={1.5} />
              <text x={(X(terms[0]) + X(nth)) / 2} y={lineY + 38} textAnchor="middle" fontSize="10" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                {hops} hops × {Math.abs(d)} = {delta}
              </text>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>

      {/* caption */}
      <motion.span
        key={`${shown}-${showCount}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 13,
          fontWeight: 800,
          color: showCount ? "#166534" : "#4338ca",
          background: showCount ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${showCount ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
        }}
      >
        {!showAll
          ? `start ${start}, each hop ${d < 0 ? "−" : "+"}${Math.abs(d)}`
          : !showCount
          ? `${n} numbers on the line`
          : `the ${n}th number is only ${hops} hops away — not ${n}`}
      </motion.span>

      {/* the near-miss trap */}
      <AnimatePresence>
        {showCount && (
          <motion.span
            key="trap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: WARN }}
          >
            {hops} hops lands on {nth}; stopping a hop early gives {prev}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && (
          <motion.div
            key="calc"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{ fontFamily: numberFont, fontSize: 17, fontWeight: 800, color: INK }}
          >
            {start} {d < 0 ? "−" : "+"} {delta} = <span style={{ color: WIN }}>{nth}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
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
