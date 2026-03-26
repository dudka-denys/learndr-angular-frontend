export class Word {
  id: number;
  word: string;
  meaning: string;
  context: string | null;
  learnProgressPercentage: number;
  isLearned: boolean;
  createdAt: Date;

  constructor(
    id: number,
    word: string,
    meaning: string,
    context: string | null,
    learnProgressPercentage: number,
    isLearned: boolean,
    createdAt: Date,
  ) {
    this.id = id;
    this.word = word;
    this.meaning = meaning;
    this.context = context;
    this.learnProgressPercentage = learnProgressPercentage;
    this.isLearned = isLearned;
    this.createdAt = createdAt;
  }
}
