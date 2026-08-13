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
import { TetrominoTilingScene } from "./scenes/TetrominoTilingScene";
import { InscribedCircleScene } from "./scenes/InscribedCircleScene";
import { RemainderHistogramScene } from "./scenes/RemainderHistogramScene";
import { MeanMedianScene } from "./scenes/MeanMedianScene";
import { FoldPairsScene } from "./scenes/FoldPairsScene";
import { PairedChoiceScene } from "./scenes/PairedChoiceScene";
import { FlowGraphScene } from "./scenes/FlowGraphScene";
import { CircleSquareShadeScene } from "./scenes/CircleSquareShadeScene";
import { SpeedZoneMeetScene } from "./scenes/SpeedZoneMeetScene";
import { HalvingShareScene } from "./scenes/HalvingShareScene";
import { GraphLabelScene } from "./scenes/GraphLabelScene";
import { EqualSpacingScene } from "./scenes/EqualSpacingScene";
import { CandidateSieveScene } from "./scenes/CandidateSieveScene";
import { TrapezoidFamilyScene } from "./scenes/TrapezoidFamilyScene";
import { PathAreaPairingScene } from "./scenes/PathAreaPairingScene";
import { OnesDigitColumnScene } from "./scenes/OnesDigitColumnScene";
import { FractionDecimalSumScene } from "./scenes/FractionDecimalSumScene";
import { NestedSquaresScene } from "./scenes/NestedSquaresScene";
import { PerfectSquareRemoveScene } from "./scenes/PerfectSquareRemoveScene";
import { DiceSumGridScene } from "./scenes/DiceSumGridScene";
import { RinkPathsScene } from "./scenes/RinkPathsScene";
import { TileMinimumScene } from "./scenes/TileMinimumScene";
import { BranchValueTreeScene } from "./scenes/BranchValueTreeScene";
import { RatioUnitScene } from "./scenes/RatioUnitScene";
import { LinearTrendScene } from "./scenes/LinearTrendScene";
import { TriangleBaseHeightScene } from "./scenes/TriangleBaseHeightScene";
import { LevelBarsScene } from "./scenes/LevelBarsScene";
import { HopPathScene } from "./scenes/HopPathScene";
import { ShortestRouteScene } from "./scenes/ShortestRouteScene";
import { RepeatBlockScene } from "./scenes/RepeatBlockScene";
import { BlockCoverScene } from "./scenes/BlockCoverScene";
import { KingPlacementScene } from "./scenes/KingPlacementScene";
import { ConcentricSectorScene } from "./scenes/ConcentricSectorScene";
import { TwoWayTableScene } from "./scenes/TwoWayTableScene";
import { CubeTriangleScene } from "./scenes/CubeTriangleScene";
import { RatioShiftScene } from "./scenes/RatioShiftScene";
import { UnrollTapeScene } from "./scenes/UnrollTapeScene";
import { LatticeCrossScene } from "./scenes/LatticeCrossScene";
import { MountainOverlapScene } from "./scenes/MountainOverlapScene";
import { SeatPairScene } from "./scenes/SeatPairScene";

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
  if (type === "tetromino-tiling" && Array.isArray(data.pieces) && data.pieces.length > 0) {
    return TetrominoTilingScene;
  }
  if (type === "inscribed-circle" && Array.isArray(data.cells) && data.cells.length > 0) {
    return InscribedCircleScene;
  }
  if (type === "remainder-histogram" && num(data.divisor ?? 0) > 1 && num(data.step ?? 0) > 0) {
    return RemainderHistogramScene;
  }
  if (type === "mean-median" && Array.isArray(data.base) && data.base.length > 0 && num(data.multiplier ?? 0) > 0) {
    return MeanMedianScene;
  }
  if (type === "fold-pairs" && num(data.rows ?? 0) > 0 && num(data.cols ?? 0) > 1) {
    return FoldPairsScene;
  }
  if (type === "paired-choice" && num(data.n ?? 0) > 0 && Array.isArray(data.examples) && data.examples.length > 0) {
    return PairedChoiceScene;
  }
  if (type === "flow-graph" && Array.isArray(data.nodes) && data.nodes.length > 0 && Array.isArray(data.edges)) {
    return FlowGraphScene;
  }
  if (type === "circle-square-shade" && num(data.r ?? 0) > 0) {
    return CircleSquareShadeScene;
  }
  if (type === "speed-zone-meet" && Array.isArray(data.zones) && data.zones.length > 0) {
    return SpeedZoneMeetScene;
  }
  if (type === "halving-share" && Array.isArray(data.names) && data.names.length > 0) {
    return HalvingShareScene;
  }
  if (type === "graph-label" && Array.isArray(data.nodes) && data.nodes.length > 0 && data.solution) {
    return GraphLabelScene;
  }
  if (type === "equal-spacing" && num(data.total ?? 0) > 1) {
    return EqualSpacingScene;
  }
  if (type === "candidate-sieve" && num(data.maxValue ?? 0) > 0) {
    return CandidateSieveScene;
  }
  if (type === "trapezoid-family" && num(data.perimeter ?? 0) > 2) {
    return TrapezoidFamilyScene;
  }
  if (type === "path-area-pairing" && num(data.n ?? 0) > 0 && Array.isArray(data.example)) {
    return PathAreaPairingScene;
  }
  if (type === "ones-digit-column" && num(data.first ?? 0) > 0 && Array.isArray(data.subtract) && data.subtract.length > 0) {
    return OnesDigitColumnScene;
  }
  if (type === "fraction-decimal-sum" && Array.isArray(data.fractions) && data.fractions.length > 0) {
    return FractionDecimalSumScene;
  }
  if (type === "nested-squares" && Array.isArray(data.squares) && data.squares.length > 1) {
    return NestedSquaresScene;
  }
  if (type === "perfect-square-remove" && num(data.to ?? 0) > num(data.from ?? 0)) {
    return PerfectSquareRemoveScene;
  }
  if (type === "dice-sum-grid" && num(data.sides ?? 0) > 1 && num(data.multipleOf ?? 0) > 1 && Array.isArray(data.candidates) && data.candidates.length > 0) {
    return DiceSumGridScene;
  }
  if (type === "rink-paths" && num(data.radius ?? 0) > 0 && Array.isArray(data.paths) && data.paths.length > 1) {
    return RinkPathsScene;
  }
  if (type === "tile-minimum" && num(data.cols ?? 0) > 0 && Array.isArray(data.solution) && data.solution.length > 0) {
    return TileMinimumScene;
  }
  if (type === "branch-value-tree" && num(data.days ?? 0) > 0 && Array.isArray(data.ops) && data.ops.length > 1) {
    return BranchValueTreeScene;
  }
  if (type === "ratio-unit" && Array.isArray(data.items) && data.items.length > 1) {
    return RatioUnitScene;
  }
  if (type === "linear-trend" && num(data.endYear ?? 0) > num(data.startYear ?? 0) && num(data.rate ?? 0) !== 0) {
    return LinearTrendScene;
  }
  if (type === "triangle-base-height" && num(data.area ?? 0) > 0 && num(data.bx ?? 0) !== num(data.ax ?? 0)) {
    return TriangleBaseHeightScene;
  }
  if (type === "level-bars" && num(data.total ?? 0) > 0 && Array.isArray(data.deltas) && data.deltas.length > 0) {
    return LevelBarsScene;
  }
  if (type === "hop-path" && num(data.hops ?? 0) >= 2 && num(data.hops ?? 0) <= 14) {
    return HopPathScene;
  }
  if (type === "shortest-route" && Array.isArray(data.nodes) && data.nodes.length > 1 && Array.isArray(data.edges) && data.edges.length > 0) {
    return ShortestRouteScene;
  }
  if (type === "repeat-block" && num(data.multiplier ?? 0) > 0 && typeof data.left === "string" && typeof data.right === "string") {
    return RepeatBlockScene;
  }
  if (type === "block-cover" && num(data.size ?? 0) > 1 && num(data.divisor ?? 0) > 1) {
    return BlockCoverScene;
  }
  if (type === "king-placement" && num(data.size ?? 0) > 1) {
    return KingPlacementScene;
  }
  if (type === "concentric-sector" && Array.isArray(data.radii) && data.radii.length > 1) {
    return ConcentricSectorScene;
  }
  if (type === "two-way-table" && num(data.total ?? 0) > 0 && Array.isArray(data.rows) && Array.isArray(data.cols)) {
    return TwoWayTableScene;
  }
  if (type === "cube-triangle" && Array.isArray(data.vertices) && data.vertices.length === 8 && typeof data.apex === "string") {
    return CubeTriangleScene;
  }
  if (type === "ratio-shift" && Array.isArray(data.before) && Array.isArray(data.after) && Array.isArray(data.moves) && data.moves.length > 0) {
    return RatioShiftScene;
  }
  if (type === "unroll-tape" && num(data.outerDiameter ?? 0) > num(data.innerDiameter ?? 0) && num(data.thickness ?? 0) > 0) {
    return UnrollTapeScene;
  }
  if (type === "lattice-cross" && Array.isArray(data.from) && Array.isArray(data.to)) {
    return LatticeCrossScene;
  }
  if (type === "mountain-overlap" && Array.isArray(data.heights) && data.heights.length > 1 && num(data.totalArea ?? 0) > 0) {
    return MountainOverlapScene;
  }
  if (type === "seat-pair" && num(data.rows ?? 0) > 0 && num(data.seatsPerRow ?? 0) > 1) {
    return SeatPairScene;
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
