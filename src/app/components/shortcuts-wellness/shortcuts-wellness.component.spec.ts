import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ShortcutsWellnessComponent } from './shortcuts-wellness.component';

describe('ShortcutsWellnessComponent', () => {
  let component: ShortcutsWellnessComponent;
  let fixture: ComponentFixture<ShortcutsWellnessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShortcutsWellnessComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ShortcutsWellnessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
