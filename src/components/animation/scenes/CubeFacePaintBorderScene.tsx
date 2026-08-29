import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT="ui-monospace, SFMono-Regular, Menlo, monospace";
const INK="#1f2a44",IND="#4338ca",GREEN="#16a34a",TEAL="#0d9488",DIM="#94a3b8",RED="#dc2626";

/** Unfold six equal cube faces, distribute the paint equally, then zoom one
 * face and reveal the centered white square as face area minus green border. */
export function CubeFacePaintBorderScene({problem,step,totalSteps}:AnimatedSceneProps){
  const data=sceneData(problem),edge=num(data.edgeLength,0),paint=num(data.paintArea,0),faces=Math.round(num(data.faceCount,0));
  const greenPerFace=paint/faces,faceArea=edge*edge,whiteArea=faceArea-greenPerFace,whiteSide=Math.sqrt(whiteArea);
  const answer=Number(problem.shortAnswer),choice=problem.choices?.find(c=>Number(c.text)===whiteArea)?.label;
  const ok=edge>0&&faces===6&&paint>0&&greenPerFace<faceArea&&whiteArea===answer&&choice===problem.answer;
  const final=step>=totalSteps-1,phase=final?2:Math.min(step,1);
  const net=[[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]],cell=62,nx=111,ny=44;
  const FX=130,FY=35,FS=210,inner=FS*whiteSide/edge,gap=(FS-inner)/2;
  return <div style={{width:"100%",display:"flex",flexDirection:"column",alignItems:"center",gap:6,padding:"5px 2px",boxSizing:"border-box"}}>
    <svg viewBox="0 0 470 315" width="100%" style={{maxWidth:500,display:"block"}} aria-label="A cube net distributing green paint and one face with a centered white square">
      {phase===0&&<g>
        <text x="235" y="23" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>unfold the cube: all {faces} faces are congruent</text>
        {net.map(([c,r],i)=>{const x=nx+c*cell,y=ny+r*cell;return <motion.g key={i} initial={{opacity:0,scale:.55}} animate={{opacity:1,scale:1}} transition={{delay:i*.12,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x={x} y={y} width={cell} height={cell} fill="#ecfdf5" stroke={TEAL} strokeWidth="2"/><path d={`M${x+8} ${y+13}Q${x+15} ${y+2} ${x+22} ${y+13}Q${x+15} ${y+25} ${x+8} ${y+13}Z`} fill={GREEN}/><text x={x+35} y={y+38} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{greenPerFace}</text></motion.g>})}
        <g transform="translate(22 87)"><rect width="77" height="91" rx="13" fill="#eef2ff" stroke="#c7d2fe"/><text x="38.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>GREEN PAINT</text><text x="38.5" y="56" textAnchor="middle" fontSize="21" fontWeight="900" fill={IND} fontFamily={FONT}>{paint}</text><text x="38.5" y="74" textAnchor="middle" fontSize="9" fontWeight="800" fill={DIM}>square feet</text></g>
        <motion.text x="235" y="276" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.8,type:"spring"}}>{paint} ÷ {faces} = {greenPerFace}</motion.text><text x="235" y="299" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={DIM}>green square feet on each face</text>
      </g>}
      {phase>=1&&<g>
        <rect x={FX} y={FY} width={FS} height={FS} fill={phase===2?GREEN:"#f8fafc"} stroke={INK} strokeWidth="2.8"/>
        {phase===1&&Array.from({length:9},(_,i)=><g key={i} opacity=".25"><line x1={FX+(i+1)*FS/10} y1={FY} x2={FX+(i+1)*FS/10} y2={FY+FS} stroke={DIM}/><line x1={FX} y1={FY+(i+1)*FS/10} x2={FX+FS} y2={FY+(i+1)*FS/10} stroke={DIM}/></g>)}
        <line x1={FX} y1={FY+FS+12} x2={FX+FS} y2={FY+FS+12} stroke={DIM}/><text x={FX+FS/2} y={FY+FS+29} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{edge} ft</text><line x1={FX-12} y1={FY} x2={FX-12} y2={FY+FS} stroke={DIM}/><text x={FX-21} y={FY+FS/2+4} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT} transform={`rotate(-90 ${FX-21} ${FY+FS/2+4})`}>{edge} ft</text>
        {phase===1&&<g><rect x="349" y="85" width="105" height="112" rx="13" fill="#eef2ff" stroke="#c7d2fe"/><text x="401.5" y="112" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>ONE FACE</text><text x="401.5" y="146" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{edge} × {edge}</text><motion.text x="401.5" y="178" textAnchor="middle" fontSize="23" fontWeight="900" fill={IND} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.6,type:"spring"}}>= {faceArea}</motion.text></g>}
        {phase===2&&<g>
          <motion.rect x={FX+gap} y={FY+gap} width={inner} height={inner} fill="#fff" stroke={INK} strokeWidth="2.4" initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",stiffness:150,damping:16}} style={{transformBox:"fill-box",transformOrigin:"center"}}/>
          <text x={FX+FS/2} y={FY+FS/2-7} textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>WHITE SQUARE</text><motion.text x={FX+FS/2} y={FY+FS/2+23} textAnchor="middle" fontSize="24" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT} initial={{opacity:0,scale:.5}} animate={{opacity:1,scale:1}} transition={{delay:.55,type:"spring"}}>area {whiteArea}</motion.text>
          <g transform="translate(349 71)"><rect width="107" height="145" rx="13" fill={ok?"#f0fdf4":"#fef2f2"} stroke={ok?GREEN:RED}/><text x="53.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={INK}>FACE AREA</text><text x="53.5" y="54" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>{faceArea}</text><text x="53.5" y="82" textAnchor="middle" fontSize="10" fontWeight="850" fill={TEAL}>− GREEN</text><text x="53.5" y="105" textAnchor="middle" fontSize="17" fontWeight="900" fill={TEAL} fontFamily={FONT}>{greenPerFace}</text><line x1="20" y1="114" x2="87" y2="114" stroke={DIM}/><text x="53.5" y="137" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok?GREEN:RED} fontFamily={FONT}>= {whiteArea}</text></g>
          <motion.g initial={{opacity:0,scale:0}} animate={{opacity:1,scale:1}} transition={{delay:.95,type:"spring"}} style={{transformBox:"fill-box",transformOrigin:"center"}}><rect x="356" y="244" width="92" height="27" rx="14" fill={ok?GREEN:RED}/><text x="402" y="262" textAnchor="middle" fontSize="13" fontWeight="900" fill="#fff">Answer {ok?problem.answer:"failed"}</text></motion.g>
        </g>}
      </g>}
    </svg>
    <motion.span key={phase} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} style={{fontFamily:FONT,fontSize:12,fontWeight:850,color:final?(ok?"#166534":RED):IND,background:final?(ok?"#dcfce7":"#fee2e2"):"#eef2ff",borderRadius:999,padding:"4px 12px",textAlign:"center",maxWidth:"calc(100% - 16px)"}}>{phase===0?`${paint} ft² spreads evenly: ${greenPerFace} ft² per face`:phase===1?`each face has area ${edge} × ${edge} = ${faceArea} ft²`:ok?`${faceArea} − ${greenPerFace} = ${whiteArea} square feet of white remains`:"paint, face area, stored answer, or choice check failed"}</motion.span>
  </div>;
}
