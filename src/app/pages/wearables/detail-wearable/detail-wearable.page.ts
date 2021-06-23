import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalErrorComponent } from "@app/components/modal-error/modal-error.component";
import { ModalGenericConfirmComponentComponent } from "@app/components/modal-generic-confirm-component/modal-generic-confirm-component.component";
import { ModalNotConnectionComponent } from "@app/components/modal-not-connection/modal-not-connection.component";
import { NavigationBackService } from "@app/services/navigation-back.service";
import { WearablesService } from "@app/services/wearables.service";
import { ModalController } from "@ionic/angular";
import { HealthStepsService } from "@services/health.service";

@Component({
  selector: "app-detail-wearable",
  templateUrl: "./detail-wearable.page.html",
  styleUrls: ["./detail-wearable.page.scss"],
})
export class DetailWearablePage implements OnInit {
  public title = "Aplicaciones y dispositivos";
  public _appName: string;
  public _appIcon: string;
  public _appDescription: string;
  public _key: string;
  public _id: string;
  public _updateAt: string;
  public spinner: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private wearableService: WearablesService,
    private router: Router,
    private _modalController: ModalController,
    private healthStepsService: HealthStepsService,
    private navigationBackService: NavigationBackService
  ) {}

  ngOnInit() {
    this._appIcon = this.route.snapshot.queryParamMap.get("image");
    this._key = this.route.snapshot.queryParamMap.get("key");
    this._appDescription = this.route.snapshot.queryParamMap.get("desc");
    this._appName = this.route.snapshot.queryParamMap.get("name");
    this._id = this.route.snapshot.queryParamMap.get("id");
    this._updateAt = this.route.snapshot.queryParamMap.get("updateAt");

    const elem = document.getElementsByClassName("content-title");
    Array.from(elem).forEach((el: any) => {
      el.style.width = "50vw";
    });
  }

  disconect() {
    if (this._key == "apple") {
      console.log("Desconectado Apple Health");
      this.healthStepsService.disconnect();
      this.navigationBackService.revertTo("/home");
      setTimeout(() => {
        this.router.navigate(["/wearables"]);
      }, 100);
    } else {
      this.spinner = true;
      this.wearableService.disconect(this._id).subscribe(
        (res: any) => {
          console.log("Desconectado");
          this.navigationBackService.revertTo("/home");
          setTimeout(() => {
            this.router.navigate(["/wearables"]);
          }, 100);
        },
        (error: HttpErrorResponse) => {
          if (!window.navigator.onLine) {
            return;
          }
          this.errorModal();
        }
      );
    }
  }

  async openConfirmModal() {
    if (!window.navigator.onLine) {
      this.notInternetModal();
      return;
    }

    this.desconectarModal();
  }

  async errorModal() {
    let modalConfirm = await this._modalController.create({
      component: ModalErrorComponent,
      cssClass: "disconect-modal-wearables",
      componentProps: {
        modalTitle: "Hubo un error al obtener las conexiones",
        modalDescription: "",
        modalConfirmButtonText: "SI, DESCONECTAR",
        modalCancelButtonText: "CANCELAR",
        modalIconPath: "/assets/wearables/list/disconect.svg",
      },
    });
    modalConfirm.onWillDismiss().then((res) => {
      if (res.data != undefined) {
        if (res.data.dismissed == "CANCELAR") {
          let ele = window.document.getElementsByClassName(
            "disconect-modal-wearables"
          );
          Array.from(ele).forEach((el: any) => {
            el.parentNode.removeChild(el);
          });
        }
      }
    });
    return modalConfirm.present();
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

  async desconectarModal() {
    let modalConfirm = await this._modalController.create({
      component: ModalGenericConfirmComponentComponent,
      cssClass: "disconect-modal-wearables",
      componentProps: {
        modalTitle: "¿Está seguro de desea desconectar su dispositivo?",
        modalDescription: "",
        modalConfirmButtonText: "SI, DESCONECTAR",
        modalCancelButtonText: "CANCELAR",
        modalIconPath: "/assets/wearables/list/disconect.svg",
      },
    });
    modalConfirm.onWillDismiss().then((res) => {
      if (res.data != undefined) {
        if (res.data.dismissed == "SI, DESCONECTAR") {
          if (!window.navigator.onLine) {
            this.notInternetModal();
            return;
          }
          this.disconect();
        }
      }
    });
    return modalConfirm.present();
  }
}
