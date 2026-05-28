export class CreateWordRequestDto {
  word: string;
  meaning: string;
  context: string;
  constructor(
    word: string,
    meaning: string,
    context: string,
  ) {
    this.word = word;
    this.meaning = meaning;
    this.context = context;
  }
}
