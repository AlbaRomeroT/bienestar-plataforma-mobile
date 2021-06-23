import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { WellnessInfoPage } from './wellness-info.page';

describe('WellnessInfoPage', () => {
  let component: WellnessInfoPage;
  let fixture: ComponentFixture<WellnessInfoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WellnessInfoPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(WellnessInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
