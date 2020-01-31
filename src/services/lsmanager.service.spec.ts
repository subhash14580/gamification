import { TestBed } from '@angular/core/testing';

import { LsmanagerService } from './lsmanager.service';

describe('LsmanagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LsmanagerService = TestBed.get(LsmanagerService);
    expect(service).toBeTruthy();
  });
});
