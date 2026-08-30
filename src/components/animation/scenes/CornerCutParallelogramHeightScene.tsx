import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44", IND="#4338ca", GREEN="#16a34a", RED="#dc2626", AMBER="#d97706", TEAL="#0d9488", DIM="#64748b";
type Pt={x:number;y:number};
const points=(ps:Pt[])=>ps.map(p=>`${p.x},${p.y}`).join(" ");
const tidy=(n:number)=>Number.isInteger(n)?String(n):String(Number(n.toFixed(2)));

/** Peel four right-triangle corners from a rectangle, measure FG with its
 * 3-4-5 right triangle, then turn the surviving area into base times height. */
export function CornerCutParallelogramHeightScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const w=num(data.rectangleWidth,0),h=num(data.rectangleHeight,0);
  const topLeft=num(data.topLeft,0),rightBottom=num(data.rightBottom,0);
  const bottomRight=num(data.bottomRight,0),leftTop=num(data.leftTop,0);
  const topRight=w-topLeft,leftBottom=h-leftTop;
  const cornerAreas=[topLeft*leftTop/2,topRight*rightBottom/2,bottomRight*(h-rightBottom)/2,(w-bottomRight)*leftBottom/2];
  const rectangleArea=w*h,removed=cornerAreas.reduce((a,b)=>a+b,0),area=rectangleArea-removed;
  const fgRun=bottomRight,fgRise=h-rightBottom,base=Math.hypot(fgRun,fgRise),height=area/base;
  const choice=problem.choices?.find(c=>Number(c.text)===height)?.label;
  const ok=w===10&&h===8&&topLeft===4&&rightBottom===5&&bottomRight===4&&leftTop===3&&
    cornerAreas.join(",")==="6,15,6,15"&&area===38&&base===5&&Number(problem.shortAnswer)===height&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);

  const x=32,y=35,s=24;
  const A={x,y},B={x:x+w*s,y},C={x:x+w*s,y:y+h*s},D={x,y:y+h*s};
  const E={x:x+topLeft*s,y},F={x:B.x,y:y+rightBottom*s},G={x:x+(w-bottomRight)*s,y:C.y},H={x,y:y+leftTop*s};
  const corners=[[A,E,H],[E,B,F],[F,C,G],[G,D,H]];
  const cornerColors=["#fef3c7","#fee2e2","#fef3c7","#fee2e2"];
  const para=[E,F,G,H];
  const projection=((E.x-F.x)*(G.x-F.x)+(E.y-F.y)*(G.y-F.y))/((G.x-F.x)**2+(G.y-F.y)**2);
  const foot={x:F.x+projection*(G.x-F.x),y:F.y+projection*(G.y-F.y)};

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 290" width="342" style={{maxWidth:"100%",display:"block"}} aria-label="A parallelogram formed by removing four right triangles from a ten by eight rectangle">
      <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"peel off the four corner triangles":phase===1?"rectangle minus corners leaves the parallelogram":phase===2?"FG is a 3–4–5 hypotenuse":"use FG as the base and d as the height"}</text>
      <rect x={x} y={y} width={w*s} height={h*s} fill="#f8fafc" stroke={INK} strokeWidth="2.4"/>
      {corners.map((p,i)=><motion.polygon key={i} points={points(p)} fill={cornerColors[i]} stroke={phase===0?(i%2?RED:AMBER):DIM} strokeWidth="1.5" initial={{opacity:0,scale:.65}} animate={{opacity:phase===1?.28:.92,scale:1}} transition={{delay:i*.12,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>)}
      <motion.polygon points={points(para)} fill={phase===3?"#dcfce7":"#e0e7ff"} fillOpacity=".9" stroke={IND} strokeWidth="2.6" initial={{opacity:.2}} animate={{opacity:1}}/>
      {[{p:A,t:"A",dx:-15,dy:-7},{p:B,t:"B",dx:8,dy:-7},{p:C,t:"C",dx:8,dy:16},{p:D,t:"D",dx:-15,dy:16},{p:E,t:"E",dx:-3,dy:-8},{p:F,t:"F",dx:8,dy:5},{p:G,t:"G",dx:-2,dy:17},{p:H,t:"H",dx:-18,dy:5}].map(v=><text key={v.t} x={v.p.x+v.dx} y={v.p.y+v.dy} fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>{v.t}</text>)}

      {phase===0&&<g fontFamily={FONT} fontSize="10.5" fontWeight="900" fill={INK}>
        <text x={(A.x+E.x)/2} y={y-7} textAnchor="middle">{topLeft}</text><text x={(E.x+B.x)/2} y={y-7} textAnchor="middle">{topRight}</text>
        <text x={B.x+9} y={(B.y+F.y)/2}>5</text><text x={B.x+9} y={(F.y+C.y)/2}>3</text>
        <text x={(D.x+G.x)/2} y={D.y+18} textAnchor="middle">6</text><text x={(G.x+C.x)/2} y={C.y+18} textAnchor="middle">4</text>
        <text x={x-12} y={(A.y+H.y)/2}>3</text><text x={x-12} y={(H.y+D.y)/2}>5</text>
        <g transform="translate(314 48)"><rect width="145" height="145" rx="13" fill="#fff" stroke="#cbd5e1"/><text x="72.5" y="23" textAnchor="middle" fontSize="9.5" fill={DIM}>FOUR RIGHT TRIANGLES</text><text x="72.5" y="51" textAnchor="middle" fill={AMBER}>2 × ½·3·4 = 12</text><text x="72.5" y="78" textAnchor="middle" fill={RED}>2 × ½·5·6 = 30</text><line x1="17" y1="94" x2="128" y2="94" stroke="#cbd5e1"/><text x="72.5" y="121" textAnchor="middle" fontSize="16" fill={INK}>removed = {removed}</text></g>
      </g>}
      {phase===1&&<g transform="translate(314 57)"><rect width="145" height="130" rx="13" fill="#eef2ff" stroke="#c7d2fe"/><text x="72.5" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PARALLELOGRAM AREA</text><text x="72.5" y="53" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{w}·{h} − {removed}</text><text x="72.5" y="79" textAnchor="middle" fontSize="14" fontWeight="900" fill={DIM} fontFamily={FONT}>{rectangleArea} − 12 − 30</text><motion.text x="72.5" y="112" textAnchor="middle" fontSize="24" fontWeight="900" fill={IND} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.5,type:"spring"}}>= {area}</motion.text></g>}
      {phase>=2&&<g>
        <motion.line x1={F.x} y1={F.y} x2={G.x} y2={G.y} stroke={TEAL} strokeWidth="5" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <line x1={G.x} y1={G.y} x2={F.x} y2={G.y} stroke={DIM} strokeWidth="1.5" strokeDasharray="4 3"/><line x1={F.x} y1={F.y} x2={F.x} y2={G.y} stroke={DIM} strokeWidth="1.5" strokeDasharray="4 3"/>
        <text x={(F.x+G.x)/2+4} y={(F.y+G.y)/2-6} fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>FG = {base}</text><text x={(F.x+G.x)/2} y={G.y+16} textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM} fontFamily={FONT}>{fgRun}</text><text x={F.x+7} y={(F.y+G.y)/2} fontSize="10" fontWeight="900" fill={DIM} fontFamily={FONT}>{fgRise}</text>
      </g>}
      {phase===2&&<g transform="translate(322 62)"><rect width="135" height="119" rx="13" fill="#ecfeff" stroke="#99f6e4"/><text x="67.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PYTHAGOREAN THEOREM</text><text x="67.5" y="57" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{fgRun}² + {fgRise}² = FG²</text><motion.text x="67.5" y="91" textAnchor="middle" fontSize="23" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}}>FG = {base}</motion.text></g>}
      {phase===3&&<g>
        <motion.line x1={E.x} y1={E.y} x2={foot.x} y2={foot.y} stroke={AMBER} strokeWidth="3.5" initial={{pathLength:0}} animate={{pathLength:1}} transition={{duration:.7}}/><path d={`M${foot.x-9},${foot.y-12} l12,9 l9,-12`} fill="none" stroke={AMBER} strokeWidth="1.8"/><text x={(E.x+foot.x)/2-12} y={(E.y+foot.y)/2} fontSize="16" fontWeight="900" fill={AMBER} fontFamily={FONT}>d</text>
        <g transform="translate(319 49)"><rect width="140" height="154" rx="13" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?"#86efac":"#fecaca"}/><text x="70" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>AREA = BASE × HEIGHT</text><text x="70" y="57" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={FONT}>{area} = {base}d</text><text x="70" y="83" textAnchor="middle" fontSize="14" fontWeight="900" fill={DIM} fontFamily={FONT}>d = {area} ÷ {base}</text><motion.text x="70" y="119" textAnchor="middle" fontSize="26" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.5,type:"spring"}}>d = {tidy(height)}</motion.text></g>
        <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={389} y={222} width={ok?86:126}/>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?"two 3×4 corners and two 5×6 corners":phase===1?`${rectangleArea} − ${removed} = ${area} square units`:phase===2?`${fgRun}² + ${fgRise}² = ${base}²`:ok?`${area} = ${base}d, so d = ${tidy(height)} — choice ${problem.answer}`:"dimension, area, or stored-answer check failed"}</motion.span>
  </div>;
}
