import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DacadooActivityService } from '@app/services/dacadoo-activity.service';
import { IonicModule } from '@ionic/angular';

import { RegisterManualActivityPage } from './register-manual-activity.page';

describe('RegisterManualActivityPage', () => {

  let dacadooActivityService:  DacadooActivityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule]
    });
    dacadooActivityService = TestBed.inject(DacadooActivityService);
  });


  it('should be created', () => {
    expect(dacadooActivityService).toBeTruthy();
  });



});
