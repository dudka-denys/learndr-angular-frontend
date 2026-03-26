import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditWordModal } from './edit-word-modal';

describe('EditWordModal', () => {
  let component: EditWordModal;
  let fixture: ComponentFixture<EditWordModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditWordModal],
    }).compileComponents();

    fixture = TestBed.createComponent(EditWordModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
