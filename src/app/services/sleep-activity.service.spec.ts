import { TestBed } from '@angular/core/testing';

import { SleepActivityService } from './sleep-activity.service';

describe('SleepActivityService', () => {
  let service: SleepActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SleepActivityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
