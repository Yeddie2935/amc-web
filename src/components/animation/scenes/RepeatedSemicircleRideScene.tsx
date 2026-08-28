import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", ORANGE = "#d97706", RED = "#dc2626", DIM = "#64748b";

/** Unroll equal semicircle arcs across a straight highway, then ride the resulting distance. */
export function RepeatedSemicircleRideScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const highwayMiles = num(data.highwayMiles, 0);
  const widthFeet = num(data.highwayWidthFeet, 0);
  const feetPerMile = num(data.feetPerMile, 0);
  const speed = num(data.speedMph, 0);
  const roadFeet = highwayMiles * feetPerMile;
  const arcCount = roadFeet / widthFeet;
  const oneArcPiFeet = widthFeet / 2;
  const pathPiFeet = arcCount * oneArcPiFeet;
  const pathPiMiles = pathPiFeet / feetPerMile;
  const timePiHours = pathPiMiles / speed;
  const den = Math.round(1 / timePiHours);
  const timeText = den === 1 ? "π" : `π/${den}`;
  const stored = String(problem.shortAnswer ?? "").replace(/\s/g, "");
  const choice = (problem.choices ?? []).find((item) => item.text.replace(/\s/g, "") === timeText)?.label;
  const ok = Number.isInteger(arcCount) && Math.abs(pathPiMiles - highwayMiles / 2) < 1e-9 && stored === timeText && choice === problem.answer;
  const failure = !Number.isInteger(arcCount) ? `${arcCount} semicircles is not whole` : Math.abs(pathPiMiles - highwayMiles / 2) >= 1e-9 ? `path coefficient is ${pathPiMiles}` : `computed ${timeText}, stored ${problem.shortAnswer}`;
  const phase = step >= totalSteps - 1 ? 3 : Math.min(step, 2);
  const captions = [
    `one semicircle spans the ${widthFeet}-foot highway`,
    `${roadFeet} feet splits into ${arcCount} equal diameters`,
    `unroll all ${arcCount} curved pieces into one route`,
    `ride the curved distance at ${speed} miles per hour`,
  ];
  const arc = (x: number, y: number, w: number, up: boolean) => `M ${x} ${y} A ${w / 2} ${w / 2} 0 0 ${up ? 1 : 0} ${x + w} ${y}`;

  const Bike = ({ x, y }: { x: number; y: number }) => <g transform={`translate(${x} ${y})`}><circle cx="-10" cy="8" r="7" fill="#fff" stroke={ORANGE} strokeWidth="2"/><circle cx="10" cy="8" r="7" fill="#fff" stroke={ORANGE} strokeWidth="2"/><path d="M-10 8 L-2 -3 L6 8 L-5 8 L2 -9 M2 -9 L10 -9" fill="none" stroke={ORANGE} strokeWidth="2"/><circle cx="2" cy="-15" r="4" fill={ORANGE}/></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ maxWidth: 480, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{captions[phase]}</text>

      {phase === 0 && <>
        <motion.path d={arc(100, 153, 260, true)} fill="none" stroke={IND} strokeWidth="5" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
        <line x1="100" y1="168" x2="360" y2="168" stroke={INK} strokeWidth="1.8" markerStart="url(#arr)" markerEnd="url(#arr)" />
        <text x="230" y="187" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>diameter = {widthFeet} ft</text>
        <g transform="translate(91 221)"><rect width="278" height="55" rx="11" fill="#eef2ff" stroke={IND}/><text x="139" y="21" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>semicircle = half a circumference</text><text x="139" y="43" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>½ · π · {widthFeet} = {oneArcPiFeet}π ft</text></g>
      </>}

      {phase === 1 && <>
        <line x1="48" y1="104" x2="412" y2="104" stroke={INK} strokeWidth="2" />
        {Array.from({ length: Math.round(arcCount) }, (_, i) => <motion.rect key={i} x={48 + i * 364 / arcCount} y="96" width={Math.max(1.2, 364 / arcCount - 0.35)} height="16" rx="0.6" fill={i % 2 ? "#c7d2fe" : "#ddd6fe"} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.008, 0.65) }} />)}
        <text x="48" y="128" fontSize="9" fontWeight="850" fill={DIM}>start</text><text x="412" y="128" textAnchor="end" fontSize="9" fontWeight="850" fill={DIM}>1 mile</text>
        <g transform="translate(73 150)"><rect width="314" height="59" rx="11" fill="#eef2ff" stroke={IND}/><text x="157" y="23" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{roadFeet} ÷ {widthFeet} = {arcCount}</text><text x="157" y="45" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={INK}>one tile per {widthFeet}-ft diameter → {arcCount} semicircles</text></g>
        <g transform="translate(119 239)">{Array.from({ length: 6 }, (_, i) => <motion.path key={i} d={arc(i * 37, 16, 37, i % 2 === 0)} fill="none" stroke={i % 2 ? "#7c3aed" : IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.1 }} />)}<text x="111" y="48" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>alternating arcs (compressed view)</text></g>
      </>}

      {phase === 2 && <>
        <g transform="translate(49 61)">{Array.from({ length: 8 }, (_, i) => <motion.path key={i} d={arc(i * 45.5, 27, 45.5, i % 2 === 0)} fill="none" stroke={IND} strokeWidth="3.2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.06 }} />)}<text x="182" y="62" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>the same arc repeated {arcCount} times</text></g>
        <motion.path d="M78 139 V166 M230 139 V166 M382 139 V166" stroke={ORANGE} strokeWidth="2.5" markerEnd="url(#down)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
        <motion.line x1="64" y1="186" x2="396" y2="186" stroke={IND} strokeWidth="7" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1, delay: 0.2 }} />
        <text x="230" y="207" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>all arcs straightened—length preserved</text>
        <g transform="translate(73 224)"><rect width="314" height="61" rx="11" fill="#eef2ff" stroke={IND}/><text x="157" y="22" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{arcCount} × {oneArcPiFeet}π = {pathPiFeet}π ft</text><text x="157" y="45" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{pathPiFeet}π ÷ {feetPerMile} = π/2 mile</text></g>
      </>}

      {phase === 3 && <>
        <line x1="58" y1="116" x2="402" y2="116" stroke="#c7d2fe" strokeWidth="8" strokeLinecap="round" />
        {Array.from({ length: 7 }, (_, i) => <line key={i} x1={58 + i * 344 / 6} y1="108" x2={58 + i * 344 / 6} y2="124" stroke={IND} strokeWidth="1.4" />)}
        <text x="230" y="93" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>distance = π/2 mile</text>
        <motion.g initial={{ x: 58 }} animate={{ x: 402 }} transition={{ duration: 1.5, ease: "easeInOut" }}><Bike x={0} y={104}/></motion.g>
        <g transform="translate(92 174)"><rect width="276" height="71" rx="13" fill={ok ? "#dcfce7" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="138" y="20" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>time = distance ÷ speed</text><text x="138" y="44" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>(π/2) ÷ {speed} = π/(2·{speed})</text><text x="138" y="64" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {timeText} hour</text></g>
        <text x="230" y="270" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "count, conversion, time, and choice verified" : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={230} y={278} width={82}/>
      </>}
      <defs><marker id="arr" markerWidth="7" markerHeight="7" refX="3" refY="3" orient="auto"><path d="M6 0 L0 3 L6 6" fill="none" stroke={INK}/></marker><marker id="down" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 Z" fill={ORANGE}/></marker></defs>
      <AnimatePresence>{phase === 3 && !ok && <motion.text x="230" y="306" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
