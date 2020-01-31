import { TestBed } from '@angular/core/testing';

import { PostLoginAuthResolverService } from './post-login-auth-resolver.service';

describe('PostLoginAuthResolverService', () => {
  let service: PostLoginAuthResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PostLoginAuthResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
