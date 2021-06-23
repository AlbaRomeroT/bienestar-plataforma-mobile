import { Injectable, SecurityContext } from "@angular/core";
import { environment } from "@environments/environment";
import { DomSanitizer } from "@angular/platform-browser";
import { Platform } from "@ionic/angular";
import { Market } from "@ionic-native/market/ngx";
import { ToastService } from "./toast.service";
import { AppAvailability } from "@ionic-native/app-availability/ngx";

@Injectable({
  providedIn: "root",
})
export class WhatsappService {
  public whatsappHelpClientNumber: string =
    environment.whatsappHelpClientNumber;
  public whatsappHelpNumber: string = environment.whatsappHelpNumber;

  constructor(
    private domSanitizer: DomSanitizer,
    private platform: Platform,
    private market: Market,
    private toastService: ToastService,
    private appAvailability: AppAvailability
  ) {}

  async openStoreWhatsapp(number: string, text?: string) {
    if (await this.checkWhatsAppAvailable().then()) {
      let url = this.domSanitizer.bypassSecurityTrustUrl(
        `whatsapp://send?phone=${number}` + (text ? `&text=${text}` : "")
      );
      window.location.href = this.domSanitizer.sanitize(
        SecurityContext.URL,
        url
      );
    } else {
      this.toastService.showMessage(
        "Su dispositivo no tiene WhatsApp instalado, se redireccionará a la tienda para su instalación"
      );

      setTimeout(() => {
        if (this.platform.is("ios")) {
          this.market.open("id310633997");
        } else if (this.platform.is("android")) {
          this.market.open("com.whatsapp");
        } else {
          let url = this.domSanitizer.bypassSecurityTrustUrl(
            `https://wa.me/${number}` + (text ? `?text=${text}` : "")
          );
          window.open(
            this.domSanitizer.sanitize(SecurityContext.URL, url),
            "_blank"
          );
        }
      }, 2000);
    }
  }

  private async checkWhatsAppAvailable(): Promise<boolean> {
    let app;
    if (this.platform.is("ios")) {
      app = "whatsapp://";
    } else if (this.platform.is("android")) {
      app = "com.whatsapp";
    } else {
      return Promise.resolve(false);
    }

    return this.appAvailability.check(app).then(
      () => {
        return Promise.resolve(true);
      },
      (reject) => {
        return Promise.resolve(false);
      }
    );
  }
}
