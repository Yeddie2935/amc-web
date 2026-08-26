import type { Problem } from "../../types/amc";
import type { AnimatedScene } from "./scenes/types";
import { ClockAngleScene } from "./scenes/ClockAngleScene";
import { LineTriangleScene, parseLines } from "./scenes/LineTriangleScene";
import { PercentSquareBiteScene } from "./scenes/PercentSquareBiteScene";
import { ScoreShareSearchScene } from "./scenes/ScoreShareSearchScene";
import { MassPointBalanceScene } from "./scenes/MassPointBalanceScene";
import { StarsAndBarsScene } from "./scenes/StarsAndBarsScene";
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
import { SplitTelescopeScene } from "./scenes/SplitTelescopeScene";
import { ParityGridScene } from "./scenes/ParityGridScene";
import { TournamentBudgetScene } from "./scenes/TournamentBudgetScene";
import { NestedSquareScene } from "./scenes/NestedSquareScene";
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
import { ExpressionRaceScene } from "./scenes/ExpressionRaceScene";
import { VotePieScaleScene } from "./scenes/VotePieScaleScene";
import { NestedRadicalCollapseScene } from "./scenes/NestedRadicalCollapseScene";
import { EstimateProductShiftScene } from "./scenes/EstimateProductShiftScene";
import { ProductSumCancelScene } from "./scenes/ProductSumCancelScene";
import { AngleRatioPartsScene } from "./scenes/AngleRatioPartsScene";
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
import { BookBlockPermuteScene } from "./scenes/BookBlockPermuteScene";
import { RatioMeetStepsScene } from "./scenes/RatioMeetStepsScene";
import { AverageSpeedGraphScene } from "./scenes/AverageSpeedGraphScene";
import { FactorialRegroupScene } from "./scenes/FactorialRegroupScene";
import { MixtureTopUpScene } from "./scenes/MixtureTopUpScene";
import { AverageLevelScene } from "./scenes/AverageLevelScene";
import { PercentSliceScene } from "./scenes/PercentSliceScene";
import { LineIncidenceScene } from "./scenes/LineIncidenceScene";
import { DivisorLatticeScene } from "./scenes/DivisorLatticeScene";
import { PrimeChoiceMachineScene } from "./scenes/PrimeChoiceMachineScene";
import { SignPyramidSweepScene } from "./scenes/SignPyramidSweepScene";
import { ParallelTriangleAreaScene } from "./scenes/ParallelTriangleAreaScene";
import { ThreeRemaindersScene } from "./scenes/ThreeRemaindersScene";
import { SquareMidpointAreaScene } from "./scenes/SquareMidpointAreaScene";
import { OctagonTriangleCountScene } from "./scenes/OctagonTriangleCountScene";
import { CubeRhombusSliceScene } from "./scenes/CubeRhombusSliceScene";
import { CubeBaseRangeScene } from "./scenes/CubeBaseRangeScene";
import { CheckerPathsScene } from "./scenes/CheckerPathsScene";
import { SemicircleRectScene } from "./scenes/SemicircleRectScene";
import { PatternDigitScene } from "./scenes/PatternDigitScene";
import { HalveDoubleChainScene } from "./scenes/HalveDoubleChainScene";
import { ReverseMachineScene } from "./scenes/ReverseMachineScene";
import { SurjectionCasesScene } from "./scenes/SurjectionCasesScene";
import { TileBorderRatioScene } from "./scenes/TileBorderRatioScene";
import { SquaredRectangleScene } from "./scenes/SquaredRectangleScene";
import { GreedyBuyScene } from "./scenes/GreedyBuyScene";
import { IdenticalTilesScene } from "./scenes/IdenticalTilesScene";
import { SharedRemainderScene } from "./scenes/SharedRemainderScene";
import { RhombusDiagonalScene } from "./scenes/RhombusDiagonalScene";
import { GraphMatchStoryScene } from "./scenes/GraphMatchStoryScene";
import { SymmetryLineGridScene } from "./scenes/SymmetryLineGridScene";
import { CapFillScene } from "./scenes/CapFillScene";
import { RemainingGridScene } from "./scenes/RemainingGridScene";
import { CylinderPairScene } from "./scenes/CylinderPairScene";
import { StatCorrectionScene } from "./scenes/StatCorrectionScene";
import { TwoSetOverlapScene } from "./scenes/TwoSetOverlapScene";
import { CubeViewsScene } from "./scenes/CubeViewsScene";
import { PalindromeSumScene } from "./scenes/PalindromeSumScene";
import { ModularCycleScene } from "./scenes/ModularCycleScene";
import { ConditionalSwapScene } from "./scenes/ConditionalSwapScene";
import { PaceCarChaseScene } from "./scenes/PaceCarChaseScene";
import { ScaleModelScene } from "./scenes/ScaleModelScene";
import { FractionZipperScene } from "./scenes/FractionZipperScene";
import { CountOutCircleScene } from "./scenes/CountOutCircleScene";
import { PinwheelGridScene } from "./scenes/PinwheelGridScene";
import { SignPairSumScene } from "./scenes/SignPairSumScene";
import { RoadChunkPaceScene } from "./scenes/RoadChunkPaceScene";
import { DigitLockChopScene } from "./scenes/DigitLockChopScene";
import { FrequencyMeanBarsScene } from "./scenes/FrequencyMeanBarsScene";
import { BorderTileGridScene } from "./scenes/BorderTileGridScene";
import { HarmonicMeanFlipScene } from "./scenes/HarmonicMeanFlipScene";
import { SeatingAdjacencyScene } from "./scenes/SeatingAdjacencyScene";
import { RaceClockScene } from "./scenes/RaceClockScene";
import { RepeatedScoreRangeScene } from "./scenes/RepeatedScoreRangeScene";
import { GreedyDigitProductScene } from "./scenes/GreedyDigitProductScene";
import { CrescentCircleScene } from "./scenes/CrescentCircleScene";
import { RepeatedBlockFactorScene } from "./scenes/RepeatedBlockFactorScene";
import { TruthCountHouseScene } from "./scenes/TruthCountHouseScene";
import { FractionMarblePackingScene } from "./scenes/FractionMarblePackingScene";
import { MaxCardSelectionScene } from "./scenes/MaxCardSelectionScene";
import { DiagonalTileCountScene } from "./scenes/DiagonalTileCountScene";
import { RemainderOneIntervalScene } from "./scenes/RemainderOneIntervalScene";
import { GameResultBalanceScene } from "./scenes/GameResultBalanceScene";
import { EqualHalfScoreScene } from "./scenes/EqualHalfScoreScene";
import { LetterBranchPathScene } from "./scenes/LetterBranchPathScene";
import { EqualPerimeterSplitScene } from "./scenes/EqualPerimeterSplitScene";
import { ChestRedistributionScene } from "./scenes/ChestRedistributionScene";
import { ConcaveTriangleSubtractScene } from "./scenes/ConcaveTriangleSubtractScene";
import { FactorialFiveLedgerScene } from "./scenes/FactorialFiveLedgerScene";
import { DistinctOddDigitSlotsScene } from "./scenes/DistinctOddDigitSlotsScene";
import { SignProductCasesScene } from "./scenes/SignProductCasesScene";
import { SemicircleAreaSplitScene } from "./scenes/SemicircleAreaSplitScene";
import { PaceDivisorDaysScene } from "./scenes/PaceDivisorDaysScene";
import { PeriodicCallInclusionScene } from "./scenes/PeriodicCallInclusionScene";
import { EquilateralSectorCutScene } from "./scenes/EquilateralSectorCutScene";

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
  // Exactly five four-number expressions with five finite track values; this
  // keeps every racer meaningful and within the scene's drawable 0–10 track.
  if (
    type === "expression-race" &&
    Array.isArray(data.expressions) && data.expressions.length === 5 && data.expressions.every((v) => typeof v === "string") &&
    Array.isArray(data.values) && data.values.length === 5 && data.values.every((v) => Number.isFinite(Number(v)) && num(v) >= 0 && num(v) <= 10) &&
    Array.isArray(data.labels) && data.labels.length === 5 && data.labels.every((v) => typeof v === "string")
  ) {
    return ExpressionRaceScene;
  }
  // Three positive sectors must make one whole pie; the highlighted percentage
  // must split into whole 10% boxes with a whole vote count in each box.
  if (
    type === "vote-pie-scale" &&
    Array.isArray(data.candidates) && data.candidates.length === 3 && data.candidates.every((v) => typeof v === "string") &&
    Array.isArray(data.percents) && data.percents.length === 3 && data.percents.every((v) => num(v) > 0) && data.percents.reduce((a, v) => a + num(v), 0) === 100 &&
    typeof data.highlightedCandidate === "string" && data.candidates.includes(data.highlightedCandidate) &&
    num(data.votes) > 0 && num(data.percents[data.candidates.indexOf(data.highlightedCandidate)]) % 10 === 0 &&
    Number.isInteger(num(data.votes) / (num(data.percents[data.candidates.indexOf(data.highlightedCandidate)]) / 10))
  ) {
    return VotePieScaleScene;
  }
  // Three positive radicands whose inside-out roots are all whole numbers;
  // otherwise the three-shell collapse would assert unsupported simplifications.
  if (type === "nested-radical-collapse") {
    const outer = num(data.outerFactor);
    const middle = num(data.middleFactor);
    const radicand = num(data.innerRadicand);
    const inner = Math.sqrt(radicand);
    const mid = Math.sqrt(middle * inner);
    const result = Math.sqrt(outer * mid);
    if (outer > 0 && middle > 0 && radicand > 0 && [inner, mid, result].every(Number.isInteger)) {
      return NestedRadicalCollapseScene;
    }
  }
  // Two positive exact factors and two positive one-significant-digit estimates,
  // bounded so their scientific-notation product remains legible.
  if (
    type === "estimate-product-shift" &&
    Array.isArray(data.exactFactors) && data.exactFactors.length === 2 && data.exactFactors.every((v) => num(v) > 0 && num(v) < 1e10) &&
    Array.isArray(data.roundedFactors) && data.roundedFactors.length === 2 && data.roundedFactors.every((v) => num(v) > 0 && num(v) < 1e10)
  ) {
    const oneSig = (v: unknown) => {
      const n = num(v);
      return Math.round((n / 10 ** Math.floor(Math.log10(n))) * 1e10) / 1e10;
    };
    if (data.roundedFactors.every((v) => Number.isInteger(oneSig(v)) && oneSig(v) >= 1 && oneSig(v) <= 9)) return EstimateProductShiftScene;
  }
  // An even, short run of consecutive positive integers, specifically bounded
  // so every paired sum and factor tile remains drawable and exact.
  if (type === "product-sum-cancel") {
    const from = Math.round(num(data.from));
    const to = Math.round(num(data.to));
    const count = to - from + 1;
    if (from === 1 && to === 8 && count % 2 === 0) return ProductSumCancelScene;
  }
  // Exactly three positive ratio entries making no more than twelve drawable
  // tiles, with a whole-degree value for each part of the triangle's angle sum.
  if (type === "angle-ratio-parts" && Array.isArray(data.ratio) && data.ratio.length === 3) {
    const ratio = data.ratio.map((v) => Math.round(num(v)));
    const sum = ratio.reduce((a, b) => a + b, 0);
    const degrees = num(data.angleSum);
    if (ratio.every((v) => v > 0) && sum <= 12 && degrees === 180 && Number.isInteger(degrees / sum)) return AngleRatioPartsScene;
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
  // a positive right-hand side gives the level line something to cut, and a
  // positive inner shift is what raises the middle hump the argument turns on
  if (type === "nested-square" && num(data.rhs ?? 0) > 0 && num(data.inner ?? 0) > 0) {
    return NestedSquareScene;
  }
  // the crosstable draws exactly one cell per game only when every pair meets
  // twice, and the leaders must have someone below them to sweep
  if (type === "tournament-budget") {
    const tm = Math.round(num(data.teams ?? 0));
    const tp = Math.round(num(data.top ?? 0));
    if (tm >= 3 && tm <= 10 && tp >= 2 && tp < tm && Math.round(num(data.meetings ?? 0)) === 2 && num(data.win ?? 0) > 0) {
      return TournamentBudgetScene;
    }
  }
  // both parities must actually appear, or there is no two-block picture to
  // reveal, and the table has to stay small enough to draw every roll
  if (type === "parity-grid" && Array.isArray(data.faces) && data.faces.length >= 2 && data.faces.length <= 10) {
    const fs = data.faces.map((v) => Math.round(num(v)));
    const odd = fs.filter((v) => Math.abs(v % 2) === 1).length;
    if (fs.every((v) => Number.isFinite(v)) && odd >= 1 && odd < fs.length) return ParityGridScene;
  }
  // at least three factors (so each chain has a real interior to cancel) and few
  // enough that re-multiplying every one of them stays cheap and exact
  if (
    type === "split-telescope" &&
    num(data.from ?? 0) >= 1 &&
    num(data.to ?? 0) >= num(data.from ?? 0) + 2 &&
    num(data.to ?? 0) - num(data.from ?? 0) <= 5000
  ) {
    return SplitTelescopeScene;
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
  // Exactly nine distinct books in three language groups, with the two named
  // groups forming blocks and the resulting factorial product matching the data.
  if (type === "book-block-permute" && Array.isArray(data.groups) && Array.isArray(data.grouped)) {
    const groups = data.groups.map((raw) => String(raw).split("|"));
    const counts = groups.map((g) => Math.round(num(g[2] ?? 0)));
    const names = groups.map((g) => g[0]);
    const grouped = data.grouped.map(String);
    const valid =
      groups.length === 3 &&
      counts.every((c) => c >= 1 && c <= 6) &&
      counts.reduce((sum, c) => sum + c, 0) === 9 &&
      grouped.length === 2 &&
      new Set(grouped).size === 2 &&
      grouped.every((name) => names.includes(name));
    if (valid) return BookBlockPermuteScene;
  }
  // A positive whole-part speed ratio, a divisible road length, and a step
  // length that turns the walker's share into a whole number of steps.
  if (type === "ratio-meet-steps") {
    const distance = num(data.distanceFeet ?? 0);
    const ratio = Math.round(num(data.speedRatio ?? 0));
    const stride = num(data.stepLength ?? 0);
    const share = ratio >= 1 ? distance / (ratio + 1) : 0;
    if (distance > 0 && ratio >= 1 && ratio <= 8 && stride > 0 && Number.isInteger(share / stride)) {
      return RatioMeetStepsScene;
    }
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
  // a short enough chain to enumerate and draw, with a real slot for the known value
  if (type === "halve-double-chain") {
    const c = Math.round(num(data.count ?? 0));
    const ki = Math.round(num(data.knownIndex ?? 0));
    const kv = Math.round(num(data.knownValue ?? 0));
    if (c >= 3 && c <= 6 && ki >= 1 && ki <= c && kv >= 1) return HalveDoubleChainScene;
  }
  // every candidate needs two real polylines, and the tests must single one out
  if (type === "graph-match-story" && Array.isArray(data.graphs) && data.graphs.length >= 2) {
    const ok = data.graphs.every((g) => {
      const parts = String(g).split("|");
      if (parts.length < 3) return false;
      return parts.slice(1, 3).every((poly) => {
        const pts = poly.trim().split(/\s+/).map((q) => q.split(",").map(Number));
        return pts.length >= 2 && pts.every((q) => q.length === 2 && q.every((n) => Number.isFinite(n)));
      });
    });
    if (ok && data.graphs.length <= 6 && num(data.finish ?? 0) > 0) return GraphMatchStoryScene;
  }
  // the half-diagonal must actually fit inside a side, or there is no right
  // triangle to solve and no rhombus to draw
  if (type === "rhombus-diagonal") {
    const per = num(data.perimeter ?? 0);
    const dg = num(data.diagonal ?? 0);
    const sd = per / 4;
    if (per > 0 && dg > 0 && sd > dg / 2) return RhombusDiagonalScene;
  }
  // the argument only exists when every fraction has the same whole part and the
  // same remainder numerator, so the denominators alone decide the order
  if (type === "shared-remainder" && Array.isArray(data.fractions) && data.fractions.length >= 2) {
    const fs = data.fractions.map((f) => String(f).split("/").map((v) => Math.round(Number(v))));
    const ok = fs.every((f) => f.length === 2 && Number.isFinite(f[0]) && Number.isFinite(f[1]) && f[1] > 0);
    if (ok && fs.length <= 4) {
      const ws = new Set(fs.map((f) => Math.floor(f[0] / f[1])));
      const rs = new Set(fs.map((f) => f[0] - Math.floor(f[0] / f[1]) * f[1]));
      const ds = new Set(fs.map((f) => f[1]));
      if (ws.size === 1 && rs.size === 1 && ds.size === fs.length && Math.max(...fs.map((f) => f[1])) <= 30) {
        return SharedRemainderScene;
      }
    }
  }
  // the pieces must really be congruent and really tile the box, or the whole
  // "long side = k short sides" reading has nothing to stand on
  if (type === "identical-tiles" && Array.isArray(data.tiles) && data.tiles.length >= 2) {
    const ts = data.tiles.map((t) => String(t).split(",").map((v) => num(v)));
    const ok = ts.every((t) => t.length === 4 && t[2] > 0 && t[3] > 0);
    if (ok && num(data.short ?? 0) > 0) {
      const bw = Math.max(...ts.map((t) => t[0] + t[2]));
      const bh = Math.max(...ts.map((t) => t[1] + t[3]));
      const shapes = new Set(ts.map((t) => [t[2], t[3]].sort((a, b) => a - b).join("x")));
      const covered = ts.reduce((a, t) => a + t[2] * t[3], 0) === bw * bh;
      const clash = ts.some((a, i) =>
        ts.some((b, j) => j > i && a[0] < b[0] + b[2] && b[0] < a[0] + a[2] && a[1] < b[1] + b[3] && b[1] < a[1] + a[3])
      );
      if (shapes.size === 1 && covered && !clash && ts.length <= 8) return IdenticalTilesScene;
    }
  }
  // real prices, and few enough purchases that every item can be drawn and counted
  if (type === "greedy-buy" && Array.isArray(data.kinds) && data.kinds.length >= 2) {
    const b = Math.round(num(data.budget ?? 0) * 100);
    const prices = data.kinds.map((k) => Math.round(num(String(k).split("|")[0] ?? 0) * 100));
    let rest = b;
    let items = 0;
    for (const pr of prices) {
      if (pr <= 0) { items = -1; break; }
      const c = Math.floor(rest / pr);
      items += c;
      rest -= c * pr;
    }
    if (b > 0 && items >= 2 && items <= 16) return GreedyBuyScene;
  }
  // the middle square only exists if the two dimensions differ by a positive even
  // amount, and the outer pair needs room to split legally
  if (type === "squared-rectangle") {
    const w = Math.round(num(data.width ?? 0));
    const h = Math.round(num(data.height ?? 0));
    const mid = (w - h) / 2;
    if (w > h && Number.isInteger(mid) && mid > 0 && h - 1 >= mid + 1) return SquaredRectangleScene;
  }
  // the area share must have an exact square root, or the side ratio is not a
  // fraction and the whole edge argument has nothing to stand on
  if (type === "tile-border-ratio") {
    const nn = Math.round(num(data.n ?? 0));
    const pc = num(data.percent ?? 0);
    const scaled = Math.round(pc * 100);
    const g2 = (a: number, b: number): number => (b ? g2(b, a % b) : Math.abs(a));
    const k = g2(scaled, 10000) || 1;
    const rt = (x: number) => {
      const r = Math.round(Math.sqrt(x));
      return r * r === x ? r : null;
    };
    const pn = rt(scaled / k);
    const qn = rt(10000 / k);
    if (nn >= 2 && nn <= 24 && pc > 0 && pc < 100 && pn != null && qn != null && pn < qn) {
      return TileBorderRatioScene;
    }
  }
  // small enough that every shape can be drawn and the factorials stay exact
  if (type === "surjection-cases") {
    const it = Math.round(num(data.items ?? 0));
    const bx = Math.round(num(data.boxes ?? 0));
    const mn = Math.round(num(data.minEach ?? 1));
    if (it >= bx && bx >= 2 && bx <= 4 && it <= 9 && mn >= 0 && it >= bx * mn) return SurjectionCasesScene;
  }
  // the backwards search must terminate in a tree narrow enough to draw, so grow
  // it here and check the widest level rather than trusting the step count
  if (type === "reverse-machine") {
    const dv = Math.round(num(data.divide ?? 2));
    const ml = Math.round(num(data.mul ?? 3));
    const ad = Math.round(num(data.add ?? 1));
    const tg = Math.round(num(data.target ?? 0));
    const st = Math.round(num(data.steps ?? 0));
    if (dv >= 2 && ml >= 1 && tg >= 1 && st >= 2 && st <= 9) {
      let level = [tg];
      let widest = 1;
      for (let i = 0; i < st; i++) {
        const next: number[] = [];
        for (const v of level) {
          if (!next.includes(dv * v)) next.push(dv * v);
          const q = (v - ad) / ml;
          if (Number.isInteger(q) && q > 0 && q % dv !== 0 && !next.includes(q)) next.push(q);
        }
        level = next;
        widest = Math.max(widest, level.length);
      }
      if (widest <= 6) return ReverseMachineScene;
    }
  }
  // the divisor must be characterised by a last-digit rule and a digit-sum rule,
  // so strip 2s, 3s and 5s and require nothing else to be left over
  if (type === "pattern-digits" && typeof data.pattern === "string") {
    const pat = String(data.pattern).trim();
    const marks = new Set(pat.split(""));
    let d = Math.round(num(data.divisor ?? 0));
    const cap = { two: 0, three: 0, five: 0 };
    while (d % 2 === 0) { d /= 2; cap.two += 1; }
    while (d % 3 === 0) { d /= 3; cap.three += 1; }
    while (d % 5 === 0) { d /= 5; cap.five += 1; }
    const simple = d === 1 && cap.two <= 1 && cap.three <= 2 && cap.five <= 1;
    if (pat.length >= 3 && pat.length <= 7 && marks.size === 2 && simple) return PatternDigitScene;
  }
  // the rectangle must fit inside the arc, and only equal end pieces centre it
  if (type === "semicircle-rect") {
    const w = num(data.width ?? 0);
    const lp = num(data.leftPad ?? 0);
    const rp = num(data.rightPad ?? lp);
    const rad = (lp + w + rp) / 2;
    if (w > 0 && lp >= 0 && rp >= 0 && Math.abs(lp - rp) < 1e-9 && rad * rad > (w / 2) * (w / 2)) {
      return SemicircleRectScene;
    }
  }
  // at most three primes (the box needs an axis each) and few enough cells to draw
  if (type === "divisor-lattice") {
    const n = Math.round(num(data.n ?? 0));
    let m = n;
    const es: number[] = [];
    for (let p = 2; p * p <= m; p += 1) {
      let e = 0;
      while (m % p === 0) {
        m /= p;
        e += 1;
      }
      if (e) es.push(e);
    }
    if (m > 1) es.push(1);
    const divisors = es.reduce((acc, e) => acc * (e + 1), 1);
    if (n >= 2 && es.length >= 1 && es.length <= 3 && divisors <= 24) return DivisorLatticeScene;
  }
  // A drawable factor-choice machine: exactly three distinct prime bins, no
  // exponent too wide for its row, and a modest total choice count.
  if (type === "prime-choice-machine") {
    let n = Math.round(num(data.n ?? 0));
    const es: number[] = [];
    for (let p = 2; p * p <= n; p += 1) {
      let e = 0;
      while (n % p === 0) { n /= p; e += 1; }
      if (e) es.push(e);
    }
    if (n > 1) es.push(1);
    const choices = es.reduce((product, e) => product * (e + 1), 1);
    if (num(data.n ?? 0) >= 2 && es.length === 3 && es.every((e) => e <= 7) && choices <= 64) {
      return PrimeChoiceMachineScene;
    }
  }
  // The proof pairs all 2^4 bottom rows by flipping the first sign, so this
  // scene intentionally guards the exact four-cell pyramid and a real example.
  if (type === "sign-pyramid-sweep" && num(data.bottomCount ?? 0) === 4 && Array.isArray(data.example)) {
    const signs = data.example.map(String);
    if (signs.length === 4 && signs.every((s) => s === "+" || s === "−" || s === "-")) {
      return SignPyramidSweepScene;
    }
  }
  // Two positive base pieces whose proportions define the parallel cuts; this
  // renderer currently uses the exact thirds lattice needed for a 1:2 split.
  if (type === "parallel-triangle-area" && Array.isArray(data.baseParts) && data.baseParts.length === 2) {
    const [a, b] = data.baseParts.map((v) => num(v));
    if (a > 0 && b > 0 && Math.abs(b / a - 2) < 1e-9) return ParallelTriangleAreaScene;
  }
  // All remainders must be the same fixed distance below their respective
  // divisors; bounded positive inputs keep the synchronized-multiples drawing legible.
  if (type === "three-remainders" && Array.isArray(data.divisors) && Array.isArray(data.remainders) && Array.isArray(data.solutions)) {
    const ds = data.divisors.map((v) => Math.round(num(v)));
    const rs = data.remainders.map((v) => Math.round(num(v)));
    const ss = data.solutions.map((v) => Math.round(num(v)));
    const shift = ds[0] - rs[0];
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const period = ds.reduce((acc, d) => Math.abs(acc * d) / gcd(acc, d), 1);
    const expected = Array.from({ length: Math.max(0, Math.floor((999 + shift) / period)) }, (_, i) => period * (i + 1) - shift)
      .filter((value) => value >= 100 && value <= 999);
    if (ds.length === 3 && rs.length === 3 && ss.length > 0 && ss.length <= 8 && ds.every((d, i) => d > 1 && rs[i] >= 0 && rs[i] < d && d - rs[i] === shift) && shift > 0 && period <= 300 && ss.every((value, i) => value === expected[i]) && ss.length === expected.length) {
      return ThreeRemaindersScene;
    }
  }
  // The unit-square split is safe only for the supplied 5/12 coordinate area
  // with a positive given area and its exact scale-up result.
  if (type === "square-midpoint-area" && String(data.fraction ?? "") === "5/12") {
    const given = num(data.givenArea);
    const answer = num(data.answer);
    if (given > 0 && answer > 0 && Math.abs(given * 12 / 5 - answer) < 1e-9) return SquareMidpointAreaScene;
  }
  // Eight vertices permit the disjoint one-side (8×4) and two-side (8)
  // classes; the guard verifies all counts before drawing the enumeration.
  if (type === "octagon-triangle-count") {
    const n = Math.round(num(data.vertices));
    const total = Math.round(num(data.total));
    const third = Math.round(num(data.oneSideThirdChoices));
    const one = Math.round(num(data.oneSideCases));
    const two = Math.round(num(data.twoSideCases));
    const favorable = Math.round(num(data.favorable));
    if (n === 8 && total === 56 && third === 4 && one === n * third && two === n && favorable === one + two && String(data.answer ?? "") === "5/7") return OctagonTriangleCountScene;
  }
  // This projected cube scene relies on the actual space/face diagonal pair
  // and their resulting squared ratio, rather than inventing a generic slice.
  if (type === "cube-rhombus-slice" && String(data.diagonal1 ?? "") === "s√3" && String(data.diagonal2 ?? "") === "s√2" && String(data.ratio ?? "") === "√6/2" && String(data.answer ?? "") === "3/2") {
    return CubeRhombusSliceScene;
  }
  // The base tokens must exactly span a modest inclusive cube-base interval.
  if (type === "cube-base-range") {
    const first = Math.round(num(data.firstBase)); const last = Math.round(num(data.lastBase));
    if (Math.round(num(data.lower)) === 257 && Math.round(num(data.upper)) === 262145 && first === 7 && last === 64 && Math.round(num(data.firstCube)) === first ** 3 && Math.round(num(data.lastCube)) === last ** 3 && Math.round(num(data.answer)) === last - first + 1) return CubeBaseRangeScene;
  }
  // exactly one point busier than the rest, or the incidence count forces nothing
  if (type === "line-incidence" && Array.isArray(data.points) && Array.isArray(data.lines)) {
    const labels = data.points.map((p) => String(p).split("|")[0]);
    const lns = data.lines.map((l) => String(l).split(",").map((t) => t.trim()));
    const count = (lab: string) => lns.filter((l) => l.includes(lab)).length;
    const cs = labels.map(count);
    const lo = cs.length ? Math.min(...cs) : 0;
    const busy = cs.filter((c) => c > lo).length;
    const known = lns.every((l) => l.every((t) => labels.includes(t)));
    if (labels.length >= 3 && lns.length >= 2 && known && busy === 1 && num(data.total ?? 0) > 0) {
      return LineIncidenceScene;
    }
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
  // both squares on the board, the same colour (so the diagonal walk connects
  // them at all), and the target genuinely above the start
  if (type === "checker-paths" && Array.isArray(data.from) && Array.isArray(data.to)) {
    const n = Math.round(num(data.size ?? 8));
    const [pr, pc] = (data.from as unknown[]).map((v) => Math.round(num(v ?? 0)));
    const [qr, qc] = (data.to as unknown[]).map((v) => Math.round(num(v ?? 0)));
    const on = (r: number, c: number) => r >= 1 && r <= n && c >= 1 && c <= n;
    if (n >= 3 && n <= 12 && on(pr, pc) && on(qr, qc) && qr > pr && (pr + pc) % 2 === (qr + qc) % 2) {
      return CheckerPathsScene;
    }
  }
  // an odd number of readings, so the median is a single middle tile the
  // corrected value can visibly move into, and a correction that really changes
  if (type === "stat-correction" && Array.isArray(data.bars) && data.bars.length >= 3) {
    const vals = data.bars.map((b) => num(String(b).split("|")[1]));
    const fi = Math.round(num(data.fixIndex ?? -1));
    const ft = num(data.fixTo ?? 0);
    const okAll = vals.every((v) => Number.isFinite(v) && v >= 0);
    if (okAll && data.bars.length % 2 === 1 && data.bars.length <= 9 && fi >= 0 && fi < vals.length && ft !== vals[fi]) {
      return StatCorrectionScene;
    }
  }
  // two real cans, and whole radii so r² can be drawn as a countable square
  if (type === "cylinder-pair" && Array.isArray(data.cans) && data.cans.length === 2) {
    const dims = data.cans.map((c) => String(c).split("|").slice(2).map((v) => num(v)));
    const okDims = dims.every(([d, h]) => d > 0 && h > 0 && Number.isInteger(d / 2) && d / 2 <= 12);
    if (okDims) return CylinderPairScene;
  }
  // every share must come out a whole object, or the countable grid would lie
  if (type === "remaining-grid" && Array.isArray(data.takers) && data.takers.length > 0) {
    const st = Math.round(num(data.start ?? 0));
    let rest = st;
    const whole = data.takers.every((t) => {
      const [, , n, d] = String(t).split("|");
      const den = Math.round(num(d));
      const bite = den ? (rest * Math.round(num(n))) / den : NaN;
      rest -= bite;
      return Number.isInteger(bite) && bite >= 0;
    });
    if (st >= 1 && st <= 200 && whole && rest >= 0) return RemainingGridScene;
  }
  // real blanks left to fill, a whole total to hit, and a cap the answer respects
  if (type === "cap-fill" && Array.isArray(data.known)) {
    const cnt = Math.round(num(data.count ?? 0));
    const avg = num(data.average ?? 0);
    const cp = num(data.cap ?? 0);
    const ks = data.known.map((v) => num(v));
    const slots = cnt - ks.length;
    const need = avg * cnt - ks.reduce((a, b) => a + b, 0);
    const low = need - cp * (slots - 1);
    if (cnt >= 2 && cnt <= 8 && slots >= 1 && cp > 0 && Number.isInteger(avg * cnt) && low >= 0 && low <= cp) {
      return CapFillScene;
    }
  }
  // an odd grid, so a centre point exists at all, and small enough to draw
  if (type === "symmetry-line-grid") {
    const sz = Math.round(num(data.size ?? 0));
    if (sz >= 3 && sz <= 15 && sz % 2 === 1) return SymmetryLineGridScene;
  }
  // six real faces, and every view naming three distinct known ones, or the
  // corner-triple search has nothing to solve against
  if (type === "cube-views" && Array.isArray(data.faces) && Array.isArray(data.views)) {
    const keys = data.faces.map((f) => String(f).split("|")[0]);
    const vs = data.views.map((v) => String(v).split("|"));
    const ok =
      keys.length === 6 &&
      new Set(keys).size === 6 &&
      vs.length >= 2 &&
      vs.every((v) => v.length === 3 && new Set(v).size === 3 && v.every((k) => keys.includes(k)));
    if (ok && keys.includes(String(data.ask ?? ""))) return CubeViewsScene;
  }
  // real part/target lengths, and enough distinct palindromes of that length to
  // actually take `addends` of them — otherwise there is nothing to enumerate
  if (type === "palindrome-sum") {
    const pd = num(data.partDigits ?? 0);
    const td = num(data.targetDigits ?? 0);
    const k = num(data.addends ?? 0);
    const available = 9 * Math.pow(10, Math.floor((pd - 1) / 2)); // palindromes with pd digits
    if (pd >= 2 && td > pd && k >= 2 && k <= available) return PalindromeSumScene;
  }
  // a real cycle of named positions, a real stride, and a forbidden position that
  // is actually one of them — otherwise there is no cycle to walk or day to avoid
  if (type === "modular-cycle" && Array.isArray(data.labels)) {
    const names = data.labels.map((l) => String(l).toLowerCase());
    const ok =
      names.length >= 3 &&
      new Set(names).size === names.length &&
      num(data.stepDays ?? 0) > 0 &&
      num(data.count ?? 0) >= 2 &&
      num(data.count ?? 0) <= names.length &&
      names.includes(String(data.avoid ?? "").toLowerCase());
    if (ok) return ModularCycleScene;
  }
  // the overlap must come out a whole number of people, fit inside the other
  // group, and both crowds must be small enough to draw one figure each
  if (type === "conditional-swap") {
    const a = num(data.aCount ?? 0);
    const b = num(data.bCount ?? 0);
    const gn = num(data.givenNum ?? 0);
    const gd = num(data.givenDen ?? 0);
    const both = gd > 0 ? (b * gn) / gd : -1;
    if (a > 0 && a <= 60 && b > 0 && b <= 60 && gd > 0 && Number.isInteger(both) && both >= 0 && both <= a) {
      return ConditionalSwapScene;
    }
  }
  // both groups real, a genuine overlap, and few enough people that every one of
  // them can be drawn as its own countable dot
  if (type === "two-set-overlap" && Array.isArray(data.sets) && data.sets.length === 2) {
    const [ca, cb] = data.sets.map((s) => Math.round(num(String(s).split("|")[1] ?? 0)));
    const tot = Math.round(num(data.total ?? 0));
    const un = tot - Math.round(num(data.neither ?? 0));
    const overlap = ca + cb - un;
    if (ca > 0 && cb > 0 && un > 0 && un <= tot && tot <= 200 && overlap > 0 && overlap <= Math.min(ca, cb)) {
      return TwoSetOverlapScene;
    }
  }
  // a real first leg, and a second speed above the target with the first below
  // it — otherwise there is no gap for the pace car to open, or none to close
  if (type === "pace-car-chase") {
    const d = num(data.distance ?? 0);
    const v1 = num(data.speed ?? 0);
    const v2 = num(data.nextSpeed ?? 0);
    const tg = num(data.target ?? 0);
    if (d > 0 && v1 > 0 && v1 < tg && v2 > tg) return PaceCarChaseScene;
  }
  // three lines with distinct slopes really do cut out a triangle, and one pair
  // of them must meet the third at the same height so there is a base to measure
  if (type === "line-triangle") {
    const ls = parseLines(data.lines);
    if (ls.length === 3 && ls.every((l) => Number.isFinite(l.m) && Number.isFinite(l.b))) {
      const meet = (i: number, j: number) => {
        const x = (ls[j].b - ls[i].b) / (ls[i].m - ls[j].m);
        return { x, y: ls[i].m * x + ls[i].b };
      };
      const slopesDiffer = ls[0].m !== ls[1].m && ls[0].m !== ls[2].m && ls[1].m !== ls[2].m;
      const vs = [meet(0, 1), meet(0, 2), meet(1, 2)];
      const pairs: [number, number][] = [
        [0, 1],
        [0, 2],
        [1, 2],
      ];
      const flat = pairs.findIndex(([i, j]) => Math.abs(vs[i].y - vs[j].y) < 1e-9);
      // the apex has to sit over the base, or its foot falls outside the segment
      // and the box-halving picture would be a lie
      const spans =
        flat >= 0 &&
        (() => {
          const [i, j] = pairs[flat];
          const apex = vs[3 - i - j];
          return apex.x > Math.min(vs[i].x, vs[j].x) && apex.x < Math.max(vs[i].x, vs[j].x);
        })();
      if (slopesDiffer && vs.every((v) => Number.isFinite(v.x) && Number.isFinite(v.y)) && spans) {
        return LineTriangleScene;
      }
    }
  }
  // the final price has to be a real fraction of the original and short of it,
  // or there is no bite for the square to lose
  if (type === "percent-square-bite") {
    const f = num(data.finalPercent ?? 0);
    if (f > 0 && f < 100) return PercentSquareBiteScene;
  }
  // needs two real fractions and a search window with room for a leftover — or
  // there is nothing to divide evenly and nothing to test
  if (type === "score-share-search") {
    const aDen = num(data.alexaDen ?? 0);
    const bDen = num(data.brittanyDen ?? 0);
    const chelsea = num(data.chelsea ?? -1);
    const others = num(data.otherPlayers ?? 0);
    const maxEach = num(data.maxPerPlayer ?? -1);
    if (aDen > 0 && bDen > 0 && chelsea >= 0 && others > 0 && maxEach >= 0) {
      const g = (a: number, b: number): number => (b === 0 ? a : g(b, a % b));
      const L = (aDen * bDen) / g(aDen, bDen);
      const alexaTicks = num(data.alexaNum ?? 0) * (L / aDen);
      const britTicks = num(data.brittanyNum ?? 0) * (L / bDen);
      const remPerK = L - alexaTicks - britTicks;
      const othersMax = others * maxEach;
      let found = false;
      for (let k = 1; k <= 60 && !found; k++) {
        const x = remPerK * k - chelsea;
        if (x >= 0 && x <= othersMax) found = true;
      }
      if (remPerK > 0 && found) return ScoreShareSearchScene;
    }
  }
  // real, positive ratio parts and a real total area, or there is no triangle
  // and no area to split
  if (type === "mass-point-balance") {
    const adNum = num(data.adNum ?? 0);
    const dcNum = num(data.dcNum ?? 0);
    const totalArea = num(data.totalArea ?? 0);
    if (adNum > 0 && dcNum > 0 && totalArea > 0) return MassPointBalanceScene;
  }
  // needs enough apples left over after the minimums to actually be split
  if (type === "stars-and-bars") {
    const total = num(data.totalApples ?? 0);
    const people = num(data.people ?? 0);
    const minEach = num(data.minEach ?? 0);
    if (people >= 2 && minEach >= 0 && total - people * minEach >= 0) return StarsAndBarsScene;
  }
  // a real height to shrink and a scale factor greater than 1, or there is
  // nothing to divide and no model to draw
  if (type === "scale-model" && num(data.realHeight ?? 0) > 0 && num(data.ratio ?? 0) > 1) {
    return ScaleModelScene;
  }
  // at least two factors, or there is no telescoping chain to cancel down
  if (type === "fraction-zipper" && num(data.count ?? 0) >= 2) {
    return FractionZipperScene;
  }
  // at least three named people, or there is no circle to count around
  if (type === "count-out-circle" && Array.isArray(data.names) && data.names.length >= 3) {
    return CountOutCircleScene;
  }
  // a real outline, a real core rectangle, and at least one spike triangle to split
  if (
    type === "pinwheel-grid" &&
    Array.isArray(data.points) &&
    data.points.length >= 4 &&
    Array.isArray(data.core) &&
    data.core.length === 4 &&
    Array.isArray(data.spikes) &&
    data.spikes.length > 0
  ) {
    return PinwheelGridScene;
  }
  // at least one pair to cancel, or there is no telescoping annihilation to show
  if (type === "sign-pair-sum" && num(data.pairs ?? 0) >= 1) {
    return SignPairSumScene;
  }
  // the highway distance must tile exactly into whole coastal-length chunks,
  // and the speed ratio must actually be faster, or there is nothing to tile
  if (
    type === "road-chunk-pace" &&
    num(data.coastalMiles ?? 0) > 0 &&
    num(data.coastalMinutes ?? 0) > 0 &&
    num(data.highwayMiles ?? 0) > 0 &&
    num(data.speedRatio ?? 0) > 1 &&
    Number.isInteger(num(data.highwayMiles ?? 0) / num(data.coastalMiles ?? 1))
  ) {
    return RoadChunkPaceScene;
  }
  // the digit sum must land on exactly one unit digit, or the "find U" step has
  // no unique answer to lock in
  if (type === "digit-lock-chop" && Array.isArray(data.digits) && data.digits.length >= 2) {
    const ds = data.digits.map((d) => Math.round(num(d)));
    const d1 = Math.round(num(data.divisor1 ?? 0));
    const d2 = Math.round(num(data.divisor2 ?? 0));
    const known = ds.every((d) => d >= 0 && d <= 9) ? ds.reduce((a, b) => a + b, 0) : -1;
    const hits = known >= 0 ? Array.from({ length: 10 }, (_, u) => u).filter((u) => (known + u) % d1 === 0).length : 0;
    if (d1 >= 2 && d2 >= 2 && hits === 1) return DigitLockChopScene;
  }
  // a matching value/frequency for every bar, and at least one person counted,
  // or there is no weighted mean to compute
  if (
    type === "frequency-mean-bars" &&
    Array.isArray(data.values) &&
    Array.isArray(data.freqs) &&
    data.values.length >= 2 &&
    data.values.length === data.freqs.length &&
    data.freqs.reduce((a, f) => a + num(f), 0) > 0
  ) {
    return FrequencyMeanBarsScene;
  }
  // the interior left after peeling a 1-tile ring must have even width and
  // height, or the 2×2 tiles cannot exactly cover it
  if (type === "border-tile-grid" && num(data.width ?? 0) >= 3 && num(data.height ?? 0) >= 3) {
    const w = Math.round(num(data.width ?? 0));
    const h = Math.round(num(data.height ?? 0));
    if ((w - 2) % 2 === 0 && (h - 2) % 2 === 0) return BorderTileGridScene;
  }
  // every value must be a positive integer, or there is no clean reciprocal to flip
  if (type === "harmonic-mean-flip" && Array.isArray(data.values) && data.values.length >= 2) {
    const vs = data.values.map((v) => num(v));
    if (vs.every((v) => v > 0 && Number.isInteger(v))) return HarmonicMeanFlipScene;
  }
  // a real R×C grid of seats, small enough that every pair stays drawable
  if (type === "seating-adjacency" && num(data.rows ?? 0) >= 1 && num(data.cols ?? 0) >= 2 && num(data.rows ?? 0) * num(data.cols ?? 0) <= 8) {
    return SeatingAdjacencyScene;
  }
  // real calibration minutes plus a real elapsed hour count to convert
  if (
    type === "race-clock" &&
    num(data.carMinutes ?? 0) > 0 &&
    num(data.realMinutes ?? 0) > 0 &&
    num(data.carMinutes ?? 0) !== num(data.realMinutes ?? 0) &&
    num(data.carElapsedHours ?? 0) > 0
  ) {
    return RaceClockScene;
  }
  // at least three tests (so four-equal-plus-one is even possible) and a real
  // average/max-score pair to derive the total and the divisibility step from
  if (
    type === "repeated-score-range" &&
    num(data.tests ?? 0) >= 3 &&
    num(data.maxScore ?? 0) > 0 &&
    num(data.average ?? -1) >= 0 &&
    num(data.average ?? 0) <= num(data.maxScore ?? 0)
  ) {
    return RepeatedScoreRangeScene;
  }
  // a real target product and a small enough digit count that the greedy
  // search and the full enumeration both stay cheap and exact
  if (type === "greedy-digit-product" && num(data.target ?? 0) > 1 && num(data.slots ?? 0) >= 2 && num(data.slots ?? 0) <= 6) {
    return GreedyDigitProductScene;
  }
  if (type === "crescent-circle" && num(data.combinedSmallArea ?? 0) > 0) {
    return CrescentCircleScene;
  }
  // exactly one three-digit repeat shift and a small, exact factorization keep
  // both the place-value regrouping and the drawable factor tree truthful
  if (type === "repeated-block-factor" && Array.isArray(data.factors)) {
    const digits = Math.round(num(data.blockDigits ?? 0));
    const shift = Math.round(num(data.shift ?? 0));
    const factors = data.factors.map((value) => Math.round(num(value)));
    if (digits === 3 && shift === 10 ** digits && factors.length === 3 && factors.every((value) => value > 1 && value <= 99) && factors.reduce((a, b) => a * b, 1) === shift + 1) {
      return RepeatedBlockFactorScene;
    }
  }
  // enumerate the entire stated range, but keep it small enough for a complete
  // truth check and require a single-digit predicate plus a genuine divisor
  if (type === "truth-count-house") {
    const lo = Math.round(num(data.min ?? 0));
    const hi = Math.round(num(data.max ?? 0));
    const divisor = Math.round(num(data.divisor ?? 0));
    const digit = Math.round(num(data.requiredDigit ?? -1));
    const truths = Math.round(num(data.truthCount ?? 0));
    if (lo === 10 && hi === 99 && divisor >= 2 && divisor <= 20 && digit >= 0 && digit <= 9 && truths === 3) {
      return TruthCountHouseScene;
    }
  }
  // the denominators must yield a compact common-multiple tray, and the fixed
  // color count must be small enough to draw every marble in the first trials
  if (type === "fraction-marble-packing") {
    const bd = Math.round(num(data.blueDen ?? 0));
    const rd = Math.round(num(data.redDen ?? 0));
    const green = Math.round(num(data.greenCount ?? 0));
    const gcd2 = (a: number, b: number): number => (b ? gcd2(b, a % b) : Math.abs(a));
    const base = bd > 0 && rd > 0 ? (bd * rd) / gcd2(bd, rd) : 0;
    if (bd >= 2 && bd <= 8 && rd >= 2 && rd <= 8 && base >= 2 && base <= 24 && green >= 1 && green <= 20 && base * 2 <= 48) {
      return FractionMarblePackingScene;
    }
  }
  // distinct ordered card labels and a modest combination count ensure every
  // equally likely selection can be generated and drawn in the gallery
  if (type === "max-card-selection" && Array.isArray(data.cards)) {
    const cards = data.cards.map((value) => Math.round(num(value)));
    const draw = Math.round(num(data.draw ?? 0));
    const target = Math.round(num(data.targetMax ?? 0));
    const choose = (n: number, k: number) => {
      let out = 1;
      for (let i = 1; i <= k; i += 1) out = (out * (n - i + 1)) / i;
      return out;
    };
    if (cards.length >= 3 && cards.length <= 7 && new Set(cards).size === cards.length && cards.every((v, i) => v > 0 && (i === 0 || cards[i - 1] < v)) && draw >= 2 && draw < cards.length && cards.includes(target) && choose(cards.length, draw) <= 20) {
      return MaxCardSelectionScene;
    }
  }
  // an odd side creates exactly one shared center tile; cap the side so every
  // floor tile can still be drawn and inspected individually
  if (type === "diagonal-tile-count") {
    const side = Math.round(num(data.sideTiles ?? 0));
    const union = Math.round(num(data.diagonalUnion ?? 0));
    if (side >= 3 && side <= 25 && side % 2 === 1 && union === 2 * side - 1) {
      return DiagonalTileCountScene;
    }
  }
  // exactly three modest divisors keep each remainder lane drawable; a common
  // positive remainder must be smaller than every divisor
  if (type === "remainder-one-interval" && Array.isArray(data.divisors)) {
    const ds = data.divisors.map((value) => Math.round(num(value)));
    const rem = Math.round(num(data.remainder ?? -1));
    if (ds.length === 3 && new Set(ds).size === 3 && ds.every((d) => d >= 2 && d <= 12 && rem >= 0 && rem < d)) {
      return RemainderOneIntervalScene;
    }
  }
  // exactly three named players, one unknown win count, and small nonnegative
  // records keep the complete token ledger both truthful and drawable
  if (type === "game-result-balance" && Array.isArray(data.players)) {
    const rows = data.players.map((raw) => String(raw).split("|"));
    const valid = rows.length === 3 && rows.every((row) => row.length === 3 && row[0].length > 0 && num(row[2]) >= 0 && num(row[2]) <= 8);
    const unknown = rows.filter((row) => Math.round(num(row[1], -1)) < 0).length;
    if (valid && unknown === 1 && rows.every((row) => num(row[1], -1) <= 8)) return GameResultBalanceScene;
  }
  // scores must stay within percentage bounds, and Chloe's equal-half mirror
  // must produce a valid shared score for Zoe's final equal-weight average
  if (type === "equal-half-score") {
    const ca = num(data.chloeAlone ?? -1);
    const co = num(data.chloeOverall ?? -1);
    const za = num(data.zoeAlone ?? -1);
    const shared = 2 * co - ca;
    const out = (za + shared) / 2;
    if ([ca, co, za, shared, out].every((v) => v >= 0 && v <= 100) && ca < co && co < shared && Number.isInteger(out)) return EqualHalfScoreScene;
  }
  // a short target and a small, uniquely positioned sparse lattice allow every
  // orthogonal branch to be enumerated and every source node to be drawn
  if (type === "letter-branch-path" && typeof data.target === "string" && Array.isArray(data.nodes)) {
    const target = data.target;
    const parsed = data.nodes.map((raw) => String(raw).split(","));
    const keys = parsed.map((row) => `${row[0]},${row[1]}`);
    if (target.length >= 3 && target.length <= 6 && parsed.length >= target.length && parsed.length <= 30 && parsed.every((row) => row.length === 3 && num(row[0], -1) >= 0 && num(row[0], -1) <= 8 && num(row[1], -1) >= 0 && num(row[1], -1) <= 8 && row[2].length === 1 && target.includes(row[2])) && new Set(keys).size === keys.length) {
      return LetterBranchPathScene;
    }
  }
  // a positive 3-4-5-scale right triangle makes the equal-perimeter split
  // unique and keeps the derived point strictly inside the hypotenuse
  if (type === "equal-perimeter-split" && Array.isArray(data.legs) && data.legs.length === 2) {
    const [a, b] = data.legs.map((value) => num(value));
    const c = num(data.hypotenuse);
    const cd = (c + b - a) / 2;
    if (a > 0 && b > 0 && c > 0 && a <= 20 && b <= 20 && c <= 30 && Math.abs(a * a + b * b - c * c) < 1e-9 && cd > 0 && cd < c) return EqualPerimeterSplitScene;
  }
  // positive integer rates with a smaller second deal must yield a modest,
  // integral number of donor and total chests so each chest can be drawn
  if (type === "chest-redistribution") {
    const first = Math.round(num(data.firstPerChest));
    const second = Math.round(num(data.secondPerChest));
    const empty = Math.round(num(data.emptyChests));
    const leftover = Math.round(num(data.leftoverCoins));
    const gap = first - second;
    const used = gap > 0 ? (empty * second + leftover) / gap : 0;
    const total = used + empty;
    if ([first, second, empty, leftover].every((v) => Number.isInteger(v) && v >= 0) && first <= 12 && second > 0 && empty > 0 && gap > 0 && Number.isInteger(used) && used > 0 && total <= 8) return ChestRedistributionScene;
  }
  // two positive legs define the right triangular notch; its hypotenuse with
  // AB must in turn match AD, keeping both nested right triangles drawable
  if (type === "concave-triangle-subtract") {
    const ab = num(data.AB), bc = num(data.BC), cd = num(data.CD), ad = num(data.AD);
    const bd = Math.sqrt(bc * bc + cd * cd);
    if ([ab, bc, cd, ad].every((v) => v > 0 && v <= 30) && bd > 0 && Math.abs(ab * ab + bd * bd - ad * ad) < 1e-9) return ConcaveTriangleSubtractScene;
  }
  // three consecutive, modest factorial indices keep the common-factor ratios
  // exact and drawable; the prime-power ledger is capped at three floor terms
  if (type === "factorial-five-ledger" && Array.isArray(data.factorials) && data.factorials.length === 3) {
    const fs = data.factorials.map((v) => Math.round(num(v))).sort((a, b) => a - b);
    const p = Math.round(num(data.prime));
    let powers = 0;
    if (p >= 2) for (let q = p; q <= fs[0]; q *= p) powers += 1;
    if (p >= 2 && p <= 11 && fs[0] >= p && fs[0] <= 150 && fs[1] === fs[0] + 1 && fs[2] === fs[1] + 1 && powers >= 1 && powers <= 3) return FactorialFiveLedgerScene;
  }
  // a decimal four-slot lock with the exact odd units set keeps every exclusion
  // explicit; the supplied range must contain all and only four-digit numbers
  if (type === "distinct-odd-digit-slots" && Array.isArray(data.oddUnits)) {
    const low = Math.round(num(data.lower)), high = Math.round(num(data.upper));
    const digits = Math.round(num(data.digitCount)), len = Math.round(num(data.length));
    const odds = data.oddUnits.map((v) => Math.round(num(v)));
    if (low === 1000 && high === 9999 && digits === 10 && len === 4 && odds.length === 5 && odds.join(",") === "1,3,5,7,9") return DistinctOddDigitSlotsScene;
  }
  // exactly three nonzero variables summing to zero leave the six nonuniform
  // sign patterns; a singleton result keeps the final merge truthful
  if (type === "sign-product-cases" && Array.isArray(data.variables) && Array.isArray(data.possibleValues)) {
    const vars = data.variables.map(String);
    const values = data.possibleValues.map((v) => num(v));
    if (vars.length === 3 && new Set(vars).size === 3 && vars.every((v) => v.length === 1) && num(data.targetSum, NaN) === 0 && values.length === 1 && Number.isFinite(values[0])) return SignProductCasesScene;
  }
  // positive right-triangle legs with a rational area-split radius keep the
  // centre inside AC and the tangent point strictly inside the hypotenuse
  if (type === "semicircle-area-split") {
    const ac = num(data.AC), bc = num(data.BC), ab = Math.hypot(ac, bc);
    const r = ac * bc / (ab + bc);
    if (ac > 0 && bc > 0 && ac <= 30 && bc <= 30 && Number.isInteger(ab) && r > 0 && r < ac / 2) return SemicircleAreaSplitScene;
  }
  // a modest hour length and day count keep the full divisor set, every pace
  // chain, and each one-mile road block enumerable and drawable
  if (type === "pace-divisor-days") {
    const hour = Math.round(num(data.hourMinutes)), days = Math.round(num(data.days)), gap = Math.round(num(data.paceIncrease));
    const ds = hour > 0 ? Array.from({ length: hour }, (_, i) => i + 1).filter((d) => hour % d === 0) : [];
    const chains = ds.filter((start) => Array.from({ length: days }, (_, i) => start + i * gap).every((v) => ds.includes(v)));
    if (hour >= 12 && hour <= 120 && days >= 3 && days <= 6 && gap > 0 && ds.length <= 24 && chains.length === 1 && hour / chains[0] <= 20) return PaceDivisorDaysScene;
  }
  // Three distinct short periods and a bounded year keep both the complete
  // repeat cycle and every day of the independent calendar check drawable.
  if (type === "periodic-call-inclusion" && Array.isArray(data.periods)) {
    const year = Math.round(num(data.yearDays));
    const periods = data.periods.map((value) => Math.round(num(value)));
    const gcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : gcd(b, a % b);
    const cycle = periods.length === 3
      ? periods.reduce((current, period) => Math.abs(current * period) / (gcd(current, period) || 1), 1)
      : 0;
    if (year >= 30 && year <= 400 && periods.length === 3 && new Set(periods).size === 3 && periods.every((period) => period >= 2 && period <= 12) && cycle <= 120) return PeriodicCallInclusionScene;
  }
  // Equal short sides and matching arc radii complete a side-(s+r)
  // equilateral triangle; the 60° arcs are exactly its two corner sectors.
  if (type === "equilateral-sector-cut") {
    const segment = num(data.segmentLength), radius = num(data.arcRadius), angle = num(data.centralAngle);
    if (segment > 0 && segment <= 20 && radius === segment && angle === 60) return EquilateralSectorCutScene;
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
