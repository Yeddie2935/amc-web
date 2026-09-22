import type { Problem } from "../types/amc";

export type PageKind = "home" | "learn" | "lesson" | "practice" | "archive" | "year" | "problems" | "problem" | "tips" | "license" | "dashboard" | "not-found";
export interface ContentLink { label: string; path: string }
export interface DiagramInfo { alt: string; width: number; height: number }
export interface LessonSummary {
  id: string;
  title: string;
  intro: string;
  objectives: string[];
  prerequisites: ContentLink[];
  next: ContentLink[];
  recap?: { title: string; paragraphs: string[] };
}
export interface PracticeLane { id: string; title: string; description: string; counts: number[] }
export interface PageData {
  kind: PageKind;
  path: string;
  title: string;
  description: string;
  heading: string;
  indexable: boolean;
  breadcrumbs: ContentLink[];
  problemCount?: number;
  lesson?: LessonSummary;
  problem?: Problem;
  diagrams?: DiagramInfo[];
  links?: ContentLink[];
  related?: ContentLink[];
  lanes?: PracticeLane[];
  year?: number;
}
