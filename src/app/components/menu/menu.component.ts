import { Component, OnInit } from "@angular/core";
import { MenuController, ModalController } from "@ionic/angular";
import { AuthService } from "@app/services/auth.service";
import { Router, NavigationStart, Event } from "@angular/router";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { PersonalInfo } from "@app/interfaces/user/profile/user.interface";
import { ModalConfirmSignOutComponent } from "../modal-confirm-sign-out/modal-confirm-sign-out.component";
import { environment } from "@environments/environment";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.scss"],
})
export class MenuComponent implements OnInit {
  public userName = null;

  public personalInfo: PersonalInfo;

  public email = null;

  public photo = "/assets/menu/profile-without-photo.svg";

  public appPages = [
    {
      title: "Mi perfil",
      url: "/profile",
      image: "/assets/menu/icon-profile.svg",
    },
    {
      title: "Centro de ayuda",
      url: "/help-center",
      image: "/assets/menu/icon-audio.svg",
    },
    {
      title: "Información de Interés",
      url: "/interest-information",
      image: "/assets/menu/icon-info.svg",
    },
    {
      title: "Aplicaciones y dispositivos",
      url: "/wearables",
      image: "/assets/menu/app.svg",
    },
  ];

  public infoLogOut = {
    title: "Cerrar sesión",
    image: "/assets/menu/logout.svg",
  };

  interval: any;

  public isProduction: boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private authService: AuthService,
    private router: Router,
    private gaService: GoogleAnalyticsService,
    private modalController: ModalController
  ) {
    this.isProduction = environment.production;
  }

  ngOnInit() {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (
          event.url == "/" ||
          event.url == "/home" ||
          event.url.startsWith("/home?")
        ) {
          this.gaService.trackEvent(AnaliticEvents.HO_inicial_PAN);
        } else if (
          event.url == "/profile" ||
          event.url.startsWith("/profile?")
        ) {
          this.gaService.trackEvent(AnaliticEvents.PE_Perfil_PAN);
        } else if (event.url == "/login" || event.url.startsWith("/login?")) {
          this.gaService.trackEvent(AnaliticEvents.LO_Login_PAN);
        } else if (event.url == "/body" || event.url.startsWith("/body?")) {
          this.gaService.trackEvent(AnaliticEvents.BI_Cuerpo_PAN);
        } else if (
          event.url == "/feeling" ||
          event.url.startsWith("/feeling?")
        ) {
          this.gaService.trackEvent(AnaliticEvents.BI_Animo_PAN);
        } else if (event.url == "/coach" || event.url.startsWith("/coach?")) {
          this.gaService.trackEvent(AnaliticEvents.CO_Coach_PAN);
        } else if (
          event.url == "/purpose" ||
          event.url.startsWith("/purpose?")
        ) {
          this.gaService.trackEvent(AnaliticEvents.PR_Propositos_PAN);
        } else if (
          event.url == "/activities" ||
          event.url.startsWith("/activities?")
        ) {
          this.gaService.trackEvent(
            AnaliticEvents.RA_Registrodeactividades_PAN
          );
        } else if (
          event.url == "/wellness" ||
          event.url.startsWith("/wellness?")
        ) {
          this.gaService.trackEvent(AnaliticEvents.BI_Bienestar_PAN);
        } else if (
          event.url == "/lifestyle" ||
          event.url.startsWith("/lifestyle?")
        ) {
          this.gaService.trackEvent(AnaliticEvents.BI_Miestilo_PAN);
        }

        this.loadUserData();
        setTimeout(() => {
          this.loadUserData();
        }, 500);
      }
    });
  }

  async showConfirmLogOutMessage() {
    let menuModal = await this.modalController.create({
      component: ModalConfirmSignOutComponent,
      cssClass: "sign-out-actions-modal",
      componentProps: {
        title: "¿Esta seguro de cerrar sesión?",
      },
    });

    menuModal.onDidDismiss().then((res) => {
      console.log("onDidDismiss", res.data.dismissed);
      if (res.data.dismissed) {
        this.logout();
      }
    });

    return menuModal.present();
  }

  async logout() {
    await this.authService.logout();
  }

  async loadUserData() {
    let profile = await this.authService.profile();
    this.email = profile.email;
    this.userName = profile.name;
  }

  fromMenuToPage(page) {
    this.router.navigateByUrl(page.url);
  }

  menuToggle() {
    this.menuCtrl.toggle();
  }
}