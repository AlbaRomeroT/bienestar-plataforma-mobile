import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Event, NavigationEnd, Router } from "@angular/router";
import { MessageEnum } from "@app/enums/message-enum";
import { Body } from "@app/models/body";
import { HealthScore } from "@app/models/health-score";
import { BodyService } from "@app/services/body.service";
import { HealthScoreService } from "@app/services/health-score.service";
import { ToastService } from "@app/services/toast.service";
import * as moment from "moment";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { ModalService } from "@app/services/modal.service";

@Component({
  selector: "app-body",
  templateUrl: "./body.page.html",
  styleUrls: ["./body.page.scss"],
})
export class BodyPage implements OnInit {
  @ViewChild("birthday") dateTimeBirthday;

  public bodyData: Body = null;
  public healthScoreData: HealthScore[];
  public heightArray: number[] = [];
  public weightArray: number[] = [];
  public showBodySurvey: boolean = false;
  public isLoading: boolean = false;
  public maxAdultDate: string;
  public pathReturn: string;
  public showMessageForHelp: boolean = false;
  public loadGraph: boolean = true;
  public title: string;
  public bodyForm: FormGroup = this.formBuilder.group({
    sex: new FormControl(null, Validators.required),
    age: new FormControl({ value: null, disabled: true }),
    height: new FormControl(null, Validators.required),
    weight: new FormControl(null, Validators.required),
    month: [null, Validators.nullValidator],
    day: [null, Validators.nullValidator],
    year: [null, Validators.nullValidator],
    fatMass: new FormControl({ value: null }, [
      Validators.min(2.4),
      Validators.max(60.75),
      Validators.pattern(/^[.\d]+$/),
    ]),
    bmi: new FormControl({ value: null, disabled: true }),
    waist: new FormControl({ value: null }, [
      Validators.min(52.5),
      Validators.max(169.0),
      Validators.pattern(/^[.\d]+$/),
    ]),
    resting: new FormControl({ value: null }, [
      Validators.min(28),
      Validators.max(143),
      Validators.pattern(/^[\d]+$/),
    ]),
    systolic: new FormControl({ value: null }, [
      Validators.min(60),
      Validators.max(210),
      Validators.pattern(/^[\d]+$/),
    ]),
    diastolic: new FormControl({ value: null }, [
      Validators.min(50),
      Validators.max(120),
      Validators.pattern(/^[\d]+$/),
    ]),
    tsc: new FormControl({ value: null }, [
      Validators.min(58.1),
      Validators.max(696.0),
      Validators.pattern(/^[.\d]+$/),
    ]),
    hdl: new FormControl({ value: null }, [
      Validators.min(7.8),
      Validators.max(197.2),
      Validators.pattern(/^[.\d]+$/),
    ]),
    ldl: new FormControl({ value: null }, [
      Validators.min(19.4),
      Validators.max(386.6),
      Validators.pattern(/^[.\d]+$/),
    ]),
    tgl: new FormControl({ value: null }, [
      Validators.min(17.7),
      Validators.max(3587.0),
      Validators.pattern(/^[.\d]+$/),
    ]),
    fbg: new FormControl({ value: null }, [
      Validators.min(72.0),
      Validators.max(324.0),
      Validators.pattern(/^[.\d]+$/),
    ]),
    cbg: new FormControl({ value: null }, [
      Validators.min(50.4),
      Validators.max(250.1),
      Validators.pattern(/^[.\d]+$/),
    ]),
  });

  constructor(
    private bodyService: BodyService,
    private healthScoreService: HealthScoreService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastService: ToastService,
    private cdref: ChangeDetectorRef,
    private gaService: GoogleAnalyticsService,
    private modalService: ModalService
  ) {
    this.getMaxAdultDate();
    this.title = "Cuerpo";
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }

  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  actionShowHelp() {
    this.showMessageForHelp = this.showMessageForHelp ? false : true;
  }

  ngOnInit() {
    this.fillHeightValues();
    this.fillWeightValues();

    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd && event.url == "/body") {
        this.showBodySurvey = false;
        this.isLoading = false;
        this.getBody();
        if (this.loadGraph) this.getHealthScoreHistorical();
      }
    });
  }

  getBody() {
    this.bodyService.getBody().subscribe((response) => {
      if (response) {
        this.bodyData = response;
        this.setBodyForm();
      }
    });
  }

  getHealthScoreHistorical() {
    this.healthScoreService.getHealthScoreHistorical().subscribe((response) => {
      this.healthScoreData = response;
      console.log(this.healthScoreData);
    });
  }

  fillWeightValues() {
    this.weightArray = [];
    for (var j = 28; j <= 175; j++) {
      this.weightArray.push(j);
    }
  }

  fillHeightValues() {
    this.heightArray = [];
    for (var i = 60; i <= 279; i++) {
      this.heightArray.push(i);
    }
  }

  setBodyForm(): void {
    this.bodyForm.get("sex").setValue(this.bodyData.sex);
    this.bodyForm.get("sex").valueChanges.subscribe((value) => {
      this.bodyData.sex = value;
    });

    if (this.bodyData.dateOfBirth != null) {
      this.bodyForm
        .get("age")
        .setValue(this.getAgeFromDate(new Date(this.bodyData.dateOfBirth)));
    }
    this.bodyForm.get("height").setValue(this.bodyData.height);
    this.bodyForm.get("height").valueChanges.subscribe((value) => {
      this.bodyData.height = value;
    });
    this.bodyForm.get("weight").setValue(this.bodyData.mass);
    this.bodyForm.get("weight").valueChanges.subscribe((value) => {
      this.bodyData.mass = value;
    });
    this.bodyForm.get("fatMass").setValue(this.bodyData.fatMass);
    this.bodyForm.get("fatMass").valueChanges.subscribe((value) => {
      this.bodyData.fatMass = value;
    });
    this.bodyForm.get("bmi").setValue(this.bodyData.bmi);
    this.bodyForm.get("waist").setValue(this.bodyData.waist);
    this.bodyForm.get("waist").valueChanges.subscribe((value) => {
      this.bodyData.waist = value;
    });
    this.bodyForm.get("resting").setValue(this.bodyData.resting);
    this.bodyForm.get("resting").valueChanges.subscribe((value) => {
      this.bodyData.resting = value;
    });
    this.bodyForm.get("systolic").setValue(this.bodyData.systolic);
    this.bodyForm.get("systolic").valueChanges.subscribe((value) => {
      this.bodyData.systolic = value;
    });
    this.bodyForm.get("diastolic").setValue(this.bodyData.diastolic);
    this.bodyForm.get("diastolic").valueChanges.subscribe((value) => {
      this.bodyData.diastolic = value;
    });
    this.bodyForm.get("tsc").setValue(this.bodyData.tsc);
    this.bodyForm.get("tsc").valueChanges.subscribe((value) => {
      this.bodyData.tsc = value;
    });
    this.bodyForm.get("hdl").setValue(this.bodyData.hdl);
    this.bodyForm.get("hdl").valueChanges.subscribe((value) => {
      this.bodyData.hdl = value;
    });
    this.bodyForm.get("ldl").setValue(this.bodyData.ldl);
    this.bodyForm.get("ldl").valueChanges.subscribe((value) => {
      this.bodyData.ldl = value;
    });
    this.bodyForm.get("tgl").setValue(this.bodyData.tgl);
    this.bodyForm.get("tgl").valueChanges.subscribe((value) => {
      this.bodyData.tgl = value;
    });
    this.bodyForm.get("fbg").setValue(this.bodyData.fbg);
    this.bodyForm.get("fbg").valueChanges.subscribe((value) => {
      this.bodyData.fbg = value;
    });
    this.bodyForm.get("cbg").setValue(this.bodyData.cbg);
    this.bodyForm.get("cbg").valueChanges.subscribe((value) => {
      this.bodyData.cbg = value;
    });
  }

  getAgeFromDate(dateOfBirth: Date): number {
    if (!dateOfBirth) return null;
    return moment().diff(dateOfBirth, "years");
  }

  save() {
    if (this.bodyForm.valid && this.bodyData.dateOfBirth != null) {
      this.isLoading = true;

      // track save
      this.gaService.trackEvent(AnaliticEvents.CU_GU_BTN);
      this.sendAnaliticsQuestionsResponse();

      // save
      this.bodyService.saveBody(this.bodyData).subscribe(
        (response) => {
          if (response) {
            this.bodyData = response;
            this.setBodyForm();
            this.showConfirmAddMessageSaved();
          } else {
            this.getBody();
          }
        },
        null,
        () => {
          setTimeout(() => {
            this.isLoading = false;
          }, 1000);
        }
      );
    }
  }

  updateBirthday(date: string) {
    this.bodyData.dateOfBirth = date.slice(0, 10);
    this.bodyForm
      .get("age")
      .setValue(this.getAgeFromDate(new Date(this.bodyData.dateOfBirth)));
    this.cdref.detectChanges();
  }

  getMaxAdultDate() {
    var date = new Date();
    date.setFullYear(date.getFullYear() - 18);
    this.maxAdultDate = date.toISOString();
  }

  onSubmitBodyForm() {
    console.log("onSubmitBodyForm");
  }

  onShowBodySurvey() {
    this.showBodySurvey = true;
    this.gaService.trackEvent(AnaliticEvents.CU_VM_BTN);
  }

  sendAnaliticsQuestionsResponse() {
    if (this.bodyData.sex !== null && this.bodyData.sex !== undefined)
      this.gaService.trackEvent(AnaliticEvents.CU_SEX_BTN, this.bodyData.sex);
    if (
      this.bodyForm.get("age").value !== null &&
      this.bodyForm.get("age").value !== undefined
    )
      this.gaService.trackEvent(
        AnaliticEvents.CU_EDA_BTN,
        this.bodyForm.get("age").value
      );
    if (this.bodyData.height !== null && this.bodyData.height !== undefined)
      this.gaService.trackEvent(
        AnaliticEvents.CU_EST_BTN,
        this.bodyData.height
      );
    if (this.bodyData.mass !== null && this.bodyData.mass !== undefined)
      this.gaService.trackEvent(AnaliticEvents.CU_PES_BTN, this.bodyData.mass);
  }

  receiveMessage($event) {
    setTimeout(() => {
      this.loadGraph = false;
      this.getHealthScoreHistorical();
      this.loadGraph = true;
    }, 5000);
  }
  async showConfirmAddMessageSaved() {
    await this.modalService.showConfirmAddMessage("body");
  }
}
