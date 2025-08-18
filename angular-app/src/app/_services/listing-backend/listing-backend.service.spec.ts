import { TestBed } from '@angular/core/testing';

import { ListingBackendService } from './listing-backend.service';

describe('ListingBackendService', () => {
  let service: ListingBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListingBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
