import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";
import { LifestyleService } from "@app/services/lifestyle.service";
import { DacadooQuestions } from "../../interfaces/dacadoo-question.interface";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { ToastService } from "@app/services/toast.service";
import { MessageEnum } from "@app/enums/message-enum";
import { ModalService } from "@app/services/modal.service";

@Component({
  selector: "app-lifestyle-question",
  templateUrl: "./lifestyle-question.component.html",
  styleUrls: ["./lifestyle-question.component.scss"],
})
export class LifestyleQuestionComponent implements OnInit {
  public lifestyleSurveyQuestions: DacadooQuestions;
  @Output() messageEvent = new EventEmitter<string>();
  public modalIsActive: boolean = false;
  constructor(
    private lifestyle: LifestyleService,
    private gaService: GoogleAnalyticsService,
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.getLifestyleSurveyQuestions();
  }

  getLifestyleSurveyQuestions() {
    this.lifestyle.getLifestyleSurveyQuestions().subscribe((response) => {
      this.lifestyleSurveyQuestions = response as DacadooQuestions;
      console.log(this.lifestyleSurveyQuestions);
    });
  }

  buildDacadooResponse(): string {
    var response: string = "{";
    console.log(this.lifestyleSurveyQuestions);
    for (var item in this.lifestyleSurveyQuestions) {
      if (
        this.lifestyleSurveyQuestions[item].id == "exerciseLevel" &&
        this.lifestyleSurveyQuestions[item].value != ""
      )
        this.gaService.trackEvent(
          AnaliticEvents.MEV_EJ_SNE_BTN +
            this.lifestyleSurveyQuestions[item].value
        );
      else if (
        this.lifestyleSurveyQuestions[item].id == "alcohol" &&
        this.lifestyleSurveyQuestions[item].value != ""
      )
        this.gaService.trackEvent(
          AnaliticEvents.MEV_AL_SNAL_BTN +
            this.lifestyleSurveyQuestions[item].value
        );
      else if (
        this.lifestyleSurveyQuestions[item].id == "coffee" &&
        this.lifestyleSurveyQuestions[item].value != ""
      )
        this.gaService.trackEvent(
          AnaliticEvents.MEV_CA_STC_BTN +
            this.lifestyleSurveyQuestions[item].value
        );
      else if (
        this.lifestyleSurveyQuestions[item].id == "diet" &&
        this.lifestyleSurveyQuestions[item].value != ""
      )
        this.gaService.trackEvent(
          AnaliticEvents.MEV_PD_SPD_BTN +
            this.lifestyleSurveyQuestions[item].value
        );
      if (this.lifestyleSurveyQuestions[item].id == "smoking") {
        response +=
          '"' +
          [this.lifestyleSurveyQuestions[item].questions[0].id] +
          '":' +
          this.lifestyleSurveyQuestions[item].questions[0].value +
          ",";
        this.gaService.trackEvent(
          AnaliticEvents.MEV_FU_SFU_BTN +
            this.lifestyleSurveyQuestions[item].questions[0].value
        );
        response +=
          '"' +
          [this.lifestyleSurveyQuestions[item].questions[1].id] +
          '":' +
          this.lifestyleSurveyQuestions[item].questions[1].value +
          ",";
      } else if (this.lifestyleSurveyQuestions[item].id == "diet") {
        response +=
          '"custom":{"' +
          [this.lifestyleSurveyQuestions[item].id] +
          '":"' +
          this.lifestyleSurveyQuestions[item].value +
          '"}';
      } else {
        response +=
          '"' +
          [this.lifestyleSurveyQuestions[item].id] +
          '":' +
          this.lifestyleSurveyQuestions[item].value +
          ",";
      }
    }
    console.log(response);
    return response.concat("}");
  }

  save() {
    this.gaService.trackEvent(AnaliticEvents.MEV_GU_BTN);
    var questions = this.buildDacadooResponse();

    this.modalIsActive = true;

    //Conexion a dacadoo
    this.lifestyle.saveLifestyleSurveyQuestions(questions).subscribe(
      (response) => {
        console.log("response save lifestyle", response);
        this.modalIsActive = false;
        this.showConfirmAddMessageSaved();
        this.messageEvent.emit();
      },
      (error: TrackHttpError) => {
        this.modalIsActive = false;
        console.log("error save lifestyle", error);
      }
    );
  }

  async showConfirmAddMessageSaved() {
    await this.modalService.showConfirmAddMessage("lifestyle");
  }
}
