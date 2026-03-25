import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Word } from '../../model/word';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-word-item',
  imports: [NgClass],
  templateUrl: './word-item.html',
  styleUrl: './word-item.css',
})
export class WordItem {
  @Input({ required: true }) word!: Word;

  @Output() deleteWord = new EventEmitter<number>();
  @Output() toggleLearned = new EventEmitter<{ id: number, isLearned: boolean }>();

  onDeleteWord(): void {
    this.deleteWord.emit(this.word.id);
  }
  onToggleLearned(): void {
        console.log('wordId=', this.word.id, typeof this.word.id);

    this.toggleLearned.emit({ id: this.word.id, isLearned: !this.word.isLearned });
  }
}