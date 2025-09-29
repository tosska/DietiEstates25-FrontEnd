import { TestBed } from '@angular/core/testing';

import { OfferBackendService } from './offer-backend.service';

describe('OfferBackendService', () => {
  let service: OfferBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfferBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
