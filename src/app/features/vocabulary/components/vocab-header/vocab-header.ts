import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vocab-header',
  imports: [],
  templateUrl: './vocab-header.html',
  styleUrl: './vocab-header.css',
})
export class VocabHeader {
  @Output() openCreateWordModal = new EventEmitter<void>();
  @Output() searchSubStrChange = new EventEmitter<string>();
  @Output() isLearnedFilterChange = new EventEmitter<boolean | null>();

  learnedFilter: boolean | null = null;

  CreateWord(): void {
    this.openCreateWordModal.emit();
  }
  onSearchInput(event: Event):void{
    const value = (event.target as HTMLInputElement).value;
    this.searchSubStrChange.emit(value);
  }
  onLearnedFilter(filterValue: boolean | null): void {
    this.learnedFilter = filterValue;
    this.isLearnedFilterChange.emit(filterValue);
  }
}
