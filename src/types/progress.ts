export interface ProblemAttempt {
  problemId: string;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  attemptedAt: string;
}

export interface ProblemProgress {
  solvedIds: string[];
  missedIds: string[];
  bookmarkedIds: string[];
  attempts: ProblemAttempt[];
}
