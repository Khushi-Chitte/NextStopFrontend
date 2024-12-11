import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminOperatorPassengerGuard } from './admin-operator-passenger.guard';

describe('adminOperatorPassengerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminOperatorPassengerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
