import { TestBed } from '@angular/core/testing';

import { ChronometerGuardGuard } from './chronometer-guard.guard';

describe('ChronometerGuardGuard', () => {
  let guard: ChronometerGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ChronometerGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
