import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", ORANGE = "#d97706", RED = "#dc2626", DIM = "#64748b";

/** Restore a discounted package's missing price share, then duplicate packages to reach the target weight. */
export function DiscountPackageDoublingScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const weightNum = Math.round(num(data.packageWeightNumerator, 0));
  const weightDen = Math.round(num(data.packageWeightDenominator, 1));
  const packageWeight = weightNum / weightDen;
  const salePrice = num(data.salePrice, 0);
  const discountPercent = num(data.discountPercent, 0);
  const targetWeight = num(data.targetWeightPounds, 0);
  const paidFraction = 1 - discountPercent / 100;
  const regularPackagePrice = salePrice / paidFraction;
  const packageCount = targetWeight / packageWeight;
  const fullPrice = regularPackagePrice * packageCount;
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === fullPrice)?.label;
  const ok = Number.isInteger(packageCount) && Number(problem.shortAnswer) === fullPrice && choice === problem.answer;
  const failure = !Number.isInteger(packageCount) ? `${packageCount} packages is not whole` : Number(problem.shortAnswer) !== fullPrice ? `computed ${fullPrice}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const phase = step >= totalSteps - 1 ? 2 : Math.min(step, 1);
  const weightText = weightNum === 1 && weightDen === 2 ? "½ lb" : `${weightNum}/${weightDen} lb`;
  const captions = [
    `${discountPercent}% off means the sale tag is half the regular price`,
    `restore the missing half of the ${weightText} package price`,
    `join ${packageCount} half-pound packages to make ${targetWeight} pound`,
  ];

  const Fish = ({ x, y, color = IND }: { x: number; y: number; color?: string }) => <g transform={`translate(${x} ${y})`}><path d="M5 18 C18 1 45 3 58 18 C45 33 18 35 5 18 Z" fill={`${color}20`} stroke={color} strokeWidth="2"/><path d="M6 18 L-7 7 V29 Z" fill={`${color}20`} stroke={color} strokeWidth="2"/><circle cx="46" cy="14" r="2.4" fill={color}/><path d="M26 9 Q33 18 26 27" fill="none" stroke={color} strokeWidth="1.4"/></g>;
  const Package = ({ x, tone = IND, label = weightText }: { x: number; tone?: string; label?: string }) => <g transform={`translate(${x} 53)`}><rect width="142" height="104" rx="14" fill={`${tone}0d`} stroke={tone} strokeWidth="2"/><path d="M0 25 H142" stroke={tone} strokeWidth="1.4"/><text x="71" y="18" textAnchor="middle" fontSize="11" fontWeight="900" fill={tone} fontFamily={FONT}>{label}</text><Fish x={42} y={50} color={tone}/></g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "6px 4px", boxSizing: "border-box" }}>
    <svg viewBox="0 0 460 310" width="100%" style={{ width: "100%", maxWidth: 340, minWidth: 0, display: "block" }}>
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{captions[phase]}</text>

      {phase <= 1 && <>
        <Package x={56}/>
        <g transform="translate(230 57)"><text x="87" y="13" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>regular price bar</text><rect x="0" y="28" width="174" height="60" rx="10" fill="#f8fafc" stroke={INK} strokeWidth="1.5"/><motion.rect x="0" y="28" width="87" height="60" rx="10" fill="#c7d2fe" stroke={IND} strokeWidth="1.5" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} style={{ transformBox: "fill-box", transformOrigin: "left" }}/><text x="43.5" y="64" textAnchor="middle" fontSize="16" fontWeight="900" fill={IND} fontFamily={FONT}>${salePrice}</text><line x1="87" y1="28" x2="87" y2="88" stroke={INK} strokeWidth="1.5"/>
          {phase === 0 ? <><rect x="87" y="28" width="87" height="60" rx="10" fill="#fff7ed" stroke={ORANGE} strokeDasharray="5 4"/><text x="130.5" y="62" textAnchor="middle" fontSize="13" fontWeight="900" fill={ORANGE}>missing</text><text x="87" y="111" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM} fontFamily={FONT}>${salePrice} = {discountPercent}% of regular</text></> : <><motion.rect x="87" y="28" width="87" height="60" rx="10" fill="#fde68a" stroke={ORANGE} strokeWidth="1.5" initial={{ x: 65, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 120 }}/><text x="130.5" y="64" textAnchor="middle" fontSize="16" fontWeight="900" fill={ORANGE} fontFamily={FONT}>${salePrice}</text><text x="87" y="111" textAnchor="middle" fontSize="13" fontWeight="900" fill={INK} fontFamily={FONT}>${salePrice} + ${salePrice} = ${regularPackagePrice}</text></>}
        </g>
        <g transform="translate(95 220)"><rect width="270" height="52" rx="11" fill={phase === 0 ? "#eef2ff" : "#fff7ed"} stroke={phase === 0 ? IND : ORANGE}/><text x="135" y="20" textAnchor="middle" fontSize="10.5" fontWeight="850" fill={DIM}>{phase === 0 ? "the sale keeps one of two equal price halves" : `regular price for one ${weightText} package`}</text><text x="135" y="41" textAnchor="middle" fontSize="16" fontWeight="900" fill={phase === 0 ? IND : ORANGE} fontFamily={FONT}>{phase === 0 ? `${paidFraction * 100}% = 1/2` : `$${salePrice} ÷ ${paidFraction} = $${regularPackagePrice}`}</text></g>
      </>}

      {phase === 2 && <>
        <motion.g initial={{ x: 95, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 110 }}><Package x={64} tone={IND}/></motion.g>
        <motion.g initial={{ x: -95, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: "spring", stiffness: 110 }}><Package x={254} tone={ORANGE}/></motion.g>
        <path d="M64 176 V190 H396 V176" fill="none" stroke={GREEN} strokeWidth="2.5"/><text x="230" y="209" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT}>{weightText} + {weightText} = {targetWeight} lb</text>
        <g transform="translate(92 223)"><rect width="276" height="56" rx="12" fill={ok ? "#dcfce7" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2"/><text x="138" y="20" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>two regular-price packages</text><text x="138" y="43" textAnchor="middle" fontSize="18" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{packageCount} × ${regularPackagePrice} = ${fullPrice}</text></g>
        <text x="155" y="301" textAnchor="middle" fontSize="8.8" fontWeight="800" fill={ok ? GREEN : RED} fontFamily={FONT}>{ok ? "discount, weight, total, and choice verified" : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={370} y={286} width={80}/>
      </>}
      <AnimatePresence>{phase === 2 && !ok && <motion.text x="230" y="307" textAnchor="middle" fontSize="9" fill={RED}>{failure}</motion.text>}</AnimatePresence>
    </svg>
  </div>;
}
