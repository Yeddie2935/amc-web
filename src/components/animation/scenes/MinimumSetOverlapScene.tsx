import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const HAT = "#d97706";
const GLOVE = "#4338ca";
const BOTH = "#16a34a";
const BAD = "#dc2626";

function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

/** Builds the smallest legal population, then physically packs two sets apart. */
export function MinimumSetOverlapScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const gloveNum = Math.round(num(data.gloveNumerator, 2));
  const gloveDen = Math.round(num(data.gloveDenominator, 5));
  const hatNum = Math.round(num(data.hatNumerator, 3));
  const hatDen = Math.round(num(data.hatDenominator, 4));
  const total = (gloveDen * hatDen) / gcd(gloveDen, hatDen);
  const gloves = (gloveNum * total) / gloveDen;
  const hats = (hatNum * total) / hatDen;
  const hatless = total - hats;
  const both = Math.max(0, gloves - hatless);
  const last = totalSteps - 1;
  const beat = Math.min(step, Math.max(last, 2));
  const final = step >= last;
  const ok = Number.isInteger(gloves) && Number.isInteger(hats) && String(both) === (problem.shortAnswer ?? "").trim();

  const people = Array.from({ length: total }, (_, i) => {
    const hasHat = i < hats;
    const hasGloves = beat >= 2 && (i >= hats || i < both);
    return { hasHat, hasGloves };
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "6px 4px" }}>
      <svg viewBox="0 0 380 300" width="100%" style={{ maxWidth: 420 }}>
        {beat === 0 ? (
          <>
            <text x="190" y="25" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={INK}>The room size must make both fractions whole</text>
            {[{ d: gloveDen, y: 67, color: GLOVE }, { d: hatDen, y: 125, color: HAT }].map(({ d, y, color }) => (
              <g key={d}>
                <text x="28" y={y + 17} fontFamily={FONT} fontSize="12" fontWeight="900" fill={color}>×{d}</text>
                {[1, 2, 3, 4, 5].map((k) => {
                  const value = d * k;
                  const hit = value === total;
                  return <motion.g key={value} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: k * 0.12 }}>
                    <rect x={56 + (k - 1) * 61} y={y} width="48" height="30" rx="8" fill={hit ? "#dcfce7" : "#f8fafc"} stroke={hit ? BOTH : color} strokeWidth={hit ? 2.5 : 1.3} />
                    <text x={80 + (k - 1) * 61} y={y + 20} textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={hit ? BOTH : INK}>{value}</text>
                  </motion.g>;
                })}
              </g>
            ))}
            <motion.text x="190" y="202" textAnchor="middle" fontFamily={FONT} fontSize="18" fontWeight="900" fill={BOTH} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: .8, type: "spring" }}>smallest common total = {total}</motion.text>
          </>
        ) : (
          <>
            <text x="190" y="18" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="900" fill={INK}>{total} people in the smallest possible room</text>
            {people.map((p, i) => {
              const col = i % 5, row = Math.floor(i / 5), x = 47 + col * 72, y = 56 + row * 46;
              return <motion.g key={i} initial={{ opacity: 0, scale: .5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * .025 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                {p.hasHat && <path d={`M ${x-12} ${y-13} L ${x-6} ${y-23} L ${x+7} ${y-23} L ${x+12} ${y-13} Z M ${x-16} ${y-13} H ${x+16}`} fill={HAT} stroke={HAT} strokeWidth="3" strokeLinecap="round" />}
                <circle cx={x} cy={y} r="10" fill={p.hasGloves ? "#eef2ff" : "#f8fafc"} stroke={p.hasHat && p.hasGloves ? BOTH : p.hasHat ? HAT : p.hasGloves ? GLOVE : "#94a3b8"} strokeWidth={p.hasHat && p.hasGloves ? 3 : 1.5} />
                <path d={`M ${x-9} ${y+13} Q ${x} ${y+7} ${x+9} ${y+13}`} fill="none" stroke={INK} strokeWidth="2" />
                {p.hasGloves && <text x={x+14} y={y+10} fontSize="15">🧤</text>}
              </motion.g>;
            })}
            <text x="8" y="246" fontFamily={FONT} fontSize="11" fontWeight="900" fill={HAT}>🎩 {hatNum}/{hatDen} × {total} = {hats}</text>
            <text x="218" y="246" fontFamily={FONT} fontSize="11" fontWeight="900" fill={GLOVE}>🧤 {gloveNum}/{gloveDen} × {total} = {gloves}</text>
            {beat >= 2 && <motion.g initial={{ opacity: 0, scale: .7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
              <rect x="78" y="263" width="224" height="29" rx="14.5" fill={BOTH} />
              <text x="190" y="282" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill="white">{gloves} − {hatless} = {both} forced overlaps · Answer {problem.answer}</text>
            </motion.g>}
          </>
        )}
      </svg>

      <motion.div key={beat} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 900, color: final ? BOTH : INK, textAlign: "center" }}>
        {beat === 0 ? `Multiples of ${gloveDen} and ${hatDen} first meet at ${total}.` : beat === 1 ? `${hats} hats and ${gloves} pairs of gloves must be placed.` : `${hatless} hatless people take gloves first; ${gloves} − ${hatless} = ${both} gloves are forced onto hat-wearers.`}
      </motion.div>
      <AnimatePresence>{final && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 210, damping: 14 }} style={{ background: BOTH, color: "white", borderRadius: 999, padding: "6px 16px", fontWeight: 800 }}>Minimum both = {both} · Answer {problem.answer}</motion.div>}</AnimatePresence>
      {final && !ok && <div style={{ color: BAD, fontFamily: FONT, fontSize: 10 }}>check failed: computed {both}, stored {problem.shortAnswer}</div>}
    </div>
  );
}
