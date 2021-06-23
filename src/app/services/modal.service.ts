import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ModalAlertComponent } from "@app/components/modal-alert/modal-alert.component";
import { ModalController } from "@ionic/angular";
import { NavigationBackService } from "./navigation-back.service";

@Injectable({
  providedIn: "root",
})
export class ModalService {
  constructor(
    private modalController: ModalController,
    private navigationBackService: NavigationBackService,
    private router: Router
  ) {}

  async showConfirmAddMessage(
    backPage?: string,
    cssClass?: string,
    title?: string,
    description?: string
  ) {
    let profileModal = await this.modalController.create({
      component: ModalAlertComponent,
      cssClass: cssClass || "activities-actions-modal-add",
      componentProps: {
        title: title || "Se han guardado sus datos con éxito",
        description: description || "",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      if (backPage) {
        this.router.navigate([backPage]);
      }
    });

    return await profileModal.present();
  }
}
