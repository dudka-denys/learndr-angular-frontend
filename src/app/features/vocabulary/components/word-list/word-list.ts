import { Component, Input, Output,EventEmitter  } from '@angular/core';
import { Word } from '../../model/word';
import { WordItem } from '../word-item/word-item';

@Component({
  selector: 'app-word-list',
  imports: [WordItem],
  templateUrl: './word-list.html',
  styleUrl: './word-list.css',
})
export class WordList {
  @Input() words: Word[]=[];
  @Output() deleteWord = new EventEmitter<number>();
  @Output() toggleLearned = new EventEmitter<{ id: number, isLearned: boolean }>();

  onDeleteWord(wordId:number): void {
    this.deleteWord.emit(wordId);
  }

  onToggleLearned(payload: { id: number, isLearned: boolean }): void {
    this.toggleLearned.emit(payload);
  }  
}
