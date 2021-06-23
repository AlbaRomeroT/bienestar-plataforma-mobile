import { HttpErrorResponse } from "@angular/common/http";
import { Component, NgZone, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { ModalErrorComponent } from "@app/components/modal-error/modal-error.component";
import { ModalNotConnectionComponent } from "@app/components/modal-not-connection/modal-not-connection.component";
import { WearablesService } from "@app/services/wearables.service";
import { CONNECTIONS_TEXTS } from "@assets/wearable/connections-texts.const";
import { WEARABLES } from "@assets/wearable/list.const";
import { ModalController, Platform } from "@ionic/angular";
import { HealthStepsService } from "@services/health.service";

@Component({
  selector: "app-wearables",
  templateUrl: "./wearables.page.html",
  styleUrls: ["./wearables.page.scss"],
})
export class WearablesPage implements OnInit {
  public title = "Aplicaciones y dispositivos";
  public description =
    "Elija la aplicación que desea conectar para hacerle seguimiento a su estado de salud; la aplicación Bolívar Conmigo irá sincronizando toda la información que se vaya registrando. <br><br>" +
    "En caso de tener algún dispositivo inteligente conectado a la aplicación que seleccione, Bolívar Conmigo irá recolectando toda esa información.<br>" +
    "Le recomendamos usar un solo dispositivo para realizar este seguimiento. ";
  currentPlatform: string;
  wearables;
  connecteds: any[] = [];
  isHealthConnected = false;
  myConnections: any;
  error: boolean;
  mock = WEARABLES;
  playing = false;

  constructor(
    private platform: Platform,
    private router: Router,
    private wearableService: WearablesService,
    private ngZone: NgZone,
    private modalController: ModalController,
    private healthStepsService: HealthStepsService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.detectPlatform();
    }, 300);
    this.validConnecteds();

    const elem = document.getElementsByClassName("content-title");
    Array.from(elem).forEach((el: any) => {
      el.style.width = "50vw";
    });
  }

  ionViewDidEnter() {
    this.ngZone.run(() => {
      this.ngOnInit();
      this.playing = true;
    });
  }

  detectPlatform() {
    if (this.platform.is("ios")) {
      this.currentPlatform = "ios";
    } else if (this.platform.is("android")) {
      this.currentPlatform = "android";
    }
  }

  setup(key, dev?) {
    if (!window.navigator.onLine) {
      this.notInternetModal(dev, key);
      return;
    }

    let _id: string;

    this.myConnections.forEach((element) => {
      if (element.service === key && element.status === "connected") {
        _id = element.id;
      }
    });

    //Ir a la pantalla de conexión de apple
    if (key == "apple") {
      this.connectApple(dev, key);
      return;
    }
    //Si está conectado, ir hacia la pnatalla de desconectar
    if (dev.connected) {
      this.disconectWearable(dev, key, _id);
      return;
    }
    //Panatalla de conexión general
    this.connectWearable(dev, key, _id);
  }

  disconectWearable(dev, key, _id) {
    console.log(dev);

    this.router.navigate(["/wearables/detail-wearable"], {
      queryParams: {
        key: key,
        image: dev.image,
        desc: dev.description,
        name: dev.name,
        id: _id,
        updateAt: dev.updateAt,
      },
    });
  }

  connectWearable(dev, key, _id) {
    this.router.navigate(["/wearables/connect-page"], {
      queryParams: {
        key: key,
        image: dev.image,
        desc: dev.description,
        name: dev.name,
        id: _id,
      },
    });
  }

  connectApple(dev, key) {
    dev = {
      image: "/assets/wearables/list/apple.svg",
      description:
        "Puede sincronizar los datos almacenados en su aplicación de Apple Salud con Bolívar Conmigo.<br/><br/>Para editar los datos compartidos con Apple Salud, ingrese a la aplicación y busque Bolívar Conmigo en la pestaña de fuentes.<br/><br/>Su dispositivo se sincronizará aproximadamente cada hora.",
      name: "Aplicación de salud",
      updateAt: this.healthStepsService.getLastUpdate(),
    };

    if (this.healthStepsService.isHealthServiceConnected()) {
      this.router.navigate(["/wearables/detail-wearable"], {
        queryParams: {
          key: key,
          image: dev.image,
          desc: dev.description,
          name: dev.name,
          updateAt: dev.updateAt,
        },
      });
    } else {
      this.router.navigate(["/wearables/connect-page"], {
        queryParams: {
          key: key,
          image: dev.image,
          desc: dev.description,
          name: dev.name,
        },
      });
    }
  }

  getConnections() {
    return new Promise((resolve, reject) => {
      this.wearableService.get().subscribe(
        (connections: any) => {
          let data = connections.body.data;

          for (const elem of data) {
            for (const elem2 of CONNECTIONS_TEXTS) {
              if (elem.key === elem2.name) {
                elem.description = elem2.desc;
              }
            }
          }
          resolve(connections);
        },
        (error: HttpErrorResponse) => {
          if (!window.navigator.onLine) {
            return;
          }
          resolve(this.errorModal());
        }
      );
    });
  }

  //Obtiene las conexiones actuales
  getConnecteds(connections) {
    return new Promise((resolve, reject) => {
      this.wearableService.getConnected().subscribe(
        (connecteds: any) => {
          this.myConnections = connecteds.body.data;
          let connects = connections.body.data;
          let conneds = connecteds.body.data;
          this.addIfConnected(conneds);
          this.modData(connects);
          var array = this.excludeConnections(connects);
          this.connecteds = new Array();
          this.iosOther(array);
        },
        (error) => {
          if (!window.navigator.onLine) {
            return;
          }
          resolve(this.errorModal());
        }
      );
    });
  }

  validConnecteds() {
    this.getConnections().then((connections) => {
      this.getConnecteds(connections);
    });
  }

  addIfConnected(conneds) {
    conneds.forEach((element) => {
      if (element.status === "connected") {
        this.connecteds.push({
          service: element.service,
          updateAt: element.modificationTime,
        });
      }
    });
  }

  modData(connects) {
    for (const elem of connects) {
      for (const elem2 of this.mock) {
        if (elem.key === elem2.key) {
          elem.image = elem2.image;
        }
      }

      for (const elem3 of this.connecteds) {
        if (elem.key === elem3.service) {
          elem.connected = true;
          elem.updateAt = elem3.updateAt;
        }
      }
    }
  }

  excludeConnections(connects) {
    return connects.filter((element) => {
      return (
        element.key.toLowerCase().trim() !== "endomondo" &&
        element.key !== "suunto" &&
        element.key !== "polar" &&
        element.key.toLowerCase().trim() !== "com_seguros_bolivar_service" &&
        element.key.toLowerCase().trim() !== "com_dacadoo_importer"
      );
    });
  }

  iosOther(array) {
    if (this.currentPlatform === "ios") {
      let array2 = array.filter((element) => {
        return element.key.toLowerCase().trim() !== "googlefit";
      });
      this.wearables = array2;
      this.isHealthConnected = this.healthStepsService.isHealthServiceConnected();
    } else {
      this.wearables = array;
    }
  }

  async errorModal() {
    let modalConfirm = await this.modalController.create({
      component: ModalErrorComponent,
      componentProps: {
        modalTitle: "Hubo un error al obtener las conexiones",
        modalDescription: "",
        modalConfirmButtonText: "SI, DESCONECTAR",
        modalCancelButtonText: "CANCELAR",
        modalIconPath: "/assets/wearables/list/disconect.svg",
      },
      cssClass: "disconect-modal-wearables",
    });
    modalConfirm.onWillDismiss().then((resp) => {
      let data = resp.data;
      if (data != undefined) {
        if (data.dismissed == "CANCELAR") {
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

  async notInternetModal(dev, key) {
    let profileModal = await this.modalController.create({
      component: ModalNotConnectionComponent,
      componentProps: {
        action: "save",
        description: "Pruebe nuevamente ahora o en un par de minutos",
      },
      cssClass: "activities-actions-modal-save",
    });

    profileModal.onWillDismiss().then((response) => {
      if (response.data != undefined) {
        if (response.data.dismissed == "tryAgain") {
          this.setup(key, dev);
        }
      }
    });
    return profileModal.present();
  }
}
