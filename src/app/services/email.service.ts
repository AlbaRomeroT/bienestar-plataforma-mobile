import { Injectable } from "@angular/core";
import { environment } from "@environments/environment";
import { EmailComposer } from "@ionic-native/email-composer/ngx";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class EmailService {
  private helpEmail: string = environment.helpEmail;

  constructor(
    private emailComposer: EmailComposer,
    private toastService: ToastService
  ) {}

  openEmailApp(emailAddress?: string) {
    try {
      this.emailComposer.isAvailable().then(
        () => {
          let email = {
            to: emailAddress || this.helpEmail,
          };
          this.emailComposer.open(email);
        },
        (reject) => {
          console.error(reject);
          this.toastService.showMessage(
            `Su dispositivo no soporta el envío de correo electrónico o no cuenta con un cliente de correo instalado, puede enviarnos su consulta al correo ${this.helpEmail}`
          );
        }
      );
    } catch (error) {
      console.error(error);
      this.toastService.showMessage(
        `Su dispositivo no soporta el envío de correo electrónico o no cuenta con un cliente de correo instalado, puede enviarnos su consulta al correo ${this.helpEmail}.`
      );
    }
  }
}
