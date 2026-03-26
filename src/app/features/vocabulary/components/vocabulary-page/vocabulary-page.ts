import { Component, OnInit, signal } from '@angular/core';
import { WordList } from '../word-list/word-list';
import { VocabularyApi } from '../../api/vocabulary.api';
import { Word } from '../../model/word';
import { Page } from '../../model/word-page';
import { finalize } from 'rxjs';
import { EditWordModal } from '../edit-word-modal/edit-word-modal';
import { UpdateWordRequest } from '../../model/request/update-word-request';
@Component({
  selector: 'app-vocabulary-page',
  imports: [WordList, EditWordModal],
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
  page: number = 0;

  selectedWord: Word | null = null;
  isEditModalOpen = false;
  isSavingWord = false;

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
          this.page = data.page;
        },
        error: (err) => {
          this.errorMessage = "error when loading words";
          console.error(err);
        }
      });
  }

  onDeleteWord(wordId: number): void {
    this.vocabulary.deleteWord(wordId)
      .pipe(finalize(() => this.loadWords()))
      .subscribe({
        error: (err) => {
          this.errorMessage = "error when deleting word";
          console.error(err);
        }
      });
  }

  onToggleLearned(payload: { id: number, isLearned: boolean }): void {
    this.vocabulary.toggleLearned(payload.id, payload.isLearned)
      .pipe(finalize(() => this.loadWords()))
      .subscribe({
        error: (err) => {
          this.errorMessage = "error while updated learned status word";
          console.error(err);
        }
      });
  }

  closeWordModal(updateReq: UpdateWordRequest): void {
    this.selectedWord = null;
    this.isEditModalOpen = false;
  }
  onOpenWord(word: Word): void {
    this.selectedWord = word;
    this.isEditModalOpen = true;
  }
  updateWord(updateReq: UpdateWordRequest): void {
    // this.vocabulary.updateWord(updateReq)
    console.log("update!");
  }
}