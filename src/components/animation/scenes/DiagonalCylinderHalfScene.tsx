import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Rotate a center-diagonal cylinder wedge onto its complement, proving equal volumes. */
export function DiagonalCylinderHalfScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const diameter = num(data.diameterCm, 0), length = num(data.lengthCm, 0);
  const radius = diameter / 2, cylinderCoeff = radius * radius * length, wedgeCoeff = cylinderCoeff / 2;
  const approximate = wedgeCoeff * Math.PI;
  const closest = problem.choices?.map(c => ({ ...c, gap: Math.abs(Number(c.text) - approximate) })).sort((a, b) => a.gap - b.gap)[0];
  const ok = radius === 4 && cylinderCoeff === 96 && wedgeCoeff === 48 && closest?.label === problem.answer && closest?.text === problem.shortAnswer;
  const failure = radius !== 4 ? `radius is ${radius}` : cylinderCoeff !== 96 ? `cylinder coefficient is ${cylinderCoeff}` : wedgeCoeff !== 48 ? `half coefficient is ${wedgeCoeff}` : `closest choice is ${closest?.label ?? "missing"} (${closest?.text ?? "missing"})`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const Cylinder = ({ x = 48, y = 67, small = false }: { x?: number; y?: number; small?: boolean }) => {
    const sx = small ? .7 : 1, w = 248 * sx, h = 145 * sx, ew = 72 * sx;
    return <g transform={`translate(${x} ${y})`}>
      <path d={`M${ew/2} 0 H${w} A${ew/2} ${h/2} 0 0 1 ${w} ${h} H${ew/2} A${ew/2} ${h/2} 0 0 1 ${ew/2} 0Z`} fill="#f8fafc" stroke={INK} strokeWidth="2"/>
      <ellipse cx={ew/2} cy={h/2} rx={ew/2} ry={h/2} fill="#fff" stroke={INK} strokeWidth="2"/>
      <path d={`M${ew/2} ${h} C${ew/2+20*sx} ${h*.45},${w-24*sx} ${h*.18},${w} 0`} fill="none" stroke={IND} strokeWidth="2.5" strokeDasharray="9 7"/>
      <path d={`M${ew/2} ${h} C${ew/2+52*sx} ${h*.86},${w-9*sx} ${h*.63},${w} 0`} fill="none" stroke={IND} strokeWidth="2.5" strokeDasharray="9 7"/>
    </g>;
  };

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 500, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 480 330" width="100%" style={{ maxWidth: "100%", display: "block" }} aria-label="A diagonal wedge cut from a cylinder and rotated onto its equal-volume complement">
      <defs><marker id="arrow-cylinder-half" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill={IND}/></marker></defs>
      <text x="240" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "read the cylinder dimensions from the source figure" : phase === 1 ? "build the whole cylinder volume before cutting it" : phase === 2 ? "a 180° center-turn swaps the wedge with its complement" : "take half of the cylinder and compare with the choices"}</text>

      {phase === 0 && <g>
        <Cylinder/>
        <line x1="83" y1="50" x2="331" y2="50" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrow-cylinder-half)"/><line x1="331" y1="50" x2="83" y2="50" stroke={TEAL} strokeWidth="2" markerEnd="url(#arrow-cylinder-half)"/><text x="207" y="43" textAnchor="middle" fontSize="14" fontWeight="900" fill={TEAL} fontFamily={FONT}>{length} cm</text>
        <line x1="30" y1="68" x2="30" y2="212" stroke={IND} strokeWidth="2" markerEnd="url(#arrow-cylinder-half)"/><line x1="30" y1="212" x2="30" y2="68" stroke={IND} strokeWidth="2" markerEnd="url(#arrow-cylinder-half)"/><text x="21" y="144" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} transform="rotate(-90 21 144)">{diameter} cm diameter</text>
        <g transform="translate(351 82)"><rect width="105" height="111" rx="12" fill="#eef2ff" stroke={IND}/><text x="52.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>RADIUS</text><text x="52.5" y="57" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{diameter} ÷ 2</text><text x="52.5" y="91" textAnchor="middle" fontSize="24" fontWeight="950" fill={IND} fontFamily={FONT}>= {radius}</text></g>
        <text x="240" y="286" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>the dashed curve marks Jerry's diagonal cut</text>
      </g>}

      {phase === 1 && <g>
        <g transform="translate(27 54)"><ellipse cx="91" cy="82" rx="70" ry="82" fill="#eef2ff" stroke={IND} strokeWidth="2"/><line x1="91" y1="82" x2="161" y2="82" stroke={IND} strokeWidth="3"/><circle cx="91" cy="82" r="4" fill={INK}/><text x="126" y="74" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>r = {radius}</text><text x="91" y="188" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>circular end</text></g>
        <motion.path d="M193 136 H232" stroke={INK} strokeWidth="2.5" markerEnd="url(#arrow-cylinder-half)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/>
        <g transform="translate(242 70)"><rect width="202" height="142" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><text x="101" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>WHOLE CYLINDER</text><text x="101" y="59" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>V = πr²h</text><text x="101" y="91" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>= π·{radius}²·{length}</text><motion.text x="101" y="124" textAnchor="middle" fontSize="24" fontWeight="950" fill={IND} fontFamily={FONT} initial={{ scale: .55 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>= {cylinderCoeff}π</motion.text></g>
        <text x="240" y="276" textAnchor="middle" fontSize="11" fontWeight="850" fill={TEAL}>the cut has not changed the cylinder's total volume</text>
      </g>}

      {phase === 2 && <g>
        <g transform="translate(77 51)"><rect width="326" height="178" rx="14" fill="#f8fafc" stroke="#cbd5e1"/><polygon points="0,178 326,0 326,178" fill="#bfdbfe" stroke={IND} strokeWidth="2"/><polygon points="0,0 326,0 0,178" fill="#fde68a" stroke={AMBER} strokeWidth="2"/><circle cx="163" cy="89" r="6" fill={INK}/><text x="163" y="80" textAnchor="middle" fontSize="10" fontWeight="900" fill={INK}>center</text><motion.path d="M119 114 A57 57 0 1 1 207 62" fill="none" stroke={GREEN} strokeWidth="3" markerEnd="url(#arrow-cylinder-half)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/><text x="91" y="43" textAnchor="middle" fontSize="14" fontWeight="900" fill={AMBER}>wedge</text><text x="246" y="147" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND}>rotated copy</text></g>
        <g transform="translate(111 251)"><rect width="258" height="45" rx="11" fill="#dcfce7" stroke={GREEN} strokeWidth="2"/><text x="129" y="18" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TWO CONGRUENT PIECES FILL THE CYLINDER</text><text x="129" y="36" textAnchor="middle" fontSize="15" fontWeight="900" fill={GREEN} fontFamily={FONT}>2 · Vwedge = {cylinderCoeff}π</text></g>
      </g>}

      {phase === 3 && <g>
        <Cylinder x={26} y={54} small/>
        <g transform="translate(257 53)"><rect width="195" height="158" rx="14" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="97.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>WEDGE VOLUME</text><text x="97.5" y="59" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{cylinderCoeff}π ÷ 2 = {wedgeCoeff}π</text><text x="97.5" y="91" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{wedgeCoeff}π ≈ {approximate.toFixed(1)}</text><motion.text x="97.5" y="130" textAnchor="middle" fontSize="24" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .55 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>closest: {closest?.text}</motion.text></g>
        <g transform="translate(60 244)">{problem.choices?.map((choice, i) => <g key={choice.label} transform={`translate(${i * 79} 0)`}><rect width="65" height="35" rx="9" fill={choice.label === closest?.label ? "#dcfce7" : "#f8fafc"} stroke={choice.label === closest?.label ? GREEN : "#cbd5e1"} strokeWidth={choice.label === closest?.label ? 2 : 1}/><text x="32.5" y="22" textAnchor="middle" fontSize="11" fontWeight="900" fill={choice.label === closest?.label ? GREEN : DIM} fontFamily={FONT}>{choice.label}: {choice.text}</text></g>)}</g>
        <text x="190" y="307" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? "dimensions, symmetry, volume, and closest choice verified" : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={424} y={288} width={78}/>
      </g>}
    </svg>
  </div>;
}
