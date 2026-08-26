import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", AMBER = "#f59e0b", DIM = "#94a3b8";

/** A trip ledger whose gallon cells physically drain and refill. */
export function FuelTankTripScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const capacity = Math.round(num(data.capacity, 0));
  const mpg = num(data.mpg, 0);
  const firstMiles = num(data.firstMiles, 0);
  const refill = num(data.refill, 0);
  const finalNumerator = Math.round(num(data.finalNumerator, 1));
  const finalDenominator = Math.round(num(data.finalDenominator, 2));
  const firstUsed = firstMiles / mpg;
  const afterFirst = capacity - firstUsed;
  const afterRefill = afterFirst + refill;
  const finalGallons = capacity * finalNumerator / finalDenominator;
  const secondUsed = afterRefill - finalGallons;
  const secondMiles = secondUsed * mpg;
  const totalMiles = firstMiles + secondMiles;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const filled = phase === 0 ? afterFirst : phase === 1 ? afterRefill : finalGallons;
  const ok = [firstUsed, afterFirst, afterRefill, finalGallons, secondUsed, secondMiles, totalMiles].every(Number.isFinite)
    && problem.shortAnswer?.includes(String(totalMiles));
  const cols = 7, cellW = 39, cellH = 28, gap = 4, x0 = 76, y0 = 49;
  const caption = phase === 0
    ? `${firstMiles} ÷ ${mpg} = ${firstUsed} gallons burned`
    : phase === 1
    ? `${afterFirst} + ${refill} = ${afterRefill} gallons after the stop`
    : phase === 2
    ? `arrival is half-full: ${afterRefill} − ${finalGallons} = ${secondUsed} gallons burned`
    : `${secondUsed} × ${mpg} = ${secondMiles};  ${firstMiles} + ${secondMiles} = ${totalMiles} miles`;

  return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%", minWidth: 0, padding: "6px 4px" }}>
    <svg viewBox="0 0 430 247" width="100%" style={{ display: "block", maxWidth: 460 }}>
      <text x="215" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "Karl drives the first leg" : phase === 1 ? "the pump puts 8 gallons back" : phase === 2 ? "drive until the tank is half-full" : "convert the last 5 gallons into miles"}</text>
      <text x="35" y="82" textAnchor="middle" fontSize="25">{phase === 1 ? "⛽" : "🚗"}</text>
      <rect x="68" y="39" width="299" height="75" rx="12" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <rect x="367" y="60" width="10" height="32" rx="3" fill={INK} />
      {Array.from({ length: capacity }, (_, i) => {
        const row = Math.floor(i / cols), col = i % cols;
        const active = i < filled;
        const newlyAdded = phase === 1 && i >= afterFirst;
        return <motion.rect key={`${phase}-${i}`} x={x0 + col * (cellW + gap)} y={y0 + (1 - row) * (cellH + gap)} width={cellW} height={cellH} rx="5"
          fill={active ? (newlyAdded ? "#fef3c7" : "#c7d2fe") : "#f1f5f9"} stroke={active ? (newlyAdded ? AMBER : IND) : "#e2e8f0"}
          initial={{ opacity: 0.25, scale: 0.65 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.035 }} style={{ transformBox: "fill-box", transformOrigin: "center" }} />;
      })}
      <text x="215" y="132" textAnchor="middle" fontSize="13" fontWeight="900" fill={phase === 3 ? GREEN : IND} fontFamily={FONT}>{filled} / {capacity} gallons</text>

      <line x1="46" y1="167" x2="384" y2="167" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />
      <motion.text key={`car-${phase}`} initial={{ x: 50 }} animate={{ x: phase === 0 ? 190 : phase === 1 ? 210 : phase === 2 ? 292 : 374 }} y="160" fontSize="22" textAnchor="middle" transition={{ duration: 1.1 }}>🚗</motion.text>
      <g fontFamily={FONT} fontWeight="800" fontSize="10">
        <text x="46" y="188" fill={DIM}>start</text><text x="186" y="188" fill={IND}>{firstMiles} mi</text>
        {phase >= 1 && <text x="238" y="188" fill={AMBER}>+{refill} gal</text>}
        {phase >= 2 && <text x="329" y="188" fill={GREEN}>+{secondMiles} mi</text>}
      </g>
      <AnimatePresence>{final && <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .35 }}><text x="215" y="218" textAnchor="middle" fontFamily={FONT} fontSize="15" fontWeight="900" fill={GREEN}>{firstMiles} + ({afterRefill} − {finalGallons}) × {mpg} = {totalMiles} miles</text></motion.g>}</AnimatePresence>
      <SvgAnswerBadge show={final && Boolean(ok)} answer={problem.answer ?? null} cx={215} y={222} width={86} />
    </svg>
    <motion.div key={step} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{ width: "100%", fontFamily: FONT, fontSize: 11.5, fontWeight: 800, color: final ? "#166534" : IND, textAlign: "center", overflowWrap: "anywhere" }}>{caption}</motion.div>
    {final && !ok && <div style={{ color: "#dc2626", fontFamily: FONT, fontSize: 11 }}>computed {totalMiles} miles; stored answer is {problem.shortAnswer}</div>}
  </div>;
}
