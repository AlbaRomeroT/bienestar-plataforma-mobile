import { Component, NgZone, OnInit } from "@angular/core";
import { ModalGenericConfirmComponentComponent } from "@app/components/modal-generic-confirm-component/modal-generic-confirm-component.component";
import { ModalController, Platform } from "@ionic/angular";
import { ActivatedRoute, Router } from "@angular/router";
import { HealthStepsService } from "@app/services/health.service";
import { WearablesService } from "@app/services/wearables.service";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import { ModalAlertComponent } from "@app/components/modal-alert/modal-alert.component";
import { Subscription } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { ModalNotConnectionComponent } from "@app/components/modal-not-connection/modal-not-connection.component";
import { NavigationBackService } from "@app/services/navigation-back.service";

@Component({
  selector: "app-connect-page",
  templateUrl: "./connect-page.page.html",
  styleUrls: ["./connect-page.page.scss"],
})
export class ConnectPagePage implements OnInit {
  public key;
  public _title: string;
  public _appName: string;
  public _appIcon: string;
  public _appDescription: string;
  public _urlCloseEvent: string = "https://dacadoo.com/";
  public tryIntervalConnect = true;
  public intervalConnect;
  public timesIntervalConect = 0;
  //solo para ios
  private healthConnectedSubscription: Subscription = null;
  private subcribeResume: any;

  constructor(
    private _modalController: ModalController,
    private _activateRoute: ActivatedRoute,
    private healthStepsService: HealthStepsService,
    private _wearablesService: WearablesService,
    private _iab: InAppBrowser,
    private _router: Router,
    private ngZone: NgZone,
    private platform: Platform,
    private wearableService: WearablesService,
    private navigationBackService: NavigationBackService
  ) {
    this._title = "Aplicaciones y Dispositivos";
    this._appName = "Health";
    this._appIcon = "/assets/wearables/list/google-fit.svg";
  }

  ngOnInit() {
    this._activateRoute.queryParams.subscribe((params) => {
      this.key = params.key;
      this._appName = params.name;
      this._appIcon = params.image;
      this._appDescription = params.desc;
    });

    const elem = document.getElementsByClassName("content-title");
    Array.from(elem).forEach((el: any) => {
      el.style.width = "50vw";
    });
    this.platform.ready().then(() => {
      if (this.platform.is("ios")) {
        this.healthConnectedSubscription = this.healthStepsService.healthConnectedObservable.subscribe(
          () => {
            if (this.healthStepsService.isHealthServiceConnected()) {
              this.openContinueModal();
            }
          }
        );
      }
    });
    this.onFocusAppEvent();
  }

  ngOnDestroy() {
    if (this.platform.is("ios")) {
      this.healthConnectedSubscription.unsubscribe();
    }
  }

  private onFocusAppEvent(): void {
    this.subcribeResume = this.platform.resume.subscribe(() => {
      this.onFocusAppEventContinueModal();
    });
  }

  private onFocusAppEventContinueModal(): void {
    if (this.tryIntervalConnect) {
      this.tryIntervalConnect = false;
      if (this.key === "apple") {
        return;
      }
      this.intervalConnect = setInterval(() => {
        this.searchStatusConnetion(this.key);
        this.timesIntervalConect = this.timesIntervalConect + 1;
        if (this.timesIntervalConect > 20) {
          clearInterval(this.intervalConnect);
        }
      }, 3000);
    }
  }

  ionViewWillLeave() {
    this.subcribeResume.unsubscribe();
    clearInterval(this.intervalConnect);
  }

  /**
   * Modal confirmaci\u00f3n.
   */
  async openConfirmModal() {
    if (!window.navigator.onLine) {
      this.notInternetModal();
      return;
    }

    let modalConfirm = await this._modalController.create({
      component: ModalGenericConfirmComponentComponent,
      cssClass: "generic-action-modal",
      componentProps: {
        modalTitle: "¿Está seguro de desea conectar su dispositivo?",
        modalDescription:
          "Se abrir\u00e1 una pantalla externa para que inicie sesi\u00f3n en la aplicaci\u00f3n que est\u00e1 intentando acceder.",
        modalConfirmButtonText: "ACEPTAR",
        modalCancelButtonText: "CANCELAR",
        modalIconPath: "/assets/wearables/list/shape.svg",
      },
    });
    modalConfirm.onWillDismiss().then((res) => {
      if (res.data != undefined) {
        if (res.data.dismissed == "ACEPTAR") {
          if (!window.navigator.onLine) {
            this.notInternetModal();
            return;
          }
          this.connect();
        }
      }
    });
    return await modalConfirm.present();
  }

  /**
   * Modal continuaci\u00f3n.
   */
  async openContinueModal() {
    let profileModal = await this._modalController.create({
      component: ModalAlertComponent,
      cssClass: "activities-actions-modal-add",
      componentProps: {
        title: "¡Su conexi\u00f3n fue exitosa!",
        description: "",
        icon: "/assets/wearables/list/connected.svg",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      setTimeout(() => {
        this.navigationBackService.revertTo("/home");
        this._router.navigate(["/wearables"]);
      }, 100);
    });
    return await profileModal.present();
  }

  /**
   * Conexi\u00f3n dispositivo.
   */
  private connect(): void {
    switch (this.key) {
      case "apple": {
        this.appleConnect();
        break;
      }
      default:
        this.doConnectWeb();
    }
  }

  private appleConnect() {
    this.healthStepsService.initStepsRead();
  }

  private doConnectWeb(): void {
    this._wearablesService.createConnection(this.key).subscribe((response) => {
      this.openExternaLink(response.body.links[0].href);
    });
  }

  private openExternaLink(url: string) {
    const option: InAppBrowserOptions = {
      zoom: "no",
    };
    let openType = "_system";
    this._iab.create(url, openType, option);
  }

  searchStatusConnetion(key) {
    if (!window.navigator.onLine) {
      return;
    }
    this.wearableService.getConnected().subscribe(
      (connecteds: any) => {
        let conneds = connecteds.body.data;
        conneds.forEach((element) => {
          if (element.service == key && element.status == "connected") {
            this.openContinueModal();
            clearInterval(this.intervalConnect);
          }
        });
      },
      (error: HttpErrorResponse) => {
        console.log(error.message);
      }
    );
  }

  async notInternetModal() {
    let profileModal = await this._modalController.create({
      component: ModalNotConnectionComponent,
      cssClass: "activities-actions-modal-save",
      componentProps: {
        action: "save",
        description: "Pruebe nuevamente ahora o en un par de minutos",
      },
    });

    profileModal.onWillDismiss().then((res) => {
      if (res.data != undefined) {
        if (res.data.dismissed == "tryAgain") {
          this.openConfirmModal();
        }
      }
    });
    return profileModal.present();
  }
}
