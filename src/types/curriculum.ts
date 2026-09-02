export type CurriculumStrand =
  | "foundations"
  | "algebra"
  | "numberTheory"
  | "countingProbability"
  | "geometry"
  | "problemSolving";

export type LessonType = "foundation" | "technique" | "connector";

export type ProblemRole = "anchor" | "guided" | "contrast" | "transfer";

export interface CurriculumNode {
  id: string;
  title: string;
  strand: CurriculumStrand;
  lessonType: LessonType;
  coreInsight: string;
  hardPrerequisites: string[];
  narrativePredecessor: string | null;
  narrativeTransition: string;
  unlocks: string[];
  transferConnections: string[];
  commonMisconceptions: string[];
}

export interface CurriculumTarget {
  competition: string;
  positioning: string;
  expectedNodeCount: number;
}

export interface CurriculumMeta {
  version: string;
  target: CurriculumTarget;
  strandOrder: CurriculumStrand[];
  strandLabels: Record<CurriculumStrand, string>;
  lessonTypeDefinitions: Record<LessonType, string>;
  edgeSemantics: {
    hardPrerequisites: string;
    narrativePredecessor: string;
    unlocks: string;
    transferConnections: string;
  };
  problemRoles: Record<ProblemRole, string>;
  authoringPrinciples: string[];
  preferredLessonBeats: string[];
  goldNarrativeEdges: [string, string][];
}

export interface CurriculumGraph {
  meta: CurriculumMeta;
  nodes: CurriculumNode[];
  byId: Record<string, CurriculumNode>;
}
