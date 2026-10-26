export type LearningStyle = 
  | 'Visual & Spatial'
  | 'Socratic & First-Principles'
  | 'Analogical & Real-World'
  | 'Rigorous & Mathematical'
  | 'ELI5 / Intuitive';

export type KnowledgeLevel = 'Novice' | 'Intermediate' | 'Advanced';

export type PedagogicalMode = 'socratic' | 'direct_explain' | 'misconception_check' | 'feynman';

export interface MemoryFact {
  id: string;
  key: string;
  value: string;
  category: 'interest' | 'preference' | 'concept' | 'note';
  createdAt: string;
}

export interface UserAccount {
  id: string; // Personal login ID / Email (e.g. 25955a0538@iare.ac.in)
  name: string;
  email: string;
  institution: string;
  role: string;
  joinedDate: string;
  learningStyle: LearningStyle;
  knowledgeLevel: KnowledgeLevel;
  pace: 'Self-Paced' | 'Balanced' | 'Intensive';
  primaryGoal: string;
  targetTopic: string;
  topic: string;
  interests: string[]; // Academic interests remembered by AI
  studentMemories?: MemoryFact[]; // Dynamic facts remembered about student
  streakDays: number;
  studyHours: number;
  averageMastery: number;
  conceptsMastered: number;
  quizzesTaken: number;
  bookmarkedResourceIds: string[];
}

export type StudentProfile = UserAccount;

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  followUpPrompts?: string[];
  keyTakeaway?: string;
  pedagogicalMode?: PedagogicalMode;
}

export interface HistoryItem {
  id: string;
  userId: string;
  type: 'chat' | 'quiz' | 'resource';
  title: string;
  topic: string;
  timestamp: string;
  preview: string;
  messages?: ChatMessage[];
  score?: number;
  resourceId?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: string;
  type: 'guide' | 'cheat_sheet' | 'interactive' | 'formula_sheet';
  difficulty: KnowledgeLevel;
  estimatedReadTime: string;
  summary: string;
  content: string;
  tags: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  misconceptionAnalysis: Record<number, string>;
  explanation: string;
}

export interface RoadmapModule {
  id: string;
  title: string;
  summary: string;
  estimatedHours: number;
  status: 'completed' | 'in-progress' | 'locked';
  masteryScore: number;
  keyConcepts: string[];
  simulationSlug?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'Fundamental' | 'Intermediate' | 'Advanced';
  intervalDays?: number;
  lastReviewed?: string;
  mastered?: boolean;
}
