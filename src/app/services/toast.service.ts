import { Injectable } from "@angular/core";
import { ToastController } from "@ionic/angular";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  constructor(private toastController: ToastController) {}

  showMessage(
    message: string,
    header?: string,
    duration?: number,
    position?: "top" | "bottom" | "middle",
    color?: string
  ) {
    this.toastController
      .create({
        message: message,
        header: header,
        duration: duration ? duration : 3000,
        position: position,
        color: color,
      })
      .then((toastData) => {
        toastData.present();
      });
  }
}
