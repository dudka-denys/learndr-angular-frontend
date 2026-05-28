import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Word } from '../../model/word';
import { UpdateWordRequest } from '../../model/request/update-word-request';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CreateWordRequestDto } from '../../model/dto/create-word-request-dto';

@Component({
  selector: 'app-word-form-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './word-form-modal.html',
  styleUrl: './word-form-modal.css',
})
export class WordFormModal implements OnChanges {
  @Input() word: Word | null = null;
  @Input() isWordFormModalOpen: boolean = false;
  @Input() isSavingWord: boolean = false;
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() closeWordModal = new EventEmitter<void>();
  @Output() updateWord = new EventEmitter<UpdateWordRequest>();
  @Output() createWord = new EventEmitter<CreateWordRequestDto>();

  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      word: ['', [Validators.required, Validators.maxLength(255)]],
      meaning: ['', [Validators.required, Validators.maxLength(255)]],
      context: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.mode == 'edit')
      if (changes['word'] && this.word) {
        this.form.patchValue({
          word: this.word ? this.word.word : '',
          meaning: this.word ? this.word.meaning : '',
          context: this.word ? this.word.context : '',
        });
      }
  }

  onBackdropClick(): void {
    if (this.mode == 'edit')
      this.onSubmit();
    else
      this.onClose();
  }
  onClose(): void {
    this.form.reset();
    this.closeWordModal.emit();
  }
  onModalClick(event: Event): void {
    event.stopPropagation();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (!this.form.dirty) {
      this.onClose();
      return;
    }
    const raw = this.form.value;

    if (this.mode == 'edit') {
      if (!this.word) return;
      let updateReq = new UpdateWordRequest(this.word?.id,
        raw.word,
        raw.meaning,
        raw.context
      )
      this.updateWord.emit(updateReq);
    }
    else {
      this.createWord.emit(new CreateWordRequestDto(
        raw.word,
        raw.meaning,
        raw.context,
      ))
    }
    this.form.reset();
    this.onClose();
  }
}
