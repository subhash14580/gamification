import { TestBed } from '@angular/core/testing';

import { HttpconnectService } from './httpconnect.service';

describe('HttpconnectService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HttpconnectService = TestBed.get(HttpconnectService);
    expect(service).toBeTruthy();
  });
});
