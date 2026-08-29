import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

type Pt = { x: number; y: number };
const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", AMBER = "#d97706", DIM = "#94a3b8", RED = "#dc2626";
const poly = (points: Pt[]) => points.map(p => `${p.x},${p.y}`).join(" ");
const tidy = (n: number) => Number.isInteger(n) ? String(n) : String(Number(n.toFixed(3)));
const fraction = (n: number) => Math.abs(n - .25) < 1e-9 ? "1/4" : Math.abs(n - .5) < 1e-9 ? "1/2" : tidy(n);
const parseValue = (value: unknown) => {
  const text = String(value ?? "").replace(/[−–—]/g, "-").trim();
  const [top, bottom] = text.split("/").map(Number);
  return bottom ? top / bottom : Number(text);
};

/** Reveal the four congruent corner triangles around an inscribed square, then
 * zoom one triangle to turn its leftover area into ab/2. */
export function InscribedSquareCornerAreaScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const outerArea = num(data.outerArea, 0), innerArea = num(data.innerArea, 0), corners = Math.round(num(data.cornerCount, 0));
  const leftover = outerArea - innerArea, eachArea = leftover / corners, product = 2 * eachArea;
  const side = Math.sqrt(outerArea), root = Math.sqrt(Math.max(0, innerArea - 2 * product));
  const a = (side - root) / 2, b = side - a;
  const stated = parseValue(problem.shortAnswer);
  const choice = problem.choices?.find(c => parseValue(c.text) === product)?.label;
  const ok = outerArea > innerArea && corners === 4 && Math.abs(a * b - product) < 1e-9 && stated === product && choice === problem.answer;
  const final = step >= totalSteps - 1, phase = final ? 3 : Math.min(step, 2);

  const ox = 35, oy = 24, size = 238, scale = size / side;
  const pts = [{ x: ox + a * scale, y: oy }, { x: ox + size, y: oy + a * scale }, { x: ox + size - a * scale, y: oy + size }, { x: ox, y: oy + size - a * scale }];
  const cornersPts: Pt[][] = [
    [{x:ox,y:oy}, pts[0], pts[3]], [{x:ox+size,y:oy}, pts[1], pts[0]],
    [{x:ox+size,y:oy+size}, pts[2], pts[1]], [{x:ox,y:oy+size}, pts[3], pts[2]],
  ];
  const colors = ["#fde68a", "#bfdbfe", "#ddd6fe", "#fecdd3"];

  return <div style={{ width:"100%", display:"flex", flexDirection:"column", alignItems:"center", gap:7, padding:"6px 2px", boxSizing:"border-box" }}>
    <svg viewBox="0 0 470 305" width="100%" style={{ maxWidth:500, display:"block" }} aria-label="An inscribed square leaving four congruent corner triangles">
      <rect x={ox} y={oy} width={size} height={size} fill="#f8fafc" stroke={INK} strokeWidth="2.5" />
      {cornersPts.map((p,i) => <motion.polygon key={i} points={poly(p)} fill={colors[i]} stroke={phase >= 2 ? IND : DIM} strokeWidth="1.5"
        initial={{ opacity:0, scale:.72 }} animate={{ opacity:phase >= 1 ? .9 : .18, scale:1 }} transition={{ delay:i*.12, type:"spring", stiffness:180, damping:17 }} style={{ transformBox:"fill-box", transformOrigin:"center" }} />)}
      <motion.polygon points={poly(pts)} fill="#e0e7ff" fillOpacity={phase === 1 ? .25 : .72} stroke={IND} strokeWidth="3"
        initial={{ pathLength:0, opacity:.2 }} animate={{ pathLength:1, opacity:phase === 1 ? .35 : 1 }} transition={{ duration:.9 }} />

      {phase === 0 && <g><text x="154" y="130" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>inner square</text><text x="154" y="158" textAnchor="middle" fontSize="22" fontWeight="900" fill={IND} fontFamily={FONT}>area = {innerArea}</text><text x="154" y="286" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>outer area = {outerArea}</text></g>}
      {phase === 1 && <g><text x="356" y="55" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>PEEL OFF THE CENTER</text><text x="356" y="91" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK} fontFamily={FONT}>{outerArea} − {innerArea}</text><motion.text x="356" y="126" textAnchor="middle" fontSize="25" fontWeight="900" fill={AMBER} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.6,type:"spring"}}>= {leftover}</motion.text><text x="356" y="151" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>total corner area</text></g>}
      {phase === 2 && <g><path d="M290 85 C310 80 305 54 325 50" fill="none" stroke={AMBER} strokeWidth="2" markerEnd="url(#arrow)"/><defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={AMBER}/></marker></defs><text x="365" y="78" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>4 congruent corners</text><text x="365" y="111" textAnchor="middle" fontSize="18" fontWeight="900" fill={AMBER} fontFamily={FONT}>{leftover} ÷ {corners} = {fraction(eachArea)}</text><text x="365" y="137" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>area of each triangle</text><text x="154" y="286" textAnchor="middle" fontSize="11" fontWeight="850" fill={IND}>rotate 90° → the next corner matches</text></g>}
      {phase === 3 && <g>
        <rect x="307" y="34" width="148" height="205" rx="15" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="1.8"/>
        <path d="M329 112 L329 58 L419 112 Z" fill="#fde68a" stroke={AMBER} strokeWidth="2.2"/>
        <text x="321" y="87" textAnchor="end" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>a</text><text x="374" y="130" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>b</text>
        <text x="381" y="157" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>ab/2 = {fraction(eachArea)}</text>
        <line x1="332" y1="171" x2="430" y2="171" stroke="#bbf7d0"/><motion.text x="381" y="202" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.55,type:"spring"}}>ab = {fraction(product)}</motion.text>
        <motion.g initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.9,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="335" y="251" width="92" height="27" rx="14" fill={ok ? GREEN : RED}/><text x="381" y="269" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {ok ? problem.answer : "check failed"}</text></motion.g>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center"}}>{phase===0?"a tilted square of area 4 sits inside area 5":phase===1?"the four corners together have area 1":phase===2?"quarter-turn symmetry makes all four triangles congruent":ok?"½ab = ¼, so ab = ½":"stored-answer or geometry check failed"}</motion.span>
  </div>;
}
