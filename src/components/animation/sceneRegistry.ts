import type { Problem } from "../../types/amc";
import type { AnimatedScene } from "./scenes/types";
import { ClockAngleScene } from "./scenes/ClockAngleScene";
import { DigitSlotsScene } from "./scenes/DigitSlotsScene";
import { Solid3DScene } from "./scenes/Solid3DScene";
import { EquationScene } from "./scenes/EquationScene";
import { GroupedSumScene } from "./scenes/GroupedSumScene";
import { NumberGridScene } from "./scenes/NumberGridScene";
import { BudgetCheckScene } from "./scenes/BudgetCheckScene";
import { PercentBarScene } from "./scenes/PercentBarScene";
import { TimelineScene } from "./scenes/TimelineScene";
import { BorderAreaScene } from "./scenes/BorderAreaScene";
import { BatteryScene } from "./scenes/BatteryScene";
import { FractionReduceScene } from "./scenes/FractionReduceScene";
import { RadicalFractionScene } from "./scenes/RadicalFractionScene";
import { RankingScene } from "./scenes/RankingScene";
import { FibonacciSpiralScene } from "./scenes/FibonacciSpiralScene";
import { CircleSumGraphScene } from "./scenes/CircleSumGraphScene";
import { LatticeSquareScene } from "./scenes/LatticeSquareScene";
import { NumberLineScene } from "./scenes/NumberLineScene";
import { GrayCubeScene } from "./scenes/GrayCubeScene";
import { FractionCountScene } from "./scenes/FractionCountScene";
import { AdjacencyRearrangeScene } from "./scenes/AdjacencyRearrangeScene";
import { ConsecutiveSumScene } from "./scenes/ConsecutiveSumScene";
import { RoundTripChaseScene } from "./scenes/RoundTripChaseScene";
import { CoinStackScene } from "./scenes/CoinStackScene";
import { MarkovWalkScene } from "./scenes/MarkovWalkScene";
import { MedianOfMediansScene } from "./scenes/MedianOfMediansScene";
import { ElasticBandScene } from "./scenes/ElasticBandScene";
import { StaircaseSumScene } from "./scenes/StaircaseSumScene";
import { CornerCutHexagonScene } from "./scenes/CornerCutHexagonScene";
import { ShadedGridScene } from "./scenes/ShadedGridScene";
import { AdditiveNumeralScene } from "./scenes/AdditiveNumeralScene";
import { ShareOutScene } from "./scenes/ShareOutScene";
import { ArithmeticHopScene } from "./scenes/ArithmeticHopScene";
import { GridRouteScene } from "./scenes/GridRouteScene";
import { RemainderBlocksScene } from "./scenes/RemainderBlocksScene";
import { CumulativeBandsScene } from "./scenes/CumulativeBandsScene";
import { CubeNetScene } from "./scenes/CubeNetScene";
import { ClockPairsScene } from "./scenes/ClockPairsScene";
import { RotatedOverlapScene } from "./scenes/RotatedOverlapScene";

function num(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Faithfulness-only selection. A diagram is used only when it depicts the
 * actual problem from real data:
 *   - clock-angle  : parses the real time from the statement
 *   - counting     : real slot/choice/adjustment data
 *   - solid-3d     : only with a real n×n×n unit grid (data.n)
 * Everything else renders the equation walkthrough built from the actual
 * solution steps — never a generic/decorative shape.
 */
export function resolveScene(problem: Problem): AnimatedScene {
  const type = problem.animation?.type;
  const data = problem.animation?.data ?? {};

  // Only use the clock when a real time (H:MM) is in the problem; otherwise the
  // scene would invent one. Mis-tagged "clock" problems fall to the walkthrough.
  if (type === "clock-angle" && /\d{1,2}:\d{2}/.test(`${problem.title} ${problem.statement}`)) {
    return ClockAngleScene;
  }
  if (type === "grouped-sum" && Array.isArray(data.terms) && data.terms.length > 0) {
    return GroupedSumScene;
  }
  if (type === "number-grid" && Array.isArray(data.rows) && data.rows.length > 0) {
    return NumberGridScene;
  }
  if (type === "budget-check" && Array.isArray(data.names) && data.names.length > 0) {
    return BudgetCheckScene;
  }
  if (type === "percent-bar" && Array.isArray(data.factors) && data.factors.length > 0) {
    return PercentBarScene;
  }
  if (type === "timeline" && Array.isArray(data.segValues) && data.segValues.length > 0) {
    return TimelineScene;
  }
  if (type === "border-area" && num(data.outerW ?? 0) > 0 && num(data.outerH ?? 0) > 0) {
    return BorderAreaScene;
  }
  if (type === "battery" && Array.isArray(data.segNums) && data.segNums.length > 0) {
    return BatteryScene;
  }
  if (type === "fraction-reduce" && num(data.den ?? 0) > 0) {
    return FractionReduceScene;
  }
  if (type === "radical-fraction" && Array.isArray(data.numChain) && Array.isArray(data.denChain)) {
    return RadicalFractionScene;
  }
  if (type === "ranking" && Array.isArray(data.names) && data.names.length > 0 && Array.isArray(data.values)) {
    return RankingScene;
  }
  if (type === "fibonacci-spiral" && Array.isArray(data.radii) && data.radii.length > 0) {
    return FibonacciSpiralScene;
  }
  if (type === "circle-sum-graph" && Array.isArray(data.xs) && data.xs.length > 0) {
    return CircleSumGraphScene;
  }
  if (type === "lattice-square" && (num(data.dx ?? 0) !== 0 || num(data.dy ?? 0) !== 0)) {
    return LatticeSquareScene;
  }
  if (type === "number-line" && Array.isArray(data.pairSums) && data.pairSums.length >= 2) {
    return NumberLineScene;
  }
  if (type === "gray-cube" && num(data.cubes ?? 0) > 0) {
    return GrayCubeScene;
  }
  if (type === "fraction-count" && Array.isArray(data.items) && data.items.length > 0) {
    return FractionCountScene;
  }
  if (type === "adjacency-rearrange" && Array.isArray(data.valid) && data.valid.length > 0) {
    return AdjacencyRearrangeScene;
  }
  if (type === "consecutive-sum" && Array.isArray(data.ways) && data.ways.length > 0) {
    return ConsecutiveSumScene;
  }
  if (type === "round-trip-chase" && num(data.speedRatio ?? 0) > 0) {
    return RoundTripChaseScene;
  }
  if (type === "coin-stack" && Array.isArray(data.cases) && data.cases.length > 0) {
    return CoinStackScene;
  }
  if (type === "markov-walk" && Array.isArray(data.transition) && data.transition.length > 0) {
    return MarkovWalkScene;
  }
  if (type === "median-of-medians" && Array.isArray(data.groups) && data.groups.length > 0) {
    return MedianOfMediansScene;
  }
  if (type === "elastic-band" && Array.isArray(data.coins) && data.coins.length > 0) {
    return ElasticBandScene;
  }
  if (type === "staircase-sum" && num(data.prime ?? 0) > 1 && num(data.nMax ?? 0) > 0) {
    return StaircaseSumScene;
  }
  if (type === "corner-cut-hexagon" && num(data.side ?? 0) > 1) {
    return CornerCutHexagonScene;
  }
  if (
    type === "shaded-grid" &&
    num(data.grid ?? 0) > 1 &&
    (Array.isArray(data.squares) || Array.isArray(data.triangles))
  ) {
    return ShadedGridScene;
  }
  if (type === "additive-numeral" && Array.isArray(data.groups) && data.groups.length > 0) {
    return AdditiveNumeralScene;
  }
  if (type === "share-out" && Array.isArray(data.rounds) && data.rounds.length > 1) {
    return ShareOutScene;
  }
  if (type === "arithmetic-hop" && num(data.step ?? 0) !== 0 && num(data.n ?? 0) > 1) {
    return ArithmeticHopScene;
  }
  if (type === "grid-route" && Array.isArray(data.stops) && data.stops.length > 1) {
    return GridRouteScene;
  }
  if (type === "remainder-blocks" && Array.isArray(data.numbers) && data.numbers.length > 0 && num(data.divisor ?? 0) > 1) {
    return RemainderBlocksScene;
  }
  if (type === "cumulative-bands" && Array.isArray(data.cutoffs) && data.cutoffs.length > 1) {
    return CumulativeBandsScene;
  }
  if (type === "cube-net" && Array.isArray(data.cells) && data.cells.length > 0 && num(data.totalArea ?? 0) > 0) {
    return CubeNetScene;
  }
  if (type === "clock-pairs" && num(data.n ?? 0) > 1) {
    return ClockPairsScene;
  }
  if (type === "rotated-overlap" && num(data.w ?? 0) > 0 && num(data.h ?? 0) > 0) {
    return RotatedOverlapScene;
  }
  if (type === "counting") return DigitSlotsScene;
  if (type === "solid-3d" && num(data.n ?? data.size ?? data.cubes) > 1) {
    return Solid3DScene;
  }
  return EquationScene;
}

// True when the problem renders the text walkthrough (EquationScene) rather than
// a diagram. The player uses this to avoid repeating the step body: diagram
// scenes need the body as caption narration; the walkthrough already shows it.
export function isWalkthroughScene(problem: Problem): boolean {
  return resolveScene(problem) === EquationScene;
}
