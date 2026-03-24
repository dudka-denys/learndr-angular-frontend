export interface Word {
  id: number;
  word: string;
  meaning: string;
  context: string | null;
  learnProgressPercentage: number;
  isLearned: boolean;
  createdAt: Date;

  
}
