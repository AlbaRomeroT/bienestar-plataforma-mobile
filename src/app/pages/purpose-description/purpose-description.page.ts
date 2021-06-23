import { Purpose } from "@app/interfaces/purpose.interface";
import { Component, OnInit } from "@angular/core";
import { ModalController, Platform } from "@ionic/angular";
import { ModalConfirmComponent } from "@app/components/modal-confirm/modal-confirm.component";
import { ActivatedRoute, Router } from "@angular/router";
import { forkJoin, Subject } from "rxjs";
import { ModalAlertComponent } from "../../components/modal-alert/modal-alert.component";
import { takeUntil } from "rxjs/operators";
import { ToastService } from "@app/services/toast.service";
import { MessageEnum } from "@app/enums/message-enum";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { DacadooPurposesService } from "@app/services/dacadoo-purposes.service";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import * as _ from "lodash";
import { NavigationBackService } from "@app/services/navigation-back.service";

@Component({
  selector: "app-purpose-description",
  templateUrl: "./purpose-description.page.html",
  styleUrls: ["./purpose-description.page.scss"],
})
export class PurposeDescriptionPage implements OnInit {
  title: string = "Propósitos";
  pathReturn: string = "";
  purposeKey: string = "";
  purpose: Purpose = {};
  subscriptions = new Subject();
  showSpinner = false;

  constructor(
    private router: Router,
    private iab: InAppBrowser,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private modalController: ModalController,
    private dacadooPurposesService: DacadooPurposesService,
    private navigationBackService: NavigationBackService,
    private plt: Platform
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    var snapshot = this.route.snapshot;
    this.purposeKey = snapshot.paramMap.get("key");
    console.log("PATHRETURN", this.pathReturn);
    await this.getPurpose(this.purposeKey);
  }

  ionViewDidLeave(): void {
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  async getPurpose(purposeKey: string) {
    this.showSpinner = true;

    var responseServices = forkJoin({
      purpose: this.dacadooPurposesService.getByKey(purposeKey),
      userPurposes: this.dacadooPurposesService.get(),
    });

    responseServices.pipe(takeUntil(this.subscriptions)).subscribe(
      ({ purpose, userPurposes }) => {
        this.showSpinner = false;

        let exists = _.find(userPurposes.body.data, {
          message: this.purposeKey,
        });

        if (exists) {
          console.log("PURPOSE => ", exists);
          this.purpose = exists;
          return;
        }
        this.purpose = purpose.body.data[0];
        console.log("PURPOSE => ", this.purpose);
      },
      (error: TrackHttpError) => {
        this.showSpinner = false;
        console.log(error);
      }
    );
  }

  async onAdd() {
    this.showSpinner = true;

    this.dacadooPurposesService
      .addToUser(this.purpose.key)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response) => {
          this.showSpinner = false;
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return;
          }

          this.showConfirmAddMessage();
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          console.log(error);
        }
      );
  }

  async showConfirmAddMessage() {
    let profileModal = await this.modalController.create({
      component: ModalAlertComponent,
      cssClass: "activities-actions-modal-add",
      componentProps: {
        title: "Se han guardado sus datos con éxito",
        description: "",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      this.navigationBackService.revertTo("/purpose");
      this.router.navigate(["purpose"]);
    });

    return await profileModal.present();
  }

  async onRemove() {
    let profileModal = await this.modalController.create({
      component: ModalConfirmComponent,
      cssClass: "activities-actions-modal-delete",
      componentProps: {
        title: "¿Está seguro de querer eliminar este propósito?",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      if (res?.data?.dismissed) {
        this.remove();
      }
    });

    return await profileModal.present();
  }

  async remove() {
    this.showSpinner = true;

    this.dacadooPurposesService
      .removeToUser(this.purpose.id)
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response) => {
          this.showSpinner = false;

          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return;
          }
          this.toastService.showMessage(MessageEnum.SUCCESS_SAVE);
          this.navigationBackService.revertTo("/purpose");
          this.router.navigate(["purpose"]);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          console.log(error);
        }
      );
  }

  openExternaLink(url: string) {
    const option: InAppBrowserOptions = {
      zoom: "no",
    };

    if (this.plt.is("ios")) {
      this.iab.create(url, "_system", option);
    } else {
      this.iab.create(url, "_self", option);
    }
  }
}
