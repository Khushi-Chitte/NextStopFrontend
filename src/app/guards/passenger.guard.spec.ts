import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { passengerGuard } from './passenger.guard';

describe('passengerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => passengerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
