import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Word } from '../../model/word';
import { UpdateWordRequest } from '../../model/request/update-word-request';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-word-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-word-modal.html',
  styleUrl: './edit-word-modal.css',
})
export class EditWordModal implements OnChanges {
  @Input() word: Word | null = null;
  @Input() isEditModalOpen: boolean = false;
  @Input() isSavingWord: boolean = false;

  @Output() closeWordModal = new EventEmitter<UpdateWordRequest>();
  @Output() updateWord = new EventEmitter<UpdateWordRequest>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      word: [this.word?.word, [Validators.required, Validators.maxLength(255)]],
      meaning: [this.word?.meaning, [Validators.required, Validators.maxLength(255)]],
      context: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("Asd");
  }

  onBackdropClick(): void {
    this.onClose();
  }
  onClose(): void {
    this.onSubmit
  }
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  onSubmit(): void {
    if(this.form.invalid) {
      // this.form.markAllAsTouched();
      return;
    }
    const raw = this.form.value;

    if (!this.word) return;
    let updateReq = new UpdateWordRequest(this.word?.id,
      this.word?.word,
      this.word?.meaning,
      this.word?.context
    )
      this.updateWord.emit(updateReq);
  }
}
