import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Fill a unit-square octagon, isolate the below-line pieces, and locate Q by triangle area. */
export function OctagonAreaBisectorScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const total=num(data.unitSquareCount,0),base=num(data.triangleBase,0),squareArea=num(data.isolatedSquareArea,0);
  const halfArea=total/2,triangleArea=halfArea-squareArea,height=2*triangleArea/base;
  const qy=height-1,xq=2-height,ratio=xq/qy;
  const frac=(v:number)=>{for(let d=1;d<=10;d++){const n=Math.round(v*d);if(Math.abs(n/d-v)<1e-9)return d===1?String(n):`${n}/${d}`;}return String(Number(v.toFixed(4)));};
  const answer=frac(ratio),choice=problem.choices?.find(c=>c.text.trim()===answer)?.label;
  const ok=total===10&&triangleArea===4&&answer===problem.shortAnswer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
  const s=52,ox=36,oy=254,px=ox,qx=ox+5*s,yY=oy-s,yX=oy-2*s,yQ=oy-height*s;
  const cells=[...Array.from({length:6},(_,i)=>[i,0]),...Array.from({length:4},(_,i)=>[i+1,1])];
  const outline=`M ${ox} ${oy} L ${ox} ${yY} L ${ox+s} ${yY} L ${ox+s} ${yX} L ${qx} ${yX} L ${qx} ${yY} L ${ox+6*s} ${yY} L ${ox+6*s} ${oy} Z`;

  return <div style={{display:"flex",justifyContent:"center",width:"100%",padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 460 325" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Ten-square octagon cut by an area-bisecting line PQ">
      <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"half of ten unit squares has area five":phase===1?"below PQ: one square plus one triangle":phase===2?"triangle area fixes Q's height":"split the unit segment XY at Q"}</text>

      {phase<3&&<>
        <path d={outline} fill="#f8fafc" stroke={INK} strokeWidth="2.5"/>
        {cells.map(([col,row],i)=><motion.rect key={`${col}-${row}`} x={ox+col*s} y={oy-(row+1)*s} width={s} height={s} fill={phase===0?(i<5?"#e0e7ff":"white"):"transparent"} stroke="#94a3b8" strokeWidth="1.1" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*.05}}/>)}
        {phase>=1&&<><motion.polygon points={`${px},${oy} ${qx},${yQ} ${qx},${oy}`} fill="#fde68a" fillOpacity=".8" stroke={GOLD} strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}}/><motion.rect x={qx} y={yY} width={s} height={s} fill="#c7d2fe" stroke={IND} strokeWidth="2" initial={{opacity:0}} animate={{opacity:1}}/></>}
        <motion.line x1={px} y1={oy} x2={qx} y2={yQ} stroke={INK} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <circle cx={px} cy={oy} r="4" fill={INK}/><circle cx={qx} cy={yQ} r="4" fill={INK}/><circle cx={qx} cy={yY} r="4" fill={INK}/><circle cx={qx} cy={yX} r="4" fill={INK}/>
        <text x={px-14} y={oy+18} fontFamily={FONT} fontSize="11" fontWeight="900" fill={INK}>P</text><text x={qx+8} y={yQ+4} fontFamily={FONT} fontSize="11" fontWeight="900" fill={INK}>Q</text><text x={qx+8} y={yY+4} fontFamily={FONT} fontSize="11" fontWeight="900" fill={INK}>Y</text><text x={qx+8} y={yX+4} fontFamily={FONT} fontSize="11" fontWeight="900" fill={INK}>X</text>
      </>}

      {phase===0&&<g transform="translate(363 66)"><rect width="82" height="128" rx="13" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="41" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TOTAL</text><text x="41" y="56" textAnchor="middle" fontFamily={FONT} fontSize="23" fontWeight="950" fill={INK}>{total}</text><line x1="15" y1="70" x2="67" y2="70" stroke={DIM}/><text x="41" y="91" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>HALF</text><motion.text x="41" y="117" textAnchor="middle" fontFamily={FONT} fontSize="22" fontWeight="950" fill={IND} initial={{scale:.5}} animate={{scale:1}}>= {halfArea}</motion.text></g>}

      {phase===1&&<g transform="translate(359 63)"><rect width="88" height="144" rx="13" fill="#fff7ed" stroke={GOLD} strokeWidth="2"/><text x="44" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>BELOW PQ</text><text x="44" y="58" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={IND}>1 + △</text><text x="44" y="88" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={INK}>= {halfArea}</text><motion.text x="44" y="123" textAnchor="middle" fontFamily={FONT} fontSize="19" fontWeight="950" fill={GOLD} initial={{scale:.5}} animate={{scale:1}}>△ = {triangleArea}</motion.text></g>}

      {phase===2&&<>
        <line x1={px} y1={oy+17} x2={qx} y2={oy+17} stroke={GOLD} strokeWidth="1.8"/><path d={`M ${px} ${oy+10} v 14 M ${qx} ${oy+10} v 14`} stroke={GOLD} strokeWidth="1.8"/><text x={(px+qx)/2} y={oy+36} textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="900" fill={GOLD}>base = {base}</text>
        <line x1={qx-15} y1={oy} x2={qx-15} y2={yQ} stroke={IND} strokeWidth="2"/><text x={qx-22} y={(oy+yQ)/2} textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="900" fill={IND} transform={`rotate(-90 ${qx-22} ${(oy+yQ)/2})`}>h = {frac(height)}</text>
        <g transform="translate(355 63)"><rect width="94" height="145" rx="13" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="47" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TRIANGLE</text><text x="47" y="57" textAnchor="middle" fontFamily={FONT} fontSize="13" fontWeight="900" fill={IND}>½·{base}·h = {triangleArea}</text><text x="47" y="87" textAnchor="middle" fontFamily={FONT} fontSize="14" fontWeight="900" fill={INK}>{base}h = {2*triangleArea}</text><motion.text x="47" y="122" textAnchor="middle" fontFamily={FONT} fontSize="20" fontWeight="950" fill={IND} initial={{scale:.5}} animate={{scale:1}}>h = {frac(height)}</motion.text></g>
      </>}

      {phase===3&&<>
        <g transform="translate(78 49)"><line x1="70" y1="16" x2="70" y2="216" stroke={INK} strokeWidth="5" strokeLinecap="round"/><circle cx="70" cy="16" r="6" fill={INK}/><circle cx="70" cy="116" r="6" fill={INK}/><circle cx="70" cy="56" r="7" fill={GOLD}/><text x="48" y="21" textAnchor="end" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INK}>X</text><text x="48" y="61" textAnchor="end" fontFamily={FONT} fontSize="13" fontWeight="900" fill={GOLD}>Q</text><text x="48" y="121" textAnchor="end" fontFamily={FONT} fontSize="13" fontWeight="900" fill={INK}>Y</text><path d="M 88 16 h 10 v 40 h -10 M 88 56 h 10 v 60 h -10" fill="none" stroke={IND} strokeWidth="2"/><text x="112" y="40" fontFamily={FONT} fontSize="13" fontWeight="900" fill={IND}>{frac(xq)}</text><text x="112" y="91" fontFamily={FONT} fontSize="13" fontWeight="900" fill={IND}>{frac(qy)}</text><text x="70" y="157" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>bottom → Y = 1</text><text x="70" y="178" textAnchor="middle" fontFamily={FONT} fontSize="10.5" fontWeight="900" fill={INK}>bottom → Q = {frac(height)}</text><text x="70" y="201" textAnchor="middle" fontFamily={FONT} fontSize="11" fontWeight="900" fill={GOLD}>{frac(height)} − 1 = {frac(qy)}</text></g>
        <g transform="translate(240 70)"><rect width="180" height="137" rx="15" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2.3"/><text x="90" y="29" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>REQUESTED RATIO</text><text x="90" y="63" textAnchor="middle" fontFamily={FONT} fontSize="17" fontWeight="900" fill={INK}>XQ / QY</text><text x="90" y="94" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={IND}>= ({frac(xq)}) / ({frac(qy)})</text><motion.text x="90" y="124" textAnchor="middle" fontFamily={FONT} fontSize="22" fontWeight="950" fill={ok?GREEN:RED} initial={{scale:.5}} animate={{scale:1}}>= {answer}</motion.text></g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={330} y={229} width={84}/>
        {!ok&&<text x="330" y="274" textAnchor="middle" fontSize="9" fill={RED}>check failed: computed {answer}; stored {problem.shortAnswer ?? "missing"}</text>}
      </>}
    </svg>
  </div>;
}
