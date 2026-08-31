import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const INDIGO = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const GOLD = "#f59e0b";

function Egg({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return <path d={`M${cx} ${cy - 7 * scale}C${cx - 6 * scale} ${cy - 2 * scale},${cx - 5 * scale} ${cy + 6 * scale},${cx} ${cy + 7 * scale}C${cx + 5 * scale} ${cy + 6 * scale},${cx + 6 * scale} ${cy - 2 * scale},${cx} ${cy - 7 * scale}Z`} fill="#fef3c7" stroke="#b45309" strokeWidth={0.9} />;
}

/** Chain student demand through whole cookie recipes into half-dozen egg cartons. */
export function CookieEggCartonsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const students = Math.round(num(data.students, 0));
  const cookiesEach = Math.round(num(data.cookiesPerStudent, 0));
  const cookiesPerRecipe = Math.round(num(data.cookiesPerRecipe, 1));
  const eggsPerRecipe = Math.round(num(data.eggsPerRecipe, 0));
  const eggsPerCarton = Math.round(num(data.eggsPerHalfDozen, 1));
  const cookies = students * cookiesEach;
  const recipes = Math.ceil(cookies / cookiesPerRecipe);
  const fullRecipes = Math.floor(cookies / cookiesPerRecipe);
  const lastCookies = cookies - fullRecipes * cookiesPerRecipe;
  const eggs = recipes * eggsPerRecipe;
  const cartons = Math.ceil(eggs / eggsPerCarton);
  const stored = Number(String(problem.shortAnswer ?? "").match(/\d+/)?.[0]);
  const failure = cookies !== 216
    ? `cookie check failed: got ${cookies}, expected 216`
    : recipes !== 15
      ? `recipe check failed: got ${recipes}, expected 15`
      : eggs !== 30
        ? `egg check failed: got ${eggs}, expected 30`
        : cartons !== stored || problem.answer !== "C"
          ? `answer check failed: got ${cartons}, stored ${problem.shortAnswer} (${problem.answer})`
          : null;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, overflow: "hidden", padding: 4, boxSizing: "border-box" }}>
      <svg viewBox="0 0 460 315" width="100%" style={{ maxWidth: "100%", minWidth: 0, display: "block" }} aria-label="Students create cookie demand, cookies fill recipe pans, recipe pans contribute eggs, and eggs fill half-dozen cartons">
        <text x="230" y="24" textAnchor="middle" fontSize="13" fontWeight="850" fill={INK}>{phase === 0 ? "2 COOKIES FOR EACH STUDENT" : phase === 1 ? "PACK THE COOKIES INTO WHOLE RECIPES" : phase === 2 ? "EACH RECIPE CONTRIBUTES 2 EGGS" : "PACK 30 EGGS INTO HALF-DOZENS"}</text>
        <AnimatePresence mode="wait" initial={false}>
          {phase === 0 && <motion.g key="students" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x="230" y="49" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INDIGO}>{students} students = 12 groups of 9</text>
            {Array.from({ length: 12 }, (_, group) => { const x = 28 + (group % 4) * 105; const y = 69 + Math.floor(group / 4) * 60; return <motion.g key={group} initial={{ scale: .6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 210, damping: 17, delay: group * .05 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={x} y={y} width="89" height="43" rx="8" fill="#fffbeb" stroke={GOLD}/>{Array.from({length:9},(_,i)=><circle key={`s${i}`} cx={x+10+i*8.7} cy={y+13} r="2.7" fill={INDIGO}/>)}{Array.from({length:18},(_,i)=><circle key={`c${i}`} cx={x+8+(i%9)*9.2} cy={y+27+Math.floor(i/9)*7} r="2.2" fill="#fbbf24" stroke="#b45309" strokeWidth=".5"/>)}</motion.g>; })}
            <text x="230" y="274" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={INDIGO}>{students} × {cookiesEach} = {cookies} cookies</text>
          </motion.g>}

          {phase === 1 && <motion.g key="recipes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <text x="230" y="49" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INDIGO}>{cookies} ÷ {cookiesPerRecipe} = {(cookies/cookiesPerRecipe).toFixed(1)}</text>
            {Array.from({length:recipes},(_,i)=>{const x=33+(i%5)*82,y=70+Math.floor(i/5)*60,partial=i===recipes-1,used=i<fullRecipes?cookiesPerRecipe:lastCookies;return <motion.g key={i} initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:220,damping:17,delay:i*.04}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="64" height="43" rx="8" fill={partial?"#fef3c7":"#eef2ff"} stroke={partial?GOLD:INDIGO} strokeWidth={partial?2:1.3}/>{Array.from({length:cookiesPerRecipe},(_,j)=><circle key={j} cx={x+10+(j%5)*11} cy={y+12+Math.floor(j/5)*10} r="3.2" fill={j<used?"#fbbf24":"#fff"} stroke={j<used?"#b45309":"#cbd5e1"} strokeWidth=".6"/>)}<text x={x+32} y={y+40} textAnchor="middle" fontFamily={FONT} fontSize="8.5" fontWeight="900" fill={partial?"#92400e":INK}>{used}/{cookiesPerRecipe}</text></motion.g>})}
            <text x="230" y="274" textAnchor="middle" fontFamily={FONT} fontSize="14" fontWeight="900" fill={INDIGO}>{fullRecipes} full pans + {lastCookies} cookies ⇒ {recipes} recipes</text>
          </motion.g>}

          {phase === 2 && <motion.g key="eggs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {Array.from({length:recipes},(_,i)=>{const x=33+(i%5)*82,y=68+Math.floor(i/5)*61;return <motion.g key={i} initial={{y:-8,opacity:0}} animate={{y:0,opacity:1}} transition={{delay:i*.04}}><rect x={x} y={y} width="64" height="44" rx="8" fill="#fffbeb" stroke={GOLD}/><Egg cx={x+23} cy={y+21} scale={.85}/><Egg cx={x+42} cy={y+21} scale={.85}/><text x={x+32} y={y+41} textAnchor="middle" fontFamily={FONT} fontSize="8" fontWeight="850" fill="#92400e">recipe {i+1}</text></motion.g>})}
            <text x="230" y="274" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={INDIGO}>{recipes} × {eggsPerRecipe} = {eggs} eggs</text>
          </motion.g>}

          {phase === 3 && <motion.g key="cartons" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <text x="230" y="49" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INDIGO}>{eggs} ÷ {eggsPerCarton} = {cartons}</text>
            {Array.from({length:cartons},(_,i)=>{const x=29+i*84;return <motion.g key={i} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:200,damping:16,delay:i*.12}} style={{transformBox:"fill-box",transformOrigin:"center"}}><path d={`M${x} 112h70l7 15v82H${x-7}v-82Z`} fill="#fffbeb" stroke={GREEN} strokeWidth="2" strokeLinejoin="round"/><path d={`M${x-7} 127h84`} stroke={GREEN} strokeWidth="1.5"/>{Array.from({length:eggsPerCarton},(_,j)=><Egg key={j} cx={x+8+(j%3)*25} cy={151+Math.floor(j/3)*35} scale={1.15}/>)}<text x={x+35} y="224" textAnchor="middle" fontFamily={FONT} fontSize="9" fontWeight="900" fill={GREEN}>6 eggs</text></motion.g>})}
            <text x="230" y="253" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={failure?RED:GREEN}>{failure??`${cartons} cartons × ${eggsPerCarton} = ${eggs} eggs exactly`}</text>
            {!failure&&<motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:210,damping:15,delay:.7}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="181" y="273" width="98" height="27" rx="14" fill={GREEN}/><text x="230" y="291" textAnchor="middle" fontSize="13" fontWeight="850" fill="#fff">Answer C</text></motion.g>}
          </motion.g>}
        </AnimatePresence>
      </svg>
    </div>
  );
}
