import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const WIN = "#16a34a";
const ORANGE = "#f59e0b";
const DIM = "#94a3b8";
type Point = { x: number; y: number };

const choose = (n: number, k: number): number => k < 0 || k > n ? 0 : k === 0 ? 1 : choose(n - 1, k - 1) * n / k;
const tri = (points: Point[], ids: number[]) => ids.map((id) => `${points[id].x},${points[id].y}`).join(" ");

/**
 * Counts triangles in a regular octagon by whether they use exactly one side
 * (an edge plus one of four non-neighboring vertices) or two consecutive sides.
 * Data: { vertices: 8, total: 56, oneSideThirdChoices: 4, oneSideCases: 32,
 * twoSideCases: 8, favorable: 40, answer: "5/7" }.
 */
export function OctagonTriangleCountScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const n = Math.round(num(data.vertices, 0));
  const total = Math.round(num(data.total, 0));
  const thirdChoices = Math.round(num(data.oneSideThirdChoices, 0));
  const oneSide = Math.round(num(data.oneSideCases, 0));
  const twoSides = Math.round(num(data.twoSideCases, 0));
  const favorable = Math.round(num(data.favorable, 0));
  const answer = String(data.answer ?? "");
  const actualTotal = choose(n, 3);
  const actualThirdChoices = n - 4;
  const actualOneSide = n * actualThirdChoices;
  const actualTwoSides = n;
  const stored = String(problem.shortAnswer ?? "").replace(/\s/g, "");
  const ok = n === 8 && total === actualTotal && thirdChoices === actualThirdChoices && oneSide === actualOneSide && twoSides === actualTwoSides && favorable === oneSide + twoSides && answer === "5/7" && stored === answer;
  const isFinal = step >= totalSteps - 1;
  const W = 460;
  const center = { x: 190, y: 139 };
  const radius = 91;
  const points = Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI * 3 / 4 + i * (2 * Math.PI / n);
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  });
  const octagon = points.map((p) => `${p.x},${p.y}`).join(" ");
  const edge = [0, 1];
  const safeThirds = [3, 4, 5, 6];
  const special = [0, 1, 2];
  const dot = (point: Point, active = false, color = INK) => <circle cx={point.x} cy={point.y} r={active ? 6 : 4.5} fill={active ? color : "#fff"} stroke={color} strokeWidth="2" />;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", padding: "8px 4px" }}>
      <svg viewBox={`0 0 ${W} 282`} width="100%" style={{ maxWidth: 470 }}>
        <text x={W / 2} y="18" textAnchor="middle" fontSize="12" fontWeight="850" fill={INK}>
          {step === 0 ? "choose any 3 of the 8 vertices" : isFinal ? "add triangles with one side and with two sides" : "fix one octagon side, then choose a non-neighboring third vertex"}
        </text>
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.g key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <polygon points={octagon} fill="#eef2ff" stroke={INK} strokeWidth="2.4" />
              <motion.polygon points={tri(points, [0, 3, 5])} fill={IND} fillOpacity="0.18" stroke={IND} strokeWidth="2.2" initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              {points.map((point, i) => <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 250, damping: 16, delay: i * 0.06 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>{dot(point, [0, 3, 5].includes(i), IND)}</motion.g>)}
              <text x="344" y="100" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>8 vertices</text>
              <text x="344" y="128" textAnchor="middle" fontSize="21" fontWeight="900" fill={INK} fontFamily={FONT}>C(8,3) = {actualTotal}</text>
              <text x="344" y="150" textAnchor="middle" fontSize="10.5" fontWeight="750" fill={DIM}>all possible triangles</text>
              <motion.text x={W / 2} y="259" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>start with {actualTotal} equally likely choices</motion.text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g key="one-edge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <polygon points={octagon} fill="#f8fafc" stroke={INK} strokeWidth="2.4" />
              <motion.line x1={points[0].x} y1={points[0].y} x2={points[1].x} y2={points[1].y} stroke={ORANGE} strokeWidth="6" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }} />
              <motion.polygon points={tri(points, [0, 1, 4])} fill={WIN} fillOpacity="0.22" stroke={WIN} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} />
              {points.map((point, i) => <g key={i}>{dot(point, edge.includes(i), ORANGE)}{safeThirds.includes(i) && <motion.circle cx={point.x} cy={point.y} r="9" fill="none" stroke={WIN} strokeWidth="2" initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.45 + safeThirds.indexOf(i) * 0.1 }} />}</g>)}
              <text x="344" y="92" textAnchor="middle" fontSize="12" fontWeight="900" fill={ORANGE}>fixed octagon side</text>
              <text x="344" y="120" textAnchor="middle" fontSize="14" fontWeight="900" fill={WIN} fontFamily={FONT}>{actualThirdChoices} safe third vertices</text>
              <text x="344" y="141" textAnchor="middle" fontSize="10.5" fontWeight="750" fill={DIM}>avoid either neighbor</text>
              <motion.text x={W / 2} y="253" textAnchor="middle" fontSize="19" fontWeight="900" fill={IND} fontFamily={FONT} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}>8 edges × {actualThirdChoices} = {actualOneSide} one-side triangles</motion.text>
            </motion.g>
          )}
          {isFinal && (
            <motion.g key="finish" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <polygon points={octagon} fill="#f8fafc" stroke={INK} strokeWidth="2.4" />
              <motion.polygon points={tri(points, special)} fill={ORANGE} fillOpacity="0.28" stroke={ORANGE} strokeWidth="2.5" initial={{ opacity: 0, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 190, damping: 16 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
              {points.map((point, i) => <g key={i}>{dot(point, special.includes(i), special.includes(i) ? ORANGE : INK)}</g>)}
              <text x="330" y="92" textAnchor="middle" fontSize="14" fontWeight="900" fill={ORANGE}>3 consecutive vertices</text>
              <text x="330" y="113" textAnchor="middle" fontSize="11" fontWeight="750" fill={DIM}>make 2 octagon sides</text>
              <motion.path d="M 282 130 C 330 130, 365 130, 410 130" fill="none" stroke={IND} strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.35 }} />
              <text x="350" y="151" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>8 such triangles</text>
              <rect x="273" y="172" width="158" height="69" rx="10" fill="#fff" stroke="#c7d2fe" />
              <text x="352" y="195" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{actualOneSide} + {actualTwoSides} = {favorable}</text>
              <text x="352" y="218" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>{favorable}/{actualTotal} = {answer}</text>
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.9 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
                <rect x="303" y="249" width="98" height="23" rx="11.5" fill={ok ? WIN : "#dc2626"} />
                <text x="352" y="265" textAnchor="middle" fontSize="11.5" fontWeight="850" fill="#fff">Answer {ok ? problem.answer : "check data"}</text>
              </motion.g>
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </div>
  );
}
