import { DacadooQuestion } from "@app/interfaces/dacadoo-question.interface";
import { Component, OnInit } from "@angular/core";
import { DacadooQuestionResponse } from "../../interfaces/dacadoo-question.interface";
import { DacadooQuestionService } from "../../services/dacadoo-question.service";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { HealthScore } from "@app/models/health-score";
import { HealthScoreService } from "@app/services/health-score.service";
import { ToastService } from "@app/services/toast.service";
import { MessageEnum } from "@app/enums/message-enum";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { ModalService } from "@app/services/modal.service";

@Component({
  selector: "app-feeling",
  templateUrl: "./feeling.page.html",
  styleUrls: ["./feeling.page.scss"],
})
export class FeelingPage implements OnInit {
  private subcategories = {
    feeling: "feeling",
    body: "body",
    habits: "habits",
  };
  private subscriptions = new Subject();
  private loadGraph = true;

  public title: string = "Mente";
  public feelingQuestions: DacadooQuestionResponse;
  public selectedCategory: string = this.subcategories.feeling;
  public healthScoreData: HealthScore[];
  public showSpinner = false;
  public modalIsActive: boolean = false;

  constructor(
    private dacadooQuestionService: DacadooQuestionService,
    private healthScoreService: HealthScoreService,
    private gaService: GoogleAnalyticsService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    this.selectedCategory = this.subcategories.feeling;
    this.getFeelingQuestions();
    if (this.loadGraph) this.getHealthScoreHistorical();
  }

  ionViewDidLeave(): void {
    console.log("FEELING => ON DESTROY");
    this.subscriptions.next();
    this.subscriptions.complete();
  }

  async getFeelingQuestions() {
    this.showSpinner = true;

    this.dacadooQuestionService
      .getByCategory("feelings")
      .pipe(takeUntil(this.subscriptions))
      .subscribe(
        (response: AppHttpResponse<DacadooQuestionResponse>) => {
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
          this.feelingQuestions = response.body;
          this.setInitialValues(this.feelingQuestions.questionList.feeling);
          this.setInitialValues(this.feelingQuestions.questionList.body);
          this.setInitialValues(this.feelingQuestions.questionList.habits);
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

  setInitialValues(questions: DacadooQuestion[]) {
    for (var question of questions) {
      if (question.value == "") {
        question.value = question.response[0].default;
      }
      question.value = question.value * 10;
    }
  }

  getHealthScoreHistorical() {
    this.healthScoreService.getHealthScoreHistorical().subscribe((response) => {
      this.healthScoreData = response;
      console.log(this.healthScoreData);
    });
  }

  categoryChanged(event) {
    this.selectedCategory = event.detail.value;
    this.focusSegment(this.selectedCategory);
    this.gaService.trackEvent(
      this.selectedCategory == this.subcategories.feeling
        ? AnaliticEvents.ME_CS_BTN
        : this.selectedCategory == this.subcategories.body
        ? AnaliticEvents.ME_HDC_BTN
        : AnaliticEvents.ME_RSH_BTN
    );
  }

  focusSegment(segment: string) {
    var segmentId = `seg-${segment}`;
    document.getElementById(segmentId).scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  }

  buildDacadooResponse(): any[] {
    var response: any = {};
    for (var item in this.feelingQuestions?.questionList) {
      var subcategory: DacadooQuestion[] = this.feelingQuestions.questionList[
        item
      ];

      for (var question of subcategory) {
        response[question.id] = question.value / 10;
      }
    }
    return response;
  }

  async save() {
    var questions = this.buildDacadooResponse();
    this.sendAnaliticsQuestionsResponse(questions);
    this.gaService.trackEvent(AnaliticEvents.ME_GU_BTN);

    if (questions.length == 0) {
      return;
    }
    this.modalIsActive = true;
    this.showSpinner = true;
    this.dacadooQuestionService
      .saveFeeling("feelings", questions)
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
          this.modalIsActive = false;
          this.showConfirmAddMessageSaved();
          this.gaService.trackEvent(AnaliticEvents.AN_GU_BTN);
          setTimeout(() => {
            this.loadGraph = false;
            this.getHealthScoreHistorical();
            this.loadGraph = true;
          }, 5000);

          console.log("response save feeling", response);
        },
        (error: TrackHttpError) => {
          this.showSpinner = false;
          this.modalIsActive = false;
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          console.log("error save feeling", error);
        }
      );
  }

  next() {
    if (this.selectedCategory == this.subcategories.feeling) {
      this.selectedCategory = this.subcategories.body;
    } else if (this.selectedCategory == this.subcategories.body) {
      this.selectedCategory = this.subcategories.habits;
    } else if (this.selectedCategory == this.subcategories.habits) {
      this.save();
    }
  }

  get buttonText() {
    if (this.selectedCategory != this.subcategories.habits) {
      return "SIGUIENTE";
    } else {
      return "GUARDAR";
    }
  }

  sendAnaliticsQuestionsResponse(questions: any) {
    if (questions["q13"] !== null && questions["q13"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSTR_BTN, questions["q13"]);
    if (questions["q12"] !== null && questions["q12"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSTD_BTN, questions["q12"]);
    if (questions["q17"] !== null && questions["q17"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSCM_BTN, questions["q17"]);
    if (questions["q15"] !== null && questions["q15"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSSC_BTN, questions["q15"]);
    if (questions["q18"] !== null && questions["q18"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSSE_BTN, questions["q18"]);
    if (questions["q16"] !== null && questions["q16"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSIS_BTN, questions["q16"]);
    if (questions["q20"] !== null && questions["q20"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSST_BTN, questions["q20"]);
    if (questions["q14"] !== null && questions["q14"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSEA_BTN, questions["q14"]);
    if (questions["q27"] !== null && questions["q27"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSVM_BTN, questions["q27"]);
    if (questions["q07"] !== null && questions["q07"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_TEF_BTN, questions["q07"]);
    if (questions["q01"] !== null && questions["q01"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_CTBS_BTN, questions["q01"]);
    if (questions["q06"] !== null && questions["q06"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSIA_BTN, questions["q06"]);
    if (questions["q08"] !== null && questions["q08"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SAOE_BTN, questions["q08"]);
    if (questions["q04"] !== null && questions["q04"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_IDDV_BTN, questions["q04"]);
    if (questions["q11"] !== null && questions["q11"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SSLE_BTN, questions["q11"]);
    if (questions["q10"] !== null && questions["q10"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_DF_BTN, questions["q10"]);
    if (questions["q19"] !== null && questions["q19"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SCS_BTN, questions["q19"]);
    if (questions["q05"] !== null && questions["q05"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_ISSA_BTN, questions["q05"]);
    if (questions["q26"] !== null && questions["q26"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_CVMF_BTN, questions["q26"]);
    if (questions["q21"] !== null && questions["q21"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_HEMR_BTN, questions["q21"]);
    if (questions["q22"] !== null && questions["q22"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_TAS_BTN, questions["q22"]);
    if (questions["q17"] !== null && questions["q17"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_SES_BTN, questions["q17"]);
    if (questions["q24"] !== null && questions["q24"] !== undefined)
      this.gaService.trackEvent(AnaliticEvents.ME_CSFMF_BTN, questions["q24"]);
  }

  async showConfirmAddMessageSaved() {
    await this.modalService.showConfirmAddMessage("feeling");
  }
}
