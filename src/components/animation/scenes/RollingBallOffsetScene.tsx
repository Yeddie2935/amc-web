import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GOLD = "#d97706", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Offset a three-semicircle track by the rolling ball's radius and total the centerline. */
export function RollingBallOffsetScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const radii = (Array.isArray(data.radii) ? data.radii : []).map((v) => num(v, 0));
  const orientations = (Array.isArray(data.orientations) ? data.orientations : []).map(String);
  const ballRadius = num(data.ballDiameter, 0) / 2;
  const signs = orientations.map((o) => o === "upper" ? 1 : -1);
  const adjusted = radii.map((r, i) => r + signs[i] * ballRadius);
  const trackCoefficient = radii.reduce((a, b) => a + b, 0);
  const centerCoefficient = adjusted.reduce((a, b) => a + b, 0);
  const adjustment = centerCoefficient - trackCoefficient;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/π/g, "").replace(/[^\d.-]/g, ""));
  const choice = (problem.choices ?? []).find((c) => Number(String(c.text).replace(/π/g, "").replace(/[^\d.-]/g, "")) === centerCoefficient)?.label;
  const ok = stored === centerCoefficient && choice === problem.answer;
  const failure = stored !== centerCoefficient ? `computed ${centerCoefficient}π, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(Math.max(step, 0), 2);

  const baseY = 90, startX = 35, scale = 0.7;
  const pixelR = radii.map((r) => r * scale);
  const starts = [startX, startX + 2 * pixelR[0], startX + 2 * pixelR[0] + 2 * pixelR[1]];
  const arc = (i: number, offset = false) => {
    const r = pixelR[i] + (offset ? signs[i] * 8 : 0);
    const cx = starts[i] + pixelR[i];
    const x1 = cx - r, x2 = cx + r;
    return `M ${x1} ${baseY} A ${r} ${r} 0 0 ${orientations[i] === "lower" ? 0 : 1} ${x2} ${baseY}`;
  };
  const colors = [IND, GOLD, "#0d9488"];
  const centerBall = phase === 0 ? { x: startX, y: baseY - 10 } : phase === 1 ? { x: starts[1] + pixelR[1], y: baseY - pixelR[1] - 9 } : { x: starts[2] + 2 * pixelR[2] - 7, y: baseY + 4 };

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 430 310" width="100%" style={{ maxWidth: 470, minWidth: 0, display: "block" }}>
      <text x="215" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
        {phase === 0 ? "three semicircles make the track" : phase === 1 ? "the ball's center follows a parallel track" : phase === 2 ? "inside arcs shrink; the outside arc grows" : "add the three centerline semicircles"}
      </text>
      <line x1="25" y1={baseY} x2="405" y2={baseY} stroke="#cbd5e1" strokeDasharray="4 4" />
      {radii.map((r, i) => <g key={r}>
        <motion.path d={arc(i)} fill="none" stroke={colors[i]} strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .7, delay: i * .16 }} />
        <text x={starts[i] + pixelR[i]} y={orientations[i] === "lower" ? baseY + pixelR[i] * .55 : baseY - pixelR[i] * .55} textAnchor="middle" fontSize="11" fontWeight="900" fill={colors[i]} fontFamily={FONT}>R{i + 1}={r}</text>
      </g>)}
      {phase >= 1 && radii.map((r, i) => <motion.path key={`offset${r}`} d={arc(i, true)} fill="none" stroke={GREEN} strokeWidth="2.5" strokeDasharray="6 4" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: .8, delay: i * .15 }} />)}
      {phase <= 1 && <motion.g initial={{ opacity: 0, scale: .6 }} animate={{ opacity: 1, scale: 1, rotate: phase === 1 ? 220 : 0 }} transition={{ type: "spring", stiffness: 150, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
        <circle cx={centerBall.x} cy={centerBall.y} r="9" fill="#f8fafc" stroke={INK} strokeWidth="2" />
        <line x1={centerBall.x} y1={centerBall.y} x2={centerBall.x + 7} y2={centerBall.y} stroke={INK} strokeWidth="1.5" />
        <circle cx={centerBall.x} cy={centerBall.y} r="2" fill={INK} />
      </motion.g>}
      <text x="22" y="87" textAnchor="end" fontSize="13" fontWeight="900" fill={INK}>A</text><text x="418" y="87" fontSize="13" fontWeight="900" fill={INK}>B</text>

      {phase === 0 && <g transform="translate(55 224)">
        <rect width="320" height="51" rx="12" fill="#eef2ff" stroke={IND} />
        <text x="160" y="20" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>each semicircle has length πr</text>
        <text x="160" y="41" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{radii.join("π + ")}π = {trackCoefficient}π</text>
      </g>}
      {phase === 1 && <g transform="translate(76 214)">
        <circle cx="34" cy="31" r="18" fill="#fff" stroke={INK} strokeWidth="2" /><circle cx="34" cy="31" r="2" fill={INK} /><line x1="34" y1="31" x2="34" y2="49" stroke={IND} strokeWidth="2" />
        <text x="34" y="9" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={INK}>center</text><text x="34" y="64" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND} fontFamily={FONT}>2 in</text>
        <text x="190" y="26" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK}>diameter 4 → radius {ballRadius}</text>
        <text x="190" y="48" textAnchor="middle" fontSize="10.5" fontWeight="800" fill={GREEN}>green dashes = center's path</text>
      </g>}
      {phase === 2 && <g transform="translate(39 207)">
        {adjusted.map((r, i) => <motion.g key={r} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .13 }}>
          <rect x={i * 120} y="0" width="108" height="55" rx="11" fill={signs[i] < 0 ? "#eef2ff" : "#fff7ed"} stroke={colors[i]} />
          <text x={i * 120 + 54} y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{orientations[i]} arc</text>
          <text x={i * 120 + 54} y="42" textAnchor="middle" fontSize="15" fontWeight="900" fill={colors[i]} fontFamily={FONT}>{radii[i]} {signs[i] < 0 ? "−" : "+"} {ballRadius} = {r}</text>
        </motion.g>)}
        <text x="174" y="76" textAnchor="middle" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>net radius change: {adjustment > 0 ? "+" : ""}{adjustment}</text>
      </g>}
      {phase === 3 && <g transform="translate(49 207)">
        <motion.rect width="332" height="59" rx="13" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" initial={{ scale: .8 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <text x="166" y="22" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>π(98 + 62 + 78)</text>
        <text x="166" y="47" textAnchor="middle" fontSize="19" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>= {centerCoefficient}π</text>
      </g>}
      <SvgAnswerBadge show={final && ok} answer={problem.answer ?? null} cx={215} y={278} width={78} />
      <AnimatePresence>{final && !ok && <motion.text x="215" y="303" textAnchor="middle" fontSize="9.5" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
