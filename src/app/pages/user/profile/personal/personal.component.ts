import { Component, Input, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IonSegment } from "@ionic/angular";
import { ProfileServiceUser } from "../../../../services/user/profile/profile.service";
import { PersonalInfo } from "../../../../interfaces/user/profile/user.interface";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormValidators } from "@app/validators/form-validators";
import { Subject, Subscription } from "rxjs";
import { BodyService } from "../../../../services/body.service";
import { ProfileService } from "@app/services/profile.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ToastService } from "@app/services/toast.service";
import { MessageEnum } from "@app/enums/message-enum";
import { DacadooUpdateNameDTO } from "../profile.interfaces";
import { AuthService } from "@app/services/auth.service";
import { Profile } from "@app/interfaces/profile.interface";
import { ModalService } from "@app/services/modal.service";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { environment } from "@environments/environment";

@Component({
  selector: "app-personal",
  templateUrl: "./personal.component.html",
  styleUrls: ["./personal.component.scss"],
})
export class PersonalComponent implements OnInit, OnDestroy {
  @ViewChild(IonSegment, { static: true }) segment: IonSegment;

  public isProduction: boolean = false;
  public weightArray: string[] = [];
  public heightArray: string[] = [];
  public customPickerOptions: any;
  public personalInfo: PersonalInfo;
  private personalInfoTosave: PersonalInfo = {};
  public userForm: FormGroup;
  public doc_types = [
    { id: "CC", name: "Cédula ciudadanía" },
    { id: "RIF", name: "RIF Venezuela" },
    { id: "PEP", name: "Permiso especial de permanencia" },
    { id: "CE", name: "Cédula de extranjería" },
    { id: "PP", name: "Pasaporte" },
  ];
  private v_valDoc: boolean;
  private valDoc = "";
  @Input()
  public parentEvent: Subject<any>;
  public modalIsActive: boolean = false;
  private interval: Subscription;
  private duplicate: boolean;
  constructor(
    public profileService: ProfileServiceUser,
    private formBuilder: FormBuilder,
    private bodyService: BodyService,
    private _profileService: ProfileService,
    private toastService: ToastService,
    private authService: AuthService,
    private modalService: ModalService
  ) {
    this.isProduction = environment.production;
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
    console.log("Destroy personal..");
    if (this.interval) {
      console.log(`Closing subscripcion..`);
      this.interval.unsubscribe();
      this.personalInfo = {};
    }
  }

  ngOnInit() {
    console.log("init personal..");
    this.parentEvent.subscribe((event) => {
      this.ngOnDestroy();
      this.getUserPersonalInfo();
    });
    this.getUserPersonalInfo();
  }

  /**
   * Inicializaci\u00f3n de campos del formulario.
   */
  initFormValues(): void {
    /**
     * Valores por defecto de los campos altura y peso
     */
    if (!this.personalInfo?.height) {
      this.personalInfo.height = "1.09";
    }

    if (!this.personalInfo?.weight) {
      this.personalInfo.weight = "80";
    }

    /**
     * Inicializaci\u00f3n de los rangos de valores para altura y peso.
     */
    for (var i = 60; i <= 279; i++) {
      this.heightArray.push(i.toString());
    }

    for (var j = 28; j <= 175; j++) {
      this.weightArray.push(j.toString());
    }
  }

  /**
   * Obtiene la informaci\u00f3n personal del usuario actual.
   */
  getUserPersonalInfo() {
    this.interval = this.profileService.getPersonalInfo().subscribe((info) => {
      this.personalInfo = <PersonalInfo>info.body;
      /*
       * TO-DO: verificar este llamado dada la naturaleza asincrona
       *        de la peticion a (getPersonalInfo)..
       */
      this.initFormValues();
      this.buildForm();
      console.log("this.personalInfo", this.personalInfo);
    });
  }

  dateChange(event) {
    //this.user.date = new Date( event.detail.value );

    this.userForm.get("birthday").setValue(new Date(event.detail.value));
  }

  typeDocumentChange(event): void {
    console.log(event);
    this.personalInfo.documentType = event.detail.value;
  }

  weightChange(event): void {
    this.personalInfo.weight = event.detail.value;
  }

  heightChange(event): void {
    this.personalInfo.height = event.detail.value;
  }

  /**
   * Acci\u00f3n del bot\u00f3n de guardado..
   */
  async onSubmitTemplate() {
    if (this.userForm.valid) {
      this.modalIsActive = true;
      let dacadooUpdateName: DacadooUpdateNameDTO = {};
      dacadooUpdateName.name = {};
      this.setFormValues();
      console.log(this.personalInfoTosave);

      await this.validDocument();

      if (!this.duplicate) {
        dacadooUpdateName.name.firstName = this.personalInfoTosave?.name;
        dacadooUpdateName.name.lastName = this.personalInfoTosave?.lastName;

        this.profileService
          .updatePersonalInfo(this.personalInfoTosave)
          .subscribe(
            (response) => {
              this.updateNameDacadoo(dacadooUpdateName);
              this.modalIsActive = false;
              this.showConfirmAddMessageSaved();
              console.log("response personal profile", response);
            },
            (error: TrackHttpError) => {
              console.log("error personal profile", error);
              this.modalIsActive = false;
            }
          );

        if (
          this.personalInfoTosave.height === null ||
          this.personalInfoTosave.gender === null ||
          this.personalInfoTosave.weight === null ||
          this.personalInfoTosave.birthday === null
        ) {
          return;
        }
      }
    } else {
      console.log("no valid Form!!");
    }
  }

  async showConfirmAddMessageSaved() {
    await this.modalService.showConfirmAddMessage("profile");
  }

  private setFormValues(): void {
    this.personalInfoTosave.name = this.userForm.get("name").value;
    this.personalInfoTosave.gender = this.userForm.get("gender").value;
    this.personalInfoTosave.lastName = this.userForm.get("lastName").value;
    this.personalInfoTosave.documentType = this.userForm.get(
      "documentType"
    ).value;
    this.personalInfoTosave.document = this.userForm.get("document").value;
    this.personalInfoTosave.email = this.userForm.get("email").value;
    this.personalInfoTosave.gender = this.userForm.get("gender").value;
    this.personalInfoTosave.height = this.userForm.get("height").value;
    this.personalInfoTosave.weight = this.userForm.get("weight").value;
    this.personalInfoTosave.photo = this.userForm.get("photo").value;
    this.personalInfoTosave.phone = this.userForm.get("phone").value;
    this.personalInfoTosave.birthday = this.userForm.get("birthday").value;
  }

  /**
   *
   */
  buildForm(): void {
    this.userForm = this.formBuilder.group({
      name: [
        this.personalInfo.name,
        [Validators.required, FormValidators.NameValidator],
      ],
      lastName: [
        this.personalInfo.lastName,
        [Validators.required, FormValidators.NameValidator],
      ],
      documentType: [this.personalInfo.documentType, [Validators.required]],
      document: [
        this.personalInfo.document,
        [Validators.required, FormValidators.DocumentValidator],
      ],
      email: [this.personalInfo.email, [Validators.required, Validators.email]],
      month: [null, Validators.nullValidator],
      day: [null, Validators.nullValidator],
      year: [null, Validators.nullValidator],
      birthday: [this.personalInfo.birthday, [FormValidators.AdultValidator]],
      gender: [this.personalInfo.gender],
      height: [this.personalInfo.height],
      weight: [this.personalInfo.weight],
      photo: [this.personalInfo.photo],
      phone: [
        this.personalInfo.phone === "" ? null : this.personalInfo.phone,
        [FormValidators.PhoneNumberValidatorEmpty],
      ],
    });
  }

  /*
    El servicio devuelve si no está la cédula un hasherror TRUE
    El servicio devuelve si está la cédula un haserror TRUE
    Si está una vez devuelve un 200 con los datos del usuario
  */
  async validDocument() {
    return new Promise<void>((resolve, reject) => {
      let e_mail = localStorage.getItem("email");
      this.valDoc = "";
      this.v_valDoc = false;
      this.duplicate = false;
      let num_doc = this.userForm.get("document").value;
      let tipo_doc = this.userForm.get("documentType").value;
      this._profileService
        .validDocument(num_doc, tipo_doc)
        .toPromise()
        .then(
          (res: any) => {
            if (!res?.hasErrors) {
              let email = res?.body?.email;
              let document = res?.body?.document;
              let documentType = res?.body?.documentType;

              if (
                String(email).toLowerCase() === String(e_mail).toLowerCase() &&
                document == num_doc &&
                tipo_doc == documentType
              ) {
                this.duplicate = false;
                resolve();
                return;
              }

              this.duplicate = true;
              this.valDoc = "El usuario ya se encuentra registrado";
              this.v_valDoc = true;
              this.getUserPersonalInfo();
              resolve();
              return;
            } else if (res?.hasErrors) {
              if (
                res?.errors[0].errorCode ==
                "segurosbolivar.profile.duplicateRecordError"
              ) {
                this.duplicate = true;
                this.valDoc = "El usuario ya se encuentra registrado";
                this.v_valDoc = true;
                this.getUserPersonalInfo();
                resolve();
                return;
              } else if (res?.errors[0].errorCode == "Not Found Record") {
                this.duplicate = false;
                resolve();
              }
            }
            resolve();
          },
          (error: HttpErrorResponse) => {
            console.log(error.message);
            resolve();
          }
        );
    });
  }

  updateNameDacadoo(dacadooUpdateName: DacadooUpdateNameDTO) {
    this.profileService.updateNameDacadoo(dacadooUpdateName).subscribe(
      async (res) => {
        let pro = this.personalInfo;

        let phone = pro.phone;
        let docType = pro.documentType;
        let docNum = pro.document;
        let birthday = pro.birthday;
        let aceptaDatos = pro.dataTratementAcceptBolivar;
        let aceptaOtros = pro.dataTratementAcceptOthers;
        let gender = pro.gender;

        console.log(res);
        let profile: Profile = {};
        profile.name = res.body.firstName;
        profile.lastName = res.body.lastName;
        profile.email = localStorage.getItem("email");
        profile.phone = phone;
        profile.documentType = docType;
        profile.document = docNum;
        profile.birthday = birthday;
        profile.dataTratementAcceptBolivar = aceptaDatos;
        profile.dataTratementAcceptOthers = aceptaOtros;
        profile.gender = gender;

        this.authService.saveProfile(profile);
      },
      (error: HttpErrorResponse) => console.log(error.message)
    );
  }
}
