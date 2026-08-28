import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",PINK="#db2777",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";

/** Deal every birth sequence into composition buckets and compare their exact sizes. */
export function BirthOutcomeBucketsScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),children=Math.round(num(data.childCount,0));
  const labels=(Array.isArray(data.outcomeLabels)?data.outcomeLabels:[]).map(String);
  const total=labels.length**children;
  const sequences=Array.from({length:total},(_,value)=>Array.from({length:children},(__,place)=>labels[Math.floor(value/labels.length**(children-1-place))%labels.length]).join(""));
  const first=labels[0]??"B",second=labels[1]??"G";
  const countSecond=(s:string)=>[...s].filter(v=>v===second).length;
  const allFirst=sequences.filter(s=>countSecond(s)===0),allSecond=sequences.filter(s=>countSecond(s)===children);
  const balanced=sequences.filter(s=>countSecond(s)===children/2);
  const threeOne=sequences.filter(s=>countSecond(s)===1||countSecond(s)===children-1);
  const counts=[allFirst.length,allSecond.length,balanced.length,threeOne.length],largest=Math.max(...counts);
  const choice=problem.choices?.find(c=>c.label==="D")?.label;
  const ok=total===16&&threeOne.length===8&&largest===threeOne.length&&problem.shortAnswer===problem.choices?.find(c=>c.label==="D")?.text&&choice===problem.answer;
  const failure=total!==16?`generated ${total} outcomes`:threeOne.length!==8?`counted ${threeOne.length} three-one outcomes`:`computed choice D, stored ${problem.answer}`;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);

  const BabyRow=({sequence,x,y,active=true,delay=0}:{sequence:string;x:number;y:number;active?:boolean;delay?:number})=><motion.g initial={{opacity:0,scale:.6}} animate={{opacity:active?1:.18,scale:1}} transition={{delay}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width="94" height="39" rx="8" fill={active?"#fff":"#f8fafc"} stroke={active?"#cbd5e1":"#e2e8f0"}/>{[...sequence].map((v,i)=>{const boy=v===first,color=boy?IND:PINK;return <g key={i}><circle cx={x+15+i*21.5} cy={y+15} r="6" fill={active?(boy?"#c7d2fe":"#fbcfe8"):"#e2e8f0"} stroke={active?color:"#cbd5e1"}/><path d={`M ${x+9+i*21.5} ${y+29} Q ${x+15+i*21.5} ${y+19} ${x+21+i*21.5} ${y+29} Z`} fill={active?color:"#cbd5e1"}/><text x={x+15+i*21.5} y={y+17.5} textAnchor="middle" fontSize="5.8" fontWeight="900" fill={active?color:DIM}>{v}</text></g>})}</motion.g>;
  const Bucket=({title,items,x,y,color,cols=2}:{title:string;items:string[];x:number;y:number;color:string;cols?:number})=>{const height=35+Math.ceil(items.length/cols)*43;return <g><rect x={x} y={y} width={cols===4?412:196} height={height} rx="13" fill={`${color}0d`} stroke={color} strokeWidth="1.7"/><text x={x+10} y={y+19} fontSize="10" fontWeight="900" fill={color}>{title}</text><text x={x+(cols===4?397:181)} y={y+19} textAnchor="end" fontSize="15" fontWeight="900" fill={color} fontFamily={FONT}>{items.length}</text>{items.map((s,i)=><BabyRow key={s} sequence={s} x={x+7+(i%cols)*(cols===4?100:96)} y={y+28+Math.floor(i/cols)*43} delay={i*.06}/>)}</g>};

  return <div style={{display:"flex",justifyContent:"center",width:"100%",maxWidth:480,minWidth:0,padding:"6px 4px",boxSizing:"border-box",overflow:"hidden"}}><svg viewBox="0 0 460 315" width="100%" style={{flex:"1 1 0",maxWidth:"100%",minWidth:0,display:"block"}}>
    <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"four independent births make sixteen equally likely sequence cards":phase===1?"only one card is all boys and only one is all girls":phase===2?"choose the two positions occupied by girls: six balanced cards":"one odd-position choice for each majority gender makes eight cards"}</text>
    {phase===0&&<><g transform="translate(25 39)">{sequences.map((s,i)=><BabyRow key={s} sequence={s} x={(i%4)*103} y={Math.floor(i/4)*50} delay={i*.035}/>)}</g><g transform="translate(120 257)"><rect width="220" height="40" rx="11" fill="#eef2ff" stroke={IND}/><text x="110" y="26" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{labels.length}^{children} = {total} sequences</text></g></>}
    {phase===1&&<><Bucket title="A  ALL BOYS" items={allFirst} x={25} y={49} color={IND}/><Bucket title="B  ALL GIRLS" items={allSecond} x={239} y={49} color={PINK}/><g transform="translate(80 177)"><rect width="300" height="75" rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="150" y="24" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>the four positions are already forced</text><text x="150" y="52" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>1 all-B card + 1 all-G card</text></g></>}
    {phase===2&&<><Bucket title="C  TWO GIRLS + TWO BOYS" items={balanced} x={132} y={40} color={GREEN}/><g transform="translate(91 238)"><rect width="278" height="51" rx="12" fill="#f0fdf4" stroke={GREEN}/><text x="139" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>choose which 2 of the 4 positions are G</text><text x="139" y="41" textAnchor="middle" fontSize="17" fontWeight="900" fill={GREEN} fontFamily={FONT}>C({children}, 2) = {balanced.length}</text></g></>}
    {phase===3&&<><Bucket title="D  THREE OF ONE + ONE OF THE OTHER" items={threeOne} x={24} y={37} color={GREEN} cols={4}/><g transform="translate(64 172)">{counts.map((count,i)=>{const colors=[IND,PINK,"#0d9488",GREEN],letters=["A","B","C","D"];return <g key={letters[i]} transform={`translate(${i*88} 0)`}><text x="32" y="10" textAnchor="middle" fontSize="10" fontWeight="900" fill={colors[i]}>{letters[i]}</text><rect x="16" y={70-count*7} width="32" height={count*7} rx="5" fill={colors[i]} opacity={count===largest?1:.48}/><text x="32" y="88" textAnchor="middle" fontSize="15" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{count}</text></g>})}</g><text x="174" y="296" textAnchor="middle" fontSize="9.2" fontWeight="800" fill={ok?GREEN:RED} fontFamily={FONT}>{ok?`4 minority-G positions + 4 minority-B positions = ${threeOne.length}`:failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={406} y={276} width={78}/></>}
    <AnimatePresence>{final&&!ok&&<motion.text x="230" y="313" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
  </svg></div>;
}
