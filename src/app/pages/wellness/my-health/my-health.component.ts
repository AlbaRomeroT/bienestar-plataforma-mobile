import { Component, OnInit } from "@angular/core";
import { IHealthCard } from "../../../interfaces/health-card.interface";
import { CarnetService } from "../../../services/carnet.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { AuthService } from "../../../services/auth.service";
import { environment } from "@environments/environment";
import { WhatsappService } from "@app/services/whatsapp.service";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { ToastService } from "@app/services/toast.service";

@Component({
  selector: "app-my-health",
  templateUrl: "./my-health.component.html",
  styleUrls: ["./my-health.component.scss"],
})
export class MyHealthComponent implements OnInit {
  code: string;
  side: "front" | "back" = "front";
  collections: IHealthCard[];
  subscriptions = new Subject();
  hasCards = true;
  showSpinner = false;
  public callHelpNumber: string = environment.callHelpNumber;
  public whatsappHelpClientNumber: string = this.whatsappService
    .whatsappHelpClientNumber;
  public whatsappHelpNumber: string = this.whatsappService.whatsappHelpNumber;

  constructor(
    private carnetService: CarnetService,
    private authService: AuthService,
    private whatsappService: WhatsappService,
    private toastService: ToastService,
    private callNumber: CallNumber
  ) {}

  ngOnInit() {
    this.getCarnets();
  }

  onCallHelpNumber() {
    this.callNumber
      .callNumber(this.callHelpNumber, true)
      .then(
        () => {
          // response
        },
        (reject) => {
          console.log(reject);
          this.toastService.showMessage(
            "Su dispositivo no tiene habilitado el envió de llamadas"
          );
        }
      )
      .catch((error) => {
        console.log(error);
        this.toastService.showMessage(
          "Su dispositivo no tiene habilitado el envió de llamadas"
        );
      });
  }

  openStoreWhatsapp(number: string) {
    this.whatsappService.openStoreWhatsapp(number);
  }

  async getCarnets() {
    this.showSpinner = true;
    var profile = await this.authService.profile();

    this.carnetService
      .get(profile.documentType, profile.document)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: IHealthCard[]) => {
          this.showSpinner = false;

          this.collections = response;
          console.log("CARD =>", this.collections);
          for (var card of this.collections) {
            card.side = "front";
          }
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          console.log(error);
        }
      );
  }

  ionViewDidLeave(): void {
    this.collections = null;
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  sideButtonText(card: IHealthCard) {
    if (card.side == "front") {
      return "CANALES DE ATENCIÓN";
    } else {
      return "CARNÉ DIGITAL";
    }
  }

  changeSide(card: IHealthCard): void {
    if (card.side == "front") {
      card.side = "back";
    } else {
      card.side = "front";
    }
  }
}
