import { TestBed } from '@angular/core/testing';

import { LawsService } from './laws.service';

describe('LawsService', () => {
  let service: LawsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LawsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
