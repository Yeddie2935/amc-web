import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const numberFont = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const BAD = "#dc2626";
const DIM = "#94a3b8";

/**
 * A meal is meat × dessert × (an unordered pair of vegetables) — the scene
 * multiplies the two independent single-item choices, then has to survive
 * the trap of counting vegetable *pairs* as ordered (pick-first, pick-second)
 * instead of the true unordered combinations, before listing the real
 * distinct pairs and multiplying every independent choice together.
 * Data: { meats, desserts, vegetables } (vegetable pairs, so choose-2 is fixed).
 */
export function BuffetComboCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const meats = Math.max(1, Math.round(num(data.meats, 3)));
  const desserts = Math.max(1, Math.round(num(data.desserts, 4)));
  const vegetables = Math.max(2, Math.round(num(data.vegetables, 4)));

  const mealDessert = meats * desserts;
  const vegPairs: [number, number][] = [];
  for (let i = 0; i < vegetables; i++) for (let j = i + 1; j < vegetables; j++) vegPairs.push([i, j]);
  const vegCombos = vegPairs.length;
  const total = mealDessert * vegCombos;
  const answerOk = problem.shortAnswer == null || String(total) === String(problem.shortAnswer).trim();
  const failure = !answerOk ? `computed ${total}, stored answer is ${problem.shortAnswer}` : "";

  const orderedVegPairs = vegetables * (vegetables - 1);
  const trapTotal = mealDessert * orderedVegPairs;
  const trapChoice = (problem.choices ?? []).find((c) => String(c.text).trim() === String(trapTotal));

  const last = totalSteps - 1;
  const isFinal = step >= last;
  const showTrap = step === 1 && !isFinal;
  const showPairs = step >= 2 || isFinal;

  const W = 300;
  const H = 220;
  const vegLabels = Array.from({ length: vegetables }, (_, i) => String.fromCharCode(97 + i));

  const caption = isFinal
    ? `${mealDessert} × ${vegCombos} = ${total} meals`
    : showPairs
    ? `${vegCombos} unordered vegetable pairs`
    : showTrap
    ? trapChoice
      ? `counting ordered picks gives ${meats} × ${desserts} × ${orderedVegPairs} = ${trapTotal} — choice ${trapChoice.label}, but pair order doesn't matter`
      : `counting ordered picks gives ${orderedVegPairs} pairs, double the real count`
    : `${meats} meats × ${desserts} desserts = ${mealDessert}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: 320 }}>
        {!showPairs && (
          <g>
            <text x={70} y={20} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>
              meats
            </text>
            {Array.from({ length: meats }).map((_, i) => (
              <motion.circle key={i} cx={30 + i * 28} cy={40} r={11} fill={IND} fillOpacity={0.75} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            ))}
            <text x={220} y={20} textAnchor="middle" fontSize="10" fontWeight="800" fill={DIM}>
              desserts
            </text>
            {Array.from({ length: desserts }).map((_, i) => (
              <motion.circle key={i} cx={180 + i * 28} cy={40} r={11} fill="#0d9488" fillOpacity={0.75} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.3 + i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
            ))}
            <motion.text x={W / 2} y={82} textAnchor="middle" fontSize="14" fontWeight="800" fill={IND} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.7 }}>
              {meats} × {desserts} = {mealDessert}
            </motion.text>

            {showTrap && (
              <g>
                <text x={W / 2} y={110} textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>
                  vegetables: {vegLabels.join(", ")}
                </text>
                {Array.from({ length: vegetables }).flatMap((_, i) =>
                  Array.from({ length: vegetables }).map((_, j) => {
                    if (i === j) return null;
                    const idx = i * vegetables + j;
                    const col = idx % 6;
                    const row = Math.floor(idx / 6);
                    return (
                      <motion.text key={`${i}-${j}`} x={40 + col * 38} y={132 + row * 18} fontSize="9.5" fontWeight="700" fill={BAD} fontFamily={numberFont} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2, delay: idx * 0.02 }}>
                        {vegLabels[i]}{vegLabels[j]}
                      </motion.text>
                    );
                  }),
                )}
              </g>
            )}
          </g>
        )}

        {showPairs && (
          <g>
            <text x={W / 2} y={20} textAnchor="middle" fontSize="10.5" fontWeight="800" fill={INK}>
              real vegetable pairs (order doesn't matter)
            </text>
            {vegPairs.map(([i, j], idx) => {
              const col = idx % 3;
              const row = Math.floor(idx / 3);
              return (
                <motion.g key={idx} initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 16, delay: idx * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x={40 + col * 76} y={36 + row * 34} width={62} height={26} rx={6} fill="#dcfce7" stroke={WIN} strokeWidth={1.3} />
                  <text x={71 + col * 76} y={53 + row * 34} textAnchor="middle" fontSize="11" fontWeight="800" fill={WIN} fontFamily={numberFont}>
                    {vegLabels[i]}+{vegLabels[j]}
                  </text>
                </motion.g>
              );
            })}
          </g>
        )}
      </svg>

      <motion.span
        key={caption}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 15 }}
        style={{
          fontFamily: numberFont,
          fontSize: 11.5,
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
