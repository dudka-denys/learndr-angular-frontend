import { Component, OnInit, signal } from '@angular/core';
import { WordList } from '../word-list/word-list';
import { VocabularyApi } from '../../api/vocabulary.api';
import { Word } from '../../model/word';
import { Page } from '../../model/word-page';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-vocabulary-page',
  imports: [WordList],
  templateUrl: './vocabulary-page.html',
  styleUrl: './vocabulary-page.css',
})
export class VocabularyPage implements OnInit {
  isLoading = signal(false);
  errorMessage: string | null = null;
  words: Word[] = [];
  totalElements: number = 0;
  totalPages: number = 0;
  hasNext: boolean = false;
  hasPrevious: boolean = false;


  constructor(private vocabulary: VocabularyApi) { }

  ngOnInit(): void {
    this.loadWords();
  }

  private loadWords(): void {
    this.isLoading.set(true);
    this.errorMessage = null;

    this.vocabulary.getWords()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (data: Page<Word>) => {
          this.words = data.wordsDto;
          this.totalElements = data.totalElements;
          this.totalPages = data.totalPages;
          this.hasNext = data.hasNext;
          this.hasPrevious = data.hasPrevious;
        },
        error: (err) => {
          this.errorMessage = "error when loading words";
          console.error(err);
        }
      })
  }

  onDeleteWord(wordId: number): void {
    this.vocabulary.deleteWord(wordId)
      .pipe(finalize(() => this.loadWords()))
      .subscribe();
  }

  onToggleLearned(wordId: number): void {
    console.log('toggle learned', wordId);
  }
}
