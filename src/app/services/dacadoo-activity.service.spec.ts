/* tslint:disable:no-unused-variable */

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';
import { DacadooActivityService } from './dacadoo-activity.service';

describe('Service: DacadooActivity', () => {

  let service: DacadooActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DacadooActivityService
      ],
      imports: [
        HttpClientTestingModule
      ]
    });

    service = TestBed.get(service);
  });

  it('should ...', inject([DacadooActivityService], (service: DacadooActivityService) => {
    expect(service).toBeTruthy();
  }));




});
