import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import * as moment from "moment";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FormValidators } from "../../../validators/form-validators";
import { Profile } from "@app/interfaces/profile.interface";
import { AuthService } from "../../../services/auth.service";
import { ProfileService } from "../../../services/profile.service";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { MessageEnum } from "@app/enums/message-enum";
import { ToastService } from "../../../services/toast.service";
import { BodyMeasureSave } from "@app/models/body";
import { BodyService } from "../../../services/body.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-health-indicator",
  templateUrl: "./health-indicator.page.html",
  styleUrls: ["./health-indicator.page.scss"],
})
export class HealthIndicatorPage implements OnInit {
  healthIndicatorForm: FormGroup;
  subscriptions = new Subject();
  isSubmitted = false;

  weightArray: number[] = [];
  heightArray: number[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private toastService: ToastService,
    private bodyService: BodyService,
    private authService: AuthService
  ) {
    this.healthIndicatorForm = this.formBuilder.group({
      weight: new FormControl("", [Validators.required]),
      height: new FormControl("", [Validators.required]),
      month: new FormControl(null, [Validators.nullValidator]),
      day: new FormControl(null, [Validators.nullValidator]),
      year: new FormControl(null, [Validators.nullValidator]),
      birthday: new FormControl(
        "",
        Validators.compose([Validators.required, FormValidators.AdultValidator])
      ),
      gender: new FormControl("", [Validators.required]),
    });
  }

  get birthday() {
    return this.healthIndicatorForm.get("birthday");
  }

  get month() {
    return this.healthIndicatorForm.get("month");
  }

  get day() {
    return this.healthIndicatorForm.get("day");
  }

  get year() {
    return this.healthIndicatorForm.get("year");
  }
 
  get height() {
    return this.healthIndicatorForm.get("height");
  }

  get weight() {
    return this.healthIndicatorForm.get("weight");
  }

  get gender() {
    return this.healthIndicatorForm.get("gender");
  }

  errorMessages = {
    birthday: [
      { type: "validAdult", message: "El usuario debe ser un adulto" },
    ],
  };

  ngOnInit() {
    for (var i = 60; i <= 279; i++) {
      this.heightArray.push(i);
    }

    for (var j = 28; j <= 175; j++) {
      this.weightArray.push(j);
    }
  }

  async ionViewDidEnter() {
    this.healthIndicatorForm.reset();
  }

  ionViewDidLeave(): void {
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  next(): void {
    this.router.navigate(["onboarding/porpuse"]);
  }

  async save() {
    this.isSubmitted = true;

    if (this.healthIndicatorForm.valid) {
      // Update the new profile data in db
      var profile: Profile = {};
      profile.birthday = this.birthday.value;
      profile.height = this.height.value;
      profile.weight = this.weight.value;
      profile.gender = this.gender.value;
      profile.email = await this.authService.email();

      this.profileService
        .update(profile)
        .pipe(takeUntil(this.subscriptions))
        .subscribe(
          async (response: AppHttpResponse<Profile>) => {
            if (response.hasErrors) {
              this.toastService.showMessage(
                response.errors[0].errorDescription,
                null,
                null,
                "top",
                "danger"
              );
            } else {
              // Update the new profile data in localstorage
              var savedProfile: Profile = await this.authService.profile();
              savedProfile.birthday = profile.birthday;
              savedProfile.height = profile.height;
              savedProfile.weight = profile.weight;
              savedProfile.gender = profile.gender;
              await this.authService.saveProfile(savedProfile);

              // Navigate to next screen
              this.router.navigate(["onboarding/porpuse"]);
            }
          },
          (error: TrackHttpError) => {
            this.toastService.showMessage(
              MessageEnum.ERROR_SAVE,
              null,
              null,
              "top",
              "danger"
            );
            console.log(error);
          }
        );

      let bodyMeasureSave: BodyMeasureSave = {};
      bodyMeasureSave.sex = profile.gender == "F" ? "female" : "male";
      bodyMeasureSave.height =
        Number(profile.height ? profile.height : 0) / 100;
      bodyMeasureSave.mass = Number(profile.weight ? profile.weight : 0);
      bodyMeasureSave.dateOfBirth = moment(profile.birthday).format(
        "YYYY-MM-DD"
      );
      bodyMeasureSave.waist = null;
      bodyMeasureSave.fatMass = null;

      this.bodyService
        .updateBodyMeasureNoMessage(bodyMeasureSave)
        .pipe(takeUntil(this.subscriptions))
        .subscribe(
          (response) => {},
          (error) => {
            console.log("ERROR", error);
          }
        );
    }
  }
}
