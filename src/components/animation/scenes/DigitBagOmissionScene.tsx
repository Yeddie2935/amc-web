import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",ORANGE="#d97706",DIM="#64748b";

function Ticket({x,y,value,color=IND,delay=0}:{x:number;y:number;value:number;color?:string;delay?:number}){
  return <motion.g initial={{opacity:0,y:-12,rotate:-8}} animate={{opacity:1,y:0,rotate:0}} transition={{delay,type:"spring",stiffness:190,damping:15}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="48" height="61" rx="8" fill="#fff" stroke={color} strokeWidth="2"/><circle cx={x+8} cy={y+9} r="2.5" fill={color}/><text x={x+24} y={y+40} textAnchor="middle" fontSize="24" fontWeight="950" fill={color} fontFamily={FONT}>{value}</text></motion.g>;
}

export function DigitBagOmissionScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),digits=(Array.isArray(data.digits)?data.digits:[]).map(v=>Math.round(num(v,0))),drawCount=Math.round(num(data.drawCount,0)),divisor=Math.round(num(data.divisor,0));
  const totalSum=digits.reduce((a,b)=>a+b,0);
  const cases=digits.map(omitted=>{const kept=digits.filter(v=>v!==omitted),sum=totalSum-omitted;return{omitted,kept,sum,works:sum%divisor===0};});
  const winners=cases.filter(c=>c.works),numerator=winners.length,denominator=cases.length;
  const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a),g=gcd(numerator,denominator),answer=`${numerator/g}/${denominator/g}`;
  const permutationsPerSet=Array.from({length:drawCount},(_,i)=>i+1).reduce((a,b)=>a*b,1);
  const totalOrdered=denominator*permutationsPerSet,winningOrdered=numerator*permutationsPerSet;
  const choice=problem.choices?.find(c=>c.text===answer)?.label;
  const ok=digits.join(",")==="1,2,3,4"&&new Set(digits).size===4&&drawCount===3&&divisor===3&&winners.map(c=>c.omitted).join(",")==="1,4"&&winningOrdered===12&&totalOrdered===24&&answer===problem.shortAnswer&&choice===problem.answer;
  const failure=cases.length!==4?`found ${cases.length} omission cases`:winners.length!==2?`found ${winners.length} successful omissions`:answer!==problem.shortAnswer?`computed ${answer}, stored ${problem.shortAnswer}`:`choice ${choice??"missing"}, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);

  return <div style={{width:"100%",display:"flex",justifyContent:"center",minWidth:0,padding:"5px 2px",boxSizing:"border-box",overflow:"hidden"}}><svg viewBox="0 0 470 315" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Four digit tickets branch by the omitted digit and are tested by digit sum modulo three">
    <defs><marker id="bag-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={IND}/></marker></defs>
    <text x="235" y="19" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"the order changes the number, but not the sum of its digits":phase===1?"leave each ticket behind once and test the other three digits":"two of four equally likely omitted tickets give a multiple of 3"}</text>
    {phase===0&&<g>
      <path d="M44 57 Q96 37 148 57 L137 174 Q96 203 55 174Z" fill="#eef2ff" stroke={IND} strokeWidth="2.5"/><path d="M55 67Q96 88 137 67" fill="none" stroke="#a5b4fc" strokeWidth="3"/>{digits.map((v,i)=><Ticket key={v} x={57+(i%2)*54} y={82+Math.floor(i/2)*65} value={v} delay={i*.1}/>) }<text x="96" y="219" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>DRAW 3 WITHOUT REPLACEMENT</text>
      <motion.path d="M160 129 H204" stroke={IND} strokeWidth="2.5" markerEnd="url(#bag-arrow)" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <g transform="translate(217 55)"><rect width="223" height="167" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="111.5" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SAME THREE TICKETS, DIFFERENT ORDER</text>{[[1,2,3],[3,2,1]].map((row,r)=>row.map((v,i)=><g key={`${r}-${i}`}><rect x={35+i*53} y={39+r*58} width="39" height="43" rx="7" fill="#fff" stroke={r?ORANGE:IND}/><text x={54.5+i*53} y={68+r*58} textAnchor="middle" fontSize="19" fontWeight="950" fill={r?ORANGE:IND} fontFamily={FONT}>{v}</text></g>))}<text x="199" y="66" textAnchor="middle" fontSize="12" fontWeight="950" fill={IND} fontFamily={FONT}>= 6</text><text x="199" y="124" textAnchor="middle" fontSize="12" fontWeight="950" fill={ORANGE} fontFamily={FONT}>= 6</text><text x="111.5" y="154" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>both are divisible by {divisor}</text></g>
      <g transform="translate(105 248)"><rect width="260" height="46" rx="13" fill="#ecfdf5" stroke="#86efac"/><text x="130" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>DIVISIBILITY RULE</text><text x="130" y="38" textAnchor="middle" fontSize="13" fontWeight="950" fill={GREEN} fontFamily={FONT}>number ÷ {divisor} ⇔ digit sum ÷ {divisor}</text></g>
    </g>}
    {phase===1&&<g>
      {cases.map((item,i)=>{const x=22+(i%2)*224,y=45+Math.floor(i/2)*126;return <motion.g key={item.omitted} initial={{opacity:0,scale:.75}} animate={{opacity:1,scale:1}} transition={{delay:i*.1,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="202" height="108" rx="13" fill={item.works?"#f0fdf4":"#f8fafc"} stroke={item.works?GREEN:"#cbd5e1"} strokeWidth={item.works?2.3:1.4}/><text x={x+15} y={y+21} fontSize="9" fontWeight="850" fill={DIM}>LEAVE OUT</text><circle cx={x+70} cy={y+17} r="13" fill={item.works?"#dcfce7":"#fee2e2"} stroke={item.works?GREEN:RED}/><text x={x+70} y={y+22} textAnchor="middle" fontSize="13" fontWeight="950" fill={item.works?GREEN:RED} fontFamily={FONT}>{item.omitted}</text><text x={x+101} y={y+53} textAnchor="middle" fontSize="17" fontWeight="950" fill={INK} fontFamily={FONT}>{item.kept.join(" + ")} = {item.sum}</text><text x={x+101} y={y+82} textAnchor="middle" fontSize="12" fontWeight="900" fill={item.works?GREEN:RED}>{item.works?`${item.sum} divisible by ${divisor} ✓`:`remainder ${item.sum%divisor} ✕`}</text></motion.g>;})}
      <text x="235" y="300" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>every omitted digit leaves {permutationsPerSet} orders, so all four cards are equally weighted</text>
    </g>}
    {phase===2&&<g>
      <g transform="translate(45 52)">{cases.map((item,i)=><motion.g key={item.omitted} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:i*.1}}><rect x={i*96} width="74" height="92" rx="13" fill={item.works?"#dcfce7":"#fee2e2"} stroke={item.works?GREEN:RED} strokeWidth="2"/><text x={i*96+37} y="20" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>omit</text><text x={i*96+37} y="52" textAnchor="middle" fontSize="25" fontWeight="950" fill={item.works?GREEN:RED} fontFamily={FONT}>{item.omitted}</text><text x={i*96+37} y="78" textAnchor="middle" fontSize="11" fontWeight="950" fill={item.works?GREEN:RED}>{item.works?"WIN ✓":"NO"}</text></motion.g>)}</g>
      <g transform="translate(100 178)"><rect width="270" height="84" rx="16" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED} strokeWidth="2.5"/><text x="135" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SUCCESSFUL OMISSIONS / ALL OMISSIONS</text><text x="135" y="57" textAnchor="middle" fontSize="25" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>{numerator}/{denominator} = {answer}</text><text x="135" y="76" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok?GREEN:RED}>{ok?`${winningOrdered} of ${totalOrdered} ordered draws agree`:failure}</text></g><SvgAnswerBadge show={ok} answer={problem.answer} cx={414} y={279} width={78}/>
    </g>}
  </svg></div>;
}
