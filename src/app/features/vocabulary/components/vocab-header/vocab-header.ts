import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-vocab-header',
  imports: [],
  templateUrl: './vocab-header.html',
  styleUrl: './vocab-header.css',
})
export class VocabHeader {
  @Output() openCreateWordModal = new EventEmitter<void>();
  CreateWord(): void {
    this.openCreateWordModal.emit();
  }
}
