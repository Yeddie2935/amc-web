import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
type P = { x: number; y: number };
const pts = (...points: P[]) => points.map((p) => `${p.x},${p.y}`).join(" ");

/** Transfer an isosceles base angle through a straight-line intersection, then finish the second triangle. */
export function StarIsoscelesAngleTransferScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const apex = num(data.apexAngle, 0), triangleSum = num(data.triangleAngleSum, 0), straight = num(data.straightAngle, 0);
  const base = (triangleSum - apex) / 2;
  const angleBFD = straight - base;
  const requested = triangleSum - angleBFD;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^\d.-]/g, ""));
  const choice = problem.choices?.find((item) => Number(String(item.text).replace(/[^\d.-]/g, "")) === requested)?.label;
  const ok = data.equalAngles === "AFG=AGF" && data.intersectionLines === "AFD|BFGE" && triangleSum === 180 && straight === 180 && base === 80 && angleBFD === 100 && requested === stored && choice === problem.answer;
  const failure = data.equalAngles !== "AFG=AGF" ? "missing equality ∠AFG = ∠AGF" : data.intersectionLines !== "AFD|BFGE" ? "missing straight lines AFD and BFGE" : base !== 80 ? `base angles compute to ${base}°` : angleBFD !== 100 ? `supplement computes to ${angleBFD}°` : requested !== stored ? `computed ${requested}°, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const A = { x: 42, y: 94 }, C = { x: 296, y: 94 }, B = { x: 164, y: 23 }, E = { x: 105, y: 247 }, D = { x: 238, y: 165 };
  const G = { x: 145, y: 94 }, F = { x: 135, y: 129 };
  const labels = [["A", A, -18, 5], ["B", B, 8, 28], ["C", C, 8, 5], ["D", D, 8, 14], ["E", E, -17, 17], ["F", F, -20, 11], ["G", G, -19, -8]] as const;
  const starLines = [[A, C], [A, D], [D, B], [B, E], [E, C]] as const;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Star figure with isosceles triangle AFG and triangle BFD sharing intersecting lines at F">
      <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "start with the small isosceles triangle AFG" : phase === 1 ? "the two equal angles split the 160° remainder" : phase === 2 ? "AFD and BFGE are straight lines through F" : "now triangle BFD has one 100° angle"}</text>

      {starLines.map(([p, q], i) => <motion.line key={i} x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={phase === 2 && i === 3 ? TEAL : INK} strokeWidth={phase === 2 && i === 3 ? 3.4 : 2.2} opacity={phase === 0 || phase === 1 ? (i === 0 || i === 1 || i === 3 ? 1 : .24) : phase === 3 ? (i === 1 || i === 2 || i === 3 ? 1 : .24) : 1} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * .08 }} />)}

      {(phase === 0 || phase === 1) && <motion.polygon points={pts(A, F, G)} fill="#e0e7ff" fillOpacity=".85" stroke={IND} strokeWidth="2.8" initial={{ opacity: 0, scale: .72 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />}
      {phase === 3 && <motion.polygon points={pts(B, F, D)} fill="#dcfce7" fillOpacity=".82" stroke={GREEN} strokeWidth="3" initial={{ opacity: 0, scale: .72 }} animate={{ opacity: 1, scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />}

      {(phase === 0 || phase === 1) && <g stroke={AMBER} strokeWidth="2.4"><line x1="126" y1="112" x2="134" y2="115" /><line x1="137" y1="106" x2="146" y2="108" /></g>}
      <path d="M65 94 A23 23 0 0 1 63.6 102" fill="none" stroke={AMBER} strokeWidth="3" />
      <text x="69" y="112" fontSize="11" fontWeight="900" fill={AMBER} fontFamily={FONT}>{apex}°</text>

      {phase === 1 && <><motion.g initial={{ scale: .55 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="107" y="99" width="43" height="24" rx="8" fill="#fff" stroke={IND} /><text x="128.5" y="116" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{base}°</text></motion.g><motion.g initial={{ scale: .55 }} animate={{ scale: 1 }} transition={{ delay: .15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x="126" y="69" width="43" height="24" rx="8" fill="#fff" stroke={IND} /><text x="147.5" y="86" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{base}°</text></motion.g></>}

      {phase === 2 && <g><motion.path d="M119 125 A20 20 0 0 0 144 145" fill="none" stroke={IND} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} /><motion.path d="M144 145 A24 24 0 0 0 156 120" fill="none" stroke={TEAL} strokeWidth="4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: .28 }} /><rect x="81" y="136" width="48" height="25" rx="8" fill="#fff" stroke={IND} /><text x="105" y="153" textAnchor="middle" fontSize="12" fontWeight="900" fill={IND} fontFamily={FONT}>{base}°</text><rect x="151" y="119" width="50" height="25" rx="8" fill="#fff" stroke={TEAL} /><text x="176" y="136" textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{angleBFD}°</text><text x="135" y="174" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>supplementary pair</text></g>}
      {phase === 3 && <><rect x="132" y="112" width="52" height="26" rx="8" fill="#fff" stroke={GREEN} /><text x="158" y="130" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>{angleBFD}°</text><text x="184" y="62" fontSize="13" fontWeight="900" fill={GREEN}>B°</text><text x="212" y="157" fontSize="13" fontWeight="900" fill={GREEN}>D°</text></>}

      {labels.map(([label, p, dx, dy]) => <g key={label}><circle cx={p.x} cy={p.y} r="3.2" fill={INK} /><text x={p.x + dx} y={p.y + dy} fontSize="12" fontWeight="900" fill={INK} fontFamily={FONT}>{label}</text></g>)}

      <g transform="translate(318 52)">
        <rect width="132" height="174" rx="14" fill={phase === 3 ? (ok ? "#f0fdf4" : "#fef2f2") : phase === 2 ? "#ecfeff" : "#eef2ff"} stroke={phase === 3 ? (ok ? GREEN : RED) : phase === 2 ? TEAL : IND} strokeWidth="2" />
        {phase === 0 && <><text x="66" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>ISOSCELES CLUE</text><text x="66" y="62" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>∠AFG = ∠AGF</text><text x="66" y="96" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>two equal boxes</text><text x="66" y="120" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>share what remains</text></>}
        {phase === 1 && <><text x="66" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>EQUAL ANGLES</text><text x="66" y="61" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>180° − {apex}° = 160°</text><text x="66" y="94" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>160° ÷ 2</text><motion.text x="66" y="133" textAnchor="middle" fontSize="25" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>= {base}°</motion.text></>}
        {phase === 2 && <><text x="66" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>STRAIGHT LINE AT F</text><text x="66" y="65" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>{base}° + ? = {straight}°</text><motion.text x="66" y="105" textAnchor="middle" fontSize="25" fontWeight="900" fill={TEAL} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>? = {angleBFD}°</motion.text><text x="66" y="139" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>this is ∠BFD</text></>}
        {phase === 3 && <><text x="66" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TRIANGLE BFD</text><text x="66" y="62" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>B + D + {angleBFD}°</text><text x="66" y="85" textAnchor="middle" fontSize="15" fontWeight="900" fill={INK} fontFamily={FONT}>= {triangleSum}°</text><motion.text x="66" y="126" textAnchor="middle" fontSize="21" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .5 }} animate={{ scale: 1 }}>B + D = {requested}°</motion.text><text x="66" y="153" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={ok ? GREEN : RED}>{ok ? `choice ${choice} matches` : failure}</text></>}
      </g>

      <text x="156" y="275" textAnchor="middle" fontSize="10" fontWeight="850" fill={phase === 3 ? GREEN : DIM}>{phase === 0 ? "equal tick marks encode the given angle equality" : phase === 1 ? "the 20° vertex leaves 160° for the equal pair" : phase === 2 ? "the adjacent angles at F fill one straight 180° turn" : ok ? "both triangle sums and the stored answer agree" : failure}</text>
      <SvgAnswerBadge show={final && ok} answer={problem.answer} cx={156} y={286} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="235" y="312" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
