import { Component, OnInit, SecurityContext } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { EmailService } from "@app/services/email.service";
import { StoreService } from "@app/services/store.service";
import { ToastService } from "@app/services/toast.service";
import { WhatsappService } from "@app/services/whatsapp.service";
import { environment } from "@environments/environment";
import { CallNumber } from "@ionic-native/call-number/ngx";

@Component({
  selector: "app-advice-widget-container",
  templateUrl: "./advice-widget-container.page.html",
  styleUrls: ["./advice-widget-container.page.scss"],
})
export class AdviceWidgetContainerPage implements OnInit {
  docNumber: string;
  isDaviviendaEmployee: boolean;
  hasBolivarPolicy: boolean;
  hasBolivarArl: boolean;
  isFromHealthSector: boolean;
  qrColor: string;
  userName: string;
  age: Date;
  name_arl: string;
  env = environment.qrenv;

  showComponent = false;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private storeService: StoreService,
    private callNumber: CallNumber,
    private emailService: EmailService,
    private toastService: ToastService,
    private whatsappService: WhatsappService,
    private domSanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      this.qrColor = params["color"];
      this.docNumber = params["docNumber"];
    });

    this.storeService.getCurrentQrInfo().subscribe((response) => {
      if (response) {
        this.isDaviviendaEmployee = false;
        this.hasBolivarPolicy = response.hasBolivarHealth;
        this.hasBolivarArl = response.hasBolivarArl;
        this.isFromHealthSector = response.worksInHealthSector;
        this.userName = response.userName;
        this.age = response.age;
        this.name_arl = response.name_arl;
      } else {
        this.router.navigate(["/"]);
      }
    });
  }

  ionViewDidEnter() {
    this.showComponent = true;
  }

  ionViewDidLeave() {
    this.showComponent = false;
  }

  onAdviceWidgetEvent(evt: string): void {
    if (evt === "advice-widget:go-back") {
      this.router.navigate(["/"]);
    }
  }

  onAdviceWidgetContactEvent(evt: any): void {
    switch (evt.action) {
      case "call":
        if (evt.payload.phoneNumber) {
          this.onCallHelpNumber(evt.payload.phoneNumber);
        }
        break;
      case "open-website":
        if (evt.payload.website) {
          window.open(
            this.domSanitizer.sanitize(
              SecurityContext.URL,
              evt.payload.website
            ),
            "_blank"
          );
        }
        break;
      case "send-email":
        if (evt.payload.address) {
          this.onSendEmail(evt.payload.address);
        }
        break;
      case "whatsapp-message":
        if (evt.payload.phoneNumber) {
          this.openStoreWhatsapp(evt.payload.phoneNumber);
        }
        break;
    }
  }

  onCallHelpNumber(phoneNumber: string) {
    this.callNumber
      .callNumber(phoneNumber, true)
      .then(null, (reject) => {
        console.log(reject);
        this.toastService.showMessage(
          "Su dispositivo no tiene habilitado el envió de llamadas"
        );
      })
      .catch((error) => {
        console.log(error);
        this.toastService.showMessage(
          "Su dispositivo no tiene habilitado el envió de llamadas"
        );
      });
  }

  onSendEmail(email: string) {
    this.emailService.openEmailApp(email);
  }

  openStoreWhatsapp(number: string) {
    this.whatsappService.openStoreWhatsapp(number);
  }
}
