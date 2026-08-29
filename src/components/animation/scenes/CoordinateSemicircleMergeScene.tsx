import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Measure an outer coordinate circle, merge two equal semicircles, and compare areas. Data: { endpointX, endpointY }. */
export function CoordinateSemicircleMergeScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const x = num(data.endpointX, 0), y = num(data.endpointY, 0);
  const outerRadiusSq = x*x+y*y, outerRadius=Math.sqrt(outerRadiusSq), semiRadius=Math.abs(x);
  const outerCoeff=outerRadiusSq, combinedCoeff=semiRadius*semiRadius;
  const ratio=combinedCoeff/outerCoeff;
  const final=step>=totalSteps-1, phase=final?2:Math.min(step,1);
  const ratioText = ratio===.5 ? "1/2" : String(Number(ratio.toFixed(4)));
  const choice=problem.choices?.find((c)=>c.text.replace(/\s/g,"")===ratioText)?.label;
  const ok=ratioText===problem.shortAnswer&&choice===problem.answer;
  const fail=`computed ${ratioText}; stored ${problem.shortAnswer ?? "missing"}`;

  const cx=150,cy=137,s=62,R=outerRadius*s, left=cx-x*s,right=cx+x*s,top=cy-y*s,bottom=cy+y*s;
  const upper=`M ${left} ${top} A ${semiRadius*s} ${semiRadius*s} 0 0 0 ${right} ${top}`;
  const lower=`M ${left} ${bottom} A ${semiRadius*s} ${semiRadius*s} 0 0 1 ${right} ${bottom}`;
  const point=(label:string,px:number,py:number,dx:number,dy:number)=><g><circle cx={px} cy={py} r="4.5" fill={INK}/><text x={px+dx} y={py+dy} fontSize="10.5" fontWeight="900" fill={INK} fontFamily={FONT}>{label}</text></g>;

  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 460 320" width="100%" style={{maxWidth:490,display:"block"}}>
      <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"measure OQ with its 1-by-1 coordinate triangle":phase===1?"two equal semicircles snap together into one unit circle":"compare the merged circle with circle O"}</text>

      {phase===0&&<>
        <circle cx={cx} cy={cy} r={R} fill="#f8fafc" stroke={INK} strokeWidth="2.3"/>
        <line x1="38" y1={cy} x2="265" y2={cy} stroke="#94a3b8" strokeWidth="1.4"/><line x1={cx} y1="34" x2={cx} y2="244" stroke="#94a3b8" strokeWidth="1.4"/>
        <motion.polygon points={`${cx},${cy} ${right},${cy} ${right},${top}`} fill="#fef3c7" stroke={GOLD} strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}}/>
        <path d={`M ${right-10} ${cy} v -10 h 10`} fill="none" stroke={GOLD} strokeWidth="1.7"/>
        <motion.line x1={cx} y1={cy} x2={right} y2={top} stroke={INDIGO} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <text x={(cx+right)/2} y={cy+17} textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>{x}</text><text x={right+10} y={(cy+top)/2+4} fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>{y}</text>
        {point("O",cx,cy,-20,18)}{point(`Q(${x},${y})`,right,top,8,-8)}
        <rect x="287" y="60" width="145" height="125" rx="13" fill="#eef2ff" stroke={INDIGO} strokeWidth="2"/>
        <text x="359.5" y="86" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>OUTER RADIUS</text>
        <text x="359.5" y="116" textAnchor="middle" fontSize="17" fontWeight="950" fill={INDIGO} fontFamily={FONT}>OQ² = {x}² + {y}²</text>
        <text x="359.5" y="144" textAnchor="middle" fontSize="21" fontWeight="950" fill={INDIGO} fontFamily={FONT}>r = √{outerRadiusSq}</text>
        <text x="359.5" y="171" textAnchor="middle" fontSize="14" fontWeight="950" fill={INK} fontFamily={FONT}>area = {outerCoeff}π</text>
      </>}

      {phase===1&&<>
        <g transform="translate(-18 0)">
          <circle cx={cx} cy={cy} r={R} fill="#fff" stroke={INK} strokeWidth="2"/>
          <path d={`${upper} L ${left} ${top} Z`} fill="#e0e7ff" stroke={INDIGO} strokeWidth="2.5"/>
          <path d={`${lower} L ${left} ${bottom} Z`} fill="#ccfbf1" stroke={TEAL} strokeWidth="2.5"/>
          <line x1={left} y1={top} x2={right} y2={top} stroke={INDIGO} strokeWidth="2"/><line x1={left} y1={bottom} x2={right} y2={bottom} stroke={TEAL} strokeWidth="2"/>
          <text x={cx} y={top-8} textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>diameter {2*x}</text><text x={cx} y={bottom+18} textAnchor="middle" fontSize="11" fontWeight="900" fill={TEAL} fontFamily={FONT}>diameter {2*x}</text>
          {point("O",cx,cy,-17,18)}
        </g>
        <motion.path d="M 265 103 C 292 83 307 83 327 103 M 265 171 C 292 191 307 191 327 171" fill="none" stroke={GOLD} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <motion.g initial={{opacity:0,scale:.65}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:180,damping:16,delay:.35}} style={{transformBox:"fill-box",transformOrigin:"center"}}>
          <circle cx="374" cy={cy} r={semiRadius*s} fill="#f0fdfa" stroke={TEAL} strokeWidth="3"/>
          <line x1="374" y1={cy} x2={374+semiRadius*s} y2={cy} stroke={INDIGO} strokeWidth="2.5"/><text x="404" y={cy-8} textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={FONT}>r={semiRadius}</text>
        </motion.g>
        <rect x="93" y="249" width="274" height="44" rx="12" fill="#f0fdfa" stroke={TEAL} strokeWidth="2"/>
        <text x="230" y="276" textAnchor="middle" fontSize="16" fontWeight="950" fill={TEAL} fontFamily={FONT}>2 · ½π({semiRadius})² = π</text>
      </>}

      {phase===2&&<>
        <g transform="translate(85 5)">
          <circle cx="145" cy="130" r={R} fill="#eef2ff" stroke={INDIGO} strokeWidth="3"/>
          <motion.circle cx="145" cy="130" r={semiRadius*s} fill="#ccfbf1" stroke={TEAL} strokeWidth="3" initial={{scale:.2}} animate={{scale:1}} transition={{type:"spring",stiffness:150,damping:17}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>
          <line x1="145" y1="130" x2={145+R} y2="130" stroke={INDIGO} strokeWidth="2"/><line x1="145" y1="130" x2={145} y2={130-semiRadius*s} stroke={TEAL} strokeWidth="2"/>
          <text x={145+R/2} y="147" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>√{outerRadiusSq}</text><text x="154" y={130-semiRadius*s/2} fontSize="11" fontWeight="900" fill={TEAL} fontFamily={FONT}>{semiRadius}</text>
        </g>
        <rect x="66" y="234" width="328" height="57" rx="13" fill={ok?"#dcfce7":"#fee2e2"} stroke={ok?GREEN:RED} strokeWidth="2.5"/>
        <text x="230" y="255" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>combined semicircles / circle O</text>
        <text x="230" y="280" textAnchor="middle" fontSize="19" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>π ÷ {outerCoeff}π = {ratioText}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={421} y={292} width={70}/>
        {!ok&&<text x="230" y="316" textAnchor="middle" fontSize="9" fill={RED}>{fail}</text>}
      </>}
    </svg>
  </div>;
}
