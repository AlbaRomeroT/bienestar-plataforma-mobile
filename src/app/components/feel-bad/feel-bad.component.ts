import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { ProductOptionCheck } from "@app/models/product-option-check";
import { ProfileService } from "@app/services/profile.service";
import { TercerosService } from "@app/services/terceros.service";
import { ToastService } from "@app/services/toast.service";
import { WhatsappService } from "@app/services/whatsapp.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-feel-bad",
  templateUrl: "./feel-bad.component.html",
  styleUrls: ["./feel-bad.component.scss"],
})
export class FeelBadComponent implements OnInit {
  public whatsappHelpClientNumber: string = this.whatsappService
    .whatsappHelpClientNumber;
  public whatsappHelpNumber: string = this.whatsappService.whatsappHelpNumber;

  @Input() public modal: HTMLIonModalElement;

  @Input() public isFeelBad: boolean;
  @Output()
  private isFeelBadChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  // step 0: select product
  // step 1: coorporative whatsapp
  // step 2: arl choose
  // step 3: doctoraki whatsapp
  public step: number = 0;

  private stepStack: number[] = [];

  public titles: string[] = ["Hablemos por WhatsApp"];

  // yes-no
  public arlChoose: string;

  public productChecks: ProductOptionCheck[] = [
    { cod: 1, val: "Seguro de salud", isChecked: false },
    { cod: 2, val: "ARL", isChecked: false },
    { cod: 3, val: "Autos, vida, hogar u otro", isChecked: false },
    {
      cod: 4,
      val: "No tengo ningún producto con Seguros Bolivar",
      isChecked: false,
    },
  ];

  response: any = "";
  showedErrorFeel: string = "";
  showErrorFeel: boolean;
  SHOW_SEGUROBOLIVAR_CHAT = 1;
  SHOW_DOCTORAKI_CHAT = 3;
  constructor(
    private whatsappService: WhatsappService,
    private profileService: ProfileService,
    private tercerosSerices: TercerosService,
    private toastService: ToastService,
    private _modalCtrl: ModalController
  ) {}

  async ngOnInit() {
    await this.getUserProfileSB();
    this.isClientOrNotSB();
  }

  goToStep(step: number) {
    this.stepStack.push(this.step);
    this.step = step;
  }

  goToStepBack() {
    this.step = this.stepStack.pop();
  }

  onBack() {
    this.isFeelBadChange.emit(false);
  }

  dismiss() {
    this._modalCtrl.dismiss({
      dismissed: true,
    });
  }

  openStoreWhatsapp(number: string, text?: string) {
    this.whatsappService.openStoreWhatsapp(number, text);
  }

  getUserProfileSB() {
    let email = localStorage.getItem("email");
    return new Promise((resolve, reject) => {
      this.profileService.get(email).subscribe(
        (res: any) => {
          let response = this.profileService.decrypRSA(
            res?.body?.encryptedData
          );
          console.log("response", response);
          res.body = response;

          if (res.hasErrors != undefined) {
            if (!res.hasErrors) {
              this.response = res.body;
              resolve(true);
            } else {
              if (res.errors[0].errorCode == "Not Found Record") {
                this.response = "Not Found Record";
                resolve(true);
              }
            }
          } else {
            this.showedErrorFeel = "Hubo un error al enviar la solicitud";
            this.showErrorFeel = true;
          }
        },
        (error) => {
          this.toastService.showMessage(
            "Ocurrió un error al consulta sus datos"
          );
          reject(true);
        }
      );
    });
  }

  isClientOrNotSB() {
    let tipoDoc = this.response.documentType;
    let numDoc = this.response.document;
    let datos = {
      pCodTipoDocumento: tipoDoc,
      pNumDocumento: numDoc,
    };

    this.tercerosSerices.getIsClientOrNot(datos).subscribe((res: any) => {
      if (res?.body?.status == "SUCCESS") {
        this.step = this.SHOW_SEGUROBOLIVAR_CHAT;
      } else {
        this.step = this.SHOW_DOCTORAKI_CHAT;
      }
    });
  }
}
