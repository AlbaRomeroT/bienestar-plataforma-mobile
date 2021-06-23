import { Component, OnInit, ViewChild } from "@angular/core";
import { Purpose } from "@app/interfaces/purpose.interface";
import { StoreService } from "@app/services/store.service";
import { Router } from "@angular/router";
import {
  ModalController,
  IonInfiniteScroll,
  ViewDidEnter,
} from "@ionic/angular";
import { ModalAlertComponent } from "@app/components/modal-alert/modal-alert.component";
import { AuthService } from "../../services/auth.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { ToastService } from "../../services/toast.service";
import { MessageEnum } from "@app/enums/message-enum";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { DacadooPurposesService } from "@app/services/dacadoo-purposes.service";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { NavigationBackService } from "../../services/navigation-back.service";

@Component({
  selector: "app-purpose-add",
  templateUrl: "./purpose-add.page.html",
  styleUrls: ["./purpose-add.page.scss"],
})
export class PurposeAddPage implements OnInit, ViewDidEnter {
  public purposes: Purpose[];
  public selectedCategory;
  private countScroll: number = 15;
  public maxShow: number;
  subscriptions = new Subject();
  showSpinner = false;

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild("pageTop") pageTop: any;

  constructor(
    private authService: AuthService,
    private purposeService: DacadooPurposesService,
    private storeService: StoreService,
    private router: Router,
    private dacadooPurposesService: DacadooPurposesService,
    private toastService: ToastService,
    private modalController: ModalController,
    private gaService: GoogleAnalyticsService,
    private navigationBackService: NavigationBackService
  ) {}

  ionViewDidEnter() {
    this.maxShow = this.countScroll;
    this.infiniteScroll.disabled = false;
    this.selectedCategory = "all";
    this.pageTop.scrollToTop();
    setTimeout(() => {
      this.focusSegment("seg-all");
    }, 100);
    this.getPurposes();
  }

  ngOnInit() {}

  async getPurposes() {
    this.showSpinner = true;
    this.purposeService.getAll().subscribe((response) => {
      this.showSpinner = false;

      if (response.hasErrors) {
        this.toastService.showMessage(
          MessageEnum.ERROR_GET,
          null,
          null,
          "top",
          "danger"
        );
        return;
      }
      this.purposes = response.body.data.filter(this.toOmit);
      console.log("purposes",this.purposes);
    });
  }

  async showConfirmAddMessage() {
    let profileModal = await this.modalController.create({
      component: ModalAlertComponent,
      cssClass: "activities-actions-modal-add",
      componentProps: {
        title: "Propósito añadido",
        description: "Desde este momento el reto iniciará automáticamente",
      },
    });

    profileModal.onDidDismiss().then((res) => {
      this.navigationBackService.revertTo("/purpose");
      this.router.navigate(["purpose"]);
    });

    return await profileModal.present();
  }

  toOmit(x: any) {
    return x.availability == "available";
  }

  getLeadTextClear(text: string) {
    if (!text) return null;
    return text.slice(text.lastIndexOf("]") + 1);
  }

  focusSegment(segmentId: string) {
    let element = document.getElementById(segmentId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
    }
  }

  viewPurposeDetail(purpose: Purpose) {
    this.sendAnaliticsPurposeView(purpose);
    purpose.message = purpose.key;
    this.router.navigate([`purpose-description/${purpose.key}`]);
  }

  async onAdd(purpose: Purpose) {
    this.showSpinner = true;
    this.sendAnaliticsPurposeAdd(purpose);
    this.dacadooPurposesService
      .addToUser(purpose.key)
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

  showMore(event) {
    setTimeout(() => {
      this.maxShow += this.countScroll;
      this.infiniteScroll.complete();
      if (this.maxShow >= this.purposes.length && this.infiniteScroll) {
        this.infiniteScroll.disabled = true;
      }
    }, 100);
  }

  sendAnaliticsPurposeAdd(purpose: Purpose) {
    if (purpose.key == "cycling_novice")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_TPM_BTN);
    if (purpose.key == "walk_marathon_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_CM_BTN);
    if (purpose.key == "running_solid")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_ERC_BTN);
    if (purpose.key == "steps_burning_food_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_PQA_BTN);
    if (purpose.key == "steps_goal_8000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_DPM_BTN);
    if (purpose.key == "steps_goal_5000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_MPM_BTN);
    if (purpose.key == "walking_regular")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_MSR_BTN);
    if (purpose.key == "cycling_solid")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_QLD_BTN);
    if (purpose.key == "steps_goal_3000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_PEM_BTN);
    if (purpose.key == "steps_goal_10000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_EVA_BTN);
    if (purpose.key == "running_novice")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_MMC_BTN);
    if (purpose.key == "cycling_regular")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_HME_BTN);

    if (purpose.key == "coffee_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_EV_TCA_BTN);
    if (purpose.key == "morning_yoga_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_EV_EDY_BTN);

    if (purpose.key == "medication_reminder_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RTM_BTN);
    if (purpose.key == "blood_pressure_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RPA_BTN);
    if (purpose.key == "blood_glucose_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RNG_BTN);
    if (purpose.key == "blood_glucose_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RNG_BTN);

    if (purpose.key == "nutrition_p_fi_8")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RCC_BTN);
    if (purpose.key == "nutrition_p_fi_3")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AEV_BTN);
    if (purpose.key == "nutrition_p_fi_2")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ACV_BTN);
    if (purpose.key == "nutrition_p_eah_7")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_PCD_BTN);
    if (purpose.key == "nutrition_p_eah_1")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_MHA_BTN);
    if (purpose.key == "oil_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AUC_BTN);
    if (purpose.key == "nutrition_p_eah_2")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_CMS_BTN);
    if (purpose.key == "nutrition_p_fi_12")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RCD_BTN);
    if (purpose.key == "nutrition_p_eah_6")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_EMC_BTN);
    if (purpose.key == "nutrition_p_bev_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RCR_BTN);
    if (purpose.key == "salt_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AMS_BTN);
    if (purpose.key == "nutrition_p_fi_6")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ILD_BTN);
    if (purpose.key == "fried_food_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RAF_BTN);
    if (purpose.key == "nutrition_p_eah_3")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_CCP_BTN);
    if (purpose.key == "nutrition_p_fi_9")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AFS_BTN);
    if (purpose.key == "nutrition_p_eah_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_DDP_BTN);
    if (purpose.key == "nutrition_p_fi_7")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_IMP_BTN);
    if (purpose.key == "nutrition_p_fi_1")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_IMF_BTN);
    if (purpose.key == "nutrition_p_bev_3")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_BMA_BTN);
    if (purpose.key == "alcohol_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_CAC_BTN);
    if (purpose.key == "nutrition_p_fi_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ICI_BTN);
    if (purpose.key == "nutrition_p_fi_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ICI_BTN);
  }

  sendAnaliticsPurposeView(purpose: Purpose) {
    if (purpose.key == "cycling_novice")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_TPM_VM_BTN);
    if (purpose.key == "walk_marathon_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_CM_VM_BTN);
    if (purpose.key == "running_solid")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_ERC_VM_BTN);
    if (purpose.key == "steps_burning_food_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_PQA_VM_BTN);
    if (purpose.key == "steps_goal_8000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_DPM_VM_BTN);
    if (purpose.key == "steps_goal_5000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_MPM_VM_BTN);
    if (purpose.key == "walking_regular")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_MSR_VM_BTN);
    if (purpose.key == "cycling_solid")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_QLD_VM_BTN);
    if (purpose.key == "steps_goal_3000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_PEM_VM_BTN);
    if (purpose.key == "steps_goal_10000")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_EVA_VM_BTN);
    if (purpose.key == "running_novice")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_MMC_VM_BTN);
    if (purpose.key == "cycling_regular")
      this.gaService.trackEvent(AnaliticEvents.MP_AC_HME_VM_BTN);

    if (purpose.key == "coffee_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_EV_TCA_VM_BTN);
    if (purpose.key == "morning_yoga_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_EV_EDY_VM_BTN);

    if (purpose.key == "medication_reminder_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RTM_VM_BTN);
    if (purpose.key == "blood_pressure_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RPA_VM_BTN);
    if (purpose.key == "blood_glucose_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RNG_VM_BTN);
    if (purpose.key == "blood_glucose_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_CU_RNG_VM_BTN);

    if (purpose.key == "nutrition_p_fi_8")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RCC_VM_BTN);
    if (purpose.key == "nutrition_p_fi_3")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AEV_VM_BTN);
    if (purpose.key == "nutrition_p_fi_2")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ACV_VM_BTN);
    if (purpose.key == "nutrition_p_eah_7")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_PCD_VM_BTN);
    if (purpose.key == "nutrition_p_eah_1")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_MHA_VM_BTN);
    if (purpose.key == "oil_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AUC_VM_BTN);
    if (purpose.key == "nutrition_p_eah_2")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_CMS_VM_BTN);
    if (purpose.key == "nutrition_p_fi_12")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RCD_VM_BTN);
    if (purpose.key == "nutrition_p_eah_6")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_EMC_VM_BTN);
    if (purpose.key == "nutrition_p_bev_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RCR_VM_BTN);
    if (purpose.key == "salt_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AMS_VM_BTN);
    if (purpose.key == "nutrition_p_fi_6")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ILD_VM_BTN);
    if (purpose.key == "fried_food_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_RAF_VM_BTN);
    if (purpose.key == "nutrition_p_eah_3")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_CCP_VM_BTN);
    if (purpose.key == "nutrition_p_fi_9")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_AFS_VM_BTN);
    if (purpose.key == "nutrition_p_eah_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_DDP_VM_BTN);
    if (purpose.key == "nutrition_p_fi_7")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_IMP_VM_BTN);
    if (purpose.key == "nutrition_p_fi_1")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_IMF_VM_BTN);
    if (purpose.key == "nutrition_p_bev_3")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_BMA_VM_BTN);
    if (purpose.key == "alcohol_goal")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_CAC_VM_BTN);
    if (purpose.key == "nutrition_p_fi_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ICI_VM_BTN);
    if (purpose.key == "nutrition_p_fi_5")
      this.gaService.trackEvent(AnaliticEvents.MP_NU_ICI_VM_BTN);
  }
}
