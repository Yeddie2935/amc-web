import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";

type CardData = { color: string; letter: string };

function Card({ card, x, y, selected = false, winner = false, delay = 0 }: { card: CardData; x: number; y: number; selected?: boolean; winner?: boolean; delay?: number }) {
  const red = card.color === "red";
  const tone = winner ? GREEN : selected ? IND : red ? "#dc2626" : "#15803d";
  return <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 220, damping: 18, delay }}>
    <rect x={x} y={y} width="48" height="64" rx="7" fill={winner ? "#f0fdf4" : "#fff"} stroke={tone} strokeWidth={selected || winner ? 2.8 : 1.8} />
    <circle cx={x + 12} cy={y + 13} r="5" fill={red ? "#ef4444" : "#22c55e"} />
    <text x={x + 24} y={y + 43} textAnchor="middle" fontSize="22" fontWeight="950" fill={tone} fontFamily={FONT}>{card.letter}</text>
  </motion.g>;
}

/** Fix one two-attribute card, then sort every possible partner by the winning rule. */
export function TwoAttributeCardSortScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const colors = (Array.isArray(data.colors) ? data.colors : []).map(String);
  const letters = (Array.isArray(data.letters) ? data.letters : []).map(String);
  const fixed: CardData = { color: String(data.fixedColor ?? ""), letter: String(data.fixedLetter ?? "") };
  const deck = colors.flatMap(color => letters.map(letter => ({ color, letter })));
  const remaining = deck.filter(card => !(card.color === fixed.color && card.letter === fixed.letter));
  const winners = remaining.filter(card => card.color === fixed.color || card.letter === fixed.letter);
  const losers = remaining.filter(card => card.color !== fixed.color && card.letter !== fixed.letter);
  const sameColor = winners.filter(card => card.color === fixed.color).length;
  const sameLetter = winners.filter(card => card.letter === fixed.letter).length;
  const fraction = `${winners.length}/${remaining.length}`;
  const choice = problem.choices?.find(item => item.text.replace(/\s/g, "") === fraction)?.label;
  const ok = deck.length === 8 && remaining.length === 7 && winners.length === 4 && sameColor === 3 && sameLetter === 1 &&
    new Set(deck.map(card => `${card.color}:${card.letter}`)).size === deck.length && fraction === problem.shortAnswer && choice === problem.answer;
  const failure = deck.length !== 8 ? `built ${deck.length} cards` : remaining.length !== 7 ? `${remaining.length} cards remain` :
    winners.length !== 4 ? `counted ${winners.length} winners` : sameColor !== 3 || sameLetter !== 1 ? `split is ${sameColor} same-color + ${sameLetter} same-letter` :
    fraction !== problem.shortAnswer ? `computed ${fraction}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 2 : Math.min(step, 1);

  return <div style={{ width: "100%", display: "flex", justifyContent: "center", minWidth: 0, padding: "5px 2px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 470 310" width="100%" style={{ maxWidth: 500, display: "block" }} aria-label="Seven possible second cards sorted into winning and losing partners">
      <text x="235" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "fix one card; each of the seven remaining cards is equally likely" : phase === 1 ? "sort every possible partner by same color or same letter" : "four of the seven possible partners make a winning pair"}</text>

      {phase === 0 && <>
        <text x="57" y="49" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={IND}>FIRST CARD</text>
        <Card card={fixed} x={33} y={62} selected />
        <path d="M105 94H142" stroke="#94a3b8" strokeWidth="2" markerEnd="url(#card-arrow)" />
        <text x="304" y="49" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={DIM}>7 POSSIBLE SECOND CARDS</text>
        {remaining.map((card, i) => <Card key={`${card.color}-${card.letter}`} card={card} x={151 + (i % 4) * 70} y={62 + Math.floor(i / 4) * 83} delay={i * .08} />)}
        <g transform="translate(129 235)"><rect width="212" height="43" rx="12" fill="#eef2ff" stroke={IND} strokeWidth="2" /><text x="106" y="18" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>DENOMINATOR</text><text x="106" y="35" textAnchor="middle" fontSize="16" fontWeight="950" fill={IND} fontFamily={FONT}>8 − 1 = 7 choices</text></g>
      </>}

      {phase === 1 && <>
        <g transform="translate(16 61)"><text x="45" y="-12" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={IND}>FIXED</text><Card card={fixed} x={21} y={0} selected /></g>
        <line x1="105" y1="40" x2="105" y2="270" stroke="#cbd5e1" strokeWidth="1.5" />
        <g transform="translate(126 43)"><rect width="326" height="112" rx="14" fill="#f0fdf4" stroke="#86efac" /><text x="163" y="18" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>WINNERS: SAME COLOR OR SAME LETTER</text>{winners.map((card, i) => <Card key={`${card.color}-${card.letter}`} card={card} x={18 + i * 76} y={31} winner delay={i * .1} />)}<text x="163" y="105" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN} fontFamily={FONT}>{sameColor} same color + {sameLetter} same letter = {winners.length}</text></g>
        <g transform="translate(126 174)"><rect width="250" height="96" rx="14" fill="#f8fafc" stroke="#cbd5e1" /><text x="125" y="18" textAnchor="middle" fontSize="10" fontWeight="900" fill={DIM}>NOT SAME COLOR OR LETTER</text>{losers.map((card, i) => <Card key={`${card.color}-${card.letter}`} card={card} x={24 + i * 72} y={27} delay={.45 + i * .08} />)}</g>
      </>}

      {phase === 2 && <>
        <g transform="translate(24 48)"><text x="49" y="-10" textAnchor="middle" fontSize="9.5" fontWeight="900" fill={IND}>FIXED CARD</text><Card card={fixed} x={25} y={0} selected /></g>
        <g transform="translate(127 44)"><rect width="319" height="105" rx="14" fill="#f0fdf4" stroke={GREEN} strokeWidth="2" /><text x="159.5" y="20" textAnchor="middle" fontSize="10" fontWeight="900" fill={GREEN}>4 WINNING PARTNERS</text>{winners.map((card, i) => <Card key={`${card.color}-${card.letter}`} card={card} x={20 + i * 74} y={31} winner delay={i * .08} />)}</g>
        <g transform="translate(104 174)"><rect width="262" height="93" rx="15" fill={ok ? "#f0fdf4" : "#fef2f2"} stroke={ok ? GREEN : RED} strokeWidth="2.5" /><text x="62" y="35" textAnchor="middle" fontSize="29" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{winners.length}</text><line x1="41" y1="44" x2="83" y2="44" stroke={INK} strokeWidth="2" /><text x="62" y="72" textAnchor="middle" fontSize="29" fontWeight="950" fill={INK} fontFamily={FONT}>{remaining.length}</text><text x="120" y="56" textAnchor="middle" fontSize="22" fontWeight="950" fill={DIM}>=</text><text x="187" y="57" textAnchor="middle" fontSize="30" fontWeight="950" fill={ok ? GREEN : RED} fontFamily={FONT}>{fraction}</text><text x="187" y="78" textAnchor="middle" fontSize="8.5" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? "all seven partners checked" : failure}</text></g>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={418} y={232} width={78} />
      </>}
      <defs><marker id="card-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#94a3b8" /></marker></defs>
    </svg>
  </div>;
}
