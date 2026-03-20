import { TestBed } from '@angular/core/testing';

import { VocabularyApi } from './vocabulary.api';

describe('VocabularyApi', () => {
  let service: VocabularyApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VocabularyApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
