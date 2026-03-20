import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetWordsPage } from './get-words-page';

describe('GetWordsPage', () => {
  let component: GetWordsPage;
  let fixture: ComponentFixture<GetWordsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GetWordsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(GetWordsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
