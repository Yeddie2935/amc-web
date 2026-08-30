import { AnimatePresence, motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { num, sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44";
const IND = "#4338ca";
const GREEN = "#16a34a";
const RED = "#dc2626";
const BLUE = "#2563eb";
const WHITE = "#f8fafc";
const DIM = "#94a3b8";

const colorOf = (name: string) => name === "R" ? "#f87171" : name === "B" ? "#60a5fa" : WHITE;
const strokeOf = (name: string) => name === "R" ? RED : name === "B" ? BLUE : DIM;

function PairIcon({ x, y, top, bottom, delay = 0, success = false }: { x: number; y: number; top: string; bottom: string; delay?: number; success?: boolean }) {
  return <motion.g initial={{ scale: 0.35, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay, type: "spring", stiffness: 190, damping: 17 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
    <path d={`M ${x} ${y} h 28 l -14 23 Z`} fill={colorOf(top)} stroke={strokeOf(top)} strokeWidth="1.7" />
    <path d={`M ${x} ${y + 48} h 28 l -14 -23 Z`} fill={colorOf(bottom)} stroke={strokeOf(bottom)} strokeWidth="1.7" />
    <line x1={x + 1} y1={y + 24} x2={x + 27} y2={y + 24} stroke={success ? GREEN : INK} strokeWidth="2" />
  </motion.g>;
}

function Inventory({ x, y, title, counts }: { x: number; y: number; title: string; counts: number[] }) {
  return <g><rect x={x} y={y} width="160" height="94" rx="12" fill="#f8fafc" stroke="#cbd5e1" /><text x={x + 80} y={y + 18} textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>{title}</text>{["R", "B", "W"].map((name, i) => <g key={name}><path d={`M ${x + 18} ${y + 30 + i * 20} h 18 l -9 15 Z`} fill={colorOf(name)} stroke={strokeOf(name)} /><text x={x + 52} y={y + 42 + i * 20} fontSize="12" fontWeight="950" fill={strokeOf(name)} fontFamily={FONT}>{name} = {counts[i]}</text>{Array.from({ length: counts[i] }, (_, j) => <circle key={j} cx={x + 91 + j * 8} cy={y + 38 + i * 20} r="3" fill={colorOf(name)} stroke={strokeOf(name)} strokeWidth="0.7" />)}</g>)}</g>;
}

/** Fold equal color inventories into pair slots and reconcile every specified coincidence to count white-white pairs. */
export function FoldedColorPairLedgerScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const initial = [num(data.red, 3), num(data.blue, 5), num(data.white, 8)];
  const rr = num(data.redRedPairs, 2);
  const bb = num(data.blueBluePairs, 3);
  const rw = num(data.redWhitePairs, 2);
  const afterSame = [initial[0] - rr, initial[1] - bb, initial[2]];
  const rwPerHalf = rw / 2;
  const afterCross = [afterSame[0] - rwPerHalf, afterSame[1], afterSame[2] - rwPerHalf];
  const bwPairs = afterCross[1] * 2;
  const whitePairs = afterCross[2] - afterCross[1];
  const choice = (problem.choices ?? []).find((item) => Number(item.text) === whitePairs)?.label;
  const valid = Number.isInteger(rwPerHalf) && afterCross[0] === 0 && whitePairs === num(data.whitePairs) && String(whitePairs) === problem.shortAnswer && choice === problem.answer;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%", minWidth: 0, padding: "5px 3px", boxSizing: "border-box" }}>
      <svg viewBox="0 0 470 315" width="100%" style={{ maxWidth: 500, minWidth: 0, display: "block" }} aria-label="Two colored triangle inventories fold together; known same-color and red-white pairs are removed, forcing blue-white pairs and leaving five white-white pairs">
        <text x="235" y="17" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>
          {phase === 0 ? "fold the upper half down: every overlap consumes one from each half" : phase === 1 ? "place the specified red-red and blue-blue coincidences" : phase === 2 ? "the two red-white pairs use opposite halves' last reds" : "the remaining blues must meet whites; then only white pairs remain"}
        </text>

        {phase === 0 && (
          <>
            <image href={String(data.imagePath ?? "")} x="25" y="36" width="172" height="230" preserveAspectRatio="xMidYMid meet" opacity="0.75" />
            <motion.path d="M 111 57 C 209 75 213 183 113 211" fill="none" stroke={IND} strokeWidth="3" markerEnd="url(#foldArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <text x="197" y="135" textAnchor="middle" fontSize="12" fontWeight="950" fill={IND}>FOLD</text>
            <Inventory x={283} y={43} title="UPPER HALF" counts={initial} />
            <Inventory x={283} y={174} title="LOWER HALF" counts={initial} />
            <motion.path d="M 363 141 V 166" stroke={IND} strokeWidth="2.3" markerEnd="url(#foldArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
            <text x="235" y="300" textAnchor="middle" fontSize="11" fontWeight="850" fill={INK}>Both halves begin with the same R=3, B=5, W=8 inventory.</text>
          </>
        )}

        {phase === 1 && (
          <>
            <Inventory x={19} y={40} title="EACH HALF: BEFORE" counts={initial} />
            <Inventory x={291} y={40} title="EACH HALF: AFTER" counts={afterSame} />
            <motion.path d="M 188 87 H 278" stroke={IND} strokeWidth="2.5" markerEnd="url(#foldArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />
            <text x="233" y="75" textAnchor="middle" fontSize="10" fontWeight="900" fill={IND}>remove</text>
            <text x="92" y="169" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED}>{rr} red-red pairs</text>
            {Array.from({ length: rr }, (_, i) => <PairIcon key={`rr${i}`} x={55 + i * 43} y={181} top="R" bottom="R" delay={i * 0.1} />)}
            <text x="326" y="169" textAnchor="middle" fontSize="11" fontWeight="900" fill={BLUE}>{bb} blue-blue pairs</text>
            {Array.from({ length: bb }, (_, i) => <PairIcon key={`bb${i}`} x={264 + i * 43} y={181} top="B" bottom="B" delay={0.2 + i * 0.1} />)}
            <text x="235" y="291" textAnchor="middle" fontSize="13" fontWeight="950" fill={INK} fontFamily={FONT}>each half: R {initial[0]}−{rr}={afterSame[0]}, B {initial[1]}−{bb}={afterSame[1]}, W={afterSame[2]}</text>
          </>
        )}

        {phase === 2 && (
          <>
            <Inventory x={19} y={42} title="EACH HALF: BEFORE" counts={afterSame} />
            <Inventory x={291} y={42} title="EACH HALF: AFTER" counts={afterCross} />
            <PairIcon x={184} y={61} top="R" bottom="W" delay={0.1} />
            <PairIcon x={231} y={61} top="W" bottom="R" delay={0.28} />
            <text x="221" y="139" textAnchor="middle" fontSize="11" fontWeight="900" fill={RED}>opposite orientations</text>
            <motion.path d="M 98 157 C 146 205 315 205 371 157" fill="none" stroke={IND} strokeWidth="2.4" markerEnd="url(#foldArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
            <rect x="90" y="220" width="290" height="55" rx="14" fill="#eef2ff" stroke={IND} />
            <text x="235" y="243" textAnchor="middle" fontSize="12" fontWeight="900" fill={INK}>one red and one white leave each half</text>
            <text x="235" y="263" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>each half: R=0, B={afterCross[1]}, W={afterCross[2]}</text>
          </>
        )}

        <AnimatePresence>
          {phase === 3 && (
            <motion.g key="finish" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x="117" y="47" textAnchor="middle" fontSize="11" fontWeight="900" fill={BLUE}>forced blue-white pairs</text>
              {Array.from({ length: bwPairs }, (_, i) => <PairIcon key={`bw${i}`} x={47 + (i % 2) * 46} y={61 + Math.floor(i / 2) * 60} top={i < 2 ? "B" : "W"} bottom={i < 2 ? "W" : "B"} delay={i * 0.1} />)}
              <text x="117" y="211" textAnchor="middle" fontSize="13" fontWeight="950" fill={BLUE} fontFamily={FONT}>{bwPairs} cross-color pairs</text>
              <motion.path d="M 180 135 H 226" stroke={GREEN} strokeWidth="2.5" markerEnd="url(#foldArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
              <text x="337" y="47" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN}>white-white pairs left</text>
              {Array.from({ length: whitePairs }, (_, i) => <PairIcon key={`ww${i}`} x={248 + (i % 3) * 48} y={61 + Math.floor(i / 3) * 61} top="W" bottom="W" success delay={0.45 + i * 0.09} />)}
              <text x="337" y="190" textAnchor="middle" fontSize="18" fontWeight="950" fill={GREEN} fontFamily={FONT}>{afterCross[2]} − {afterCross[1]} = {whitePairs}</text>
              <rect x="99" y="235" width="272" height="43" rx="14" fill={valid ? "#dcfce7" : "#fee2e2"} stroke={valid ? GREEN : RED} strokeWidth="2" />
              <text x="235" y="262" textAnchor="middle" fontSize="18" fontWeight="950" fill={valid ? GREEN : RED} fontFamily={FONT}>{whitePairs} white-white pairs</text>
              <text x="195" y="303" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={valid ? GREEN : RED} fontFamily={FONT}>{valid ? "all 16 triangles per half reconciled • choice verified" : `check failed: computed ${whitePairs}, stored ${problem.shortAnswer}`}</text>
              <SvgAnswerBadge show={valid} answer={problem.answer} cx={427} y={287} width={72} />
            </motion.g>
          )}
        </AnimatePresence>

        <defs><marker id="foldArrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 Z" fill={IND} /></marker></defs>
      </svg>
    </div>
  );
}
