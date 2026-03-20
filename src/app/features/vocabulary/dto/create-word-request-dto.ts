export class CreateWordRequestDto {
  word!: string;
  meaning!: string;
  context!: string;
  сonstructor(data: {
    word: string;
    meaning: string;
    context: string;
  }) {
    this.word = data.word;
    this.meaning = data.meaning;
    this.context = data.context;
  }
}
