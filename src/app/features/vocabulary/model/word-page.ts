import { Word } from "./word";

export class Page<Word> {
  wordsDto: Word;
  page: number;
  totalElements: number;
  totalPages: number;
  hasNext: false;
  hasPrevious: false;

  constructor(data: {
    word: Word
    page: number
    totalElements: number
    totalPages: number
    hasNext: false
    hasPrevious: false
  }) {
    this.wordsDto = data.word;
    this.page = data.page;
    this.totalElements = data.totalElements;
    this.totalPages = data.totalPages;
    this.hasNext = data.hasNext;
    this.hasPrevious = data.hasPrevious;
  }
}

