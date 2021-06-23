import { Component, OnInit } from "@angular/core";
import { MessageEnum } from "@app/enums/message-enum";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { Purpose, PurposeResponse } from "@app/interfaces/purpose.interface";
import { ToastService } from "../../services/toast.service";
import { takeUntil } from "rxjs/operators";
import { ModalController } from "@ionic/angular";
import { ModalConfirmComponent } from "../../components/modal-confirm/modal-confirm.component";
import { Subject } from "rxjs";
import { Router } from "@angular/router";
import { DacadooPurposesService } from "@app/services/dacadoo-purposes.service";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";

@Component({
  selector: "app-purpose",
  templateUrl: "./purpose.page.html",
  styleUrls: ["./purpose.page.scss"],
})
export class PurposePage implements OnInit {
  statuses = {
    completed: "completed",
    actives: "actives",
  };

  sections = {
    empty: "empty",
    purposes: "purposes",
  };

  title: string = "Mis propósitos";
  sectiontToShow: string = "";
  selectedStatus: string;
  purposes: Purpose[] = [];
  isEdit: boolean;
  subscriptions = new Subject();
  completedDisable: boolean;
  showSpinner = false;

  constructor(
    private dacadooPurposesService: DacadooPurposesService,
    private toastService: ToastService,
    private modalController: ModalController,
    private router: Router,
    private gaService: GoogleAnalyticsService
  ) {}

  async ngOnInit() {}

  async ionViewDidEnter() {
    this.completedDisable = true;
    this.selectedStatus = this.statuses.actives;
    this.isEdit = false;
    this.purposes = [];

    await this.getPurposes();
  }

  ionViewDidLeave(): void {
    this.purposes = [];
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  async getPurposes() {
    this.showSpinner = true;

    this.dacadooPurposesService
      .get()
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<PurposeResponse>) => {
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

          this.purposes = response.body.data;
          console.log("PURPOSES =>", this.purposes);

          if (this.purposes.some((e) => e.completed)) {
            this.completedDisable = false;
          }

          if (this.purposes.length > 0) {
            this.sectiontToShow = this.sections.purposes;
          } else {
            this.sectiontToShow = this.sections.empty;
          }
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          console.log(error);
        }
      );
  }

  onEdit() {
    this.gaService.trackEvent(AnaliticEvents.MP_EP_BTN);
    this.isEdit = !this.isEdit;
    console.log("EDIT ", this.isEdit);
  }

  onSave() {
    if (this.purposes.length > 0) {
      this.sectiontToShow = this.sections.purposes;
    } else {
      this.sectiontToShow = this.sections.empty;
    }
    this.isEdit = false;
  }

  statusChanged(event) {
    this.selectedStatus = event.detail.value;
    this.focusSegment(this.selectedStatus);
  }

  focusSegment(segment: string) {
    var segmentId = `seg-${segment}`;
    document.getElementById(segmentId).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  async onRemove(purpose: Purpose) {
    let profileModal = await this.modalController.create({
      component: ModalConfirmComponent,
      cssClass: "activities-actions-modal-delete",
      componentProps: {
        title: "¿Está seguro de querer eliminar este propósito?",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      if (res?.data?.dismissed) {
        this.remove(purpose);
      }
    });

    return await profileModal.present();
  }

  async remove(purpose: Purpose) {
    this.showSpinner = true;

    this.dacadooPurposesService
      .removeToUser(purpose.id)
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
          this.getPurposes();
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

  goToAddPurpose() {
    this.gaService.trackEvent(AnaliticEvents.MP_AP_BTN);
    this.router.navigate(["/purpose-add"]);
  }
}
