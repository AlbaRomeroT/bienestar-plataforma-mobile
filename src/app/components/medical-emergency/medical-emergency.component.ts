import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { environment } from "@environments/environment";
import { ToastService } from "@app/services/toast.service";
import { PurecloudService } from "@app/services/purecloud.service";
import { TercerosService } from "@app/services/terceros.service";
import { ProfileService } from "@app/services/profile.service";
import { GreenButtonTitleComponent } from "../green-button-title/green-button-title.component";

@Component({
  selector: "app-medical-emergency",
  templateUrl: "./medical-emergency.component.html",
  styleUrls: ["./medical-emergency.component.scss"],
})
export class MedicalEmergencyComponent implements OnInit {
  @Input() private medEmergency: boolean;
  @Output()
  public medEmergencyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  //Títulos
  title: string = "";
  llamada: string = "En breve lo contactaremos";
  lineaEmergencia: string =
    "Contacte a la línea única de emergencia Nacional 123";
  confirmPureCloud: string = `Tenga presente que esta solicitud es exclusiva para emergencias <strong class="bold-text">médicas</strong> y <strong class="bold-text">laborales</strong>`;
  confirmTitle: string = "Queremos ayudarle con su emergencia";
  //Flags
  showError: boolean;
  showedError: string = "";
  response: any = "";
  answer: number = 0;
  res: any;
  SHOW_PURECLOUD_CALL = 3;
  SHOW_123_CALL = 2;
  SHOW_WARNING_MSG = 1;
  show: boolean;
  private call123: string = environment.callEmergencyNationalNumber;
  constructor(
    private _modalCtrl: ModalController,
    private callNumber: CallNumber,
    private toastService: ToastService,
    private pureClodService: PurecloudService,
    private tercerosSerices: TercerosService,
    private profileService: ProfileService,
    private g: GreenButtonTitleComponent
  ) {}

  async ngOnInit() {
    await this.getUserProfile();
    this.isClientOrNot();
    this.validTitle();
    this.g.closeModal();
  }

  regresar() {
    this.medEmergencyChange.emit(false);
  }

  dismiss() {
    this._modalCtrl.dismiss({
      dismissed: true,
    });
  }

  call() {
    this.callNumber
      .callNumber(this.call123, true)
      .then(
        (res) => {},
        (reject) => {
          this.toastService.showMessage(
            "Su dispositivo no tiene habilitado el envío de llamadas"
          );
        }
      )
      .catch((err) => {
        this.toastService.showMessage(
          "Su dispositivo no tiene habilitado el envío de llamadas"
        );
      });
  }

  getUserProfile() {
    let email = localStorage.getItem("email");
    return new Promise((resolve, reject) => {
      this.profileService.get(email).subscribe(
        (res: any) => {
          let response = this.profileService.decrypRSA(
            res?.body?.encryptedData
          );
          res.body = response;

          if (res.hasErrors != undefined) {
            if (res.hasErrors) {
              if (res.errors[0].errorCode == "Not Found Record") {
                this.response = "Not Found Record";
                resolve(true);
              }
            } else {
              this.response = res.body;
              resolve(true);
            }
          } else {
            this.showError = true;
            this.showedError = "Hubo un error al enviar la solicitud";
          }
        },
        (error) => {
          console.log("Ocurrió un error: ", error);
          this.toastService.showMessage(
            "Ocurrió un error al consulta sus datos: ",
            error
          );
          reject(true);
        }
      );
    });
  }

  async sendEmergencyCallRequest() {
    this.showError = false;
    console.log(this.response);

    if (this.response == "Not Found Record") {
      this.showError = true;
      this.showedError = "No se pudo consultar la información del perfil";
      return;
    }

    let tipoDocumento = this.response.documentType;
    let numDocumento = this.response.document;
    let telefono = this.response.phone;
    let nombre = this.response.name;
    let apellido = this.response.lastName;

    let data = {
      tipoDocumento: tipoDocumento,
      numDocumento: numDocumento,
      telefono: telefono,
      nombre: nombre,
      apellido: apellido
    };
    if (data.telefono == null) {
      this.showError = true;
      this.showedError = "El número de teléfono es obligatorio";
      return;
    }

    this.callPureCLoud(data);
  }

  callPureCLoud(data) {
    this.pureClodService.sendEmergencyCallRequest(data).subscribe(
      (res) => {
        if (res.body != undefined) {
          let status = res.body.status;
          if (status === "FAILURE") {
            this.showError = true;
            this.showedError = "No se pudo enviar la solicitud";
          } else {
            this.dismiss();
          }
        } else {
          this.showError = true;
          this.showedError = "Hubo un error al enviar la solicitud";
        }
      },
      (err) => {
        this.showError = true;
        this.showedError = "Hubo un error al enviar la solicitud";
      }
    );
  }

  isClientOrNot() {
    let tipoDocumento = this.response.documentType;
    let numDocumento = this.response.document;
    let data = {
      pCodTipoDocumento: tipoDocumento,
      pNumDocumento: numDocumento,
    };
    this.show = true;
    this.answer = 4;
    this.validTitle();
    this.res = this.tercerosSerices.getIsClientOrNot(data).subscribe(
      (res: any) => {
        if (res?.body?.status == "SUCCESS") {
          this.title = this.llamada;
          this.answer = this.SHOW_WARNING_MSG;
        } else {
          this.title = this.lineaEmergencia;
          this.answer = this.SHOW_123_CALL;
        }
        this.validTitle();
      },
      (error) => {
        this.showError = true;
        this.showedError = "Hubo un error al enviar la solicitud";
      }
    );
  }

  validTitle() {
    if (this.answer == 4) {
      this.title = "Cargando";
    } else if (this.answer == 1) {
      this.title = "Queremos ayudarle con su emergencia";
    } else if (this.answer == 2) {
      this.title = "Contacte a la línea única de emergencia Nacional 123";
    } else if (this.answer == 3) {
      this.title = "En breve lo contactaremos";
    }
  }

  navigate() {
    if (this.answer == 3) {
      this.answer = 1;
      this.title = "Queremos ayudarle con su emergencia";
    } else if (this.answer == 1) {
      this.regresar();
    }
  }

  sendToPure() {
    this.answer = this.SHOW_PURECLOUD_CALL;
    this.validTitle();
  }

  close() {
    this.dismiss();
  }
}
