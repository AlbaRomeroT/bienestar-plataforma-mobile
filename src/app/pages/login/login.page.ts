import { Component, OnInit, ViewChild, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { IonSegment, ModalController } from "@ionic/angular";

import { AuthService } from "../../services/auth.service";
import { environment } from "../../../environments/environment";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { TercerosService } from "../../services/terceros.service";
import { ProfileService } from "../../services/profile.service";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { Profile } from "@app/interfaces/profile.interface";
import { TreatmentsModal } from "@app/components/terms-treatments/treatment.component";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { HttpErrorResponse } from "@angular/common/http";
import { NotificationsService } from "../../services/notifications.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit, OnDestroy {
  switchTabsOn: boolean;
  tokenCheck: any;
  loadAPI: Promise<any>;
  @ViewChild(IonSegment, { static: true }) optionTab: IonSegment;
  showScreen: boolean;
  additional: boolean = false;
  formGroup: FormGroup;
  v_tipo_doc: boolean;
  v_num_doc: boolean;
  v_num_doc_min_length: boolean;
  v_num_doc_max_length: boolean;
  isSubmitted: boolean;
  auth_data: boolean = true;
  auth_offers: boolean;
  valDoc = "";
  v_check: boolean;
  v_valDoc: boolean;
  tipo_docs = [
    { id: "CC", name: "Cédula ciudadanía" },
    { id: "RIF", name: "RIF Venezuela" },
    { id: "PEP", name: "Permiso especial de permanencia" },
    { id: "CE", name: "Cédula de extranjería" },
    { id: "PP", name: "Pasaporte" },
  ];
  autorizacion =
    "Autorizo de manera voluntaria y explícita  el tratamiento de los datos personales sensibles en los términos de esta autorización.";
  autorizacion_offers =
    "Autorizo la utilización de mis datos personales para el envío de información y ofertas comerciales de Seguros Bolívar y de las compañías que hacen parte del Grupo Bolívar";
  public selectOptions: any = {
    header: "Tipo documento",
    translucent: true,
    //cssClass:'my-custom-interface'
  };
  private token: any;
  constructor(
    private authService: AuthService,
    private router: Router,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private notificationService: NotificationsService,
    private gaService: GoogleAnalyticsService
  ) {
    this.formGroup = this.formBuilder.group({
      tipo_doc: new FormControl("", [Validators.required]),
      num_doc: new FormControl("", [
        Validators.required,
        Validators.pattern("^[0-9,$]*$"),
        Validators.minLength(5),
        Validators.maxLength(10),
      ]),
    });

    this.token = localStorage.getItem("token-node");
  }

  async ngOnInit() {}

  public loadScript() {
    let node = document.createElement("script");
    node.src = environment.logintr;
    node.async = true;
    node.charset = "utf-8";
    document.getElementsByTagName("head")[0].appendChild(node);
  }

  loadLogin() {
    setTimeout(() => {
      let loginSystem = window["loginSystem"];
      if (loginSystem != undefined) {
        this.showScreen = true;
        loginSystem.loadRegister();
        loginSystem.loadLogin();

        setTimeout(() => {
          var elem = document.getElementById("trackLabelTemrs");
          elem.innerHTML =
            "He leído y acepto los Términos y Condiciones de uso y el Tratamiento de mis datos personales.";
          var emailTitle = document.querySelector("legend");
          emailTitle.innerHTML = "Ingrese con su correo electrónico";
          //var btnLogin = document.getElementById('loginUser');
        }, 500);
      } else {
        this.loadLogin();
      }
    }, 500);
  }

  ngOnDestroy() {
    clearInterval(this.tokenCheck);
  }

  async ionViewDidEnter() {
    this.notificationService.clearNewNotification();
    this.formGroup.reset();
    this.optionTab.value = "login";
    this.additional = false;

    this.formGroup.get("tipo_doc").setValue("");
    this.formGroup.get("num_doc").setValue("");

    this.setInterval();
    this.loadAPI = new Promise((resolve) => {
      this.loadScript();
      resolve(true);
    });

    this.loadAPI.then((data) => {
      setTimeout(() => {
        this.loadLogin();
      }, 800);
    });

    setTimeout(() => {
      this.showScreen = true;
      document.getElementById("register-box").style.visibility = "visible";
      document.getElementById("register-footer-hide").style.visibility =
        "visible";
      document.getElementById("login-box").style.visibility = "visible";
      document.getElementById("login-footer-hide").style.visibility = "visible";
    }, 1500);
  }

  setInterval() {
    this.tokenCheck = setInterval(async () => {
      const token = await this.authService.token();

      if (!token) {
        return;
      }
      document.getElementById("register-box").style.visibility = "hidden";
      document.getElementById("register-footer-hide").style.visibility =
        "hidden";
      document.getElementById("login-box").style.visibility = "hidden";
      document.getElementById("login-footer-hide").style.visibility = "hidden";

      clearInterval(this.tokenCheck);
      const loginMethod = await this.authService.loginMethod();

      if (loginMethod === "register") {
        console.log("Usuario registrado exitosamente");

        let registerData = localStorage.getItem("registerData");
        var arrStr = registerData.split(/[=&]/);
        let firstName = arrStr[1];
        let secondName = arrStr[3];
        let firstLastName = arrStr[5];
        let secondLastName = arrStr[7];
        let email = arrStr[9];

        let profile: Profile = {};
        profile.name = `${firstName} ${
          secondName != undefined || secondName != null ? secondName : ""
        }`;
        profile.lastName = `${firstLastName} ${
          secondLastName != undefined || secondLastName != null
            ? secondLastName
            : ""
        }`;
        profile.email = email;
        console.log(profile);
        localStorage.setItem("email", email);
        
        // Si no pudo guardar se presentará un bloqueo...
        this.profileService.update(profile).subscribe(
          (res) => {
            this.authService
              .saveProfile(profile)
              .then()
              .finally(() => {
                // TODO: Quitar cuando este funcionando el servicio de profile
                //this.tercerosService.saveUserDacadoo(profile).then();
              });
            this.additional = true;
          },
          (error) => {
            console.log("Hubo un problema al guardar la información");
          }
        );
      } else {
        const email = await this.authService.email();
        this.profileService.get(email).subscribe(
          (res: AppHttpResponse<Profile>) => {
            let response = this.profileService.decrypRSA(
              res?.body?.encryptedData
            );
            res.body = response;
            if (res.hasErrors) {
              if (res.errors[0].errorCode == "Not Found Record") {
                this.additional = true;
              }
            } else {
              this.authService.saveProfile(res.body);

              if (res.body.documentType == null || res.body.document == null) {
                this.additional = true;
              } else {
                this.router.navigate(["home"]);
              }
            }
          },
          (error: TrackHttpError) => {
            console.log(error.friendlyMessage);
            this.router.navigate(["home"]);
          }
        );
      }
    }, 100);
  }

  segmentChanged(ev: any) {
    const tab = ev.detail.value;
    if (tab === "login") {
      this.switchTabsOn = true;
    } else if (tab === "register") {
      this.switchTabsOn = false;
    }
  }

  goToTab(value: string) {
    if (value === "login") {
      this.optionTab.value = "login";
      this.switchTabsOn = true;
    } else if (value === "register") {
      this.optionTab.value = "register";
      this.switchTabsOn = false;
      this.gaService.trackEvent(AnaliticEvents.SI_Singin_PAN);
    }
  }

  validDocument() {
    this.v_valDoc = false;
    let num_doc = this.formGroup.get("num_doc").value;
    let tipo_doc = this.formGroup.get("tipo_doc").value;

    if (!this.auth_data) {
      this.v_check = true;
      return;
    }

    //validar formulario
    this.v_tipo_doc = false;
    this.v_num_doc = false;
    this.v_num_doc_min_length = false;
    this.v_num_doc_max_length = false;

    if (this.formGroup.invalid) {
      if (this.formGroup.get("tipo_doc").errors?.required) {
        this.v_tipo_doc = true;
      }
      if (this.formGroup.get("num_doc").errors?.required) {
        this.v_num_doc = true;
      }
      if (this.formGroup.get("num_doc").errors.minlength) {
        this.v_num_doc_min_length = true;
      }
      if (this.formGroup.get("num_doc").errors.maxlength) {
        this.v_num_doc_max_length = true;
      }
      return;
    }

    return new Promise((resolve, reject) => {
      this.valDoc = "";
      this.v_valDoc = false;
      this.profileService
        .validDocument(num_doc, tipo_doc)
        .toPromise()
        .then(
          (res: any) => {
            if (!res?.hasErrors) {
              this.valDoc = "El usuario ya se encuentra registrado";
              this.v_valDoc = true;
              resolve();
              return;
            } else if (res?.hasErrors) {
              if (
                res?.errors[0].errorCode ==
                "segurosbolivar.profile.duplicateRecordError"
              ) {
                this.valDoc = "El usuario ya se encuentra registrado";
                this.v_valDoc = true;
                resolve();
                return;
              } else if (res?.errors[0].errorCode == "Not Found Record") {
                this.guardarAdicionales();
                resolve();
              }
            }
            resolve();
          },
          (error: HttpErrorResponse) => {
            console.log(error);
            resolve();
          }
        );
    });
  }

  async callModalTreatment() {
    localStorage.setItem("view-terms", "1");
    let profileModal = await this.modalCtrl.create({
      component: TreatmentsModal,
    });

    profileModal.onDidDismiss().then((res) => {
      localStorage.removeItem("view-terms");
    });
    profileModal.present();
  }

  validCheck() {
    if (!this.auth_data) {
      this.v_check = true;
      return;
    } else {
      this.v_check = false;
      return;
    }
  }

  async guardarAdicionales() {
    //Guardar y redirigir al onboarding
    if (this.formGroup.valid) {
      let nombreEmpresa = "";
      let tipo_doc = this.formGroup.get("tipo_doc").value;
      let num_doc = this.formGroup.get("num_doc").value;
      let check_data = this.auth_data;
      let check_offers = this.auth_offers;

      let pro = await this.authService.profile();

      let profile: Profile = {};
      profile.email = localStorage.getItem("email");
      profile.document = num_doc;
      profile.documentType = tipo_doc;
      profile.dataTratementAcceptBolivar = check_data;
      profile.dataTratementAcceptOthers = check_offers;
      profile.name = pro.name;
      profile.lastName = pro.lastName;
      profile.phone = pro.phone;

      this.profileService.update(profile).subscribe(
        async (res) => {
          let profileStore = await this.authService.profile();
          profile.name = profileStore.name;
          this.authService.saveProfile(profile);
          this.router.navigate(["/onboarding", { empresa: nombreEmpresa }]);
        },
        (error) => {
          console.log("Hubo un problema al guardar la información");
        }
      );

      /* this.tercerosService.getTerceronatural(tipo_doc, num_doc).subscribe(
        (res: any) => {
          console.log(res);

          if (res?.dataHeader.codRespuesta === 0) {
            nombreEmpresa = res.data.tercerosNaturalInfo.infoActecoTerceroNatural.empresaTrabaja;
          } else {
            nombreEmpresa = res?.dataHeader.errores[0].descError;
          }
          localStorage.setItem('usuario', JSON.stringify(res?.data?.tercerosNaturalInfo) + "");
          nombreEmpresa = nombreEmpresa == undefined ? "" : nombreEmpresa;
          localStorage.setItem('nombre-empresa', nombreEmpresa + "");
          
        }, error => {
          console.log(`Ocurrió un error al consultar el servicio ${JSON.stringify(error)}`);
        }
      ); */
    }
  }
}
