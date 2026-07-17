export interface UpdateWordRequest {
  wordId: number;
  word: string;
  meaning: string;
  context: string | null;
}