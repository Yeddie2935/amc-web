import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
type P = { x: number; y: number };
const area = (points: P[]) => Math.abs(points.reduce((sum, p, i) => { const q = points[(i + 1) % points.length]; return sum + p.x * q.y - q.x * p.y; }, 0)) / 2;

/** Partition a square into one interior triangle and three removable corner triangles. */
export function SquareCornerTriangleComplementScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.sideLength, 0);
  const ratio = (Array.isArray(data.segmentRatio) ? data.segmentRatio : []).map(v => num(v, 0));
  const parts = ratio.reduce((a, b) => a + b, 0);
  const long = parts ? side * ratio[0] / parts : 0, short = side - long;
  const A = { x: 0, y: 0 }, B = { x: side, y: 0 }, C = { x: side, y: side }, E = { x: 0, y: side }, F = { x: 0, y: long }, D = { x: short, y: side };
  const cornerTriangles = [[A, B, F], [B, C, D], [E, F, D]];
  const cornerAreas = cornerTriangles.map(area);
  const squareArea = side * side, outside = cornerAreas.reduce((a, b) => a + b, 0), targetArea = squareArea - outside;
  const coordinateCheck = area([B, F, D]);
  const divisor = gcd(Math.round(targetArea), Math.round(squareArea)) || 1;
  const answer = `${targetArea / divisor}/${squareArea / divisor}`;
  const choice = problem.choices?.find(c => c.text === answer)?.label;
  const ok = long === 4 && short === 2 && cornerAreas.join(",") === "12,12,2" && targetArea === coordinateCheck && answer === problem.shortAnswer && choice === problem.answer;
  const failure = long !== 4 || short !== 2 ? `segments are ${long} and ${short}` : cornerAreas.join(",") !== "12,12,2" ? `corner areas are ${cornerAreas.join(",")}` : targetArea !== coordinateCheck ? `subtraction gives ${targetArea}, coordinates give ${coordinateCheck}` : answer !== problem.shortAnswer ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);
  const ox = 38, oy = 48, scale = 39;
  const X = (p: P) => ox + p.x * scale, Y = (p: P) => oy + p.y * scale;
  const poly = (points: P[]) => points.map(p => `${X(p)},${Y(p)}`).join(" ");
  const points = [["A", A, -17, -8], ["B", B, 7, -8], ["C", C, 7, 18], ["D", D, -2, 20], ["E", E, -17, 18], ["F", F, -19, 5]] as const;
  const fills = ["#fde68a", "#bae6fd", "#ddd6fe"], strokes = [AMBER, TEAL, IND];

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 500, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 480 330" width="100%" style={{ maxWidth: "100%", display: "block" }} aria-label="Square ABCE partitioned into triangle BFD and three corner right triangles">
      <text x="240" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "choose side 6 so every 2-to-1 split becomes 4 and 2" : phase === 1 ? "the three corner pieces are easy right triangles" : "peel away the corners: triangle BFD is exactly what remains"}</text>

      {Array.from({ length: 7 }, (_, i) => <g key={i}><line x1={ox + i * scale} y1={oy} x2={ox + i * scale} y2={oy + side * scale} stroke="#e2e8f0"/><line x1={ox} y1={oy + i * scale} x2={ox + side * scale} y2={oy + i * scale} stroke="#e2e8f0"/></g>)}
      <rect x={ox} y={oy} width={side * scale} height={side * scale} fill="#fff" fillOpacity=".25" stroke={INK} strokeWidth="2.4"/>

      {phase === 1 && cornerTriangles.map((triangle, i) => <motion.polygon key={i} points={poly(triangle)} fill={fills[i]} stroke={strokes[i]} strokeWidth="1.8" initial={{ scale: .7 }} animate={{ scale: 1 }} transition={{ delay: i * .16, type: "spring", stiffness: 180, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}/>) }
      <motion.polygon points={poly([B, F, D])} fill={phase === 2 ? "#dcfce7" : "#eef2ff"} fillOpacity={phase === 0 ? .45 : .72} stroke={phase === 2 ? GREEN : INK} strokeWidth={phase === 2 ? 3 : 2.3} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}/>

      {points.map(([label, point, dx, dy]) => <g key={label}><circle cx={X(point)} cy={Y(point)} r="3.5" fill={INK}/><text x={X(point) + dx} y={Y(point) + dy} fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{label}</text></g>)}

      {phase === 0 && <g>
        <line x1={ox - 10} y1={Y(A)} x2={ox - 10} y2={Y(F)} stroke={IND} strokeWidth="3"/><line x1={ox - 10} y1={Y(F)} x2={ox - 10} y2={Y(E)} stroke={TEAL} strokeWidth="3"/>
        <text x={ox - 20} y={(Y(A) + Y(F)) / 2 + 4} textAnchor="end" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>AF = {long}</text><text x={ox - 20} y={(Y(F) + Y(E)) / 2 + 4} textAnchor="end" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>FE = {short}</text>
        <line x1={X(E)} y1={Y(E) + 11} x2={X(D)} y2={Y(E) + 11} stroke={TEAL} strokeWidth="3"/><line x1={X(D)} y1={Y(E) + 11} x2={X(C)} y2={Y(E) + 11} stroke={IND} strokeWidth="3"/>
        <text x={(X(E) + X(D)) / 2} y={Y(E) + 29} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>DE = {short}</text><text x={(X(D) + X(C)) / 2} y={Y(E) + 29} textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>CD = {long}</text>
        <g transform="translate(308 76)"><rect width="148" height="109" rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="74" y="26" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>CONVENIENT SCALE</text><text x="74" y="58" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={FONT}>{ratio[0]} + {ratio[1]} = {parts} parts</text><text x="74" y="88" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{side} ÷ {parts} = {short} each</text></g>
      </g>}

      {phase === 1 && <g>
        {[[118,97],[249,136],[70,261]].map(([x,y],i) => <motion.g key={i} initial={{ scale: .6 }} animate={{ scale: 1 }} transition={{ delay: .3 + i * .16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={x - 37} y={y - 14} width="74" height="28" rx="8" fill="#fff" fillOpacity=".92" stroke={strokes[i]}/><text x={x} y={y + 5} textAnchor="middle" fontSize="11" fontWeight="900" fill={strokes[i]} fontFamily={FONT}>{i < 2 ? `½·6·4=${cornerAreas[i]}` : `½·2·2=${cornerAreas[i]}`}</text></motion.g>)}
        <g transform="translate(311 70)"><rect width="143" height="151" rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="71.5" y="25" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>OUTSIDE AREA</text>{cornerAreas.map((value, i) => <text key={i} x="71.5" y={55 + i * 27} textAnchor="middle" fontSize="14" fontWeight="900" fill={strokes[i]} fontFamily={FONT}>corner {i + 1}: {value}</text>)}<path d="M25 139h93" stroke="#cbd5e1"/><text x="71.5" y="148" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>total {outside}</text></g>
      </g>}

      {phase === 2 && <g>
        {cornerTriangles.map((triangle, i) => <motion.polygon key={i} points={poly(triangle)} fill={fills[i]} stroke={strokes[i]} strokeWidth="1.3" initial={{ opacity: .75 }} animate={{ opacity: 0 }} transition={{ duration: .65, delay: i * .12 }}/>) }
        <g transform="translate(307 58)"><rect width="157" height="190" rx="14" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="78.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>AREA OF △BFD</text><text x="78.5" y="59" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>{side}² − ({cornerAreas.join(" + ")})</text><text x="78.5" y="88" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT}>= {targetArea}</text><path d="M23 106h111" stroke="#cbd5e1"/><text x="78.5" y="130" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>triangle / square</text><text x="78.5" y="158" textAnchor="middle" fontSize="20" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{targetArea}/{squareArea} = {answer}</text></g>
        <text x="186" y="309" textAnchor="middle" fontSize="9" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `subtraction and coordinate area both give ${targetArea}` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={420} y={283} width={78}/>
      </g>}
    </svg>
  </div>;
}
