export class Word {
  id: number;
  word: string;
  meaning: string;
  context: string;
  learnProgressPercentage: number;
  isLearned: boolean;
  createdAt: Date;

  constructor(data: {
    id: number
    word: string
    meaning: string
    context: string
    learnProgressPercentage: number
    isLearned: boolean
    createdAt: Date
  }) {
    this.id = data.id;
    this.word = data.word;
    this.meaning = data.meaning;
    this.context = data.context;
    this.learnProgressPercentage = data.learnProgressPercentage;
    this.isLearned = data.isLearned;
    this.createdAt = data.createdAt;
  }
}
