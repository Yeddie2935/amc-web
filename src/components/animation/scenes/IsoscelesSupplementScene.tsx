import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", INDIGO = "#4338ca", TEAL = "#0d9488", AMBER = "#d97706", GREEN = "#16a34a", RED = "#dc2626";
type Pt = { x: number; y: number };
const polar = (p: Pt, r: number, deg: number) => ({ x: p.x + r * Math.cos(deg * Math.PI / 180), y: p.y + r * Math.sin(deg * Math.PI / 180) });
const sector = (p: Pt, r: number, start: number, end: number) => { const a = polar(p, r, start), b = polar(p, r, end); return `M ${p.x} ${p.y} L ${a.x} ${a.y} A ${r} ${r} 0 ${end - start > 180 ? 1 : 0} 1 ${b.x} ${b.y} Z`; };

/** Transfer equal base angles in an isosceles triangle, then take the supplement on a straight line. Data: { givenAngle, triangleAngleSum, straightAngle }. */
export function IsoscelesSupplementScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const given = num(data.givenAngle, 0), triangleSum = num(data.triangleAngleSum, 180), straight = num(data.straightAngle, 180);
  const atB = given, atD = triangleSum - given - atB, target = straight - atD;
  const final = step >= totalSteps - 1;
  const showD = step >= 1 || final;
  const stored = Number(String(problem.shortAnswer ?? "").replace(/[^0-9.-]/g, ""));
  const choice = problem.choices?.find((c) => Number(c.text) === target)?.label;
  const consistent = atD > 0 && target === stored && choice === problem.answer;
  const A = { x: 28, y: 174 }, D = { x: 145, y: 174 }, C = { x: 315, y: 174 };
  const B = polar(D, C.x - D.x, -40);

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", padding: "5px 4px" }}>
    <svg viewBox="0 0 360 244" width="100%" style={{ maxWidth: 430 }}>
      <text x="180" y="16" textAnchor="middle" fontSize="11" fontWeight="900" fill="#64748b">{final ? "A–D–C IS A STRAIGHT LINE" : showD ? "CLOSE TRIANGLE BDC" : "BD = DC MAKES TWO BASE ANGLES MATCH"}</text>
      <motion.polygon points={`${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`} fill="#f8fafc" stroke={INK} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} />
      <motion.line x1={D.x} y1={D.y} x2={B.x} y2={B.y} stroke={INDIGO} strokeWidth="2.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
      {[A,D,C,B].map((p, i) => <g key={i}><circle cx={p.x} cy={p.y} r="4" fill={INK} /><text x={p.x + (i === 0 ? -9 : i === 2 ? 10 : i === 3 ? 8 : 0)} y={p.y + (i === 3 ? -9 : 18)} textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>{["A","D","C","B"][i]}</text></g>)}

      <line x1={(D.x+B.x)/2-5} y1={(D.y+B.y)/2-5} x2={(D.x+B.x)/2+5} y2={(D.y+B.y)/2+5} stroke={INDIGO} strokeWidth="2.5" />
      <line x1={(D.x+C.x)/2} y1={D.y-7} x2={(D.x+C.x)/2} y2={D.y+7} stroke={INDIGO} strokeWidth="2.5" />
      <text x="211" y="116" textAnchor="middle" fontSize="11" fontWeight="900" fill={INDIGO} fontFamily={FONT}>BD = DC</text>

      <path d={sector(C, 32, 180, 250)} fill="#fef3c7" stroke={AMBER} strokeWidth="1.5" />
      <text x="282" y="154" textAnchor="middle" fontSize="12" fontWeight="900" fill={AMBER} fontFamily={FONT}>{given}°</text>
      <AnimatePresence>{!final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.path d={sector(B, 31, 70, 140)} fill="#ccfbf1" stroke={TEAL} strokeWidth="1.5" initial={{ scale: 0 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <text x={B.x} y={B.y + 43} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{atB}°</text>
      </motion.g>}</AnimatePresence>

      <AnimatePresence>{showD && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <path d={sector(D, 34, 320, 360)} fill="#e0e7ff" stroke={INDIGO} strokeWidth="1.5" />
        {!final && <text x="181" y="163" textAnchor="middle" fontSize="12" fontWeight="900" fill={INDIGO} fontFamily={FONT}>{atD}°</text>}
      </motion.g>}</AnimatePresence>

      {!final && <motion.g initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
        <rect x="67" y="201" width="226" height="32" rx="10" fill={showD ? "#eef2ff" : "#ecfeff"} stroke={showD ? INDIGO : TEAL} />
        <text x="180" y="222" textAnchor="middle" fontSize="14" fontWeight="900" fill={showD ? INDIGO : TEAL} fontFamily={FONT}>{showD ? `${triangleSum}° − ${given}° − ${atB}° = ${atD}°` : `∠DBC = ∠BCD = ${given}°`}</text>
      </motion.g>}

      {final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.path d={sector(D, 53, 180, 320)} fill="#dcfce7" fillOpacity="0.88" stroke={GREEN} strokeWidth="2" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 15 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />
        <text x="111" y="132" textAnchor="middle" fontSize="18" fontWeight="900" fill={GREEN} fontFamily={FONT}>{target}°</text>
        <path d="M 53 201 H 307" stroke={GREEN} strokeWidth="3" strokeLinecap="round" />
        <rect x="77" y="208" width="206" height="31" rx="10" fill="#dcfce7" stroke={consistent ? GREEN : RED} strokeWidth="2" />
        <text x="180" y="229" textAnchor="middle" fontSize="16" fontWeight="900" fill={consistent ? GREEN : RED} fontFamily={FONT}>{straight}° − {atD}° = {target}°</text>
      </motion.g>}
    </svg>
    <motion.span key={step} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} style={{ fontFamily: FONT, fontSize: 12, fontWeight: 800, color: final ? "#166534" : INDIGO, textAlign: "center" }}>
      {final ? `∠ADB and ${atD}° fill a straight ${straight}° angle` : step === 0 ? `equal sides face equal ${given}° angles` : `∠BDC = ${triangleSum}° − ${given}° − ${atB}° = ${atD}°`}
    </motion.span>
    <AnimatePresence>{final && consistent && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.65 }} style={{ padding: "6px 16px", borderRadius: 999, background: GREEN, color: "#fff", fontWeight: 800, fontSize: 15 }}>Answer {problem.answer}</motion.div>}</AnimatePresence>
    {final && !consistent && <span style={{ color: RED, fontSize: 11, fontWeight: 800 }}>angle chase or stored answer check failed</span>}
  </div>;
}
