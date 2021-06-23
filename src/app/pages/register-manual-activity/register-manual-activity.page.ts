import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DacadooActivityService } from '../../services/dacadoo-activity.service';
import { IonDatetime, ModalController } from '@ionic/angular';
import { AppHttpResponse, TrackHttpError } from '@app/interfaces/app-http-response.interface';
import { ModalAlertComponent } from '@app/components/modal-alert/modal-alert.component';
import { DacadooSportActivityResponse, DacadooSportActivity, DacadooManualSportActivityToSave } from '@app/interfaces/dacadoo-sport-activity.interface';
import * as moment from "moment";
import * as _ from "lodash";
import { FormValidators } from '@app/validators/form-validators';

@Component({
  selector: 'app-register-manual-activity',
  templateUrl: './register-manual-activity.page.html',
  styleUrls: ['./register-manual-activity.page.scss'],
})
export class RegisterManualActivityPage implements OnInit {

  title: string = "Actividades";
  showSpinner = false;
  activityForm: FormGroup;
  activities: DacadooSportActivity[];
  subscriptions = new Subject();
  maxDate:string;
  hours:number[];
  @ViewChild(IonDatetime) ionDatetime: IonDatetime;

  constructor(
    private formBuilder: FormBuilder,
    private modalController: ModalController,
    private dacadooActivityService:  DacadooActivityService
  ) { 
    this.inicializeForm();
  }

  inicializeForm() {
    this.activityForm = this.formBuilder.group({
      activity: new FormControl(null, [Validators.required]),
      datetime: new FormControl(null, [Validators.required]),
      
      duration: new FormControl(
        0,
        Validators.compose([Validators.required, FormValidators.AtLeastOneMinuteValidator])
      ),

      distance: new FormControl(
        null, 
        Validators.compose([Validators.min(0), Validators.max(1000000), FormValidators.Decimals])
      ),

      ascent: new FormControl(
        null, 
        Validators.compose([Validators.min(0), Validators.max(100000), FormValidators.Integers])
      ),

      descent: new FormControl(
        null, 
        Validators.compose([Validators.min(0), Validators.max(100000), FormValidators.Integers])
      ),

      heartRate: new FormControl(
        null, 
        Validators.compose([Validators.min(28), Validators.max(195), FormValidators.Integers])
      ),
    })
  }

  get activity(): FormControl {
    return this.activityForm.get("activity") as FormControl;
  }

  get datetime(): FormControl {
    return this.activityForm.get("datetime") as FormControl;
  }

  get duration(): FormControl {
    return this.activityForm.get("duration") as FormControl;
  }

  get distance(): FormControl {
    return this.activityForm.get("distance") as FormControl;
  }

  get ascent(): FormControl {
    return this.activityForm.get("ascent") as FormControl;
  }

  get descent(): FormControl {
    return this.activityForm.get("descent") as FormControl;
  }

  get heartRate(): FormControl {
    return this.activityForm.get("heartRate") as FormControl;
  }

  get selectedActivityHasDistance(): boolean {
    return this.activity.value?.values?.includes("distance")
  }

  get selectedActivityHasAscent(): boolean {
    return this.activity.value?.values?.includes("ascent")
  }

  get selectedActivityHasDescent(): boolean {
    return this.activity.value?.values?.includes("descent")
  }

  errorMessages = {
    datetime: [
      {
        type: "required",
        message: "La fecha y hora es requerida",
      },
    ],
    duration: [
      {
        type: "validAtLeastOneMinute",
        message: "El tiempo mínimo es 1 minuto",
      },
    ],
    distance: [
      {
        type: "min",
        message: "El valor mínimo es 0 kilometros",
      },
      {
        type: "max",
        message: "El valor máximo es 1000000 kilometros",
      },
      {
        type: "validDecimals",
        message: "El formato del número es incorrecto. Ej: 12.32"
      }
    ],
    ascent: [
      {
        type: "min",
        message: "El valor mínimo es 0 metros",
      },
      {
        type: "max",
        message: "El valor máximo es 100000 metros",
      },
      {
        type: "validIntegers",
        message: "Sólo se permiten números"
      }
    ],
    descent: [
      {
        type: "min",
        message: "El valor mínimo es 0 metros",
      },
      {
        type: "max",
        message: "El valor máximo es 100000 metros",
      },
      {
        type: "validIntegers",
        message: "Sólo se permiten números"
      }
    ],
    heartRate: [
      {
        type: "min",
        message: "El valor mínimo es 28 LPM",
      },
      {
        type: "max",
        message: "El valor máximo es 195 LPM",
      },
      {
        type: "validIntegers",
        message: "Sólo se permiten números"
      }
    ],
  };

  get datetimeError(): string {
    for(var error of this.errorMessages.datetime) {
      if(this.datetime.hasError(error.type) && this.datetime.dirty && this.datetime.value) {
        return error.message
      }
    }
    return null;
  }

  get distanceError(): string {
    for(var error of this.errorMessages.distance) {
      if(this.distance.hasError(error.type) && this.distance.dirty && this.distance.value) {
        return error.message
      }
    }
    return null;
  }

  get ascentError(): string {
    for(var error of this.errorMessages.ascent) {
      if(this.ascent.hasError(error.type) && this.ascent.dirty && this.ascent.value) {
        return error.message
      }
    }
    return null;
  }

  get descentError(): string {
    for(var error of this.errorMessages.descent) {
      if(this.descent.hasError(error.type) && this.descent.dirty && this.descent.value) {
        return error.message
      }
    }
    return null;
  }

  get heartRateError(): string {
    for(var error of this.errorMessages.heartRate) {
      if(this.heartRate.hasError(error.type) && this.heartRate.dirty && this.heartRate.value) {
        return error.message
      }
    }
    return null;
  }

  get durationError(): string {
    for(var error of this.errorMessages.duration) {
      if(this.duration.hasError(error.type) && this.duration.dirty && this.duration.value) {
        return error.message
      }
    }
    return null;
  }

  ngOnInit() {
    this.title =  "Actividades";
  }

  async ionViewDidEnter() {
    this.activityForm?.reset();
    this.inicializeForm();
    this.getActivities();
    this.getTimesLimits();
  }

  ionViewDidLeave(): void {
    console.log("ionViewDidLeave");
    this.activities = [];
    this.subscriptions.next();
    this.subscriptions.complete();
    this.activityForm.reset();
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }

  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  getTimesLimits(){
    var date = new Date();
    this.maxDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), (date.getHours()-4), 0, 0).toISOString();
  }

  getActivities() {
    this.showSpinner = true;

    this.dacadooActivityService
      .getAll()
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooSportActivityResponse>) => {
          this.showSpinner = false;

          this.activities = _.sortBy(response.body.data, function (item) {
            return item.name;
          });
        },
        (error) => {
          console.log("Error => ", error);
          this.showSpinner = false;
        }
      );
  }

  onSave(): void {
    this.showSpinner = true;

    var toSave : DacadooManualSportActivityToSave = this.activityForm.value;
    var activity : DacadooSportActivity = this.activity.value;

    var time = new Date(this.datetime.value);
    var durationTime = new Date(this.duration.value);

    toSave.activity = activity.key;
    toSave.duration = ((durationTime.getHours() * 60) * 60) + (durationTime.getMinutes() * 60); //segundos
        
    toSave.time = moment(time).format("YYYY-MM-DDTHH:mm:ss[Z]"); 
    var endTime =  new Date(time.getTime() + toSave.duration * 1000 );
    toSave.endTime = moment(endTime).format("YYYY-MM-DDTHH:mm:ss[Z]"); 
    toSave.distance = toSave.distance * 1000;
    toSave.acquisition = "manual";

    console.log("toSave => ", toSave);

    this.dacadooActivityService
    .saveManualActivity(toSave)
    .pipe(takeUntil(this.subscriptions))
    .subscribe(
      (response) => {
        this.showSpinner = false;
        if (response.hasErrors) {
          console.log("ERROR=>", response)
          return;
        }

        this.showConfirmAddMessage();
      },
      (error: TrackHttpError) => {
        this.showSpinner = false;
        console.log(error);
      }
    );
  }

  async showConfirmAddMessage() {
    let profileModal = await this.modalController.create({
      component: ModalAlertComponent,
      cssClass: "activities-actions-modal-add",
      componentProps: {
        title: "Se han guardado sus datos con éxito",
        description: "",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      this.activityForm.reset();
      this.inicializeForm();
    });

    return profileModal.present();
  }

  initTime() {
    if(!this.datetime.value) {
      this.datetime.setValue(0);
      this.datetime.reset();
    }
  }

}
