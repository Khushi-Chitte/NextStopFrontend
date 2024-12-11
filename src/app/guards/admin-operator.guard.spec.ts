import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminOperatorGuard } from './admin-operator.guard';

describe('adminOperatorGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminOperatorGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
