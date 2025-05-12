import { TestBed } from '@angular/core/testing';

import { TestimoniosService } from './testimonios.service';

describe('TestimoniosService', () => {
  let service: TestimoniosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TestimoniosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
