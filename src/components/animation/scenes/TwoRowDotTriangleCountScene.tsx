import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GREEN="#16a34a",RED="#dc2626",DIM="#94a3b8";
type P={x:number;y:number};

function choose3(n:number){const out:number[][]=[];for(let a=0;a<n;a++)for(let b=a+1;b<n;b++)for(let c=b+1;c<n;c++)out.push([a,b,c]);return out;}
const twiceArea=(a:P,b:P,c:P)=>Math.abs((b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x));

/** Enumerate every three-dot card from two rows, mark the cards whose three
 * points flatten into a line, and remove those degeneracies from C(6,3). */
export function TwoRowDotTriangleCountScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const points=(Array.isArray(data.points)?data.points:[]).map(v=>String(v).split("|").map(Number)).map(([x,y])=>({x,y}));
  const triples=choose3(points.length),bad=triples.filter(ids=>twiceArea(points[ids[0]],points[ids[1]],points[ids[2]])===0),good=triples.length-bad.length;
  const choice=problem.choices?.find(item=>Number(item.text)===good)?.label;
  const valid=points.length===6&&triples.length===20&&bad.length===2&&good===Number(problem.shortAnswer)&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const mainX=(p:P)=>76+p.x*100,mainY=(p:P)=>58+p.y*110;

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:7,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 315" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Twenty three-dot choices with two collinear choices removed to leave eighteen triangles">
      <text x="235" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"choose any three of the six dots":phase===1?"test every triple: triangle or straight line?":"remove the two flattened cards"}</text>

      {phase===0&&<>
        <g>{points.map((p,i)=><motion.g key={i} initial={{scale:0}} animate={{scale:1}} transition={{delay:i*.08,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={mainX(p)} cy={mainY(p)} r="8" fill={INK}/><text x={mainX(p)} y={mainY(p)-14} textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>{i+1}</text></motion.g>)}</g>
        <motion.polygon points={`${mainX(points[0])},${mainY(points[0])} ${mainX(points[2])},${mainY(points[2])} ${mainX(points[4])},${mainY(points[4])}`} fill="#c7d2fe" fillOpacity=".55" stroke={IND} strokeWidth="2.5" initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.45,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>
        <g transform="translate(325 57)"><rect width="122" height="120" rx="14" fill="#eef2ff" stroke="#c7d2fe"/><text x="61" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>ALL TRIPLES</text><text x="61" y="59" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>6·5·4</text><line x1="34" y1="69" x2="88" y2="69" stroke={IND}/><text x="61" y="84" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>3·2·1</text><motion.text x="61" y="108" textAnchor="middle" fontSize="23" fontWeight="950" fill={TEAL} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}}>= {triples.length}</motion.text></g>
        <text x="235" y="236" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM}>each set of 3 dots gets one card</text>
        <g transform="translate(170 251)">{[0,1,2].map((_,i)=><motion.rect key={i} x={i*6} y={i*3} width="118" height="40" rx="8" fill="#fff" stroke={IND} initial={{opacity:0,x:i*6-18}} animate={{opacity:1,x:i*6}} transition={{delay:.55+i*.1}}/>)}<text x="71" y="27" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>20 choice cards</text></g>
      </>}

      {phase===1&&<>
        <g transform="translate(18 37)">{triples.map((ids,i)=>{const col=i%5,row=Math.floor(i/5),x=col*89,y=row*63,isBad=twiceArea(points[ids[0]],points[ids[1]],points[ids[2]])===0;const mini=(p:P)=>({x:x+13+p.x*25,y:y+14+p.y*26});const ps=ids.map(id=>mini(points[id]));return <motion.g key={ids.join("-")} initial={{opacity:0,scale:.6}} animate={{opacity:1,scale:1}} transition={{delay:i*.035}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="78" height="52" rx="8" fill={isBad?"#fef2f2":"#f8fafc"} stroke={isBad?RED:"#cbd5e1"} strokeWidth={isBad?"2":"1"}/><path d={`M${ps[0].x} ${ps[0].y}L${ps[1].x} ${ps[1].y}L${ps[2].x} ${ps[2].y}${isBad?"":"Z"}`} fill={isBad?"none":"#e0e7ff"} stroke={isBad?RED:IND} strokeWidth="1.5"/>{ps.map((p,j)=><circle key={j} cx={p.x} cy={p.y} r="2.7" fill={INK}/>)}{isBad&&<text x={x+39} y={y+47} textAnchor="middle" fontSize="8" fontWeight="900" fill={RED}>STRAIGHT</text>}</motion.g>})}</g>
        <text x="235" y="301" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>18 closed triangles · 2 red straight-line cards</text>
      </>}

      {phase===2&&<>
        <g transform="translate(45 55)"><rect width="112" height="112" rx="15" fill="#eef2ff" stroke={IND}/><text x="56" y="29" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ALL TRIPLES</text><text x="56" y="73" textAnchor="middle" fontSize="38" fontWeight="950" fill={IND} fontFamily={FONT}>{triples.length}</text></g>
        <text x="182" y="120" textAnchor="middle" fontSize="31" fontWeight="900" fill={INK}>−</text>
        <g transform="translate(207 55)"><rect width="112" height="112" rx="15" fill="#fef2f2" stroke={RED}/><text x="56" y="29" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>STRAIGHT ROWS</text><text x="56" y="73" textAnchor="middle" fontSize="38" fontWeight="950" fill={RED} fontFamily={FONT}>{bad.length}</text><g transform="translate(18 89)">{bad.map((_,i)=><line key={i} x1={i*42} y1="0" x2={i*42+32} y2="0" stroke={RED} strokeWidth="3"/>)}</g></g>
        <text x="344" y="120" textAnchor="middle" fontSize="31" fontWeight="900" fill={INK}>=</text>
        <motion.g initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.35,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="365" y="55" width="80" height="112" rx="15" fill={valid?"#f0fdf4":"#fef2f2"} stroke={valid?GREEN:RED} strokeWidth="2.5"/><text x="405" y="91" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TRIANGLES</text><text x="405" y="137" textAnchor="middle" fontSize="38" fontWeight="950" fill={valid?GREEN:RED} fontFamily={FONT}>{good}</text></motion.g>
        <text x="235" y="211" textAnchor="middle" fontSize="24" fontWeight="950" fill={valid?GREEN:RED} fontFamily={FONT}>{triples.length} − {bad.length} = {good}</text>
        <motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.7,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="189" y="232" width="92" height="26" rx="13" fill={valid?GREEN:RED}/><text x="235" y="250" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fff">{valid?`Answer ${problem.answer}`:"check failed"}</text></motion.g>
      </>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(valid?"#166534":RED):IND,background:final?(valid?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`C(${points.length},3) = ${triples.length} three-dot choices`:phase===1?`${bad.length} choices use all three dots from one horizontal row`:valid?`${triples.length} − ${bad.length} = ${good} genuine triangles`:`point layout, count, stored-answer, or choice check failed`}</motion.span>
  </div>;
}
