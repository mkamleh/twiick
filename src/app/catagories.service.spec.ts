import { TestBed } from '@angular/core/testing';

import { CatagoriesService } from './catagories.service';

describe('CatagoriesService', () => {
  let service: CatagoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CatagoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
