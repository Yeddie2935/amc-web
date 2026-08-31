import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GOLD = "#f59e0b";

function Person({ x, y, dim = false }: { x: number; y: number; dim?: boolean }) {
  return <g opacity={dim ? 0.2 : 1}><circle cx={x} cy={y} r="3.2" fill={INDIGO} /><path d={`M${x} ${y + 4}v7M${x - 4} ${y + 7}h8M${x} ${y + 11}l-3 5M${x} ${y + 11}l3 5`} stroke={INDIGO} strokeWidth="1.5" strokeLinecap="round" /></g>;
}

/** Attendance shrinks by a percent, then students become cookies and cookies fill whole recipe pans. */
export function AttendanceCookieRecipesScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const original = Math.round(num(data.originalStudents, 0));
  const decrease = Math.round(num(data.decreasePercent, 0));
  const cookiesEach = Math.round(num(data.cookiesPerStudent, 0));
  const cookiesPerRecipe = Math.round(num(data.cookiesPerRecipe, 1));
  const attending = original * (100 - decrease) / 100;
  const cookies = attending * cookiesEach;
  const recipes = Math.ceil(cookies / cookiesPerRecipe);
  const fullPans = Math.floor(cookies / cookiesPerRecipe);
  const lastPan = cookies - fullPans * cookiesPerRecipe;
  const stored = Number(String(problem.shortAnswer ?? "").match(/\d+/)?.[0]);
  const failure = attending !== 81
    ? `attendance check failed: got ${attending}, expected 81`
    : cookies !== 162
      ? `cookie check failed: got ${cookies}, expected 162`
      : recipes !== stored || problem.answer !== "E"
        ? `answer check failed: got ${recipes}, stored ${problem.shortAnswer} (${problem.answer})`
        : null;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, overflow: "hidden", padding: "4px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 315" width="100%" style={{ maxWidth: "100%", minWidth: 0, display: "block" }} aria-label="A quarter of the students leave, the remaining students receive two cookies each, and the cookies fill eleven recipe pans">
        <text x="230" y="24" textAnchor="middle" fontSize="13" fontWeight="850" fill={INK}>{phase === 0 ? "REMOVE THE 25% WHO WILL NOT ATTEND" : phase === 1 ? "GIVE EACH ATTENDING STUDENT 2 COOKIES" : "PACK 162 COOKIES INTO FULL RECIPES"}</text>
        <AnimatePresence mode="wait" initial={false}>
          {phase === 0 && (
            <motion.g key="attendance" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x="230" y="50" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={INDIGO}>{original} students = 4 equal groups of {original / 4}</text>
              {Array.from({ length: 4 }, (_, group) => {
                const x = 27 + group * 108;
                const leaving = group === 3;
                return (
                  <motion.g key={group} initial={{ y: 8, opacity: 0 }} animate={{ y: leaving ? 20 : 0, opacity: leaving ? 0.25 : 1 }} transition={{ type: "spring", stiffness: 180, damping: 18, delay: group * 0.12 }}>
                    <rect x={x} y="75" width="86" height="124" rx="12" fill={leaving ? "#fef2f2" : "#eef2ff"} stroke={leaving ? RED : INDIGO} strokeWidth="1.7" />
                    {Array.from({ length: 9 }, (_, i) => <Person key={i} x={x + 18 + (i % 3) * 25} y={100 + Math.floor(i / 3) * 28} dim={leaving} />)}
                    <text x={x + 43} y="189" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={leaving ? RED : INK}>{original / 4}</text>
                    {leaving && <><path d={`M${x + 12} 88l62 96M${x + 74} 88l-62 96`} stroke={RED} strokeWidth="3" /><text x={x + 43} y="218" textAnchor="middle" fontSize="10" fontWeight="900" fill={RED}>25% DOWN</text></>}
                  </motion.g>
                );
              })}
              <text x="230" y="258" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={GREEN}>3 × {original / 4} = {attending} students attend</text>
              <text x="230" y="282" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="800" fill="#64748b">keep {100 - decrease}% of the original group</text>
            </motion.g>
          )}

          {phase === 1 && (
            <motion.g key="cookies" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <text x="230" y="50" textAnchor="middle" fontFamily={FONT} fontSize="12" fontWeight="900" fill={INDIGO}>{attending} students arranged as 9 groups of 9</text>
              {Array.from({ length: 9 }, (_, group) => {
                const x = 37 + (group % 3) * 138;
                const y = 70 + Math.floor(group / 3) * 61;
                return (
                  <motion.g key={group} initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 210, damping: 17, delay: group * 0.07 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={x} y={y} width="110" height="46" rx="9" fill="#fffbeb" stroke={GOLD} />
                    {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={x + 14 + (i % 9) * 10.2} cy={y + 17} r="3.2" fill={INDIGO} />)}
                    {Array.from({ length: 18 }, (_, i) => <circle key={i} cx={x + 10 + (i % 9) * 11.3} cy={y + 31 + Math.floor(i / 9) * 7} r="2.5" fill="#fbbf24" stroke="#b45309" strokeWidth=".5" />)}
                  </motion.g>
                );
              })}
              <text x="230" y="276" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={INDIGO}>{attending} × {cookiesEach} = {cookies} cookies</text>
            </motion.g>
          )}

          {phase === 2 && (
            <motion.g key="recipes" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="230" y="50" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INDIGO}>{cookies} ÷ {cookiesPerRecipe} = {(cookies / cookiesPerRecipe).toFixed(1)}</text>
              {Array.from({ length: recipes }, (_, i) => {
                const x = 29 + (i % 6) * 69;
                const y = 76 + Math.floor(i / 6) * 76;
                const used = i < fullPans ? cookiesPerRecipe : lastPan;
                const partial = i === recipes - 1;
                return (
                  <motion.g key={i} initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 17, delay: i * 0.06 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                    <rect x={x} y={y} width="55" height="50" rx="8" fill={partial ? "#f0fdf4" : "#eef2ff"} stroke={partial ? GREEN : INDIGO} strokeWidth={partial ? 2 : 1.3} />
                    {Array.from({ length: cookiesPerRecipe }, (_, j) => <circle key={j} cx={x + 9 + (j % 5) * 9} cy={y + 13 + Math.floor(j / 5) * 10} r="3" fill={j < used ? "#fbbf24" : "#fff"} stroke={j < used ? "#b45309" : "#cbd5e1"} strokeWidth=".7" />)}
                    <text x={x + 27.5} y={y + 46} textAnchor="middle" fontFamily={FONT} fontSize="8.5" fontWeight="900" fill={partial ? GREEN : INK}>{used}/{cookiesPerRecipe}</text>
                  </motion.g>
                );
              })}
              <text x="230" y="244" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={failure ? RED : GREEN}>{failure ?? `${fullPans} full pans + ${lastPan} cookies ⇒ make recipe ${recipes}`}</text>
              {!failure && <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 210, damping: 15, delay: 0.7 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="182" y="270" width="96" height="27" rx="14" fill={GREEN} /><text x="230" y="288" textAnchor="middle" fontSize="13" fontWeight="850" fill="#fff">Answer E</text></motion.g>}
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
