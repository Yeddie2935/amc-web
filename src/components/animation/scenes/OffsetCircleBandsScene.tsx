import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

/** Slide internally tangent nested circles to one center, exposing alternating area bands. */
export function OffsetCircleBandsScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const radii = (Array.isArray(data.radii) ? data.radii : []).map(v => num(v, 0)).sort((a, b) => a - b);
  const blackBands = (Array.isArray(data.blackBands) ? data.blackBands : []).map(v => Math.round(num(v, -1)));
  const outer = radii.at(-1) ?? 0;
  const bandCoeff = blackBands.map(i => radii[i] ** 2 - (i > 0 ? radii[i - 1] ** 2 : 0));
  const blackCoeff = bandCoeff.reduce((sum, value) => sum + value, 0);
  const totalCoeff = outer ** 2;
  const exactPercent = totalCoeff ? blackCoeff / totalCoeff * 100 : 0;
  const roundedPercent = Math.round(exactPercent);
  const choice = problem.choices?.find(c => Number(c.text) === roundedPercent)?.label;
  const expectedRadii = radii.join(",") === "2,4,6,8,10,12";
  const ok = expectedRadii && blackBands.join(",") === "0,2,4" && blackCoeff === 60 && totalCoeff === 144 && String(roundedPercent) === problem.shortAnswer && choice === problem.answer;
  const failure = !expectedRadii ? `radii are ${radii.join(",")}` : blackCoeff !== 60 ? `black coefficient is ${blackCoeff}` : totalCoeff !== 144 ? `outer coefficient is ${totalCoeff}` : String(roundedPercent) !== problem.shortAnswer ? `computed ${roundedPercent}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  const cx = 158, cy = 153, scale = 8;
  const descending = radii.map((radius, index) => ({ radius, index })).reverse();
  const isBlack = (index: number) => blackBands.includes(index);
  const CircleDesign = ({ centered }: { centered: boolean }) => <g>
    {descending.map(({ radius, index }) => {
      const offset = (outer - radius) * scale;
      return <motion.g key={radius} initial={{ x: centered ? offset : 0 }} animate={{ x: centered ? 0 : offset }} transition={{ duration: .9, delay: (radii.length - 1 - index) * .06 }}>
        <circle cx={cx} cy={cy} r={radius * scale} fill={isBlack(index) ? INK : "#fff"} stroke={INK} strokeWidth={index === radii.length - 1 ? 2 : 1.2}/>
      </motion.g>;
    })}
    <circle cx={centered ? cx : cx + outer * scale} cy={cy} r="3.5" fill={IND}/>
  </g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 460 330" width="100%" style={{ maxWidth: "100%", display: "block" }} aria-label="Offset tangent circles sliding together to reveal alternating black area bands">
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "six circles share one right-hand tangent point" : phase === 1 ? "sliding a circle does not change its area" : phase === 2 ? "each black band is one circle area minus the next" : "compare the black ink with the whole outer circle"}</text>

      {phase === 0 && <g>
        <CircleDesign centered={false}/>
        <line x1={cx + outer * scale} y1="48" x2={cx + outer * scale} y2="258" stroke={IND} strokeWidth="1.5" strokeDasharray="5 4"/>
        <text x={cx + outer * scale + 8} y="61" fontSize="9.5" fontWeight="850" fill={IND}>common tangent</text>
        <g transform="translate(286 72)"><rect width="143" height="166" rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="71.5" y="23" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>RADII (INCHES)</text>{radii.map((radius, i) => <motion.g key={radius} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .09 }}><circle cx={24 + (i % 2) * 68} cy={50 + Math.floor(i / 2) * 43} r="15" fill={isBlack(i) ? INK : "#fff"} stroke={INK}/><text x={24 + (i % 2) * 68} y={55 + Math.floor(i / 2) * 43} textAnchor="middle" fontSize="12" fontWeight="900" fill={isBlack(i) ? "#fff" : INK} fontFamily={FONT}>{radius}</text></motion.g>)}</g>
        <text x="230" y="302" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>black, white, black, white, black, white from the center outward</text>
      </g>}

      {phase === 1 && <g>
        <CircleDesign centered/>
        {radii.map((radius, i) => <line key={radius} x1={cx + radius * scale} y1={cy} x2={cx + radius * scale} y2={cy + (i % 2 ? 8 : -8)} stroke={isBlack(i) ? "#fff" : IND} strokeWidth="1.4"/>)}
        <g transform="translate(287 75)"><rect width="142" height="151" rx="13" fill="#eef2ff" stroke={IND}/><text x="71" y="27" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>SAME AREAS</text><text x="71" y="57" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND}>offset circles</text><text x="71" y="83" textAnchor="middle" fontSize="20" fontWeight="900" fill={INK}>→</text><text x="71" y="110" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND}>concentric bands</text><text x="71" y="135" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>only positions changed</text></g>
        <text x="230" y="302" textAnchor="middle" fontSize="10.5" fontWeight="900" fill={IND}>now every shaded piece is an ordinary annulus (or center disk)</text>
      </g>}

      {phase === 2 && <g>
        <g transform="translate(42 57) scale(.72)"><CircleDesign centered/></g>
        <g transform="translate(244 49)">{blackBands.slice().reverse().map((band, row) => { const innerSq = band > 0 ? radii[band - 1] ** 2 : 0; return <g key={band} transform={`translate(0 ${row * 65})`}><motion.g initial={{ x: 12 }} animate={{ x: 0 }} transition={{ delay: row * .15 }}><rect width="183" height="51" rx="10" fill="#f8fafc" stroke={IND}/><circle cx="20" cy="25.5" r="10" fill={INK}/><text x="104" y="21" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>{band === 0 ? "center disk" : `radii ${radii[band]} and ${radii[band - 1]}`}</text><text x="104" y="41" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{band === 0 ? `${radii[band]}²π` : `(${radii[band]}²−${radii[band - 1]}²)π`} = {radii[band] ** 2 - innerSq}π</text></motion.g></g>; })}</g>
        <g transform="translate(101 272)"><rect width="258" height="43" rx="11" fill="#eef2ff" stroke={IND} strokeWidth="2"/><text x="129" y="27" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>{bandCoeff.slice().reverse().join("π + ")}π = {blackCoeff}π black</text></g>
      </g>}

      {phase === 3 && <g>
        <g transform="translate(-6 21) scale(.75)"><CircleDesign centered/></g>
        <g transform="translate(42 223)"><rect width="141" height="39" rx="10" fill="#eef2ff" stroke={IND}/><text x="70.5" y="16" textAnchor="middle" fontSize="9" fontWeight="850" fill={DIM}>WHOLE OUTER CIRCLE</text><text x="70.5" y="32" textAnchor="middle" fontSize="13" fontWeight="900" fill={IND} fontFamily={FONT}>{outer}²π = {totalCoeff}π</text></g>
        <g transform="translate(202 55)"><rect width="225" height="158" rx="14" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="112.5" y="28" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>PERCENT BLACK</text><text x="112.5" y="61" textAnchor="middle" fontSize="18" fontWeight="900" fill={INK} fontFamily={FONT}>{blackCoeff}π / {totalCoeff}π × 100</text><text x="112.5" y="91" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>= 5/12 × 100</text><motion.text x="112.5" y="130" textAnchor="middle" fontSize="24" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT} initial={{ scale: .55 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>≈ {roundedPercent}%</motion.text></g>
        <text x="202" y="303" textAnchor="middle" fontSize="10" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? `${exactPercent.toFixed(2)}% rounds to the listed choice` : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={388} y={286} width={84}/>
      </g>}
    </svg>
  </div>;
}
