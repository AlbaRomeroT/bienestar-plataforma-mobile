import { Component, OnInit } from "@angular/core";
import { EmailService } from "@app/services/email.service";
import { WhatsappService } from "@app/services/whatsapp.service";
import { CallNumber } from "@ionic-native/call-number/ngx";
import { ToastService } from "src/app/services/toast.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-help-center",
  templateUrl: "./help-center.page.html",
  styleUrls: ["./help-center.page.scss"],
})
export class HelpCenterPage implements OnInit {
  public callHelpNumber: string = environment.callHelpNumber;

  public whatsappHelpClientNumber: string = this.whatsappService
    .whatsappHelpClientNumber;
  public whatsappHelpNumber: string = this.whatsappService.whatsappHelpNumber;

  constructor(
    private callNumber: CallNumber,
    private emailService: EmailService,
    private toastService: ToastService,
    private whatsappService: WhatsappService
  ) {}

  ngOnInit() {}

  onCallHelpNumber() {
    this.callNumber
      .callNumber(this.callHelpNumber, true)
      .then(
        () => {},
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

  onSendEmail() {
    this.emailService.openEmailApp();
  }

  openStoreWhatsapp(number: string) {
    this.whatsappService.openStoreWhatsapp(number);
  }
}
