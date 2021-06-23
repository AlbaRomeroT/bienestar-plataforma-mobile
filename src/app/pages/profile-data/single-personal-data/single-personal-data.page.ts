import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ProfileDataPersistenceService } from "../profile-data-persistence.service";
import { ProfileDataService } from "../../../services/profile-data.service";
import { forkJoin } from "rxjs";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { Router } from "@angular/router";
import { AuthService } from "../../../services/auth.service";
import { BodyService } from "../../../services/body.service";
import { DacadooQuestions } from "@app/interfaces/dacadoo-question.interface";
import { FormValidators } from "@app/validators/form-validators";
import { LifestyleService } from "@app/services/lifestyle.service";
import { DISEASES } from "../../../../assets/profile-data/data/diseases.const";
import { LIVE_WITH } from "../../../../assets/profile-data/data/liveWith.const";

@Component({
  selector: "app-single-personal-data",
  templateUrl: "./single-personal-data.page.html",
  styleUrls: ["./single-personal-data.page.scss"],
})
export class SinglePersonalDataPage implements OnInit {
  public title: string;
  public subtitle: string;
  public subtitleTwo: string;
  public subtitleThree: string;
  public isFemale: boolean;
  public showSpinner: boolean = true;
  personalForm: FormGroup;
  @Output() public saveEvent: EventEmitter<any> = new EventEmitter();
  @Output() public previousEvent: EventEmitter<any> = new EventEmitter();

  steps = {
    perfil: "perfil",
    profesional: "profesional",
    personal: "personal",
  };

  liveWithList: any[] = [];
  diseasesList: any[] = [];
  bodySurveyQuestions: DacadooQuestions;
  lifestyleSurveyQuestions: any;

  constructor(
    private formBuilder: FormBuilder,
    private profileDataService: ProfileDataService,
    private authService: AuthService,
    private router: Router,
    private bodyService: BodyService,
    private lifestyleService: LifestyleService,
    private profileDataPersistenceService: ProfileDataPersistenceService
  ) {
    this.title = "Información complementaria";
    this.subtitle = "Queremos conocer datos adicionales";
    this.subtitleTwo = "Cuéntenos sobre su familia";
    this.subtitleThree = "Contacto en caso de emergencia";

    this.personalForm = this.formBuilder.group({
      hasBeenSmoker: new FormControl("", [Validators.required]),
      familyDiseases: new FormControl("", [Validators.required]),
      isPregnant: new FormControl("", [Validators.required]),
      contactName: new FormControl("", [Validators.required]),
      contactPhone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          Validators.pattern("^[0-9]{7,12}$"),
        ])
      ),
      termsAndConditions: new FormControl(undefined, [Validators.requiredTrue]),
      dataTreatment: new FormControl(undefined, [Validators.requiredTrue]),
      liveWith: new FormArray(
        [],
        [FormValidators.atLeastOneCheckboxCheckedValidator(1)]
      ),
      diseases: new FormArray(
        [],
        [FormValidators.atLeastOneCheckboxCheckedValidator(1)]
      ),
    });

    this.getLists();

    setTimeout(() => {
      this.createDiseasesCheckBoxes();
    }, 100);

    setTimeout(() => {
      this.createLiveWithCheckBoxes();
    }, 100);
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }

  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  private createDiseasesCheckBoxes() {
    this.diseasesList.forEach(() =>
      this.diseasesControls.push(new FormControl(undefined, []))
    );
  }

  private createLiveWithCheckBoxes() {
    this.liveWithList.forEach(() =>
      this.liveWithControls.push(new FormControl(undefined, []))
    );
  }

  get diseasesControls() {
    return this.personalForm.controls.diseases as FormArray;
  }

  get liveWithControls() {
    return this.personalForm.controls.liveWith as FormArray;
  }

  get hasBeenSmoker() {
    return this.personalForm.get("hasBeenSmoker");
  }

  get isPregnant() {
    return this.personalForm.get("isPregnant");
  }

  get familyDiseases() {
    return this.personalForm.get("familyDiseases");
  }

  get contactName() {
    return this.personalForm.get("contactName");
  }

  get contactPhone() {
    return this.personalForm.get("contactPhone");
  }

  get termsAndConditions() {
    return this.personalForm.get("termsAndConditions");
  }

  get dataTreatment() {
    return this.personalForm.get("dataTreatment");
  }

  errorMessages = {
    birthday: [
      { type: "required", message: "Campo requerido" },
      { type: "validAdult", message: "El usuario debe ser un adulto" },
    ],
    phone: [
      {
        type: "pattern",
        message: "Verifique que el número de celular ingresado sea correcto",
      },
    ],
    gender: [{ type: "required", message: "Campo requerido" }],
  };

  ngOnInit() {
    this.showSpinner = true;
    this.validateGender();
    this.setInitialValues();
    this.showSpinner = false;
  }

  async getLists() {
    this.diseasesList = DISEASES;
    this.liveWithList = LIVE_WITH;
  }

  async setInitialValues() {
    if (this.profileDataPersistenceService.personalForm) {
      const values = this.profileDataPersistenceService.personalForm;

      setTimeout(() => {
        this.personalForm.patchValue(values);
      }, 300);
      return;
    }

    setTimeout(async () => {
      this.getValuesFromFamilyService();
      setTimeout(async () => {
        this.getLifeStyleQuestions();
        this.getValuesFromBodySurvey();
      }, 300);
    }, 300);
  }

  async getValuesFromFamilyService() {
    var email = await this.authService.email();
    this.profileDataService.getFamily(email).subscribe(
      (values) => {
        this.hasBeenSmoker.setValue(values.body.hasBeenSmoker);
        this.familyDiseases.setValue(values.body.familyDiseases);
        this.isPregnant.setValue(values.body.isPregnant);
        this.contactName.setValue(values.body.contactName);
        this.contactPhone.setValue(values.body.contactPhone);
        this.termsAndConditions.setValue(values.body.termsAndConditions);
        this.dataTreatment.setValue(values.body.dataTreatment);

        if (values.body.diseases) {
          for (var disease of values.body.diseases) {
            var index = this.diseasesList.findIndex((x) => x.id == disease.id);
            var diseaseControl = this.diseasesControls.controls[
              index
            ] as FormControl;
            diseaseControl.setValue(true);
          }
        }

        if (values.body.liveWith) {
          for (var lw of values.body.liveWith) {
            var indexOf = this.liveWithList.findIndex((x) => x.id == lw.id);
            var liveWithControl = this.liveWithControls.controls[
              indexOf
            ] as FormControl;
            liveWithControl.setValue(true);
          }
        }
      },
      (error: TrackHttpError) => {
        console.log(error);
      }
    );
  }

  getLifeStyleQuestions() {
    this.lifestyleService
      .getLifestyleSurveyQuestions()
      .subscribe((response) => {
        this.lifestyleSurveyQuestions = response;
        var smoking = this.lifestyleSurveyQuestions.find(
          (x) => x.id == "smoking"
        );
        var smokingNow = smoking.questions.find((x) => x.id == "smokingNow");
        this.hasBeenSmoker.setValue(smokingNow.value);
      });
  }

  buildLifeStyleQuestions() {
    var response: string = "{";
    console.log(this.lifestyleSurveyQuestions);
    for (var item in this.lifestyleSurveyQuestions) {
      if (this.lifestyleSurveyQuestions[item].id == "smoking") {
        const q0 = this.lifestyleSurveyQuestions[item].questions[0].value;
        const q1 = this.lifestyleSurveyQuestions[item].questions[1].value;
        response +=
          '"' +
          [this.lifestyleSurveyQuestions[item].questions[0].id] +
          '":' +
          (q0 != "" ? q0 : "false") +
          ",";
        response +=
          '"' +
          [this.lifestyleSurveyQuestions[item].questions[1].id] +
          '":' +
          (q1 != "" ? q1 : "false") +
          ",";
      } else if (this.lifestyleSurveyQuestions[item].id == "diet") {
        response +=
          '"custom":{"' +
          [this.lifestyleSurveyQuestions[item].id] +
          '":"' +
          this.lifestyleSurveyQuestions[item].value +
          '"}';
      } else {
        response +=
          '"' +
          [this.lifestyleSurveyQuestions[item].id] +
          '":' +
          this.lifestyleSurveyQuestions[item].value +
          ",";
      }
    }
    response += "}";
    return response;
  }

  async getValuesFromBodySurvey() {
    this.bodyService.getBodySurveyQuestions().subscribe((response) => {
      this.bodySurveyQuestions = response;

      var diabetic = this.bodySurveyQuestions.DIABETES.find(
        (x) => x.id == "dm2" && x.value == "true"
      );
      if (diabetic) {
        var diabeticControl = this.diseasesControls.controls[0] as FormControl;
        diabeticControl.setValue(true);
      }

      var bloodPressure = this.bodySurveyQuestions.HIPERTENSION.find(
        (x) => x.id == "hyt" && x.value == "true"
      );
      if (bloodPressure) {
        var bloodPressureControl = this.diseasesControls
          .controls[1] as FormControl;
        bloodPressureControl.setValue(true);
      }

      var heartDiseases = ["lvh", "chf", "afn", "pmi"];
      for (var disease of heartDiseases) {
        var hasDisease = this.bodySurveyQuestions.HEART.find(
          (x) => x.id == disease && x.value == "true"
        );
        if (hasDisease) {
          var heartDiseasesControl = this.diseasesControls
            .controls[3] as FormControl;
          heartDiseasesControl.setValue(true);
          break;
        }
      }

      var renalDisease = this.bodySurveyQuestions.RENAL.find(
        (x) => x.id == "ckd" && x.value == "true"
      );
      if (renalDisease) {
        var renalDiseaseControl = this.diseasesControls
          .controls[5] as FormControl;
        renalDiseaseControl.setValue(true);
      }
    });
  }

  async updateBodySurveyQuestions() {
    var diabeticControl = this.diseasesControls.controls[0] as FormControl;
    var diabetic = this.bodySurveyQuestions.DIABETES.find((x) => x.id == "dm2");
    diabetic.value = diabeticControl.value;

    var bloodPressureControl = this.diseasesControls.controls[1] as FormControl;
    var bloodPressure = this.bodySurveyQuestions.HIPERTENSION.find(
      (x) => x.id == "hyt"
    );
    bloodPressure.value = bloodPressureControl.value;

    var renalDiseaseControl = this.diseasesControls.controls[5] as FormControl;
    var renalDisease = this.bodySurveyQuestions.RENAL.find(
      (x) => x.id == "ckd"
    );
    renalDisease.value = renalDiseaseControl.value;
  }

  async updateLifeStyleQuestions() {
    var smoking = this.lifestyleSurveyQuestions.find((x) => x.id == "smoking");
    var smokingEver = smoking.questions.find((x) => x.id == "smokingEver");
    var smokingNow = smoking.questions.find((x) => x.id == "smokingNow");

    var hasBeenSmoker = this.hasBeenSmoker.value;
    if (hasBeenSmoker == "true") {
      smokingNow.value = hasBeenSmoker;
      smokingEver.value = hasBeenSmoker;
    } else {
      smokingNow.value = hasBeenSmoker;
    }
  }

  validateGender(): void {
    this.isFemale = this.profileDataPersistenceService.isFemale;

    var isPregnantFields = ["isPregnant"];

    if (this.isFemale) {
      for (var field of isPregnantFields) {
        this.personalForm.controls[field].setValidators([Validators.required]);
        this.personalForm.controls[field].updateValueAndValidity();
      }
    } else {
      for (var item of isPregnantFields) {
        this.personalForm.controls[item].setValidators(null);
        this.personalForm.controls[item].updateValueAndValidity();
        this.personalForm.controls[item].setValue(null);
      }
    }
  }

  get diseasesChecked() {
    const items: any[] = this.personalForm.value.diseases
      .map((checked, i) => (checked ? checked : null))
      .filter((v) => v !== null);
    return items.length > 0;
  }

  get liveWithChecked() {
    const items: any[] = this.personalForm.value.liveWith
      .map((checked, i) => (checked ? checked : null))
      .filter((v) => v !== null);
    return items.length > 0;
  }

  ngOnDestroy(): void {
    console.log("Destruyendo personal..");
  }

  async save(): Promise<void> {
    this.profileDataPersistenceService.personalForm = this.personalForm;

    this.updateBodySurveyQuestions();
    this.updateLifeStyleQuestions();

    this.profileDataPersistenceService.personalForm = this.personalForm;

    const diseases = this.personalForm.value.diseases
      .map((checked, i) =>
        checked
          ? { id: this.diseasesList[i].id, name: this.diseasesList[i].label }
          : null
      )
      .filter((v) => v !== null);

    const liveWith = this.personalForm.value.liveWith
      .map((checked, i) =>
        checked
          ? { id: this.liveWithList[i].id, name: this.liveWithList[i].label }
          : null
      )
      .filter((v) => v !== null);

    var email = await this.authService.email();

    var personal = Object.assign(
      {},
      this.profileDataPersistenceService._personal
    );
    personal.diseases = diseases;
    personal.liveWith = liveWith;
    personal.email = email;

    var professional = Object.assign(
      {},
      this.profileDataPersistenceService._profesional
    );
    professional.email = email;
    console.log("DATA PROFESSIONAL ", professional);

    var profile = Object.assign(
      {},
      this.profileDataPersistenceService._profile
    );
    profile.email = email;
    console.log("DATA PROFILE ", profile);
    forkJoin({
      personalResponse: this.profileDataService.saveFamily(personal),
      professionalResponse: this.profileDataService.saveProfessional(
        professional
      ),
      profileResponse: this.profileDataService.saveProfile(profile),
      bodySurveyResponse: this.bodyService.saveBodySurveyQuestions(
        this.bodySurveyQuestions
      ),
      lifeStyleResponse: this.lifestyleService.saveLifestyleSurveyQuestions(
        this.buildLifeStyleQuestions()
      ),
    }).subscribe(
      ({
        personalResponse,
        professionalResponse,
        profileResponse,
        bodySurveyResponse,
        lifeStyleResponse,
      }) => {
        this.profileDataPersistenceService.clearForms();
        this.router.navigate(["/home"]);
      },
      (error: TrackHttpError) => {
        console.log(error);
      }
    );
  }

  previous(): void {
    console.log("PREVIOUS");

    this.profileDataPersistenceService.personalForm = this.personalForm;
    var tab = {
      detail: {
        value: this.steps.profesional,
      },
    };
    this.previousEvent.emit(tab);
  }
}
