import {motion} from "motion/react";
import type {AnimatedSceneProps} from "./types";
import {num,sceneData,SvgAnswerBadge} from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",INDIGO="#4338ca",TEAL="#0d9488",GOLD="#d97706",GREEN="#16a34a",RED="#dc2626",DIM="#64748b";
const gcd=(a:number,b:number):number=>b?gcd(b,a%b):Math.abs(a);

/** Repeatedly remove a fraction of the current book plus a fixed page bundle, then solve the final remainder. Data: { denominators, extras, finalPages }. */
export function SuccessiveReadingRemainderScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const den=(Array.isArray(data.denominators)?data.denominators:[]).map(v=>Math.round(num(v,0)));
  const extras=(Array.isArray(data.extras)?data.extras:[]).map(v=>Math.round(num(v,0)));
  const finalPages=Math.round(num(data.finalPages,0));
  const states:{n:number;d:number;offset:number}[]=[{n:1,d:1,offset:0}];
  for(let i=0;i<den.length;i++){
    const prev=states[i],n=prev.n*(den[i]-1),d=prev.d*den[i],g=gcd(n,d);
    states.push({n:n/g,d:d/g,offset:prev.offset*(den[i]-1)/den[i]-extras[i]});
  }
  const last=states[states.length-1],answer=(finalPages-last.offset)*last.d/last.n;
  const final=step>=totalSteps-1,phase=final?3:Math.min(step,2),day=phase;
  const choice=problem.choices?.find(c=>Number(c.text)===answer)?.label;
  const ok=Number.isInteger(answer)&&String(answer)===problem.shortAnswer&&choice===problem.answer;
  const fail=`computed ${answer}; stored ${problem.shortAnswer ?? "missing"}`;
  const fmt=(s:{n:number;d:number;offset:number})=>`${s.n===s.d?"x":`${s.n}x/${s.d}`}${s.offset<0?` − ${Math.abs(s.offset)}`:s.offset>0?` + ${s.offset}`:""}`;

  return <div style={{display:"flex",justifyContent:"center",width:"100%",minWidth:0,padding:"6px 4px",boxSizing:"border-box"}}><svg viewBox="0 0 460 330" width="100%" style={{maxWidth:490,display:"block"}}>
    <text x="230" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{final?"use the 62-page ending to recover the whole book":`day ${day+1}: read 1/${den[day]} of what remains, then ${extras[day]} more`}</text>

    {!final&&<>
      <g transform="translate(37 47)">
        <path d="M0 12 Q45 -2 90 12 V86 Q45 72 0 86 Z" fill="#eef2ff" stroke={INDIGO} strokeWidth="2.3"/><path d="M90 12 Q135 -2 180 12 V86 Q135 72 90 86 Z" fill="#f0fdfa" stroke={TEAL} strokeWidth="2.3"/><line x1="90" y1="12" x2="90" y2="86" stroke={INK} strokeWidth="2"/>
        <text x="90" y="45" textAnchor="middle" fontSize="18">📖</text><text x="90" y="108" textAnchor="middle" fontSize="13" fontWeight="950" fill={INK} fontFamily={FONT}>before: {fmt(states[day])}</text>
      </g>
      <motion.path d="M 219 100 C 240 80 252 80 269 100" fill="none" stroke={GOLD} strokeWidth="2.5" initial={{pathLength:0}} animate={{pathLength:1}}/>
      <g transform="translate(267 50)">
        <text x="77" y="0" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>CURRENT REMAINDER</text>
        {Array.from({length:den[day]},(_,i)=><motion.g key={i} initial={{opacity:0,y:-10}} animate={{opacity:1,y:i===0?18:0}} transition={{delay:i*.08}}><rect x={i*(145/den[day])} y="18" width={145/den[day]-3} height="53" rx="5" fill={i===0?"#fef3c7":"#ccfbf1"} stroke={i===0?GOLD:TEAL} strokeWidth="1.7"/><text x={i*(145/den[day])+(145/den[day]-3)/2} y="49" textAnchor="middle" fontSize={i===0?11:8.5} fontWeight="900" fill={i===0?GOLD:TEAL} fontFamily={FONT}>{i===0?`1/${den[day]}`:"keep"}</text></motion.g>)}
        <text x="72" y="96" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={GOLD}>fraction read</text>
      </g>
      <motion.g initial={{opacity:0,x:18}} animate={{opacity:1,x:0}} transition={{delay:.45}}>
        <g transform="translate(292 169)">{Array.from({length:3},(_,i)=><rect key={i} x={i*8} y={18-i*7} width="74" height="22" rx="4" fill="#fff7ed" stroke={GOLD} strokeWidth="1.5"/>)}<text x="53" y="52" textAnchor="middle" fontSize="12" fontWeight="950" fill={GOLD} fontFamily={FONT}>+ {extras[day]} pages</text></g>
      </motion.g>
      <motion.path d="M 230 177 V 221" stroke={INDIGO} strokeWidth="3" initial={{pathLength:0}} animate={{pathLength:1}} transition={{delay:.3}}/>
      <motion.g initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.6}}><rect x="78" y="224" width="304" height="62" rx="14" fill="#eef2ff" stroke={INDIGO} strokeWidth="2.5"/><text x="230" y="246" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>AFTER DAY {day+1}</text><text x="230" y="274" textAnchor="middle" fontSize="23" fontWeight="950" fill={INDIGO} fontFamily={FONT}>{fmt(states[day+1])}</text></motion.g>
      <text x="230" y="311" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>first keep {(den[day]-1)}/{den[day]} of the current expression, then subtract {extras[day]}</text>
    </>}

    {final&&<>
      <g transform="translate(62 47)"><rect width="336" height="57" rx="14" fill="#eef2ff" stroke={INDIGO} strokeWidth="2.5"/><text x="168" y="22" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>AFTER DAY 3</text><text x="168" y="47" textAnchor="middle" fontSize="20" fontWeight="950" fill={INDIGO} fontFamily={FONT}>{fmt(last)} = {finalPages}</text></g>
      <motion.g initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:.2}}><rect x="90" y="129" width="280" height="42" rx="11" fill="#fef3c7" stroke={GOLD} strokeWidth="2"/><text x="230" y="156" textAnchor="middle" fontSize="18" fontWeight="950" fill={GOLD} fontFamily={FONT}>{last.n}x/{last.d} = {finalPages-last.offset}</text></motion.g>
      <motion.g initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{type:"spring",stiffness:180,damping:16,delay:.45}} style={{transformBox:"fill-box",transformOrigin:"center"}}><path d="M118 209 Q174 190 230 209 Q286 190 342 209 V267 Q286 248 230 267 Q174 248 118 267 Z" fill="#dcfce7" stroke={GREEN} strokeWidth="2.5"/><line x1="230" y1="209" x2="230" y2="267" stroke={GREEN} strokeWidth="2"/><text x="230" y="233" textAnchor="middle" fontSize="12" fontWeight="900" fill={DIM}>WHOLE BOOK</text><text x="230" y="258" textAnchor="middle" fontSize="23" fontWeight="950" fill={ok?GREEN:RED} fontFamily={FONT}>x = {answer} pages</text></motion.g>
      <SvgAnswerBadge show={ok} answer={problem.answer} cx={410} y={292} width={72}/>{!ok&&<text x="230" y="326" textAnchor="middle" fontSize="9" fill={RED}>{fail}</text>}
    </>}
  </svg></div>;
}
