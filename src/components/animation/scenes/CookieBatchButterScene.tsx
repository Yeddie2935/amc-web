import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GOLD = "#f59e0b";

/** Two ceiling conversions: cookies → whole recipes → tablespoons → whole sticks. */
export function CookieBatchButterScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cookiesNeeded = Math.round(num(data.cookiesNeeded, 0));
  const cookiesPerRecipe = Math.round(num(data.cookiesPerRecipe, 1));
  const tbspPerRecipe = Math.round(num(data.tbspPerRecipe, 1));
  const tbspPerStick = Math.round(num(data.tbspPerStick, 1));

  const recipes = Math.ceil(cookiesNeeded / cookiesPerRecipe);
  const fullRecipes = Math.floor(cookiesNeeded / cookiesPerRecipe);
  const lastDemand = cookiesNeeded - fullRecipes * cookiesPerRecipe;
  const tablespoons = recipes * tbspPerRecipe;
  const sticks = Math.ceil(tablespoons / tbspPerStick);
  const butterLeft = sticks * tbspPerStick - tablespoons;
  const stored = Number(String(problem.shortAnswer ?? "").match(/\d+/)?.[0]);
  const failure = recipes !== 15
    ? `recipe check failed: got ${recipes}, expected 15`
    : tablespoons !== 45
      ? `butter check failed: got ${tablespoons} tablespoons, expected 45`
      : sticks !== stored || problem.answer !== "B"
        ? `answer check failed: got ${sticks} sticks, stored ${problem.shortAnswer} (${problem.answer})`
        : null;

  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const panX = (i: number) => 35 + (i % 5) * 82;
  const panY = (i: number) => 76 + Math.floor(i / 5) * 58;

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, overflow: "hidden", padding: "4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 315" width="100%" style={{ maxWidth: "100%", minWidth: 0, display: "block" }} aria-label="Cookies are grouped into whole recipe pans, whose butter measures are regrouped into whole sticks">
        <text x="230" y="24" textAnchor="middle" fontSize="13" fontWeight="850" fill={INK}>
          {phase === 0 ? "PACK COOKIES INTO WHOLE RECIPES" : phase === 1 ? "EACH RECIPE ADDS 3 TABLESPOONS" : "PACK TABLESPOONS INTO WHOLE STICKS"}
        </text>

        <AnimatePresence mode="wait" initial={false}>
          {phase === 0 && (
            <motion.g key="recipes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x="230" y="49" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INDIGO}>{cookiesNeeded} ÷ {cookiesPerRecipe} = {(cookiesNeeded / cookiesPerRecipe).toFixed(1)}</text>
              {Array.from({ length: recipes }, (_, i) => {
                const last = i === recipes - 1;
                return (
                  <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 17, delay: i * 0.035 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={panX(i)} y={panY(i)} width="62" height="39" rx="8" fill={last ? "#fef3c7" : "#eef2ff"} stroke={last ? GOLD : INDIGO} strokeWidth={last ? 2 : 1.3} />
                    <path d={`M${panX(i) + 8} ${panY(i) + 13}h46M${panX(i) + 8} ${panY(i) + 25}h46`} stroke={last ? GOLD : "#a5b4fc"} strokeWidth="1" />
                    <text x={panX(i) + 31} y={panY(i) + 25} textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="900" fill={last ? "#92400e" : INK}>{last ? `${lastDemand}/${cookiesPerRecipe}` : cookiesPerRecipe}</text>
                  </motion.g>
                );
              })}
              <path d="M337 242c24 0 42-9 47-28" fill="none" stroke={GOLD} strokeWidth="2" markerEnd="url(#cookie-arrow)" />
              <text x="230" y="276" textAnchor="middle" fontFamily={FONT} fontSize="14" fontWeight="900" fill={INDIGO}>{fullRecipes} full pans + part of one more ⇒ {recipes} recipes</text>
            </motion.g>
          )}

          {phase === 1 && (
            <motion.g key="tablespoons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {Array.from({ length: recipes }, (_, i) => (
                <motion.g key={i} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.04 }}>
                  <rect x={panX(i)} y={panY(i)} width="62" height="39" rx="8" fill="#fff7ed" stroke={GOLD} />
                  {Array.from({ length: tbspPerRecipe }, (_, j) => <circle key={j} cx={panX(i) + 18 + j * 13} cy={panY(i) + 19} r="5" fill="#fbbf24" stroke="#92400e" />)}
                  <text x={panX(i) + 31} y={panY(i) + 52} textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="800" fill="#92400e">recipe {i + 1}</text>
                </motion.g>
              ))}
              <text x="230" y="278" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={INDIGO}>{recipes} × {tbspPerRecipe} = {tablespoons} tablespoons</text>
            </motion.g>
          )}

          {phase === 2 && (
            <motion.g key="sticks" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="230" y="49" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INDIGO}>{tablespoons} ÷ {tbspPerStick} = {(tablespoons / tbspPerStick).toFixed(3)}</text>
              {Array.from({ length: sticks }, (_, i) => {
                const used = Math.max(0, Math.min(tbspPerStick, tablespoons - i * tbspPerStick));
                const x = 38 + (i % 3) * 143;
                const y = 78 + Math.floor(i / 3) * 91;
                return (
                  <motion.g key={i} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 190, damping: 17, delay: i * 0.1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={x} y={y} width="118" height="57" rx="10" fill="#fffbeb" stroke={i === sticks - 1 ? GREEN : GOLD} strokeWidth="1.8" />
                    <text x={x + 59} y={y + 16} textAnchor="middle" fontSize="9" fontWeight="900" fill="#92400e">STICK {i + 1}</text>
                    {Array.from({ length: tbspPerStick }, (_, j) => <rect key={j} x={x + 10 + j * 12.2} y={y + 25} width="9" height="18" rx="2" fill={j < used ? "#fbbf24" : "#fff"} stroke={j < used ? "#b45309" : "#cbd5e1"} />)}
                    <text x={x + 59} y={y + 52} textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="800" fill={INK}>{used}/{tbspPerStick} tbsp</text>
                  </motion.g>
                );
              })}
              <text x="230" y="274" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={failure ? RED : GREEN}>{failure ?? `${tablespoons} used, ${butterLeft} left over ⇒ buy ${sticks} sticks`}</text>
              {!failure && (
                <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.6 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                  <rect x="184" y="286" width="92" height="25" rx="13" fill={GREEN} />
                  <text x="230" y="303" textAnchor="middle" fontSize="13" fontWeight="850" fill="#fff">Answer B</text>
                </motion.g>
              )}
            </motion.g>
          )}
        </AnimatePresence>
        <defs><marker id="cookie-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill={GOLD} /></marker></defs>
      </svg>
    </div>
  );
}
