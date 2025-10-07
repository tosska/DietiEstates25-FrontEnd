import { TestBed } from '@angular/core/testing';

import { AgencyBackendService } from './agency-backend.service';

describe('AgencyBackendService', () => {
  let service: AgencyBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgencyBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
