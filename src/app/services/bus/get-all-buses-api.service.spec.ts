import { TestBed } from '@angular/core/testing';

import { GetAllBusesAPIService } from './get-all-buses-api.service';

describe('GetAllBusesAPIService', () => {
  let service: GetAllBusesAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GetAllBusesAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
