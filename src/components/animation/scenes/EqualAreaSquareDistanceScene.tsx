import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
type P = { x: number; y: number };
const pts = (...ps: P[]) => ps.map((p) => `${p.x},${p.y}`).join(" ");
const polygonArea = (ps: P[]) => Math.abs(ps.reduce((sum, p, i) => { const q = ps[(i + 1) % ps.length]; return sum + p.x * q.y - q.x * p.y; }, 0)) / 2;

/** Equal-area rays locate a point on a square side, then expose a right triangle for the requested distance. */
export function EqualAreaSquareDistanceScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const side = num(data.sideLength, 0), regionCount = Math.round(num(data.equalRegionCount, 0));
  const segments = (Array.isArray(data.dividingSegments) ? data.dividingSegments : []).map(String);
  const squareArea = side * side, regionArea = squareArea / regionCount;
  const BM = side ? 2 * regionArea / side : 0, AM = side - BM;
  const horizontal = side, vertical = BM, radicand = horizontal * horizontal + vertical * vertical;
  const answer = `√${radicand}`;
  const choice = problem.choices?.find((item) => String(item.text).replace(/\s/g, "") === answer)?.label;
  const final = step >= totalSteps - 1, phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const ox = 48, oy = 43, sizePx = 210, scale = sizePx / side;
  const X = (x: number) => ox + x * scale, Y = (y: number) => oy + (side - y) * scale;
  const A = { x: 0, y: 0 }, B = { x: 0, y: side }, C = { x: side, y: side }, D = { x: side, y: 0 }, M = { x: 0, y: AM }, N = { x: AM, y: 0 }, P = { x: side, y: AM };
  const regions = [[B, C, M], [C, D, N], [A, M, C, N]];
  const areas = regions.map(polygonArea);
  const ok = side === 3 && regionCount === 3 && segments.join(",") === "CM,CN" && areas.every((area) => area === regionArea) && BM === 2 && AM === 1 && radicand === 13 && answer === problem.shortAnswer && choice === problem.answer;
  const failure = areas.some((area) => area !== regionArea) ? `region areas are ${areas.join(",")}` : BM !== 2 ? `BM computes to ${BM}` : radicand !== 13 ? `radicand is ${radicand}` : answer !== problem.shortAnswer ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const poly = (ps: P[]) => ps.map((p) => `${X(p.x)},${Y(p.y)}`).join(" ");
  const labels = [["A", A, -18, 18], ["B", B, -18, -8], ["C", C, 8, -8], ["D", D, 8, 18], ["M", M, -22, 5], ["N", N, -4, 21]] as const;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 480 330" width="100%" style={{ maxWidth: 510, minWidth: 0, display: "block" }} aria-label="Square ABCD split by CM and CN into three equal-area regions, with CM shown as a right-triangle hypotenuse">
      <text x="240" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "three equal regions share the square's 9 square units" : phase === 1 ? "triangle BCM has area 3, base BM, and perpendicular height 3" : phase === 2 ? "BM = 2 places M one unit above A" : "drop a horizontal helper: CM spans 3 across and 2 up"}</text>

      {phase === 0 && regions.map((region, i) => <motion.polygon key={i} points={poly(region)} fill={["#fde68a", "#bae6fd", "#ddd6fe"][i]} stroke={[AMBER, TEAL, IND][i]} strokeWidth="1.5" initial={{ opacity: 0, scale: .7 }} animate={{ opacity: .82, scale: 1 }} transition={{ delay: i * .14, type: "spring", stiffness: 180, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />)}
      {phase === 1 && <polygon points={poly([B, C, M])} fill="#fde68a" fillOpacity=".86" stroke={AMBER} strokeWidth="2.5" />}
      {phase === 3 && <polygon points={poly([M, P, C])} fill="#dcfce7" fillOpacity=".82" stroke={GREEN} strokeWidth="2.5" />}
      <rect x={X(0)} y={Y(side)} width={sizePx} height={sizePx} fill="none" stroke={INK} strokeWidth="2.6" />
      <motion.line x1={X(M.x)} y1={Y(M.y)} x2={X(C.x)} y2={Y(C.y)} stroke={phase === 3 ? GREEN : IND} strokeWidth={phase === 3 ? 3.5 : 2.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      <motion.line x1={X(N.x)} y1={Y(N.y)} x2={X(C.x)} y2={Y(C.y)} stroke={phase === 0 ? TEAL : "#cbd5e1"} strokeWidth={phase === 0 ? 2.6 : 1.6} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      {labels.map(([label, p, dx, dy]) => <g key={label}><circle cx={X(p.x)} cy={Y(p.y)} r="3.4" fill={INK} />{!(phase === 2 && label === "M") && <text x={X(p.x) + dx} y={Y(p.y) + dy} fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{label}</text>}</g>)}

      {phase === 0 && <g>{[[1.55,2.55],[2.55,1.45],[1.15,.72]].map(([x,y],i) => <motion.g key={i} initial={{ scale: .55 }} animate={{ scale: 1 }} transition={{ delay: .28 + i * .14 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><circle cx={X(x)} cy={Y(y)} r="22" fill="#fff" fillOpacity=".92" stroke={[AMBER,TEAL,IND][i]} strokeWidth="2" /><text x={X(x)} y={Y(y)+5} textAnchor="middle" fontSize="14" fontWeight="900" fill={[AMBER,TEAL,IND][i]} fontFamily={FONT}>area {areas[i]}</text></motion.g>)}</g>}

      {phase === 1 && <g><motion.line x1={X(B.x)-11} y1={Y(B.y)} x2={X(M.x)-11} y2={Y(M.y)} stroke={IND} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x={X(B.x)-25} y={(Y(B.y)+Y(M.y))/2} textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT} transform={`rotate(-90 ${X(B.x)-25} ${(Y(B.y)+Y(M.y))/2})`}>BM = ?</text><motion.line x1={X(B.x)} y1={Y(B.y)-11} x2={X(C.x)} y2={Y(C.y)-11} stroke={TEAL} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><text x={(X(B.x)+X(C.x))/2} y={Y(B.y)-17} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>height = {side}</text></g>}

      {phase === 2 && <g>{Array.from({ length: 4 }, (_, i) => <g key={i}><line x1={X(0)-5} y1={Y(i)} x2={X(0)+5} y2={Y(i)} stroke="#94a3b8" /><text x={X(0)-10} y={Y(i)+4} textAnchor="end" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>{i}</text><line x1={X(i)} y1={Y(0)-5} x2={X(i)} y2={Y(0)+5} stroke="#94a3b8" /><text x={X(i)} y={Y(0)+15} textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM} fontFamily={FONT}>{i}</text></g>)}<motion.circle cx={X(M.x)} cy={Y(M.y)} r="8" fill={IND} initial={{ scale: 0 }} animate={{ scale: 1 }} /><rect x={X(M.x)+10} y={Y(M.y)-27} width="66" height="24" rx="8" fill="#fff" stroke={IND} /><text x={X(M.x)+43} y={Y(M.y)-10} textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>M = (0, {AM})</text></g>}

      {phase === 3 && <g><motion.line x1={X(M.x)} y1={Y(M.y)} x2={X(P.x)} y2={Y(P.y)} stroke={IND} strokeWidth="3" strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><motion.line x1={X(P.x)} y1={Y(P.y)} x2={X(C.x)} y2={Y(C.y)} stroke={TEAL} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .15 }} /><path d={`M${X(P.x)-11} ${Y(P.y)}v-11h11`} fill="none" stroke={INK} strokeWidth="1.8" /><rect x={X(1.5)-19} y={Y(AM)+7} width="38" height="23" rx="7" fill="#fff" stroke={IND} /><text x={X(1.5)} y={Y(AM)+24} textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{horizontal}</text><rect x={X(P.x)+8} y={(Y(P.y)+Y(C.y))/2-11} width="34" height="23" rx="7" fill="#fff" stroke={TEAL} /><text x={X(P.x)+25} y={(Y(P.y)+Y(C.y))/2+6} textAnchor="middle" fontSize="13" fontWeight="900" fill={TEAL} fontFamily={FONT}>{vertical}</text></g>}

      <g transform="translate(318 56)"><rect width="145" height="184" rx="14" fill={phase === 3 ? (ok ? "#f0fdf4" : "#fef2f2") : phase === 1 ? "#fff7ed" : "#eef2ff"} stroke={phase === 3 ? (ok ? GREEN : RED) : phase === 1 ? AMBER : IND} strokeWidth="2" />
        {phase === 0 && <><text x="72.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>EQUAL REGIONS</text><text x="72.5" y="62" textAnchor="middle" fontSize="17" fontWeight="900" fill={INK} fontFamily={FONT}>{side} × {side} = {squareArea}</text><text x="72.5" y="99" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{squareArea} ÷ {regionCount}</text><motion.text x="72.5" y="139" textAnchor="middle" fontSize="25" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>= {regionArea}</motion.text></>}
        {phase === 1 && <><text x="72.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>AREA OF △BCM</text><text x="72.5" y="63" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>½ × BM × {side}</text><text x="72.5" y="88" textAnchor="middle" fontSize="14" fontWeight="900" fill={INK} fontFamily={FONT}>= {regionArea}</text><motion.text x="72.5" y="132" textAnchor="middle" fontSize="24" fontWeight="900" fill={AMBER} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>BM = {BM}</motion.text></>}
        {phase === 2 && <><text x="72.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>LOCATE M</text><text x="72.5" y="62" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>AM = AB − BM</text><text x="72.5" y="94" textAnchor="middle" fontSize="18" fontWeight="900" fill={IND} fontFamily={FONT}>{side} − {BM} = {AM}</text><motion.text x="72.5" y="137" textAnchor="middle" fontSize="20" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>M = (0, {AM})</motion.text></>}
        {phase === 3 && <><text x="72.5" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PYTHAGOREAN THEOREM</text><text x="72.5" y="61" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>CM² = {horizontal}² + {vertical}²</text><text x="72.5" y="91" textAnchor="middle" fontSize="17" fontWeight="900" fill={IND} fontFamily={FONT}>= {radicand}</text><motion.text x="72.5" y="132" textAnchor="middle" fontSize="24" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>CM = {answer}</motion.text><text x="72.5" y="161" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={ok ? GREEN : RED}>{ok ? `choice ${choice} matches` : failure}</text></>}
      </g>
      <text x="164" y="292" textAnchor="middle" fontSize="9.6" fontWeight="850" fill={phase === 3 ? GREEN : DIM}>{phase === 0 ? "each colored region has exactly one-third of the square" : phase === 1 ? "BM is a side segment; the opposite reach to C is 3" : phase === 2 ? "the area equation fixes M at the 1-unit tick" : ok ? "area, coordinates, distance, and stored answer agree" : failure}</text><SvgAnswerBadge show={final && ok} answer={problem.answer} cx={164} y={300} width={76} /><AnimatePresence>{final && !ok && <motion.text x="240" y="328" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
