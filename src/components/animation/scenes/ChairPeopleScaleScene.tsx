import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",RED="#dc2626",AMBER="#d97706",TEAL="#0d9488",DIM="#64748b";

function Chair({x,y,empty,delay=0}:{x:number;y:number;empty:boolean;delay?:number}){return <motion.g initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay,type:"spring",stiffness:190,damping:16}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x+3} y={y} width="20" height="17" rx="4" fill={empty?"#fff7ed":"#dcfce7"} stroke={empty?AMBER:GREEN} strokeWidth="1.5"/><path d={`M${x+6} ${y+17}v9M${x+20} ${y+17}v9M${x} ${y+11}h3M${x+23} ${y+11}h3`} stroke={empty?AMBER:GREEN} strokeWidth="1.8"/><text x={x+13} y={y+13} textAnchor="middle" fontSize="8" fontWeight="900" fill={empty?AMBER:GREEN}>{empty?"○":"●"}</text></motion.g>}
function Person({x,y,standing,delay=0}:{x:number;y:number;standing:boolean;delay?:number}){const tone=standing?AMBER:IND;return <motion.g initial={{opacity:0,y:standing?-13:8,scale:.6}} animate={{opacity:1,y:0,scale:1}} transition={{delay,type:"spring",stiffness:190,damping:16}} style={{transformBox:"fill-box",transformOrigin:"center"}}><circle cx={x} cy={y} r="5" fill={tone}/><path d={`M${x-7} ${y+14}q0-8 7-8t7 8Z`} fill={tone}/>{standing&&<path d={`M${x-4} ${y+14}l-2 8M${x+4} ${y+14}l2 8`} stroke={tone} strokeWidth="2"/>}</motion.g>}

/** Clone the six-chair empty quarter into the full chair set, fill the other
 * chairs, then regroup eighteen seated people as two of three equal thirds. */
export function ChairPeopleScaleScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const empty=num(data.emptyChairs,0),occupiedNum=num(data.occupiedNumerator,0),occupiedDen=num(data.occupiedDenominator,0),seatedNum=num(data.seatedNumerator,0),seatedDen=num(data.seatedDenominator,0);
  const chairs=empty*occupiedDen/(occupiedDen-occupiedNum),taken=chairs-empty,group=taken/seatedNum,people=group*seatedDen,standing=people-taken;
  const choice=problem.choices?.find(c=>Number(c.text)===people)?.label;
  const ok=empty===6&&occupiedNum===3&&occupiedDen===4&&seatedNum===2&&seatedDen===3&&chairs===24&&taken===18&&group===9&&people===27&&choice===problem.answer&&Number(problem.shortAnswer)===people;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2);
  const chairPos=(i:number)=>({x:44+(i%8)*43,y:53+Math.floor(i/8)*48});
  const personPos=(i:number)=>{const g=Math.floor(i/group),within=i%group;return{x:65+g*137+(within%3)*25,y:73+Math.floor(within/3)*30}};

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 300" width="342" style={{maxWidth:"100%",display:"block"}} aria-label="Six empty chairs expanded to twenty-four chairs, then eighteen seated people expanded from two thirds to twenty-seven people">
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"six empty chairs are one quarter of all chairs":phase===1?"fill the other three quarter-blocks":phase===2?"eighteen seated people make two equal thirds":"add the standing third"}</text>
      {phase<=1&&<g>
        {[...Array(chairs)].map((_,i)=>{const quarter=Math.floor(i/empty),show=phase===1||quarter===0;const emptySeat=quarter===0;return show?<Chair key={i} {...chairPos(i)} empty={emptySeat} delay={phase===0?i*.07:quarter*.12+i*.012}/>:null})}
        {phase===0&&<g><rect x="34" y="40" width="354" height="44" rx="10" fill="none" stroke={AMBER} strokeWidth="2" strokeDasharray="5 3"/><text x="407" y="67" fontSize="13" fontWeight="900" fill={AMBER} fontFamily={FONT}>1/4</text><motion.path d="M210 101v27" stroke={IND} strokeWidth="2.5" markerEnd="url(#cps-arrow)" initial={{pathLength:0}} animate={{pathLength:1}}/><defs><marker id="cps-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={IND}/></marker></defs><g transform="translate(100 139)"><rect width="270" height="63" rx="13" fill="#fff7ed" stroke="#fed7aa"/><text x="135" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>FOUR EQUAL QUARTERS</text><text x="135" y="48" textAnchor="middle" fontSize="20" fontWeight="900" fill={AMBER} fontFamily={FONT}>{empty} × {occupiedDen} = {chairs} chairs</text></g></g>}
        {phase===1&&<g transform="translate(91 219)"><rect width="288" height="53" rx="13" fill="#f0fdf4" stroke="#86efac"/><text x="144" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TAKEN CHAIRS</text><motion.text x="144" y="42" textAnchor="middle" fontSize="19" fontWeight="900" fill={GREEN} fontFamily={FONT} initial={{scale:.5}} animate={{scale:1}}>{chairs} − {empty} = {taken}</motion.text></g>}
      </g>}

      {phase>=2&&<g>
        {[...Array(people)].map((_,i)=>{const show=phase===3||i<taken;return show?<Person key={i} {...personPos(i)} standing={i>=taken} delay={i*.025}/>:null})}
        {[0,1,2].map(g=><rect key={g} x={49+g*137} y="47" width="113" height="113" rx="14" fill="none" stroke={g<2?IND:phase===3?AMBER:"#cbd5e1"} strokeWidth="1.8" strokeDasharray={g===2&&phase===2?"5 3":undefined}/>)}
        <text x="105" y="180" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{group} seated</text><text x="242" y="180" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{group} seated</text><text x="379" y="180" textAnchor="middle" fontSize="11" fontWeight="900" fill={phase===3?AMBER:DIM} fontFamily={FONT}>{phase===3?`${standing} standing`:"missing 1/3"}</text>
        {phase===2&&<g transform="translate(87 207)"><rect width="296" height="58" rx="13" fill="#eef2ff" stroke="#c7d2fe"/><text x="148" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TWO THIRDS = {taken} PEOPLE</text><text x="148" y="46" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{taken} ÷ {seatedNum} = {group} per third</text></g>}
        {phase===3&&<g transform="translate(89 205)"><rect width="292" height="60" rx="13" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?"#86efac":"#fecaca"}/><text x="146" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ALL THREE THIRDS</text><motion.text x="146" y="47" textAnchor="middle" fontSize="22" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.5,type:"spring"}}>{group} × {seatedDen} = {people} people</motion.text></g>}
        <SvgAnswerBadge show={final} answer={ok?problem.answer:"check failed"} cx={408} y={263} width={ok?80:118}/>
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`${empty} is 1/4, so there are ${chairs} chairs`:phase===1?`${taken} chairs are occupied, so ${taken} people are seated`:phase===2?`${taken} seated people split into ${seatedNum} groups of ${group}`:ok?`${seatedDen} groups of ${group} make ${people} people — choice ${problem.answer}`:"chair counts, fraction groups, or stored-answer check failed"}</motion.span>
  </div>;
}
