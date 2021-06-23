import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { FormValidators } from "@app/validators/form-validators";
import { AuthService } from "../../../services/auth.service";
import { ProfileDataPersistenceService } from "../profile-data-persistence.service";
import { ProfileDataService } from "../../../services/profile-data.service";
import { ProfileService } from "@app/services/profile.service";

@Component({
  selector: "app-single-profile-data",
  templateUrl: "./single-profile-data.page.html",
  styleUrls: ["./single-profile-data.page.scss"],
})
export class SingleProfileDataPage implements OnInit {
  public title: string;
  public subtitle: string;
  public showSpinner: boolean = true;
  profileForm: FormGroup;
  @Output() public nextEvent: EventEmitter<any> = new EventEmitter();

  steps = {
    perfil: "perfil",
    profesional: "profesional",
    personal: "personal",
  };

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private profileDataService: ProfileDataService,
    private profileDataPersistenceService: ProfileDataPersistenceService,
    private profileService: ProfileService
  ) {
    this.title = "Datos personales";
    this.subtitle = "Para empezar, cuéntenos:";

    this.profileForm = this.formBuilder.group({
      birthday: new FormControl(
        "",
        Validators.compose([Validators.required, FormValidators.AdultValidator])
      ),
      gender: new FormControl("", [Validators.required]),
      phone: new FormControl(
        "",
        Validators.compose([
          Validators.required,
          FormValidators.PhoneNumberValidator,
        ])
      ),
    });
  }

  get birthday(): FormControl {
    return this.profileForm.get("birthday") as FormControl;
  }

  get gender(): FormControl {
    return this.profileForm.get("gender") as FormControl;
  }

  get phone(): FormControl {
    return this.profileForm.get("phone") as FormControl;
  }

  errorMessages = {
    birthday: [
      { type: "required", message: "Campo requerido" },
      { type: "validAdult", message: "El usuario debe ser un adulto" },
    ],
    phone: [
      {
        type: "validPhoneNumber",
        message: "Verifique que el número de celular ingresado sea correcto",
      },
    ],
    gender: [{ type: "required", message: "Campo requerido" }],
  };

  ngOnInit() {
    this.showSpinner = true;
    this.setInitialValues();
    this.showSpinner = false;
  }

  checkInputFocus() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "none";
  }

  checkInputBlur() {
    var elem = document.getElementById("ion-fab-green-button");
    elem.style.display = "block";
  }

  ngOnDestroy(): void {
    console.log("Destruyendo perfil..");
  }

  async setInitialValues() {
    if (this.profileDataPersistenceService.profileForm) {
      const profileFormValue = this.profileDataPersistenceService.profileForm;
      this.profileForm.patchValue(profileFormValue);
      return;
    }

    await this.getDataFromService();
  }

  async getDataFromService() {
    var email = await this.authService.email();
    this.profileDataService.getProfile(email).subscribe((values) => {
      let response = this.profileService.decrypRSA(values?.body?.encryptedData);
      values.body = response;
      this.profileForm.patchValue(values.body);
    });
  }

  next(): void {
    console.log("NEXT");
    console.log("DATA FORM => ", this.profileForm.value);

    if (this.profileForm.valid) {
      this.profileDataPersistenceService.profileForm = this.profileForm;

      var tab = {
        detail: {
          value: this.steps.profesional,
        },
      };
      this.nextEvent.emit(tab);
    }
  }
}
