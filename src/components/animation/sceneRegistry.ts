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
import { NetFoldRingScene } from "./scenes/NetFoldRingScene";
import { TwoStepReachScene } from "./scenes/TwoStepReachScene";
import { TriangleRingSplitScene } from "./scenes/TriangleRingSplitScene";
import { StatInsertScene } from "./scenes/StatInsertScene";
import { MagicSquareLinesScene } from "./scenes/MagicSquareLinesScene";
import { ProductChainScene } from "./scenes/ProductChainScene";
import { TilePatternProbScene } from "./scenes/TilePatternProbScene";
import { TriangleAreaSplitScene } from "./scenes/TriangleAreaSplitScene";
import { IntervalSqueezeScene } from "./scenes/IntervalSqueezeScene";
import { GridPolygonAreaScene } from "./scenes/GridPolygonAreaScene";
import { OperationMachineScene } from "./scenes/OperationMachineScene";
import { FactorTripleScene } from "./scenes/FactorTripleScene";
import { ReflectComposeScene } from "./scenes/ReflectComposeScene";
import { AgeBarsScene } from "./scenes/AgeBarsScene";
import { SpacedRatioScene } from "./scenes/SpacedRatioScene";
import { UnitChainScene } from "./scenes/UnitChainScene";
import { TelescopeProductScene } from "./scenes/TelescopeProductScene";
import { DiagonalLetterGridScene } from "./scenes/DiagonalLetterGridScene";
import { DetourPaceScene } from "./scenes/DetourPaceScene";
import { OvershootRemoveScene } from "./scenes/OvershootRemoveScene";
import { TwoScaleRouteScene } from "./scenes/TwoScaleRouteScene";
import { CircleLedgerScene } from "./scenes/CircleLedgerScene";
import { MagnitudeEstimateScene } from "./scenes/MagnitudeEstimateScene";
import { PieBitesScene } from "./scenes/PieBitesScene";
import { BandTimeScene } from "./scenes/BandTimeScene";
import { TournamentGridScene } from "./scenes/TournamentGridScene";
import { LineBoxHitScene } from "./scenes/LineBoxHitScene";
import { PowerSlotsScene } from "./scenes/PowerSlotsScene";
import { SampleRatioScene } from "./scenes/SampleRatioScene";
import { SpiralGridScene } from "./scenes/SpiralGridScene";
import { ThermometerDropScene } from "./scenes/ThermometerDropScene";
import { PaperFoldCutScene } from "./scenes/PaperFoldCutScene";
import { PrecedenceGroupScene } from "./scenes/PrecedenceGroupScene";
import { SeatPairScene } from "./scenes/SeatPairScene";
import { HalvingGapScene } from "./scenes/HalvingGapScene";
import { BiteSplitScene } from "./scenes/BiteSplitScene";
import { TripGraphScene } from "./scenes/TripGraphScene";
import { SpinnerSquareScene } from "./scenes/SpinnerSquareScene";
import { SplitBlankScene } from "./scenes/SplitBlankScene";
import { GapPlacementScene } from "./scenes/GapPlacementScene";
import { SlopeSweepScene } from "./scenes/SlopeSweepScene";
import { OverlapPairsScene } from "./scenes/OverlapPairsScene";
import { UnitsDigitRunScene } from "./scenes/UnitsDigitRunScene";
import { MidpointRectScene } from "./scenes/MidpointRectScene";
import { DotPlotShiftScene } from "./scenes/DotPlotShiftScene";
import { MagicGridSlideScene } from "./scenes/MagicGridSlideScene";
import { CeilingSqueezeScene } from "./scenes/CeilingSqueezeScene";
import { ChaseScheduleScene } from "./scenes/ChaseScheduleScene";
import { LinePairGridScene } from "./scenes/LinePairGridScene";
import { PrismNetScene } from "./scenes/PrismNetScene";
import { LeafHopReturnScene } from "./scenes/LeafHopReturnScene";
import { RecipeChainScene } from "./scenes/RecipeChainScene";
import { EqualizeShareScene } from "./scenes/EqualizeShareScene";
import { AreaYieldScene } from "./scenes/AreaYieldScene";
import { HexRingsScene } from "./scenes/HexRingsScene";
import { PourShareScene } from "./scenes/PourShareScene";
import { SeatDeduceScene } from "./scenes/SeatDeduceScene";
import { IncreasingDigitsScene } from "./scenes/IncreasingDigitsScene";
import { SwapValueScene } from "./scenes/SwapValueScene";
import { IcedCubeScene } from "./scenes/IcedCubeScene";
import { GlueBlockScene } from "./scenes/GlueBlockScene";
import { AverageSpeedGraphScene } from "./scenes/AverageSpeedGraphScene";
import { FactorialRegroupScene } from "./scenes/FactorialRegroupScene";
import { MixtureTopUpScene } from "./scenes/MixtureTopUpScene";
import { AverageLevelScene } from "./scenes/AverageLevelScene";
import { PercentSliceScene } from "./scenes/PercentSliceScene";

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
  if (type === "precedence-group" && Array.isArray(data.expressions) && data.expressions.length === 2) {
    return PrecedenceGroupScene;
  }
  if (type === "paper-fold-cut" && Array.isArray(data.cutPoly) && data.cutPoly.length >= 6) {
    return PaperFoldCutScene;
  }
  if (type === "thermometer-drop" && num(data.rate ?? 0) > 0 && num(data.amount ?? 0) > 0) {
    return ThermometerDropScene;
  }
  // needs a real gap to halve and a whole number of halvings the ladder can draw
  if (
    type === "halving-gap" &&
    num(data.start ?? 0) !== num(data.ambient ?? 0) &&
    num(data.period ?? 0) > 0 &&
    num(data.minutes ?? 0) > 0 &&
    Math.abs(num(data.minutes ?? 0) / num(data.period ?? 1) - Math.round(num(data.minutes ?? 0) / num(data.period ?? 1))) < 1e-9 &&
    Math.round(num(data.minutes ?? 0) / num(data.period ?? 1)) <= 5
  ) {
    return HalvingGapScene;
  }
  // enough pieces to have gaps, and few enough that the row stays readable
  if (
    type === "bite-split" &&
    num(data.pieces ?? 0) >= 2 &&
    num(data.pieces ?? 0) <= 14 &&
    num(data.biteLen ?? 0) > 0 &&
    num(data.remaining ?? 0) > 0
  ) {
    return BiteSplitScene;
  }
  // needs both speeds, a real stay, and the contest's candidate graphs to judge
  if (
    type === "trip-graph" &&
    num(data.outSpeed ?? 0) > 0 &&
    num(data.backSpeed ?? 0) > 0 &&
    num(data.outHours ?? 0) > 0 &&
    num(data.stayHours ?? 0) > 0 &&
    Array.isArray(data.candidates) &&
    data.candidates.length >= 2 &&
    data.candidates.length <= 6
  ) {
    return TripGraphScene;
  }
  // both faces real, and small enough that the outcome block stays readable
  if (
    type === "spinner-square" &&
    Array.isArray(data.a) &&
    Array.isArray(data.b) &&
    data.a.length >= 2 &&
    data.a.length <= 5 &&
    data.b.length >= 2 &&
    data.b.length <= 5
  ) {
    return SpinnerSquareScene;
  }
  // a real total, and few enough cuts that every blank gets its own card
  if (
    type === "split-blank" &&
    num(data.total ?? 0) > 2 &&
    Math.floor((num(data.total ?? 0) - 1) / (Math.max(1, num(data.multiple ?? 2)) + 1)) >= 1 &&
    Math.floor((num(data.total ?? 0) - 1) / (Math.max(1, num(data.multiple ?? 2)) + 1)) <= 12
  ) {
    return SplitBlankScene;
  }
  // a real word that actually repeats the named letter, short enough for one row
  if (type === "gap-placement" && typeof data.word === "string" && typeof data.letter === "string") {
    const w = String(data.word).toUpperCase();
    const L = String(data.letter).toUpperCase().slice(0, 1);
    const repeats = w.split("").filter((c) => c === L).length;
    if (repeats >= 2 && w.length - repeats >= 1 && w.length <= 13) return GapPlacementScene;
  }
  // enough plotted points for a real scatter, few enough to stay readable
  if (type === "slope-sweep" && Array.isArray(data.cols) && data.cols.length >= 2) {
    const n = data.cols.reduce((a, c) => {
      const list = String(c).split("|")[1];
      return a + (list ? list.split(",").length : 0);
    }, 0);
    if (n >= 4 && n <= 60) return SlopeSweepScene;
  }
  // an odd number of overlapping pairs is what makes the middles cancel
  if (
    type === "overlap-pairs" &&
    Array.isArray(data.averages) &&
    data.averages.length >= 3 &&
    data.averages.length <= 5 &&
    data.averages.length % 2 === 1
  ) {
    return OverlapPairsScene;
  }
  // a real arithmetic run of factors, long enough to have a tail worth killing
  if (
    type === "units-digit-run" &&
    num(data.first ?? 0) > 0 &&
    num(data.step ?? 0) > 0 &&
    num(data.last ?? 0) >= num(data.first ?? 0) &&
    (num(data.last ?? 0) - num(data.first ?? 0)) / num(data.step ?? 1) + 1 <= 5000
  ) {
    return UnitsDigitRunScene;
  }
  // exactly four midpoints, each a real coordinate pair
  if (
    type === "midpoint-rect" &&
    Array.isArray(data.points) &&
    data.points.length === 4 &&
    data.points.every((p) => Array.isArray(p) && p.length === 2 && p.every((c) => Number.isFinite(Number(c))))
  ) {
    return MidpointRectScene;
  }
  // a real dot plot with a bonus and a target median, small enough to search
  if (
    type === "dot-plot-shift" &&
    Array.isArray(data.scores) &&
    data.scores.length >= 2 &&
    data.scores.length <= 10 &&
    num(data.boost ?? 0) > 0 &&
    num(data.targetMedian ?? 0) > 0
  ) {
    return DotPlotShiftScene;
  }
  // a square grid with at least one blank and the named unknown present
  if (type === "magic-grid-slide" && Array.isArray(data.grid) && data.grid.length >= 2) {
    const g = data.grid.map((r) => String(r).split(","));
    const xn = data.unknown != null ? String(data.unknown) : "x";
    const square = g.every((r) => r.length === g.length);
    const flat = g.flat().map((s) => s.trim());
    if (square && flat.includes(xn) && flat.filter((s) => s === "?").length >= 1) return MagicGridSlideScene;
  }
  // at least two parts, each carrying a real rival record and its own attempts
  if (type === "ceiling-squeeze" && Array.isArray(data.halves) && data.halves.length >= 2) {
    const parts = data.halves.map((h) => String(h).split("|"));
    const ok = parts.every((p) => {
      const [, made, att, own] = p;
      return p.length >= 4 && Number(att) > 0 && Number(own) > 0 && Number(made) >= 0 && Number(made) <= Number(att);
    });
    if (ok) return CeilingSqueezeScene;
  }
  // real rhythms for both travellers, and the ride genuinely starts behind
  if (type === "chase-schedule") {
    const drive = num(data.driveTime ?? 0);
    const walkT = num(data.walkTime ?? 0);
    const busS = num(data.busStart ?? 0);
    const walkS = num(data.walkerStart ?? 0);
    if (drive > 0 && walkT > 0 && num(data.dwellTime ?? 0) >= 0 && walkS > busS) return ChaseScheduleScene;
  }
  // a real square grid, small enough to enumerate, with a well-formed sample
  if (type === "line-pair-grid" && Array.isArray(data.sample)) {
    const size = num(data.size ?? 0);
    const rows = data.sample.map((r) => String(r));
    if (size >= 2 && size <= 4 && rows.length === size && rows.every((r) => r.length === size && /^[01]+$/.test(r))) {
      return LinePairGridScene;
    }
  }
  // GH must genuinely overhang the prism length, or there is no second leg
  if (type === "prism-net") {
    const ahv = num(data.ah ?? 0);
    const efv = num(data.ef ?? 0);
    const ghv = num(data.gh ?? 0);
    if (ahv > 0 && efv > 0 && ghv > efv) return PrismNetScene;
  }
  // at least 3 sites (so a move is possible) and a real number of hops
  if (type === "leaf-hop-return") {
    const sitesN = num(data.sites ?? 0);
    const hopsN = num(data.hops ?? 0);
    if (sitesN >= 3 && sitesN <= 8 && hopsN >= 2 && hopsN <= 10) return LeafHopReturnScene;
  }
  // a real fill fraction and cup count, small enough for the slices to be drawable
  if (
    type === "pour-share" &&
    num(data.numer ?? 0) > 0 &&
    num(data.den ?? 0) > 1 &&
    num(data.cups ?? 0) >= 1 &&
    num(data.den ?? 0) * num(data.cups ?? 0) <= 40
  ) {
    return PourShareScene;
  }
  // a real hexagon index to build up to, with the figure's own hexagons to prove on
  if (type === "hex-rings" && num(data.target ?? 0) >= 2) {
    return HexRingsScene;
  }
  // a real rectangle plus at least one per-unit rate to carry its area through
  if (
    type === "area-yield" &&
    Array.isArray(data.rates) &&
    data.rates.length >= 1 &&
    num(data.width ?? 0) > 0 &&
    num(data.length ?? 0) > 0
  ) {
    return AreaYieldScene;
  }
  // real amounts that pool and divide exactly, so the levelling picture is honest
  if (type === "equalize-share" && Array.isArray(data.amounts) && data.amounts.length >= 2) {
    const amts = data.amounts.map((a) => num(a));
    const sum = amts.reduce((a, b) => a + b, 0);
    if (amts.every((a) => a > 0) && sum % amts.length === 0) return EqualizeShareScene;
  }
  // a real chain of "k times as much A as B" links plus the given quantity
  if (type === "recipe-chain" && Array.isArray(data.levels) && data.levels.length >= 2 && num(data.amount ?? 0) > 0) {
    return RecipeChainScene;
  }
  if (type === "spiral-grid" && num(data.size ?? 0) >= 3 && Array.isArray(data.marked) && data.marked.length >= 2) {
    return SpiralGridScene;
  }
  if (
    type === "sample-ratio" &&
    num(data.sampleMarked ?? 0) > 0 &&
    num(data.sampleTotal ?? 0) > 0 &&
    num(data.sampleTotal ?? 0) <= 240 &&
    num(data.sampleTotal ?? 0) % num(data.sampleMarked ?? 1) === 0 &&
    num(data.populationMarked ?? 0) > 0
  ) {
    return SampleRatioScene;
  }
  if (type === "power-slots" && Array.isArray(data.digits) && data.digits.length >= 4 && data.digits.length % 2 === 0) {
    return PowerSlotsScene;
  }
  if (type === "line-box-hit" && Array.isArray(data.rect) && data.rect.length === 4 && Array.isArray(data.lines) && data.lines.length > 0) {
    return LineBoxHitScene;
  }
  if (type === "tournament-grid" && Array.isArray(data.rows) && data.rows.length >= 2 && data.rows.length % 2 === 0) {
    return TournamentGridScene;
  }
  if (type === "band-time" && Array.isArray(data.points) && data.points.length >= 8 && num(data.high ?? 0) > num(data.low ?? 0)) {
    return BandTimeScene;
  }
  if (type === "pie-bites" && Array.isArray(data.eaters) && data.eaters.length > 0) {
    return PieBitesScene;
  }
  if (type === "magnitude-estimate" && num(data.value ?? 0) > 0 && Array.isArray(data.chain) && data.chain.length >= 2) {
    return MagnitudeEstimateScene;
  }
  if (type === "circle-ledger" && num(data.radius ?? 0) > 0 && Array.isArray(data.circles) && data.circles.length > 0) {
    return CircleLedgerScene;
  }
  if (type === "two-scale-route" && Array.isArray(data.scales) && data.scales.length >= 2 && Array.isArray(data.pick) && num(data.gap ?? 0) > 0) {
    return TwoScaleRouteScene;
  }
  if (type === "overshoot-remove" && Array.isArray(data.kinds) && data.kinds.length >= 2 && num(data.target ?? 0) > 0) {
    return OvershootRemoveScene;
  }
  if (type === "detour-pace" && num(data.blocks ?? 0) > 1 && num(data.minutes ?? 0) > 0 && num(data.distance ?? 0) > 0 && num(data.detourBlocks ?? 0) > 1) {
    return DetourPaceScene;
  }
  if (type === "diagonal-letters" && num(data.size ?? 0) > 2 && Array.isArray(data.letters) && data.letters.length >= 2) {
    return DiagonalLetterGridScene;
  }
  if (type === "net-fold-ring" && Array.isArray(data.faces) && data.faces.length >= 4 && Array.isArray(data.points) && Array.isArray(data.strip)) {
    return NetFoldRingScene;
  }
  if (type === "two-step-reach" && num(data.right ?? 0) > 0 && num(data.left ?? 0) > 0 && num(data.target ?? 0) > 0) {
    return TwoStepReachScene;
  }
  if (type === "triangle-ring-split" && num(data.outer ?? 0) > 1 && num(data.inner ?? 0) > 0 && num(data.inner ?? 0) < num(data.outer ?? 0)) {
    return TriangleRingSplitScene;
  }
  if (type === "stat-insert" && Array.isArray(data.list) && data.list.length >= 3) {
    return StatInsertScene;
  }
  if (type === "magic-square-lines" && Array.isArray(data.cards) && Array.isArray(data.square) && data.square.length >= 3) {
    return MagicSquareLinesScene;
  }
  if (type === "product-chain" && num(data.length ?? 0) >= 3 && num(data.target ?? 0) > 1) {
    return ProductChainScene;
  }
  if (type === "tile-pattern-prob" && num(data.grid ?? 0) >= 2 && num(data.options ?? 0) >= 2 && Array.isArray(data.pattern) && data.pattern.length >= 4) {
    return TilePatternProbScene;
  }
  if (type === "triangle-area-split" && num(data.topHeight ?? 0) > 0 && num(data.bottomHeight ?? 0) > 0) {
    return TriangleAreaSplitScene;
  }
  if (type === "interval-squeeze" && Array.isArray(data.bounds) && data.bounds.length >= 2 && num(data.count ?? 0) >= 3) {
    return IntervalSqueezeScene;
  }
  if (type === "grid-polygon-area" && Array.isArray(data.outline) && data.outline.length >= 3 && num(data.grid ?? 0) >= 2) {
    return GridPolygonAreaScene;
  }
  if (
    type === "operation-machine" &&
    ["sq-diff", "diff-sq"].includes(String(data.first)) &&
    ["sq-diff", "diff-sq"].includes(String(data.second))
  ) {
    return OperationMachineScene;
  }
  if (type === "factor-triple" && num(data.product ?? 0) > 1) {
    return FactorTripleScene;
  }
  if (type === "reflect-compose" && Array.isArray(data.guides) && Array.isArray(data.order) && data.order.length === 2) {
    return ReflectComposeScene;
  }
  if (type === "age-bars" && Array.isArray(data.people) && data.people.length >= 2 && num(data.total ?? 0) > 0) {
    return AgeBarsScene;
  }
  if (type === "spaced-ratio" && num(data.middle ?? 0) > 0 && num(data.ratio ?? 0) > 1) {
    return SpacedRatioScene;
  }
  if (type === "unit-chain" && Array.isArray(data.chain) && data.chain.length >= 2 && num(data.start ?? 0) > 0) {
    return UnitChainScene;
  }
  if (type === "telescope-product" && num(data.to ?? 0) > num(data.from ?? 0) && num(data.gap ?? 0) >= 1) {
    return TelescopeProductScene;
  }
  // the frozen remainder must divide into whole parts, and the drawer must stay drawable
  if (type === "mixture-topup" && Array.isArray(data.kinds) && data.kinds.length >= 2) {
    const parsed = data.kinds.map((k) => String(k).split("|"));
    const tgt = String(data.target ?? "");
    const p = num(data.percent ?? 0);
    const frozen = parsed.filter((k) => k[0] !== tgt).reduce((s, k) => s + num(k[2] ?? 0), 0);
    const g2 = (a: number, b: number): number => (b === 0 ? a : g2(b, a % b));
    const dd = g2(Math.round(100 - p), 100) || 1;
    const rn = Math.round(100 - p) / dd;
    const total = rn > 0 ? (frozen / rn) * (100 / dd) : 0;
    if (p > 0 && p < 100 && frozen > 0 && Number.isInteger(total) && total > 0 && total <= 120) {
      return MixtureTopUpScene;
    }
  }
  // two factorials small enough to stay exact, and a coefficient that really divides
  if (type === "factorial-regroup" && Array.isArray(data.left) && data.left.length === 2) {
    const a = num(data.left[0] ?? 0);
    const b = num(data.left[1] ?? 0);
    const k = num(data.coef ?? 0);
    const fa = a >= 1 && a <= 12 ? Array.from({ length: a }, (_, i) => i + 1).reduce((x, y) => x * y, 1) : 0;
    if (a >= 1 && a <= 12 && b >= 1 && b <= 12 && k >= 2 && fa % k === 0) return FactorialRegroupScene;
  }
  // exactly two journeys, each a real polyline, so a difference of averages exists
  if (type === "avg-speed-graph" && Array.isArray(data.travellers) && data.travellers.length === 2) {
    const ok = data.travellers.every((t) => String(t).split("|").length >= 4 && String(t).split("|")[3].trim().length > 0);
    if (ok && num(data.xMax ?? 0) > 0 && num(data.yMax ?? 0) > 0) return AverageSpeedGraphScene;
  }
  // enough items that gluing two of them actually shortens the row, few enough to enumerate
  if (type === "glue-block" && Array.isArray(data.items) && Array.isArray(data.pair)) {
    if (data.items.length >= 3 && data.items.length <= 6 && data.pair.length === 2) return GlueBlockScene;
  }
  // a real cube with some faces bare (all six coated has no layer to contrast)
  if (type === "iced-cube" && Array.isArray(data.faces)) {
    const sz = num(data.size ?? 0);
    if (sz >= 2 && sz <= 6 && data.faces.length > 0 && data.faces.length < 6) return IcedCubeScene;
  }
  // two real values with a genuine gap, and room to spare the floor at both ends
  if (type === "swap-value" && typeof data.low === "string" && typeof data.high === "string") {
    const tot = num(data.total ?? 0);
    const floor = num(data.minEach ?? 1);
    const lo = num(String(data.low).split("|")[0]);
    const hi = num(String(data.high).split("|")[0]);
    if (tot > 2 * floor && hi > lo) return SwapValueScene;
  }
  // a real window and a digit count the increasing enumeration can actually fill
  if (type === "increasing-digits") {
    const lo = num(data.low ?? 0);
    const hi = num(data.high ?? 0);
    const ln = num(data.length ?? 0);
    if (hi > lo && ln >= 2 && ln <= 9) return IncreasingDigitsScene;
  }
  // one person per place, few enough to enumerate every seating, and real rules
  if (type === "seat-deduce" && Array.isArray(data.people) && Array.isArray(data.rules)) {
    const n = num(data.slots ?? 0);
    if (n >= 2 && n <= 7 && data.people.length === n && data.rules.length > 0) return SeatDeduceScene;
  }
  // both percentages must be whole numbers of one slice, and the answer bar must
  // end on a tick of the other's ruler, or the counting picture would be a lie
  if (type === "percent-slice") {
    const p = num(data.leftPercent ?? 0);
    const q = num(data.rightPercent ?? 0);
    const g2 = (a: number, b: number): number => (b === 0 ? Math.abs(a) : g2(b, a % b));
    const u = g2(g2(p, q), 100) || 1;
    const slices = 100 / u;
    if (p > 0 && q > 0 && p <= 100 && q <= 100 && slices <= 25 && (100 * p) % q === 0 && (slices * p) % q === 0) {
      return PercentSliceScene;
    }
  }
  // enough bars that adding them is the wrong move, and a line to read off the chart
  if (type === "average-level" && Array.isArray(data.values) && data.values.length >= 4 && num(data.readAverage ?? 0) > 0) {
    return AverageLevelScene;
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
