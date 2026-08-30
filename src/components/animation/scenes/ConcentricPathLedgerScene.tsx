import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Sort an A-to-K route through concentric circles into curved and straight ledgers. */
export function ConcentricPathLedgerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const outer = num(data.outerRadius, 0), inner = num(data.innerRadius, 0), pattern = String(data.pathPattern ?? "");
  const gap = outer - inner, diameter = 2 * inner;
  const arcRadii = [outer, inner, inner], arcCoeff = arcRadii.reduce((sum, radius) => sum + radius / 2, 0);
  const straightLengths = [gap, diameter, gap], straightTotal = straightLengths.reduce((a, b) => a + b, 0);
  const answer = `${arcCoeff}π + ${straightTotal}`;
  const normalize = (value: string) => value.replace(/\s/g, "");
  const choice = problem.choices?.find(c => normalize(c.text) === normalize(answer))?.label;
  const expectedPattern = "outer-quarter,gap,inner-quarter,inner-diameter,inner-quarter,gap";
  const ok = pattern === expectedPattern && gap === 10 && diameter === 20 && arcCoeff === 20 && straightTotal === 40 && normalize(answer) === normalize(problem.shortAnswer ?? "") && choice === problem.answer;
  const failure = pattern !== expectedPattern ? "path order does not match the source" : gap !== 10 || diameter !== 20 ? `straight pieces are ${straightLengths.join(",")}` : arcCoeff !== 20 ? `arc coefficient is ${arcCoeff}` : straightTotal !== 40 ? `straight total is ${straightTotal}` : normalize(answer) !== normalize(problem.shortAnswer ?? "") ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const cx = 183, cy = 160, Ro = 108, Ri = Ro * inner / outer;
  const paths = [
    { d: `M${cx} ${cy-Ro} A${Ro} ${Ro} 0 0 0 ${cx-Ro} ${cy}`, type: "arc", label: "¼ outer" },
    { d: `M${cx-Ro} ${cy} H${cx-Ri}`, type: "line", label: "gap" },
    { d: `M${cx-Ri} ${cy} A${Ri} ${Ri} 0 0 0 ${cx} ${cy+Ri}`, type: "arc", label: "¼ inner" },
    { d: `M${cx} ${cy+Ri} V${cy-Ri}`, type: "line", label: "diameter" },
    { d: `M${cx} ${cy-Ri} A${Ri} ${Ri} 0 0 1 ${cx+Ri} ${cy}`, type: "arc", label: "¼ inner" },
    { d: `M${cx+Ri} ${cy} H${cx+Ro}`, type: "line", label: "gap" },
  ];
  const Aardvark = () => <g transform={`translate(${cx-2} ${cy-Ro-2}) scale(.62)`}><ellipse cx="0" cy="0" rx="17" ry="10" fill="#d97706"/><path d="M13-5Q30-2 34 5Q23 8 13 5Z" fill="#d97706"/><circle cx="18" cy="-3" r="1.7" fill={INK}/><path d="M-15-3l-10-8" stroke="#d97706" strokeWidth="4" strokeLinecap="round"/><path d="M-8 7v8M7 7v8" stroke="#92400e" strokeWidth="3"/></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 500, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}><svg viewBox="0 0 470 325" width="100%" style={{ maxWidth: "100%", display: "block" }} aria-label="Aardvark path through two concentric circles sorted into arcs and straight segments">
    <defs><marker id="path-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={INK}/></marker></defs>
    <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "follow A to K and color every curved and straight piece" : phase === 1 ? "collect the three quarter-arcs in one curved ledger" : phase === 2 ? "align the two gaps and diameter in one straight ledger" : "combine the independently measured curved and straight pieces"}</text>
    {phase === 0 && <g>
      <circle cx={cx} cy={cy} r={Ro} fill="none" stroke="#cbd5e1" strokeWidth="2"/><circle cx={cx} cy={cy} r={Ri} fill="none" stroke="#cbd5e1" strokeWidth="2"/>
      {paths.map((piece, i) => <motion.path key={i} d={piece.d} fill="none" stroke={piece.type === "arc" ? IND : TEAL} strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .18, duration: .55 }}/>) }
      <Aardvark/><text x={cx + 13} y={cy - Ro - 6} fontSize="14" fontWeight="900" fill={INK}>A</text><text x={cx + Ro + 10} y={cy + 5} fontSize="14" fontWeight="900" fill={INK}>K</text>
      {[[cx-76,cy-75,"arc",IND],[cx-92,cy-8,"gap",TEAL],[cx+6,cy+48,"diameter",TEAL],[cx+62,cy-29,"arc",IND]].map(([x,y,label,color],i)=><g key={i}><rect x={Number(x)-20} y={Number(y)-11} width={String(label).length*7+14} height="20" rx="8" fill="#fff" fillOpacity=".9"/><text x={Number(x)} y={Number(y)+3} textAnchor="middle" fontSize="9" fontWeight="900" fill={String(color)}>{String(label)}</text></g>)}
      <g transform="translate(321 77)"><rect width="124" height="144" rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="62" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PATH PIECES</text><text x="62" y="53" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND}>3 curved</text><text x="62" y="80" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL}>3 straight</text><path d="M22 94h80" stroke="#e2e8f0"/><text x="62" y="111" textAnchor="middle" fontSize="9" fontWeight="850" fill={INK}>travel order</text><text x="62" y="126" textAnchor="middle" fontSize="8" fill={DIM}>arc → gap → arc</text><text x="62" y="138" textAnchor="middle" fontSize="8" fill={DIM}>diameter → arc → gap</text></g>
      <text x="235" y="295" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>outer radius {outer} m · inner radius {inner} m</text>
    </g>}
    {phase === 1 && <g>
      <g transform="translate(41 57)">{arcRadii.map((radius, i) => { const r = radius === outer ? 70 : 43; return <g key={i} transform={`translate(${i * 91} 0)`}><motion.g initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: i * .15 }}><path d={`M${r} ${r} A${r} ${r} 0 0 0 0 ${2*r}`} fill="none" stroke={i === 0 ? IND : "#7c3aed"} strokeWidth="6" strokeLinecap="round"/><text x={r/2} y={r+7} textAnchor="middle" fontSize="10" fontWeight="900" fill={INK} fontFamily={FONT}>r={radius}</text></motion.g></g>; })}</g>
      <g transform="translate(304 53)"><rect width="139" height="189" rx="14" fill="#eef2ff" stroke={IND}/><text x="69.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ARC LEDGER</text>{arcRadii.map((radius, i) => <text key={i} x="69.5" y={56 + i * 31} textAnchor="middle" fontSize="13" fontWeight="900" fill={i === 0 ? IND : "#7c3aed"} fontFamily={FONT}>¼·2π·{radius} = {radius/2}π</text>)}<path d="M20 151h99" stroke="#c7d2fe"/><text x="69.5" y="168" textAnchor="middle" fontSize="12.5" fontWeight="900" fill={IND} fontFamily={FONT}>{arcRadii.map(r => `${r/2}π`).join(" + ")}</text><text x="69.5" y="185" textAnchor="middle" fontSize="18" fontWeight="950" fill={IND} fontFamily={FONT}>= {arcCoeff}π</text></g>
      <text x="235" y="290" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>one large quarter plus two small quarters</text>
    </g>}
    {phase === 2 && <g>
      <g transform="translate(54 57)"><text x="0" y="18" fontSize="10" fontWeight="900" fill={TEAL}>STRAIGHT LEDGER</text>{straightLengths.map((length, i) => { const widths = straightLengths.map(v => v * 7), x = widths.slice(0, i).reduce((a,b)=>a+b,0); return <motion.g key={i} initial={{ x: -15 }} animate={{ x: 0 }} transition={{ delay: i * .15 }}><rect x={x} y="36" width={length * 7} height="37" rx="7" fill={i === 1 ? "#ccfbf1" : "#ecfeff"} stroke={TEAL} strokeWidth="2"/><text x={x + length*3.5} y="60" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{length}</text></motion.g>; })}<text x={straightTotal*3.5} y="96" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{straightLengths.join(" + ")} = {straightTotal} m</text></g>
      <g transform="translate(84 180)"><rect width="302" height="74" rx="14" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="151" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>THREE STRAIGHT PIECES</text><text x="151" y="54" textAnchor="middle" fontSize="21" fontWeight="950" fill={TEAL} fontFamily={FONT}>{gap} + {diameter} + {gap} = {straightTotal} m</text></g>
      <text x="235" y="291" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>each gap is {outer} − {inner} = {gap}; diameter is 2 × {inner} = {diameter}</text>
    </g>}
    {phase === 3 && <g>
      <g transform="translate(38 55)"><rect width="176" height="79" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="88" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CURVED LEDGER</text><text x="88" y="55" textAnchor="middle" fontSize="22" fontWeight="950" fill={IND} fontFamily={FONT}>{arcCoeff}π</text></g>
      <g transform="translate(256 55)"><rect width="176" height="79" rx="14" fill="#ecfeff" stroke={TEAL} strokeWidth="2"/><text x="88" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>STRAIGHT LEDGER</text><text x="88" y="55" textAnchor="middle" fontSize="22" fontWeight="950" fill={TEAL} fontFamily={FONT}>{straightTotal}</text></g>
      <motion.path d="M126 145 C126 178 190 172 218 194 M344 145 C344 178 280 172 252 194" fill="none" stroke={INK} strokeWidth="2.5" markerEnd="url(#path-arrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/>
      <g transform="translate(87 202)"><rect width="296" height="74" rx="14" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="148" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TOTAL A-TO-K DISTANCE</text><text x="148" y="53" textAnchor="middle" fontSize="23" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{arcCoeff}π + {straightTotal} meters</text></g>
      <text x="185" y="307" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? "path order, radii, all six pieces, and choice verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={420} y={286} width={78}/>
    </g>}
  </svg></div>;
}
