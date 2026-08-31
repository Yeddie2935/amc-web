import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Convert a two-link barter chain, then distribute the resulting units equally across the original items. */
export function BarterChainShareScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const fishCount = Math.round(num(data.fishCount, 0)), breadCount = Math.round(num(data.breadCount, 0)), ricePerBread = Math.round(num(data.riceBagsPerBread, 0));
  const totalRice = breadCount * ricePerBread;
  const whole = Math.floor(totalRice / fishCount), remainder = totalRice % fishCount;
  const resultText = `${whole} ${remainder}/${fishCount} bags`;
  const choiceText = `${whole} ${remainder}/${fishCount}`;
  const choice = problem.choices?.find((item) => String(item.text).trim() === choiceText)?.label;
  const final = step >= totalSteps - 1, phase = final ? 2 : Math.min(Math.max(step, 0), 1);
  const ok = fishCount === 3 && breadCount === 2 && ricePerBread === 4 && totalRice === 8 && whole === 2 && remainder === 2 && resultText === problem.shortAnswer && choice === problem.answer;
  const failure = totalRice !== 8 ? `bread converts to ${totalRice} bags` : whole !== 2 || remainder !== 2 ? `split gives ${whole} remainder ${remainder}` : resultText !== problem.shortAnswer ? `computed ${resultText}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;

  const Fish = ({ x, y, color = IND, delay = 0, scale = 1 }: { x: number; y: number; color?: string; delay?: number; scale?: number }) => <motion.g initial={{ opacity: 0, scale: .4 }} animate={{ opacity: 1, scale }} transition={{ delay, type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><ellipse cx={x} cy={y} rx="22" ry="13" fill={`${color}24`} stroke={color} strokeWidth="2" /><path d={`M${x-22} ${y}l-15-12v24z`} fill={`${color}45`} stroke={color} strokeWidth="2" /><circle cx={x+10} cy={y-3} r="2.3" fill={color} /><path d={`M${x+18} ${y+4}q-5 4-10 0`} fill="none" stroke={color} strokeWidth="1.5" /></motion.g>;
  const Bread = ({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) => <motion.g initial={{ opacity: 0, y: -10, scale: .55 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay, type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><path d={`M${x-24} ${y+14}v-24q0-15 15-15h18q15 0 15 15v24z`} fill="#fde68a" stroke={AMBER} strokeWidth="2" /><path d={`M${x-11} ${y-15}q4 5 0 10M${x+2} ${y-17}q4 5 0 10M${x+15} ${y-14}q4 5 0 10`} fill="none" stroke="#b45309" strokeWidth="1.5" /></motion.g>;
  const Bag = ({ x, y, delay = 0, fraction = 1 }: { x: number; y: number; delay?: number; fraction?: number }) => <motion.g initial={{ opacity: 0, scale: .45 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring", stiffness: 220, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><path d={`M${x-13} ${y-17}h26l-4 8q7 8 7 22h-32q0-14 7-22z`} fill="#fff" stroke={TEAL} strokeWidth="1.8" /><clipPath id={`bag-${x}-${y}`}><path d={`M${x-16} ${y-17}h32v30h-32z`} /></clipPath><rect x={x-15} y={y+13-30*fraction} width="30" height={30*fraction} fill="#99f6e4" clipPath={`url(#bag-${x}-${y})`} /><path d={`M${x-7} ${y-10}q7 5 14 0`} fill="none" stroke={TEAL} strokeWidth="1.4" /><text x={x} y={y+8} textAnchor="middle" fontSize="9" fontWeight="900" fill={INK}>RICE</text></motion.g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 470 320" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Two loaves become eight rice bags, which are shared equally among three fish">
      <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "open each loaf into its four-bag rice value" : phase === 1 ? "substitute: the same trade now reads 3 fish = 8 rice bags" : "deal eight bags equally to the three fish"}</text>

      {phase === 0 && <>
        {Array.from({ length: breadCount }, (_, loaf) => { const x = 120 + loaf * 230; return <g key={loaf}><Bread x={x} y={78} delay={loaf * .15} /><motion.path d={`M${x} 105v24`} stroke={AMBER} strokeWidth="2.5" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .3 + loaf * .15 }} /><path d={`M${x} 132l-6-9h12z`} fill={AMBER} />{Array.from({ length: ricePerBread }, (_, i) => <Bag key={i} x={x - 60 + i * 40} y={163} delay={.45 + loaf * .15 + i * .08} />)}<text x={x} y="205" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{ricePerBread} bags</text></g>; })}
        <g transform="translate(92 232)"><rect width="286" height="55" rx="13" fill="#ecfeff" stroke={TEAL} strokeWidth="2" /><text x="143" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TWO LOAVES</text><text x="143" y="44" textAnchor="middle" fontSize="18" fontWeight="900" fill={TEAL} fontFamily={FONT}>{breadCount} × {ricePerBread} = {totalRice} rice bags</text></g>
      </>}

      {phase === 1 && <>
        <g transform="translate(22 48)"><rect width="172" height="177" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="86" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>GIVEN TRADE</text>{Array.from({ length: fishCount }, (_, i) => <Fish key={i} x={52 + (i%2)*76} y={66 + Math.floor(i/2)*53} delay={i*.1} scale={.85} />)}<text x="86" y="160" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{fishCount} fish</text></g>
        <motion.path d="M205 137h44" stroke={AMBER} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><path d="M249 137l-10-6v12z" fill={AMBER} /><text x="227" y="124" textAnchor="middle" fontSize="13" fontWeight="900" fill={AMBER}>=</text>
        <g transform="translate(262 48)"><rect width="186" height="177" rx="14" fill="#ecfeff" stroke={TEAL} strokeWidth="2" /><text x="93" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>AFTER SUBSTITUTION</text>{Array.from({ length: totalRice }, (_, i) => <Bag key={i} x={28 + (i%4)*43} y={67 + Math.floor(i/4)*58} delay={i*.07} />)}<text x="93" y="160" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{totalRice} rice bags</text></g>
        <g transform="translate(94 245)"><rect width="282" height="43" rx="12" fill="#fff7ed" stroke={AMBER} /><text x="141" y="27" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{fishCount} fish = {breadCount} loaves = {totalRice} bags</text></g>
      </>}

      {phase === 2 && <>
        {Array.from({ length: fishCount }, (_, row) => { const y = 67 + row * 69; return <motion.g key={row} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: row * .14 }}><Fish x={64} y={y} color={IND} scale={.72} /><text x="101" y={y+5} fontSize="13" fontWeight="900" fill={DIM}>gets</text><Bag x={151} y={y} delay={.15+row*.14} /><Bag x={194} y={y} delay={.22+row*.14} /><Bag x={250} y={y} delay={.29+row*.14} fraction={2/3} /><text x="273" y={y+5} fontSize="15" fontWeight="900" fill={GREEN} fontFamily={FONT}>= 2⅔</text></motion.g>; })}
        <g transform="translate(323 54)"><rect width="130" height="181" rx="14" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2.3" /><text x="65" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PER FISH</text><text x="65" y="58" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{totalRice} ÷ {fishCount}</text><text x="65" y="91" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>= {totalRice}/{fishCount}</text><motion.text x="65" y="132" textAnchor="middle" fontSize="21" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>= {whole} {remainder}/{fishCount}</motion.text><text x="65" y="160" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={ok ? GREEN : RED}>{ok ? `choice ${choice} matches` : failure}</text></g>
        <text x="170" y="282" textAnchor="middle" fontSize="9.7" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `${fishCount} shares of ${totalRice}/${fishCount} use all ${totalRice} bags` : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={419} y={271} width={76} />
      </>}
      <AnimatePresence>{final && !ok && <motion.text x="235" y="317" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
