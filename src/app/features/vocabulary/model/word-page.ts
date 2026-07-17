export interface Page<Word> {
  wordsDto: Word[];
  page: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

