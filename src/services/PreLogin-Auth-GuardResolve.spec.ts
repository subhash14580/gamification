import { TestBed } from '@angular/core/testing';

import { PreLoginAuthGuardResolver } from './auth-guard.resolver';

describe('AuthGuardService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreLoginAuthGuardResolver = TestBed.get(PreLoginAuthGuardResolver);
    expect(service).toBeTruthy();
  });
});
