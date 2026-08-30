import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",TEAL="#0d9488",GREEN="#16a34a",RED="#dc2626",GOLD="#d97706",DIM="#94a3b8";
const COLORS=["#818cf8","#2dd4bf","#fbbf24"];

type BoxInfo={name:string;amount:number;price:number;color:string};

/** Propagate linked amount/price percentages across three detergent boxes,
 * then normalize each price to dollars per ounce and reorder best-to-worst. */
export function DetergentUnitPriceRankScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem);
  const smallPrice=num(data.smallPrice,0),smallAmount=num(data.smallAmount,0);
  const mediumPriceFactor=num(data.mediumPriceFactor,0),largeAmountFactor=num(data.largeAmountFactor,0);
  const mediumOfLarge=num(data.mediumAmountFractionOfLarge,0),largePriceFactor=num(data.largePriceFactorOfMedium,0);
  const mediumPrice=smallPrice*mediumPriceFactor,largeAmount=smallAmount*largeAmountFactor;
  const mediumAmount=largeAmount*mediumOfLarge,largePrice=mediumPrice*largePriceFactor;
  const boxes:BoxInfo[]=[{name:"S",amount:smallAmount,price:smallPrice,color:COLORS[0]},{name:"M",amount:mediumAmount,price:mediumPrice,color:COLORS[1]},{name:"L",amount:largeAmount,price:largePrice,color:COLORS[2]}];
  const ranked=[...boxes].sort((a,b)=>a.price/a.amount-b.price/b.amount);
  const ranking=ranked.map(b=>b.name).join("");
  const choice=problem.choices?.find(item=>item.text===ranking)?.label;
  const valid=smallPrice===1&&smallAmount===5&&mediumPriceFactor===1.5&&largeAmountFactor===2&&mediumOfLarge===.8&&largePriceFactor===1.3&&ranking===problem.shortAnswer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);

  const detergentBox=(box:BoxInfo,x:number,index:number,showDetails:boolean)=>{
    const maxAmount=Math.max(...boxes.map(b=>b.amount)),h=118,w=88,y=52,fillH=h*box.amount/maxAmount;
    return <motion.g key={box.name} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}} transition={{delay:index*.14,type:"spring"}}>
      <path d={`M${x+10} ${y}H${x+w-10}L${x+w} ${y+18}V${y+h}H${x}V${y+18}Z`} fill="#f8fafc" stroke={box.color} strokeWidth="2.4"/>
      <path d={`M${x+2} ${y+h-fillH}H${x+w-2}V${y+h-2}H${x+2}Z`} fill={box.color} fillOpacity=".45"/>
      <rect x={x+10} y={y+10} width={w-20} height="31" rx="7" fill={box.color}/><text x={x+w/2} y={y+32} textAnchor="middle" fontSize="20" fontWeight="950" fill="#fff">{box.name}</text>
      <text x={x+w/2} y={y+76} textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{box.amount} oz</text>
      {showDetails&&<g><rect x={x+13} y={y+h+8} width={w-26} height="25" rx="12" fill="#fff7ed" stroke="#fed7aa"/><text x={x+w/2} y={y+h+25} textAnchor="middle" fontSize="13" fontWeight="900" fill={GOLD} fontFamily={FONT}>${box.price.toFixed(2)}</text></g>}
    </motion.g>;
  };

  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:7,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 285" width="100%" style={{maxWidth:500,display:"block"}} aria-label="Three detergent boxes compared by ounces, prices, and cost per ounce">
      <text x="235" y="16" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase===0?"choose a convenient small-box baseline":phase===1?"propagate every amount and price link":"normalize all three to dollars per ounce"}</text>

      {phase===0&&<>
        {detergentBox(boxes[0],64,0,true)}{detergentBox(boxes[2],278,1,false)}
        <motion.path d="M166 111 C210 75 247 75 278 111" fill="none" stroke={IND} strokeWidth="2.5" markerEnd="url(#detergent-arrow)" initial={{pathLength:0}} animate={{pathLength:1}}/>
        <defs><marker id="detergent-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={IND}/></marker></defs>
        <text x="220" y="73" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>× {largeAmountFactor}</text>
        <g transform="translate(163 199)"><rect width="144" height="56" rx="13" fill="#eef2ff" stroke="#c7d2fe"/><text x="72" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>LARGE AMOUNT</text><text x="72" y="43" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{smallAmount} × {largeAmountFactor} = {largeAmount} oz</text></g>
      </>}

      {phase===1&&<>
        {boxes.map((b,i)=>detergentBox(b,40+i*135,i,true))}
        <g transform="translate(24 235)"><rect width="422" height="39" rx="12" fill="#f8fafc" stroke="#cbd5e1"/><text x="211" y="16" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>LINKED CALCULATIONS</text><text x="211" y="32" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>M: {largeAmount}×{mediumOfLarge}={mediumAmount} oz, ${smallPrice}×{mediumPriceFactor}=${mediumPrice.toFixed(2)}   ·   L: ${mediumPrice.toFixed(2)}×{largePriceFactor}=${largePrice.toFixed(2)}</text></g>
      </>}

      {phase===2&&<>
        {ranked.map((b,i)=>{const x=30+i*148,unit=b.price/b.amount,bar=unit*400;return <motion.g key={b.name} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:i*.16,type:"spring"}}>
          <rect x={x} y="54" width="116" height="171" rx="15" fill={i===0?"#f0fdf4":"#f8fafc"} stroke={i===0?GREEN:"#cbd5e1"} strokeWidth={i===0?"2.5":"1.5"}/>
          <circle cx={x+58} cy="82" r="20" fill={i===0?GREEN:b.color}/><text x={x+58} y="88" textAnchor="middle" fontSize="20" fontWeight="950" fill="#fff">{b.name}</text>
          <text x={x+58} y="118" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>{i===0?"BEST BUY":i===1?"SECOND":"THIRD"}</text>
          <text x={x+58} y="143" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>${b.price.toFixed(2)} ÷ {b.amount}</text>
          <text x={x+58} y="168" textAnchor="middle" fontSize="17" fontWeight="950" fill={i===0?GREEN:IND} fontFamily={FONT}>${unit.toFixed(4)}</text><text x={x+58} y="184" textAnchor="middle" fontSize="9.5" fontWeight="800" fill={DIM}>per ounce</text>
          <rect x={x+15} y="199" width="86" height="9" rx="4.5" fill="#e2e8f0"/><motion.rect x={x+15} y="199" width={Math.min(86,bar)} height="9" rx="4.5" fill={i===0?GREEN:b.color} initial={{width:0}} animate={{width:Math.min(86,bar)}} transition={{delay:.35+i*.12}}/>
        </motion.g>})}
        <motion.text x="235" y="253" textAnchor="middle" fontSize="22" fontWeight="950" fill={valid?GREEN:RED} fontFamily={FONT} initial={{scale:.5,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.5,type:"spring"}}>{ranking}</motion.text>
        <motion.g initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}} transition={{delay:.8,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="189" y="259" width="92" height="25" rx="13" fill={valid?GREEN:RED}/><text x="235" y="276" textAnchor="middle" fontSize="12.5" fontWeight="900" fill="#fff">{valid?`Answer ${problem.answer}`:"check failed"}</text></motion.g>
      </>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(valid?"#166534":RED):IND,background:final?(valid?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`set S to $${smallPrice.toFixed(2)} and ${smallAmount} oz; L holds ${largeAmount} oz`:phase===1?`S $${smallPrice.toFixed(2)}/${smallAmount} oz · M $${mediumPrice.toFixed(2)}/${mediumAmount} oz · L $${largePrice.toFixed(2)}/${largeAmount} oz`:valid?`lower cost per ounce is better: ${ranking}`:`rates, stored answer, or choice check failed`}</motion.span>
  </div>;
}
