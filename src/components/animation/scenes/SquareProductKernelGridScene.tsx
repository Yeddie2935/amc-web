import { motion } from "motion/react";
import type { AnimatedSceneProps } from "./types";
import { sceneData, SvgAnswerBadge } from "./sceneKit";

const FONT = "ui-monospace, SFMono-Regular, Menlo, monospace";
const INK = "#1f2a44", IND = "#4338ca", TEAL = "#0d9488", GREEN = "#16a34a", RED = "#dc2626", DIM = "#64748b";
const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : Math.abs(a);
const squareFreeCore = (value: number) => {
  let n = value, core = 1;
  for (let p = 2; p * p <= n; p++) {
    let odd = false;
    while (n % p === 0) { n /= p; odd = !odd; }
    if (odd) core *= p;
  }
  return core * n;
};

/** Reduce tile and die values to squarefree cores, then light their matching outcome cells. */
export function SquareProductKernelGridScene({ problem, step, totalSteps }: AnimatedSceneProps) {
  const data = sceneData(problem);
  const tiles = (Array.isArray(data.tileValues) ? data.tileValues : []).map(Number);
  const dice = (Array.isArray(data.dieValues) ? data.dieValues : []).map(Number);
  const tileCores = tiles.map(squareFreeCore), dieCores = dice.map(squareFreeCore);
  const outcomes = dice.flatMap((die, row) => tiles.map((tile, col) => ({ die, tile, row, col, product: die * tile, match: dieCores[row] === tileCores[col] })));
  const favorable = outcomes.filter(o => o.match);
  const rowCounts = dice.map((_, row) => favorable.filter(o => o.row === row).length);
  const divisor = gcd(favorable.length, outcomes.length) || 1;
  const answer = `${favorable.length / divisor}/${outcomes.length / divisor}`;
  const choice = problem.choices?.find(c => c.text === answer)?.label;
  const squareCheck = favorable.every(o => Number.isInteger(Math.sqrt(o.product))) && outcomes.filter(o => Number.isInteger(Math.sqrt(o.product))).length === favorable.length;
  const ok = favorable.length === 11 && outcomes.length === 60 && squareCheck && answer === problem.shortAnswer && choice === problem.answer;
  const failure = outcomes.length !== 60 ? `generated ${outcomes.length} outcomes` : !squareCheck ? "core matches disagree with square products" : favorable.length !== 11 ? `counted ${favorable.length} squares` : answer !== problem.shortAnswer ? `computed ${answer}, stored ${problem.shortAnswer}` : `choice ${choice ?? "missing"}, stored ${problem.answer}`;
  const final = step >= totalSteps - 1;
  const phase = final ? 3 : Math.min(step, 2);
  const gx = 91, gy = 67, cw = 34, ch = 31;

  const Grid = ({ matches }: { matches: boolean }) => <g>
    <text x={gx + tiles.length * cw / 2} y="37" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM}>TILE → COLUMNS</text>
    {tiles.map((tile, col) => <g key={tile}><rect x={gx + col * cw + 3} y="43" width="28" height="21" rx="5" fill="#eef2ff" stroke={IND}/><text x={gx + col * cw + 17} y="58" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{tile}</text></g>)}
    <text x="33" y={gy + dice.length * ch / 2} textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} transform={`rotate(-90 33 ${gy + dice.length * ch / 2})`}>DIE → ROWS</text>
    {dice.map((die, row) => <g key={die}><rect x="54" y={gy + row * ch + 2} width="29" height="26" rx="6" fill="#ecfeff" stroke={TEAL}/><text x="68.5" y={gy + row * ch + 20} textAnchor="middle" fontSize="12" fontWeight="900" fill={TEAL} fontFamily={FONT}>{die}</text></g>)}
    {outcomes.map((o, index) => <motion.g key={`${o.die}-${o.tile}`} initial={{ scale: .65 }} animate={{ scale: 1 }} transition={{ delay: index * .012 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}><rect x={gx + o.col * cw + 2} y={gy + o.row * ch + 1} width="30" height="28" rx="5" fill={matches && o.match ? "#dcfce7" : "#f8fafc"} stroke={matches && o.match ? GREEN : "#cbd5e1"} strokeWidth={matches && o.match ? 2 : 1}/><text x={gx + o.col * cw + 17} y={gy + o.row * ch + 19} textAnchor="middle" fontSize="9" fontWeight="900" fill={matches && o.match ? GREEN : DIM} fontFamily={FONT}>{matches && o.match ? "✓" : o.product}</text></motion.g>)}
  </g>;

  return <div style={{ display: "flex", justifyContent: "center", width: "100%", maxWidth: 480, minWidth: 0, padding: "6px 4px", boxSizing: "border-box", overflow: "hidden" }}>
    <svg viewBox="0 0 460 320" width="100%" style={{ maxWidth: "100%", display: "block" }} aria-label="Ten tile values and six die values forming a grid whose square products have matching squarefree cores">
      <text x="230" y="18" textAnchor="middle" fontSize="11.5" fontWeight="850" fill={INK}>{phase === 0 ? "each tile can pair with each die face" : phase === 1 ? "remove square factor pairs: only each value's core remains" : phase === 2 ? "equal cores pair up to make a perfect square" : "put the eleven square-product cells over all sixty outcomes"}</text>

      {phase === 0 && <g><Grid matches={false}/><g transform="translate(119 273)"><rect width="222" height="36" rx="10" fill="#eef2ff" stroke={IND}/><text x="111" y="24" textAnchor="middle" fontSize="15" fontWeight="900" fill={IND} fontFamily={FONT}>{tiles.length} tiles × {dice.length} faces = {outcomes.length}</text></g></g>}

      {phase === 1 && <g>
        <text x="31" y="54" fontSize="10" fontWeight="900" fill={IND}>TILES</text><g transform="translate(68 36)">{tiles.map((value, i) => <motion.g key={value} initial={{ y: -10 }} animate={{ y: 0 }} transition={{ delay: i * .06 }}><rect x={i * 38} width="33" height="47" rx="7" fill="#eef2ff" stroke={IND}/><text x={i * 38 + 16.5} y="17" textAnchor="middle" fontSize="10" fontWeight="850" fill={DIM} fontFamily={FONT}>{value}</text><path d={`M${i * 38 + 8} 23h17`} stroke="#cbd5e1"/><text x={i * 38 + 16.5} y="40" textAnchor="middle" fontSize="14" fontWeight="900" fill={IND} fontFamily={FONT}>{tileCores[i]}</text></motion.g>)}</g>
        <text x="31" y="132" fontSize="10" fontWeight="900" fill={TEAL}>DIE</text><g transform="translate(75 111)">{dice.map((value, i) => <motion.g key={value} initial={{ y: 10 }} animate={{ y: 0 }} transition={{ delay: .15 + i * .08 }}><rect x={i * 58} width="47" height="55" rx="9" fill="#ecfeff" stroke={TEAL}/><text x={i * 58 + 23.5} y="21" textAnchor="middle" fontSize="12" fontWeight="850" fill={DIM} fontFamily={FONT}>{value}</text><path d={`M${i * 58 + 10} 28h27`} stroke="#cbd5e1"/><text x={i * 58 + 23.5} y="47" textAnchor="middle" fontSize="16" fontWeight="900" fill={TEAL} fontFamily={FONT}>{dieCores[i]}</text></motion.g>)}</g>
        <g transform="translate(75 205)"><rect width="310" height="74" rx="13" fill="#f8fafc" stroke="#cbd5e1"/><text x="155" y="24" textAnchor="middle" fontSize="11" fontWeight="850" fill={DIM}>why cores work</text><text x="155" y="49" textAnchor="middle" fontSize="16" fontWeight="900" fill={INK} fontFamily={FONT}>8 × 2 = (2²·2) × 2 = 4²</text><text x="155" y="67" textAnchor="middle" fontSize="10" fontWeight="850" fill={GREEN}>core 2 matches core 2</text></g>
      </g>}

      {phase === 2 && <g><Grid matches/><g transform="translate(87 273)"><rect width="286" height="37" rx="10" fill="#dcfce7" stroke={GREEN}/><text x="143" y="15" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={DIM}>square cells by die row</text><text x="143" y="30" textAnchor="middle" fontSize="13" fontWeight="900" fill={GREEN} fontFamily={FONT}>{rowCounts.join(" + ")} = {favorable.length}</text></g></g>}

      {phase === 3 && <g>
        <g transform="translate(49 52)">{dice.map((die, row) => <g key={die} transform={`translate(0 ${row * 34})`}><motion.g initial={{ x: -10 }} animate={{ x: 0 }} transition={{ delay: row * .08 }}><rect width="260" height="27" rx="7" fill="#f8fafc" stroke="#cbd5e1"/><rect x="10" y="5" width="17" height="17" rx="4" fill="#ecfeff" stroke={TEAL}/><text x="18.5" y="18" textAnchor="middle" fontSize="10" fontWeight="900" fill={TEAL} fontFamily={FONT}>{die}</text><text x="39" y="18" fontSize="10" fontWeight="850" fill={INK} fontFamily={FONT}>core {dieCores[row]}</text><text x="240" y="18" textAnchor="end" fontSize="12" fontWeight="900" fill={GREEN} fontFamily={FONT}>{rowCounts[row]} squares</text></motion.g></g>)}</g>
        <g transform="translate(326 62)"><text x="48" y="18" textAnchor="middle" fontSize="11" fontWeight="900" fill={GREEN} fontFamily={FONT}>{favorable.length} favorable</text><text x="48" y="43" textAnchor="middle" fontSize="11" fontWeight="900" fill={IND} fontFamily={FONT}>{outcomes.length} total</text><path d="M48 51v15" stroke={INK} strokeWidth="2"/><motion.rect x="0" y="75" width="96" height="55" rx="12" fill={ok ? "#dcfce7" : "#fee2e2"} stroke={ok ? GREEN : RED} strokeWidth="2" initial={{ scale: .6 }} animate={{ scale: 1 }} style={{ transformBox: "fill-box", transformOrigin: "center" }}/><text x="48" y="110" textAnchor="middle" fontSize="21" fontWeight="900" fill={ok ? GREEN : RED} fontFamily={FONT}>{answer}</text></g>
        <text x="180" y="285" textAnchor="middle" fontSize="9.5" fontWeight="850" fill={ok ? GREEN : RED}>{ok ? "all products, cores, counts, fraction, and choice verified" : failure}</text>
        <SvgAnswerBadge show={ok} answer={problem.answer} cx={405} y={266} width={78}/>
      </g>}
    </svg>
  </div>;
}
