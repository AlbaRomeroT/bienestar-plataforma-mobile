import { PointsService } from './../../../services/points.service';
import { HttpClientTestingModule } from "@angular/common/http/testing";
import {
  async,
  ComponentFixture,
  TestBed
} from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { IonicModule } from "@ionic/angular";
import { of } from "rxjs";
import { MyPointsPage } from './my-points.page';

describe("MyPointsPage", () => {
  let component: MyPointsPage;
  let fixture: ComponentFixture<MyPointsPage>;

  let serviceResponse = {
    hasErrors: false,
    body: {
      links : []
    },
    errors: [],
    friendlyMessage: "",
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyPointsPage],
      imports: [
        IonicModule.forRoot(),
        HttpClientTestingModule,
        RouterTestingModule,
      ],
      providers: [
          {
            provide: PointsService,
            useValue: {
                getHistory: () => of(serviceResponse),
                getHistoryNext: () => of(serviceResponse),
                getPointsByDate: () => of(serviceResponse)
            }
          }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPointsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it("should create", () => {
    expect(component).toBeTruthy();
  });

});