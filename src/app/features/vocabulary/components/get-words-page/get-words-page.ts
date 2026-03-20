import { Component, OnInit } from '@angular/core';
import { Word } from '../../model/word';
import { Page } from '../../model/word-page';
import { VocabularyApi } from '../../api/vocabulary.api';
import { finalize } from 'rxjs';
import { signal } from '@angular/core';

@Component({
  selector: 'app-get-words-page',
  imports: [],
  templateUrl: './get-words-page.html',
  styleUrl: './get-words-page.css',
})
export class GetWordsPage implements OnInit {
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
        next: (data: Page<Word[]>) => {
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
}
