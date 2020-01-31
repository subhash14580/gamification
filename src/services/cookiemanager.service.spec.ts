import { TestBed } from '@angular/core/testing';

import { CookiemanagerService } from './cookiemanager.service';

describe('CookiemanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CookiemanagerService = TestBed.get(CookiemanagerService);
    expect(service).toBeTruthy();
  });
});
