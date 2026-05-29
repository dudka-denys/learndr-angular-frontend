import { Component, OnInit, signal } from '@angular/core';
import { WordList } from '../word-list/word-list';
import { VocabularyApi } from '../../api/vocabulary.api';
import { Word } from '../../model/word';
import { Page } from '../../model/word-page';
import { finalize } from 'rxjs';
import { WordFormModal } from '../word-form-modal/word-form-modal';
import { UpdateWordRequest } from '../../model/request/update-word-request';
import { Pagination } from '../pagination/pagination';
import { VocabHeader } from '../vocab-header/vocab-header';
import { CreateWordRequestDto } from '../../model/dto/create-word-request-dto';
@Component({
  selector: 'app-vocabulary-page',
  imports: [WordList, WordFormModal, Pagination, VocabHeader],
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

  searchSubStr: string | null = null;
  isLearnedFilter: boolean | null = null;

  selectedWord: Word | null = null;
  isWordFormModalOpen = false;
  isSavingWord = false;
  wordModalMode: 'create' | 'edit' = 'create';

  constructor(private vocabulary: VocabularyApi) { }

  ngOnInit(): void {
    this.loadWords();
  }

  private loadWords(): void {
    this.isLoading.set(true);
    this.errorMessage = null;

    this.vocabulary.getWords(this.page, undefined, undefined, this.searchSubStr, this.isLearnedFilter)
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
  // ~~~~~~~~~~~~~~~~~~~~~~~~ GET WORDS WITH SEARCH SUBSTRING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  getSearchSubStrWords(searchSubStr: string): void {
    this.searchSubStr = searchSubStr;
    this.page = 0;
    this.loadWords();
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~ GET WORDS WITH SEARCH SUBSTRING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  isLearnedFilterChange(isLearned: boolean | null): void {
    this.isLearnedFilter = isLearned;
    this.page = 0;
    this.loadWords();
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~ CREATE WORD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  openCreateWordModal(): void {
    this.selectedWord = null;
    this.isWordFormModalOpen = true;
    this.wordModalMode = 'create';
  }
  createWord(newWord: CreateWordRequestDto): void {
    this.vocabulary.createWord(newWord.word, newWord.meaning, newWord.context)
      .pipe(finalize(() => this.loadWords()))
      .subscribe({
        error: (err) => {
          this.errorMessage = "error when creating word";
          console.error(err);
        }
      });
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~ CREATE WORD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~ EDIT WORD WITH BUTTONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
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
  // ~~~~~~~~~~~~~~~~~~~~~~~~ EDIT WORD WITH BUTTONS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~ EDIT WORD WITH MODAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  closeWordModal(): void {
    this.selectedWord = null;
    this.isWordFormModalOpen = false;
  }
  onOpenWord(word: Word): void {
    this.wordModalMode = 'edit';
    this.selectedWord = word;
    this.isWordFormModalOpen = true;
  }
  updateWord(updateReq: UpdateWordRequest): void {
    this.vocabulary.updateWord(updateReq.wordId,
      updateReq.word,
      updateReq.meaning,
      updateReq.context,
    )
      .pipe(finalize(() => this.loadWords()))
      .subscribe({
        error: (err) => {
          this.errorMessage = "error while updating content of word" + updateReq.word;
          console.error(err);
        }
      });
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~ EDIT WORD WITH MODAL ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // ~~~~~~~~~~~~~~~~~~~~~~~~ PAGINATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  nextPage(): void {
    if (this.hasNext) {
      this.page++;
      this.loadWords();
    }
  }
  prevPage(): void {
    if (this.hasPrevious) {
      this.page--;
      this.loadWords();
    }
  }
  // ~~~~~~~~~~~~~~~~~~~~~~~~ PAGINATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
}
