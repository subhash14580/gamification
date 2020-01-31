import { TestBed } from '@angular/core/testing';

import { PostloginauthguardService } from './postloginauthguard.service';

describe('PostloginauthguardService', () => {
  let service: PostloginauthguardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostloginauthguardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
