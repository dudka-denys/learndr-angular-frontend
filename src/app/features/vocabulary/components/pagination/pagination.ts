import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.css',
})
export class Pagination {
  @Input() hasNext: boolean = false;
  @Input() hasPrevious: boolean = false;
  @Output() prevPage = new EventEmitter<void>();
  @Output() nextPage = new EventEmitter<void>();

  PrevPage(): void {
    this.prevPage.emit();
  }

  NextPage(): void {
    this.nextPage.emit();
  }
}
