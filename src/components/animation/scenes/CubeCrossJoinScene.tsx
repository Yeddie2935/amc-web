import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", AMBER = "#d97706", DIM = "#64748b";
type Point = [number, number];
const points = (value: Point[]) => value.map(([x, y]) => `${x},${y}`).join(" ");

function IsoCube({ x, y, size = 28, label, color = IND, delay = 0 }: { x: number; y: number; size?: number; label?: string; color?: string; delay?: number }) {
  const h = size * .58;
  return <motion.g initial={{ opacity: 0, scale: .55 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay, type: "spring", stiffness: 180, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <polygon points={points([[x,y],[x+size,y-h],[x+2*size,y],[x+size,y+h]])} fill="#c7d2fe" stroke={color} strokeWidth="1.6" />
    <polygon points={points([[x,y],[x+size,y+h],[x+size,y+h+size],[x,y+size]])} fill="#a5b4fc" stroke={color} strokeWidth="1.6" />
    <polygon points={points([[x+size,y+h],[x+2*size,y],[x+2*size,y+size],[x+size,y+h+size]])} fill="#818cf8" stroke={color} strokeWidth="1.6" />
    {label && <text x={x+size} y={y+h+size*.55} textAnchor="middle" fontSize="11" fontWeight="950" fill="#fff" fontFamily={FONT}>{label}</text>}
  </motion.g>;
}

export function CubeCrossJoinScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const cubes = Math.round(num(data.cubeCount, 0));
  const facesPerCube = Math.round(num(data.facesPerCube, 0));
  const joins = Math.round(num(data.centerJoins, 0));
  const unitVolume = num(data.unitVolume, 0);
  const volume = cubes * unitVolume;
  const separateFaces = cubes * facesPerCube;
  const hiddenFaces = joins * 2;
  const surface = separateFaces - hiddenFaces;
  const answer = `${volume} : ${surface}`;
  const normalize = (s: string) => s.replace(/\s/g, "");
  const choice = problem.choices?.find((c) => normalize(c.text) === normalize(answer))?.label;
  const ok = cubes === 7 && facesPerCube === 6 && joins === 6 && unitVolume === 1 && surface === 30 && normalize(problem.shortAnswer ?? "") === normalize(answer) && choice === problem.answer;
  const failure = cubes !== 7 ? `cube count is ${cubes}` : joins !== 6 ? `join count is ${joins}` : surface !== 30 ? `surface area is ${surface}` : normalize(problem.shortAnswer ?? "") !== normalize(answer) ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const cluster: Array<[number, number, string]> = [[204,118,"C"],[204,62,"1"],[204,174,"2"],[146,147,"3"],[262,89,"4"],[262,147,"5"],[146,89,"6"]];

  return <div style={{ width: "100%", display: "flex", justifyContent: "center", minWidth: 0, padding: "5px 2px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, display: "block" }} aria-label="Seven unit cubes join around one center cube while hidden faces are subtracted">
      <text x="235" y="19" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "one center cube has a neighbor on each of its six faces" : phase === 1 ? "pull the cubes apart: every unit cube starts with six faces" : phase === 2 ? "snap each neighbor back: every join hides a pair of faces" : "compare the seven cubic units with thirty exposed squares"}</text>

      {phase === 0 && <g>
        {cluster.map(([x,y,label],i) => <IsoCube key={label} x={x} y={y} label={label} color={label === "C" ? AMBER : IND} delay={i*.08} />)}
        <g transform="translate(28 74)"><rect width="102" height="126" rx="13" fill="#fff7ed" stroke="#fdba74"/><text x="51" y="24" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={DIM}>INVENTORY</text><text x="51" y="56" textAnchor="middle" fontSize="23" fontWeight="950" fill={AMBER} fontFamily={FONT}>1 center</text><text x="51" y="83" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>+ 6 outside</text><line x1="18" y1="94" x2="84" y2="94" stroke="#fdba74"/><text x="51" y="116" textAnchor="middle" fontSize="18" fontWeight="950" fill={INK} fontFamily={FONT}>= {cubes} cubes</text></g>
        <motion.g initial={{ scale: .7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: .7, type: "spring" }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="126" y="261" width="218" height="38" rx="12" fill="#eef2ff" stroke="#c7d2fe"/><text x="235" y="286" textAnchor="middle" fontSize="18" fontWeight="950" fill={IND} fontFamily={FONT}>volume = {cubes} × {unitVolume} = {volume}</text></motion.g>
      </g>}

      {phase === 1 && <g>
        {Array.from({ length: cubes }, (_, i) => <g key={i}><IsoCube x={18+i*64} y={67+(i%2)*9} size={23} label={String(i+1)} delay={i*.07}/><text x={41+i*64} y="145" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>6</text></g>)}
        <motion.path d="M42 165 H428" stroke="#c7d2fe" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/>
        <g transform="translate(91 190)"><rect width="288" height="77" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="144" y="27" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>BEFORE ANY CUBES TOUCH</text><text x="144" y="57" textAnchor="middle" fontSize="23" fontWeight="950" fill={IND} fontFamily={FONT}>{cubes} × {facesPerCube} = {separateFaces} faces</text></g>
        <text x="235" y="294" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>these include faces that will become hidden inside the shape</text>
      </g>}

      {phase === 2 && <g>
        <circle cx="235" cy="143" r="37" fill="#fff7ed" stroke={AMBER} strokeWidth="2.5"/><text x="235" y="137" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CENTER</text><text x="235" y="158" textAnchor="middle" fontSize="18" fontWeight="950" fill={AMBER}>CUBE</text>
        {[[-1,0],[1,0],[0,-1],[0,1],[-.72,-.72],[.72,.72]].map(([dx,dy],i) => { const x=235+dx*105,y=143+dy*89; return <g key={i}><motion.line x1={235+dx*40} y1={143+dy*40} x2={x-dx*21} y2={y-dy*21} stroke={RED} strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i*.1 }}/><circle cx={x} cy={y} r="24" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x={x} y={y+5} textAnchor="middle" fontSize="13" fontWeight="950" fill={IND} fontFamily={FONT}>{i+1}</text></g>; })}
        <g transform="translate(96 250)"><rect width="278" height="50" rx="13" fill="#fef2f2" stroke="#fca5a5"/><text x="139" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SIX JOINS · TWO HIDDEN FACES EACH</text><text x="139" y="41" textAnchor="middle" fontSize="18" fontWeight="950" fill={RED} fontFamily={FONT}>{separateFaces} − {joins} × 2 = {surface}</text></g>
      </g>}

      {phase === 3 && <g>
        <g transform="translate(44 57)"><rect width="164" height="91" rx="14" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="82" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>VOLUME</text><text x="82" y="58" textAnchor="middle" fontSize="27" fontWeight="950" fill={IND} fontFamily={FONT}>{volume}</text><text x="82" y="77" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>cubic units</text></g>
        <g transform="translate(262 57)"><rect width="164" height="91" rx="14" fill="#ecfdf5" stroke={GREEN} strokeWidth="2"/><text x="82" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SURFACE AREA</text><text x="82" y="58" textAnchor="middle" fontSize="27" fontWeight="950" fill={GREEN} fontFamily={FONT}>{surface}</text><text x="82" y="77" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>square units</text></g>
        <motion.path d="M126 162 C126 190 190 184 217 205 M344 162 C344 190 280 184 253 205" fill="none" stroke={INK} strokeWidth="2.4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/>
        <motion.g initial={{ opacity: 0, scale: .72 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", delay: .25 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="105" y="207" width="260" height="67" rx="16" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2.5"/><text x="235" y="232" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>VOLUME : SURFACE AREA</text><text x="235" y="259" textAnchor="middle" fontSize="25" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text></motion.g>
        <text x="185" y="302" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? "7 cubes, 6 joins, and choice D verified" : failure}</text><SvgAnswerBadge show={ok} answer={problem.answer} cx={416} y={282} width={78}/>
      </g>}
    </svg>
  </div>;
}
