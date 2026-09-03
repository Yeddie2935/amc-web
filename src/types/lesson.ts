import type { DifficultyLevel, Problem } from "./amc";
import type { LessonType, ProblemRole } from "./curriculum";

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

/** Pedagogical phase: why this beat exists in the learning sequence. */
export type LessonPhase =
  | "puzzle"
  | "try"
  | "notice"
  | "name"
  | "play"
  | "competition-application"
  | "guided-problem"
  | "independent-transfer"
  | "reflection";

/** Rendering/interaction mechanism. A phase may use any appropriate beat kind. */
export type LessonBeatKind =
  | "copy"
  | "visual"
  | "interaction"
  | "concept"
  | "problem"
  | "reflection";

export type LessonVisualPrimitive =
  | "choice-grid"
  | "path-walk"
  | "branch-tree"
  | "sort-into-cases"
  | "outcome-grid"
  | "venn-builder"
  | "object-lineup"
  | "slot-filler"
  | "bars-and-groups"
  | "number-line"
  | "factor-tree"
  | "remainder-clock"
  | "area-cut-rearrange"
  | "angle-explorer"
  | "shape-scale"
  | "balance-scale"
  | "pattern-extender"
  | "probability-tree"
  | "data-graph"
  | "solid-fold"
  | "drag-match"
  | "custom";

export interface LessonVisualSpec {
  primitive: LessonVisualPrimitive;
  /** JSON-serializable configuration interpreted by the primitive renderer. */
  data: Record<string, JsonValue>;
  /** Optional stable key for carrying visual state/objects across adjacent beats. */
  continuityKey?: string;
  ariaLabel?: string;
}

export interface LessonResolutionStep {
  title?: string;
  body: string;
  math?: string;
}

export interface LessonResolutionSpec {
  /** Static or self-animating visual that explains this exact question. */
  visual?: LessonVisualSpec;
  /** Uses the problem beat's existing controlled animation plan and prompts. */
  animation?: { kind: "problem-animation" };
  steps?: LessonResolutionStep[];
  takeaway?: string;
}

export interface LessonChoiceOption {
  id: string;
  text: string;
}

export type LessonResponseSpec =
  | { kind: "none" }
  | {
      kind: "single-choice";
      options: LessonChoiceOption[];
      correctId: string;
      feedback?: Record<string, string>;
    }
  | {
      kind: "multi-select";
      options: LessonChoiceOption[];
      correctIds: string[];
      feedback?: string;
    }
  | {
      kind: "numeric";
      answer: number;
      tolerance?: number;
      units?: string;
      feedback?: string;
    }
  | {
      kind: "sort";
      items: LessonChoiceOption[];
      buckets: LessonChoiceOption[];
      correctBucketByItem: Record<string, string>;
      feedback?: string;
    }
  | {
      kind: "match";
      left: LessonChoiceOption[];
      right: LessonChoiceOption[];
      correctRightByLeft: Record<string, string>;
      feedback?: string;
    }
  | {
      kind: "free-response";
      rubric: string;
      revealAfterSubmit?: string;
    };

export interface LessonBeatBase {
  id: string;
  phase: LessonPhase;
  kind: LessonBeatKind;
  /** Internal authoring note: what this beat is pedagogically doing. */
  purpose: string;
  /** The specific realization the learner should leave this beat with. */
  expectedRealization?: string;
  /** Natural language bridge from the previous beat. Required at major problem boundaries. */
  transitionIn?: string;
  /** Natural language/conceptual bridge into the next beat. */
  transitionOut?: string;
  estimatedSeconds?: number;
}

export interface CopyLessonBeat extends LessonBeatBase {
  kind: "copy";
  heading?: string;
  body: string;
  math?: string[];
}

export interface VisualLessonBeat extends LessonBeatBase {
  kind: "visual";
  visual: LessonVisualSpec;
  caption?: string;
}

export interface InteractionLessonBeat extends LessonBeatBase {
  kind: "interaction";
  prompt: string;
  visual?: LessonVisualSpec;
  response: LessonResponseSpec;
  correctFeedback?: string;
  incorrectFeedback?: string;
  allowRetry?: boolean;
  resolution?: LessonResolutionSpec;
}

export interface ConceptLessonBeat extends LessonBeatBase {
  kind: "concept";
  name: string;
  conciseDefinition: string;
  formalization?: string;
  memoryHook?: string;
}

export type LessonProblemSource = "bank" | "generated";
export type LessonProblemPresentation =
  | "scenario-first"
  | "full-prompt"
  | "animation-first"
  | "independent";

export interface LessonProblemAnimationPlan {
  mode: "none" | "whole" | "slice";
  /** 0-based scene/explanation steps when mode is slice. */
  stepIndices?: number[];
  /** Lesson owns stepping for integrated teaching problems. */
  controlledByLesson: boolean;
  autoplay?: boolean;
  showPlayerControls?: boolean;
}

export interface LessonProblemBeat extends LessonBeatBase {
  kind: "problem";
  source: LessonProblemSource;
  problemId: string;
  role: ProblemRole;
  presentation: LessonProblemPresentation;
  whyNow: string;
  entryBridge: string;
  exitBridge: string;
  reusedRepresentation?: string;
  animation: LessonProblemAnimationPlan;
  learnerPrompts: string[];
  correctFeedback?: string;
  incorrectFeedback?: string;
  resolution?: LessonResolutionSpec;
  /** Authentic provenance should be visible without interrupting discovery. */
  sourceLabelTiming?: "before" | "after" | "completion" | "hidden";
}

export interface ReflectionLessonBeat extends LessonBeatBase {
  kind: "reflection";
  prompt: string;
  takeaway?: string;
}

export type LessonBeat =
  | CopyLessonBeat
  | VisualLessonBeat
  | InteractionLessonBeat
  | ConceptLessonBeat
  | LessonProblemBeat
  | ReflectionLessonBeat;

export interface LessonMisconceptionTarget {
  misconception: string;
  /** Beats that intentionally surface, diagnose, or repair the misconception. */
  beatIds: string[];
}

export interface LessonContinuitySpec {
  /** Optional callback to the narrative predecessor; should feel useful, not ceremonial. */
  openingCallback?: string;
  /** Ideas/representations intentionally planted for later lessons. */
  closingSeeds: string[];
  nextLessonIds: string[];
}

export type PracticeTransferLevel = "near" | "mixed" | "challenge";

export interface PracticeSelectionRule {
  source: LessonProblemSource;
  transferLevel: PracticeTransferLevel;
  count: number;
  difficulty?: DifficultyLevel | DifficultyLevel[];
}

export interface LessonPracticePlan {
  /** Minimum validated generated pool available before the lesson is publishable. */
  generatedPoolMinimum: {
    near: number;
    mixed: number;
    challenge: number;
  };
  /** Default five-item end-of-lesson session unless a lesson overrides it. */
  sessionSelection: PracticeSelectionRule[];
  /** Problems consumed inside teaching should not immediately repeat as practice. */
  excludeProblemIds: string[];
  requireFreshGeneratedItems: boolean;
}

export interface LessonMasterySpec {
  skillId: string;
  /** Independent evidence matters more than merely reaching the end of a lesson. */
  evidenceBeatIds: string[];
  minIndependentPracticeItems: number;
  recommendedAccuracyThreshold: number;
  weightMixedTransferMore: boolean;
}

export interface LessonGenerationMetadata {
  curriculumVersion: string;
  mappingVersion: string;
  generatorVersion: string;
  sourceDrafts?: string[];
  notes?: string[];
}

export type LessonReviewStatus = "draft" | "validated" | "approved";

export interface LessonSpec {
  schemaVersion: "1.0.0";
  lessonId: string;
  curriculumNodeId: string;
  title: string;
  lessonType: LessonType;
  status: LessonReviewStatus;
  estimatedMinutes: number;

  coreInsight: string;
  targetLearnerRealization: string;
  learningObjectives: string[];
  hardPrerequisites: string[];
  narrativePredecessor: string | null;
  continuity: LessonContinuitySpec;
  misconceptionTargets: LessonMisconceptionTarget[];

  beats: LessonBeat[];
  practice: LessonPracticePlan;
  mastery: LessonMasterySpec;
  generation: LessonGenerationMetadata;
}

export type GeneratedProblemPurpose = "teaching" | "practice";
export type GeneratedProblemValidationStatus = "draft" | "validated" | "approved";

/**
 * Wrapper around the existing Problem schema for Mathinking-original material.
 * The actual problem remains compatible with Practice/ProblemWorkspace while
 * provenance and validation stay inspectable by the generator pipeline.
 */
export interface GeneratedProblemArtifact {
  schemaVersion: "1.0.0";
  lessonId: string;
  purpose: GeneratedProblemPurpose;
  transferLevel: "discovery" | PracticeTransferLevel;
  targetConcepts: string[];
  inspirationProblemIds: string[];
  problem: Problem & { sourceType: "Original"; license: "Original" };
  validation: {
    status: GeneratedProblemValidationStatus;
    answerVerified: boolean;
    solutionVerified: boolean;
    uniquenessVerified: boolean | null;
    prerequisiteAuditPassed: boolean;
    wordingReviewed: boolean;
    notParaphraseOfBank: boolean;
    validationMethods: string[];
    notes?: string[];
  };
}
