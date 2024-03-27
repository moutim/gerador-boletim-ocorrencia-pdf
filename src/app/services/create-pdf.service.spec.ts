import { TestBed } from '@angular/core/testing';

import { CreatePdfService } from './create-pdf.service';

describe('CreatePdfService', () => {
  let service: CreatePdfService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreatePdfService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
