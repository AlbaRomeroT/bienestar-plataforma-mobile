import { Injectable } from "@angular/core";
import { AlertController, ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class UiService {
  constructor(
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async alert(message: string) {
    const alert = await this.alertController.create({
      message,
    });

    await alert.present();
  }

  async toast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
    });

    await toast.present();
  }
}
