import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { MessageEnum } from "@app/enums/message-enum";
import { DacadooQuestions } from "@app/interfaces/dacadoo-question.interface";
import { BodyService } from "@app/services/body.service";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { ModalService } from "@app/services/modal.service";
import { ToastService } from "@app/services/toast.service";

@Component({
  selector: "app-body-survey",
  templateUrl: "./body-survey.component.html",
  styleUrls: ["./body-survey.component.scss"],
})
export class BodySurveyComponent implements OnInit {
  @Input() private showBodySurvey: boolean;
  @Output()
  private showBodySurveyChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  public selectedCategory: string = "HEART";
  public bodySurveyQuestions: DacadooQuestions;
  public isSubmit: boolean = false;
  public isLoading: boolean = false;
  public categories: string[] = ["HEART", "HIPERTENSION", "DIABETES", "RENAL"];

  constructor(
    private bodyService: BodyService,
    private toastService: ToastService,
    private gaService: GoogleAnalyticsService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getBodySurveyQuestions();
    this.gaService.trackEvent(AnaliticEvents.CU_VM_BT);
  }

  getBodySurveyQuestions() {
    this.bodyService.getBodySurveyQuestions().subscribe((response) => {
      this.bodySurveyQuestions = response as DacadooQuestions;
      console.log(this.bodySurveyQuestions);
    });
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

    this.gaService.trackEvent(
      segmentId == "seg-" + this.categories[0]
        ? AnaliticEvents.CU_CYS_BTN
        : segmentId == "seg-" + this.categories[1]
        ? AnaliticEvents.CU_HT_BTN
        : segmentId == "seg-" + this.categories[2]
        ? AnaliticEvents.CU_DI_BTN
        : AnaliticEvents.CU_ERC_BTN
    );
  }

  save() {
    if (this.selectedCategory === this.categories[this.categories.length - 1]) {
      //save
      this.gaService.trackEvent(AnaliticEvents.CU_GU_BTN);
      this.sendAnaliticsQuestionsResponse();

      this.isLoading = true;
      this.bodyService
        .saveBodySurveyQuestions(this.bodySurveyQuestions)
        .subscribe(
          (response) => {
            if (response) {
              this.showConfirmAddMessageSaved();
            }
          },
          null,
          () => {
            setTimeout(() => {
              this.isLoading = false;
            }, 1000);
            this.showBodySurveyChange.emit(false);
          }
        );
    } else {
      //select next category
      this.gaService.trackEvent(AnaliticEvents.CU_SIG_BTN);

      for (let index = 0; index < this.categories.length; index++) {
        if (this.categories[index] === this.selectedCategory) {
          this.selectedCategory = this.categories[index + 1];
          setTimeout(() => {
            this.focusSegment("seg-" + this.selectedCategory);
          }, 200);
          return;
        }
      }
    }
  }

  async showConfirmAddMessageSaved() {
    await this.modalService.showConfirmAddMessage("body");
  }

  sendAnaliticsQuestionsResponse() {
    this.bodySurveyQuestions.HEART.forEach((element) => {
      if (
        element.id == "pmi" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_HTI_BTN, element.value);
      if (
        element.id == "afn" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_HTA_BTN, element.value);
      if (
        element.id == "lvh" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_HTH_BTN, element.value);
      if (
        element.id == "chf" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_DIC_BTN, element.value);
      if (
        element.id == "fcv" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_AFM_BTN, element.value);
      if (
        element.id == "fmi" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_AFI_BTN, element.value);
    });

    this.bodySurveyQuestions.DIABETES.forEach((element) => {
      if (
        element.id == "dm2" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_HSDD_BTN, element.value);
      if (
        element.id == "fmd" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_AFD_BTN, element.value);
    });

    this.bodySurveyQuestions.RENAL.forEach((element) => {
      if (
        element.id == "cdk" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_ERCD_BTN, element.value);
    });

    this.bodySurveyQuestions.HIPERTENSION.forEach((element) => {
      if (
        element.id == "hyt" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_TH_BTN, element.value);
      if (
        element.id == "tht" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_THM_BTN, element.value);
      if (
        element.id == "pht" &&
        element.value !== null &&
        element.value !== undefined
      )
        this.gaService.trackEvent(AnaliticEvents.CU_THA_BTN, element.value);
    });
  }
}
