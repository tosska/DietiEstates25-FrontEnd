import { TestBed } from '@angular/core/testing';

import { CustomerBackendService } from './customer-backend.service';

describe('CustomerBackendService', () => {
  let service: CustomerBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
