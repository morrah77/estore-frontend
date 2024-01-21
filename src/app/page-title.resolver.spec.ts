import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { pageTitleResolver } from './page-title.resolver';

describe('pageTitleResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => pageTitleResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
