import { TestBed } from '@angular/core/testing';

import { SearchBackendService } from './search-backend.service';

describe('SearchBackendService', () => {
  let service: SearchBackendService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchBackendService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
