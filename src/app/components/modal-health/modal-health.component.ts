import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { Profile } from "@app/interfaces/profile.interface";
import { BodyMeasureSave, Body } from "@app/models/body";
import { TercerosService } from "@app/services/terceros.service";
import { ToastService } from "@app/services/toast.service";
import { FormValidators } from "@app/validators/form-validators";
import { PopoverController } from "@ionic/angular";
import * as moment from "moment";
import { BodyService } from "../../services/body.service";
import { ProfileService } from "../../services/profile.service";

@Component({
  selector: "app-modal-health",
  templateUrl: "./modal-health.component.html",
  styleUrls: ["./modal-health.component.scss"],
})
export class ModalHealthComponent implements OnInit {
  formGroup: FormGroup;
  weightArray: number[] = [];
  heightArray: number[] = [];
  response: any = "";
  from: any;
  titulo: string =
    "Complete los siguientes datos para conocer su índice de salud";
  isConnected: boolean;
  public selectOptions: any = {
    header: "Sexo",
    translucent: true,
    //cssClass:'my-custom-interface'
  };

  isSubmitted: boolean = false;
  check_msg: string = "";
  public gender: any = [
    { id: "M", name: "Masculino" },
    { id: "F", name: "Femenino" },
  ];
  constructor(
    private _modalCtrl: PopoverController,
    private formBuilder: FormBuilder,
    private tercerosService: TercerosService,
    private toastService: ToastService,
    private bodyService: BodyService,
    private profileService: ProfileService,
    private _router: Router
  ) {}

  ngOnInit() {
    this.validForm();
    for (var i = 60; i <= 279; i++) {
      this.heightArray.push(i);
    }

    for (var j = 28; j <= 175; j++) {
      this.weightArray.push(j);
    }
    this.getUserProfile();
  }

  validForm() {
    this.formGroup = this.formBuilder.group({
      sexo: new FormControl("", [Validators.required]),
      fecha_nacimiento: new FormControl(
        "",
        Validators.compose([FormValidators.AdultValidator, Validators.required])
      ),
      month: [null, Validators.nullValidator],
      day: [null, Validators.nullValidator],
      year: [null, Validators.nullValidator],
      estatura: new FormControl("", [Validators.required]),
      peso: new FormControl("", [Validators.required]),
    });
  }
  get month() {
    return this.formGroup.get("month");
  }
  get day() {
    return this.formGroup.get("day");
  }
  get year() {
    return this.formGroup.get("year");
  }
  get birthday() {
    return this.formGroup.get("fecha_nacimiento");
  }

  errorMessages = {
    birthday: [
      { type: "validAdult", message: "El usuario debe ser un adulto" },
    ],
  };

  dismiss() {
    this._modalCtrl.dismiss({
      dismissed: true,
    });
  }

  async getUserProfile() {
    let email = localStorage.getItem("email");
    return new Promise((resolve, reject) => {
      this.profileService.get(email).subscribe(
        (res: any) => {
          console.log(res);
          let response = this.profileService.decrypRSA(
            res?.body?.encryptedData
          );
          res.body = response;
          if (res.hasErrors) {
            if (res.errors[0].errorCode == "Not Found Record") {
              this.response = "Not Found Record";
              resolve(true);
            }
          } else {
            if (res.body != undefined) {
              this.response = res.body;
              this.formGroup.patchValue({
                sexo: this.response.gender,
                peso: this.response.weight,
                estatura: this.response.height,
                fecha_nacimiento: this.response.birthday,
              });
              resolve(true);
            }
          }
        },
        (error) => {
          console.log(error);
          reject(true);
        }
      );
    });
  }

  //Método guardará en Bienestar y en Dacadoo
  async saveProfile() {
    this.isConnected = window.navigator.onLine;
    if (!this.isConnected) {
      this.dismiss();
      this._router.navigate(["/not-connection"], {
        queryParams: { home: true },
      });
      return;
    }

    if (this.formGroup.valid) {
      this.isSubmitted = true;
      let email = localStorage.getItem("email");
      let user: Profile = {};
      user.email = email;
      user.gender = this.formGroup.get("sexo").value;
      user.height = this.formGroup.get("estatura").value;
      user.weight = this.formGroup.get("peso").value;
      user.birthday = this.formGroup.get("fecha_nacimiento").value;

      this.bodyService.getBody().subscribe((body: Body) => {
        let bodyMeasureSave: BodyMeasureSave = {};
        bodyMeasureSave.sex = user.gender == "F" ? "female" : "male";
        bodyMeasureSave.height = Number(user.height ? user.height : 0) / 100;
        bodyMeasureSave.mass = Number(user.weight ? user.weight : 0);
        bodyMeasureSave.dateOfBirth = moment(user.birthday).format(
          "YYYY-MM-DD"
        );
        bodyMeasureSave.waist = body?.waist ? body.waist : null;
        bodyMeasureSave.fatMass = body?.fatMass ? body.fatMass : null;

        this.profileService.update(user).subscribe(
          (response) => {
            console.log(response);
          },
          (error) => console.log(error)
        );

        this.bodyService.updateBodyMeasure(bodyMeasureSave).subscribe(
          (response) => {
            console.log(response);
            this._modalCtrl.dismiss();
            this.toastService.showMessage(
              "Un momento, estamos generando su indicador de salud",
              null,
              null
            );
          },
          (error) => console.log(error)
        );
      });
    } else {
      this.toastService.showMessage(
        "Por favor ingrese todos los datos para continuar",
        null,
        null,
        "top",
        "danger"
      );
    }
  }
}
