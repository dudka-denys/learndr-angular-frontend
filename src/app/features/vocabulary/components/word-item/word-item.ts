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
  @Input({required:true}) word!: Word;

  @Output() deleteWord = new EventEmitter<number>();
  @Output() toggleLearned = new EventEmitter<number>();

  onDeleteWord(): void{
    this.deleteWord.emit(this.word.id);
  }
  onToggleLearned():void {
    this.toggleLearned.emit(this.word.id);
  }
}