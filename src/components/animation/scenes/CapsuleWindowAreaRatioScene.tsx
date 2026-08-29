import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44", IND="#4338ca", GOLD="#d97706", GREEN="#16a34a", RED="#dc2626", DIM="#64748b";

/** Scale a capsule window, detach its semicircular caps, then compare the rectangle and circle areas. */
export function CapsuleWindowAreaRatioScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const width=num(data.rectangleWidth,1), ratioLong=num(data.ratioLong,1), ratioShort=num(data.ratioShort,1);
  const height=width*ratioLong/ratioShort, radius=width/2;
  const rectArea=width*height, circleCoeff=radius*radius;
  const divisor=(()=>{const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);return gcd(rectArea,circleCoeff);})();
  const left=rectArea/divisor, right=circleCoeff/divisor;
  const stored=`${left}:pi`, shown=`${left}:π`;
  const choice=problem.choices?.find(c=>c.text.replace(/\s/g,"").toLowerCase()===stored)?.label;
  const ok=Number.isInteger(height)&&Number.isInteger(radius)&&problem.shortAnswer?.replace(/\s/g,"").toLowerCase()===stored&&choice===problem.answer;
  const final=step>=totalSteps-1, phase=final?2:Math.min(step,1);

  const x=80,y=70,w=120,h=180,r=60,mid=x+w/2;
  const topArc=`M ${x} ${y} A ${r} ${r} 0 0 1 ${x+w} ${y}`;
  const bottomArc=`M ${x+w} ${y+h} A ${r} ${r} 0 0 1 ${x} ${y+h}`;
  return <div style={{display:"flex",justifyContent:"center",width:"100%",padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 460 325" width="100%" style={{maxWidth:500,display:"block"}} aria-label="A capsule-shaped window separated into a rectangle and a circle">
      <text x={phase===0?350:230} y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"scale the 3:2 side ratio":phase===1?"the two semicircular caps make one circle":"compare the rectangle with the recombined circle"}</text>

      {phase===0&&<>
        <path d={`${topArc} M ${x} ${y} V ${y+h} ${bottomArc} M ${x+w} ${y} V ${y+h}`} fill="#eef2ff" stroke={INK} strokeWidth="2.5"/>
        <line x1={x} y1={y} x2={x+w} y2={y} stroke={IND} strokeWidth="2"/><line x1={x} y1={y+h} x2={x+w} y2={y+h} stroke={IND} strokeWidth="2"/>
        <circle cx={x} cy={y+h} r="3.7" fill={INK}/><circle cx={x+w} cy={y+h} r="3.7" fill={INK}/>
        <text x={x-17} y={y+h+18} fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>A</text><text x={x+w+8} y={y+h+18} fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>B</text><text x={x-17} y={y-5} fontSize="11" fontWeight="900" fill={INK} fontFamily={FONT}>D</text>
        <text x={mid} y={y+h+22} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>AB = {width}</text>
        <path d={`M ${x-19} ${y} h -9 v ${h} h 9`} fill="none" stroke={GOLD} strokeWidth="2"/><text x={x-36} y={y+h/2} textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT} transform={`rotate(-90 ${x-36} ${y+h/2})`}>AD = ?</text>
        <g transform="translate(265 79)"><rect width="165" height="132" rx="14" fill="#fff7ed" stroke={GOLD} strokeWidth="2"/><text x="82.5" y="27" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>AD : AB = {ratioLong} : {ratioShort}</text><text x="82.5" y="57" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>1 part = {width} ÷ {ratioShort}</text><text x="82.5" y="84" textAnchor="middle" fontSize="15" fontWeight="900" fill={GOLD} fontFamily={FONT}>= {width/ratioShort}</text><motion.text x="82.5" y="115" textAnchor="middle" fontSize="19" fontWeight="950" fill={GOLD} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}} transition={{delay:.45,type:"spring"}}>AD = {height}</motion.text></g>
      </>}

      {phase===1&&<>
        <rect x="35" y="70" width="120" height="180" fill="#eef2ff" stroke={IND} strokeWidth="2.5"/>
        <text x="95" y="163" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{width} × {height}</text>
        <motion.path d="M 35 70 A 60 60 0 0 1 155 70 Z" fill="#fef3c7" stroke={GOLD} strokeWidth="2.5" initial={{x:0,y:0}} animate={{x:205,y:25}} transition={{type:"spring",stiffness:90,damping:18}}/>
        <motion.path d="M 155 250 A 60 60 0 0 1 35 250 Z" fill="#fef3c7" stroke={GOLD} strokeWidth="2.5" initial={{x:0,y:0}} animate={{x:205,y:-155}} transition={{type:"spring",stiffness:90,damping:18}}/>
        <motion.circle cx="300" cy="95" r="60" fill="#fef3c7" fillOpacity=".35" stroke={GOLD} strokeWidth="2.5" initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.65,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>
        <line x1="300" y1="95" x2="360" y2="95" stroke={GOLD} strokeWidth="2"/><text x="329" y="87" textAnchor="middle" fontSize="12" fontWeight="900" fill={GOLD} fontFamily={FONT}>r={radius}</text>
        <text x="300" y="190" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>½ circle + ½ circle = 1 circle</text>
      </>}

      {phase===2&&<>
        <g transform="translate(29 57)"><rect width="184" height="195" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2"/><rect x="39" y="24" width="106" height="82" fill="#c7d2fe" stroke={IND} strokeWidth="2"/><text x="92" y="68" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{width} × {height}</text><text x="92" y="136" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>RECTANGLE</text><text x="92" y="168" textAnchor="middle" fontSize="19" fontWeight="950" fill={IND} fontFamily={FONT}>{rectArea}</text></g>
        <g transform="translate(247 57)"><rect width="184" height="195" rx="14" fill="#fff7ed" stroke={GOLD} strokeWidth="2"/><circle cx="92" cy="65" r="48" fill="#fde68a" stroke={GOLD} strokeWidth="2"/><line x1="92" y1="65" x2="140" y2="65" stroke={GOLD} strokeWidth="2"/><text x="116" y="58" textAnchor="middle" fontSize="11" fontWeight="900" fill={GOLD} fontFamily={FONT}>{radius}</text><text x="92" y="136" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>TWO CAPS</text><text x="92" y="168" textAnchor="middle" fontSize="19" fontWeight="950" fill={GOLD} fontFamily={FONT}>{circleCoeff}π</text></g>
        <motion.g initial={{opacity:0,scale:.75}} animate={{opacity:1,scale:1}} transition={{delay:.4,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="119" y="270" width="222" height="39" rx="19.5" fill={ok?GREEN:RED}/><text x="230" y="295" textAnchor="middle" fontSize="16" fontWeight="950" fill="white" fontFamily={FONT}>{rectArea}:{circleCoeff}π = {shown}</text></motion.g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={404} y={291} width={74}/>
        {!ok&&<text x="230" y="321" textAnchor="middle" fontSize="9" fill={RED}>check failed: computed {stored}; stored {problem.shortAnswer ?? "missing"}</text>}
      </>}
    </svg>
  </div>;
}
