import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const WIN = "#16a34a";
const WHO = ["#f59e0b", "#4338ca", "#0d9488", "#be123c"];

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));

/**
 * People take turns eating a fixed fraction of whatever is left, cycling in
 * order. Each person's share is a geometric series: their first bite times
 * 1/(1 − ratio^k) for k people. The block is drawn as a bar that gets carved up
 * bite by bite, colour-coded by eater, and the target's pieces are summed
 * exactly as a fraction.
 * Data: { names:[...], bites, targetIndex?, num?, den? } (bite = num/den of what remains).
 */
export function HalvingShareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const names = Array.isArray(data.names) ? data.names.map((v) => String(v)) : ["A", "B", "C"];
  const k = names.length;
  const bn = Math.max(1, Math.round(num(data.num, 1)));
  const bd = Math.max(2, Math.round(num(data.den, 2)));
  const bites = Math.max(k, Math.round(num(data.bites, 9)));
  const target = Math.min(names.length - 1, Math.max(0, Math.round(num(data.targetIndex, 0))));

  // carve the block: bite i takes bn/bd of what remains
  const pieces: { who: number; frac: number }[] = [];
  let remain = 1;
  for (let i = 0; i < bites; i++) {
    const eat = (remain * bn) / bd;
    pieces.push({ who: i % k, frac: eat });
    remain -= eat;
  }
  // exact total for the target: first bite × 1/(1 − ratio^k), ratio = 1 − bn/bd
  // with bn/bd = 1/2 and k people this is (1/2)/(1 − 1/2^k)
  const p = bn;
  const q = bd;
  const powNum = Math.pow(q - p, k);
  const powDen = Math.pow(q, k);
  // share = (p/q) / (1 − (q−p)^k / q^k) = p·q^(k−1) / (q^k − (q−p)^k)
  let sn = p * Math.pow(q, k - 1);
  let sd = powDen - powNum;
  const g = gcd(Math.round(sn), Math.round(sd)) || 1;
  sn = Math.round(sn / g);
  sd = Math.round(sd / g);
  const exactStr = `${sn}/${sd}`;
  const running = pieces.filter((x) => x.who === target).reduce((s, x) => s + x.frac, 0);

  const last = totalSteps - 1;
  const isFinal = step >= last;
  // how much of the block has been eaten so far
  const shown = isFinal ? pieces.length : Math.min(pieces.length, Math.max(1, step * k));

  // ---- geometry: the block as a bar carved left to right ----
  const W = 340;
  const H = 108;
  const x0 = 14;
  const bw = W - 2 * x0;
  const barY = 26;
  const barH = 40;

  let acc = 0;
  const laid = pieces.slice(0, shown).map((pc) => {
    const seg = { ...pc, x: acc, w: pc.frac };
    acc += pc.frac;
    return seg;
  });
  const eatenTarget = laid.filter((s) => s.who === target).reduce((s, x) => s + x.frac, 0);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 380 }}>
        <rect x={x0} y={barY} width={bw} height={barH} fill="#f8fafc" stroke={INK} strokeWidth={1.6} />
        {laid.map((s, i) => (
          <motion.rect
            key={i}
            x={x0 + s.x * bw}
            y={barY}
            height={barH}
            fill={WHO[s.who % WHO.length]}
            fillOpacity={s.who === target ? 0.95 : 0.4}
            stroke="#fff"
            strokeWidth={0.7}
            initial={{ width: 0 }}
            animate={{ width: s.w * bw }}
            transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.07 }}
          />
        ))}
        <rect x={x0} y={barY} width={bw} height={barH} fill="none" stroke={INK} strokeWidth={1.6} />

        {/* who is who */}
        {names.map((nm, i) => (
          <g key={i}>
            <rect x={x0 + i * 76} y={barY + barH + 10} width={10} height={10} rx={2} fill={WHO[i % WHO.length]} fillOpacity={i === target ? 0.95 : 0.4} />
            <text x={x0 + i * 76 + 15} y={barY + barH + 19} fontSize="10.5" fontWeight={i === target ? 800 : 700} fill={i === target ? INK : "#94a3b8"} fontFamily={numberFont}>
              {nm}
            </text>
          </g>
        ))}
        <text x={x0} y={18} fontSize="10.5" fontWeight="700" fill="#94a3b8" fontFamily={numberFont}>
          each turn eats {bn}/{bd} of what is left
        </text>
      </svg>

      <motion.span
        key={`${shown}-${isFinal}`}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 12.5,
          fontWeight: 800,
          color: isFinal ? "#166534" : "#4338ca",
          background: isFinal ? "#dcfce7" : "#eef2ff",
          border: `1px solid ${isFinal ? "#bbf7d0" : "#c7d2fe"}`,
          padding: "4px 12px",
          borderRadius: 999,
          textAlign: "center",
        }}
      >
        {isFinal
          ? `${names[target]} eats ${exactStr} of the block`
          : `after ${shown} turn${shown === 1 ? "" : "s"}, ${names[target]} has ${eatenTarget.toFixed(4)}…`}
      </motion.span>

      <AnimatePresence>
        {isFinal && (
          <motion.span
            key="series"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            style={{ fontFamily: numberFont, fontSize: 11.5, fontWeight: 700, color: "#94a3b8", textAlign: "center" }}
          >
            {pieces.filter((x) => x.who === target).slice(0, 3).map((_, i) => `1/${Math.pow(bd, 1 + i * k)}`).join(" + ")} + … = {exactStr} ≈ {running.toFixed(4)}
          </motion.span>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFinal && problem.answer && (
          <motion.div
            key="answer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.4 }}
            style={{ padding: "6px 16px", borderRadius: 999, background: WIN, color: "#fff", fontWeight: 700, fontSize: 15 }}
          >
            Answer {problem.answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
