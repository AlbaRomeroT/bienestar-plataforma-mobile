import { Component, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";
import { GreenButtonOptionsComponent } from "../green-button-options/green-button-options.component";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";

@Component({
  selector: "app-green-button",
  templateUrl: "./green-button.component.html",
  styleUrls: ["./green-button.component.scss"],
})
export class GreenButtonComponent implements OnInit {
  private modal: HTMLIonModalElement;
  public isActive: boolean = false;
  public isLoading: boolean = false;

  constructor(
    private modalController: ModalController,
    private gaService: GoogleAnalyticsService
  ) {}

  ngOnInit() {}

  async presentModal() {
    if (this.isLoading) return;

    this.isLoading = true;

    if (this.isActive && this.modal) {
      this.modal.dismiss();
    } else {
      this.modal = await this.modalController.create({
        component: GreenButtonOptionsComponent,
        cssClass: "green-button-class",
        backdropDismiss: false,
        keyboardClose: false,
        componentProps: {
          modal: this.modal,
        },
      });

      this.modal
        .onDidDismiss()
        .then(() => {
          this.isActive = false;
        })
        .finally(() => {
          this.isLoading = false;
        });

      this.gaService.trackEvent(AnaliticEvents.BV_comoayudamos_PAN);
      this.gaService.trackEvent(AnaliticEvents.BV_CA_BV_BTN);

      return this.modal
        .present()
        .then(() => {
          this.isActive = true;
        })
        .finally(() => {
          this.isLoading = false;
        });
    }
  }
}
