import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",TEAL="#0d9488",ORANGE="#d97706",RED="#dc2626",DIM="#64748b";
type Point=[number,number];
const polar=(cx:number,cy:number,r:number,degrees:number):Point=>{const a=degrees*Math.PI/180;return[cx+r*Math.cos(a),cy+r*Math.sin(a)]};
const pt=([x,y]:Point)=>`${x} ${y}`;
function sectorPath(cx:number,cy:number,r:number,a0:number,a1:number){const p0=polar(cx,cy,r,a0),p1=polar(cx,cy,r,a1);return`M${cx} ${cy}L${pt(p0)}A${r} ${r} 0 0 1 ${pt(p1)}Z`;}
function ringPath(cx:number,cy:number,ri:number,ro:number,a0:number,a1:number){const o0=polar(cx,cy,ro,a0),o1=polar(cx,cy,ro,a1),i1=polar(cx,cy,ri,a1),i0=polar(cx,cy,ri,a0);return`M${pt(o0)}A${ro} ${ro} 0 0 1 ${pt(o1)}L${pt(i1)}A${ri} ${ri} 0 0 0 ${pt(i0)}Z`;}

export function DartboardParityAreaScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),outer=num(data.outerRadius,0),inner=num(data.innerRadius,0),sectorCount=Math.round(num(data.sectorCount,0));
  const innerScores=(Array.isArray(data.innerScores)?data.innerScores:[]).map(v=>num(v,0));
  const outerScores=(Array.isArray(data.outerScores)?data.outerScores:[]).map(v=>num(v,0));
  const innerArea=inner*inner,boardArea=outer*outer,ringArea=boardArea-innerArea;
  const innerSector=innerArea/sectorCount,outerSector=ringArea/sectorCount;
  const scoreArea=(score:number)=>innerScores.filter(v=>v===score).length*innerSector+outerScores.filter(v=>v===score).length*outerSector;
  const oneArea=scoreArea(1),twoArea=scoreArea(2),oneNum=oneArea,oneDen=boardArea,twoNum=twoArea,twoDen=boardArea;
  const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);
  const g1=gcd(oneNum,oneDen),g2=gcd(twoNum,twoDen),p1n=oneNum/g1,p1d=oneDen/g1,p2n=twoNum/g2,p2d=twoDen/g2;
  const oddNum=2*p1n*p2n,oddDen=p1d*p2d,go=gcd(oddNum,oddDen),answer=`${oddNum/go}/${oddDen/go}`;
  const choice=problem.choices?.find(c=>c.text===answer)?.label;
  const ok=outer===6&&inner===3&&sectorCount===3&&innerScores.join(",")==="2,2,1"&&outerScores.join(",")==="1,1,2"&&oneArea===21&&twoArea===15&&answer===problem.shortAnswer&&choice===problem.answer;
  const failure=oneArea+twoArea!==boardArea?`score areas total ${oneArea+twoArea}, board is ${boardArea}`:answer!==problem.shortAnswer?`computed ${answer}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const cx=137,cy=154,ro=104,ri=52,angles=[-90,30,150,270];
  const pieces=Array.from({length:3},(_,i)=>({i,a0:angles[i],a1:angles[i+1],inner:innerScores[i],outer:outerScores[i]}));

  return <div style={{width:"100%",display:"flex",justifyContent:"center",minWidth:0,padding:"5px 2px",boxSizing:"border-box",overflow:"hidden"}}><svg viewBox="0 0 470 320" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Dartboard regions regroup by score and feed a two-dart parity outcome grid">
    <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"split the inner disk and outer ring into three equal sectors":phase===1?"recolor all six regions by their point value and combine their areas":"an odd total needs one 1 and one 2, in either order"}</text>
    {phase<=1&&<g>
      {pieces.map(({i,a0,a1,inner:iv,outer:ov})=><g key={i}><motion.path d={ringPath(cx,cy,ri,ro,a0,a1)} fill={phase===0?"#eef2ff":ov===1?"#dcfce7":"#ffedd5"} stroke={INK} strokeWidth="1.6" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.09}}/><motion.path d={sectorPath(cx,cy,ri,a0,a1)} fill={phase===0?"#ecfeff":iv===1?"#dcfce7":"#ffedd5"} stroke={INK} strokeWidth="1.6" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.12+i*.09}}/>{[[ri*.58,iv],[ri+(ro-ri)*.55,ov]].map(([r,v],j)=>{const p=polar(cx,cy,Number(r),(a0+a1)/2);return <text key={j} x={p[0]} y={p[1]+6} textAnchor="middle" fontSize="18" fontWeight="950" fill={phase===1?(v===1?GREEN:ORANGE):INK} fontFamily={FONT}>{v}</text>;})}</g>)}
      {phase===0?<g transform="translate(276 54)"><rect width="169" height="191" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="84.5" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>AREA LEDGER (π FACTORED OUT)</text><text x="84.5" y="57" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>inner: {inner}² = {innerArea}</text><text x="84.5" y="82" textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{innerArea} ÷ {sectorCount} = {innerSector} each</text><line x1="19" y1="101" x2="150" y2="101" stroke="#e2e8f0"/><text x="84.5" y="126" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>ring: {outer}²−{inner}² = {ringArea}</text><text x="84.5" y="151" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{ringArea} ÷ {sectorCount} = {outerSector} each</text><text x="84.5" y="178" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>all areas are multiples of π</text></g>:<g transform="translate(276 55)"><rect width="169" height="190" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="84.5" y="24" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>GROUP BY SCORE</text><rect x="15" y="40" width="139" height="56" rx="11" fill="#f0fdf4" stroke="#86efac"/><text x="84.5" y="61" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>score 1 area</text><text x="84.5" y="84" textAnchor="middle" fontSize="16" fontWeight="950" fill={GREEN} fontFamily={FONT}>2·{outerSector}+1·{innerSector} = {oneArea}</text><rect x="15" y="108" width="139" height="56" rx="11" fill="#fff7ed" stroke="#fdba74"/><text x="84.5" y="129" textAnchor="middle" fontSize="11" fontWeight="900" fill={ORANGE}>score 2 area</text><text x="84.5" y="152" textAnchor="middle" fontSize="16" fontWeight="950" fill={ORANGE} fontFamily={FONT}>1·{outerSector}+2·{innerSector} = {twoArea}</text><text x="84.5" y="184" textAnchor="middle" fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>P(1)={p1n}/{p1d} · P(2)={p2n}/{p2d}</text></g>}
      <text x="137" y="283" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>outer radius {outer} · inner radius {inner}</text>
    </g>}
    {phase===2&&<g>
      <text x="124" y="57" textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM}>DART 2</text><text x="30" y="165" textAnchor="middle" fontSize="11" fontWeight="900" fill={DIM} transform="rotate(-90 30 165)">DART 1</text>
      {[1,2].map((a,r)=>[1,2].map((b,c)=>{const odd=(a+b)%2===1,x=62+c*104,y=78+r*86;return <motion.g key={`${a}${b}`} initial={{opacity:0,scale:.65}} animate={{opacity:1,scale:1}} transition={{delay:(r*2+c)*.1,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="90" height="70" rx="12" fill={odd?"#dcfce7":"#f8fafc"} stroke={odd?GREEN:"#cbd5e1"} strokeWidth={odd?2.4:1.3}/><text x={x+45} y={y+29} textAnchor="middle" fontSize="16" fontWeight="950" fill={odd?GREEN:DIM} fontFamily={FONT}>{a} + {b} = {a+b}</text><text x={x+45} y={y+52} textAnchor="middle" fontSize="10" fontWeight="900" fill={odd?GREEN:DIM}>{odd?"ODD ✓":"even"}</text></motion.g>; }))}
      <g transform="translate(286 66)"><rect width="159" height="183" rx="14" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2"/><text x="79.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TWO MIXED ORDERS</text><text x="79.5" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>(1,2) or (2,1)</text><text x="79.5" y="91" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>2 × {p1n}/{p1d} × {p2n}/{p2d}</text><line x1="27" y1="109" x2="132" y2="109" stroke="#bbf7d0"/><text x="79.5" y="141" textAnchor="middle" fontSize="25" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>= {answer}</text><text x="79.5" y="168" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok?GREEN:RED}>{ok?"areas and choice verified":failure}</text></g><SvgAnswerBadge show={ok} answer={problem.answer} cx={392} y={274} width={78}/>
    </g>}
  </svg></div>;
}
