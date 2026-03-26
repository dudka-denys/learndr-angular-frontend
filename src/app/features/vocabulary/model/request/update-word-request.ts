export class UpdateWordRequest {
  wordId: number;
  word: string;
  meaning: string;
  context: string | null;
  constructor(
    wordId: number,
    word: string,
    meaning: string,
    context: string | null,
  ) {
    this.wordId = wordId;
    this.word = word;
    this.meaning = meaning;
    this.context = context;
  }
}