import { Component, OnInit, Input } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ModalController } from "@ionic/angular";
import { TercerosService } from "@app/services/terceros.service";
import { ProfileService } from "@app/services/profile.service";
import { AuthService } from "@app/services/auth.service";
import { Profile } from "@app/interfaces/profile.interface";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { UiService } from "@app/services/ui.service";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";

@Component({
  selector: "app-green-button-options",
  templateUrl: "./green-button-options.component.html",
  styleUrls: ["./green-button-options.component.scss"],
})
export class GreenButtonOptionsComponent implements OnInit {
  @Input() public modal: HTMLIonModalElement;

  celular: boolean;
  medEmergency: boolean;
  inicio: boolean;
  profile: Profile;

  mobNumberPattern = "^[3][0-3][0-9]{8}$";
  isValidFormSubmitted = false;
  user = new UserMobile();
  isFeelBad: boolean;

  constructor(
    private modalController: ModalController,
    private tercerosSerices: TercerosService,
    private profileService: ProfileService,
    private authService: AuthService,
    private uiService: UiService,
    private gaService: GoogleAnalyticsService
  ) {}

  async ngOnInit() {
    this.profile = await this.authService.profile();
    this.checkMobile();
  }
  titleEmergency: string = "¿Cómo le podemos ayudar?";

  emergencia() {
    this.medEmergency = true;
    this.gaService.trackEvent(AnaliticEvents.BV_CA_TEM_BTN);
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }

  async save(mobile) {
    var profile2: Profile = {};
    profile2.phone = mobile;
    profile2.email = await this.authService.email();

    this.profileService.update(profile2).subscribe(
      async (response: AppHttpResponse<Profile>) => {
        if (response.hasErrors) {
          this.uiService.toast(response.errors[0].errorDescription);
        } else {
          var savedProfile: Profile = await this.authService.profile();
          savedProfile.phone = profile2.phone;
          await this.authService.saveProfile(savedProfile);
        }
      },
      (error: TrackHttpError) => {
        console.log(error.friendlyMessage);
      }
    );
    this.celular = true;
    this.inicio = true;
  }

  async checkMobile() {
    this.celular = true;
    this.profile.email = await this.authService.email();
    var phone = await this.profile.phone;
    if (phone == null) {
      this.celular = false;
      this.cambiarVista();
    } else {
      this.celular = true;
      this.cambiarVista();
    }
  }

  cambiarVista() {
    if (this.celular == true) {
      this.celular = true;
      this.inicio = true;
    }
  }

  onFormSubmit(form: NgForm) {
    this.isValidFormSubmitted = false;
    if (form.invalid) {
      return;
    }
    this.isValidFormSubmitted = true;
    let user: UserMobile = form.value;
    this.save(user.mobileNumber);
  }

  onFeelBad() {
    this.isFeelBad = true;
    this.gaService.trackEvent(AnaliticEvents.BV_CA_MSM_BTN);
  }
}

export class UserMobile {
  mobileNumber?: string;
}
