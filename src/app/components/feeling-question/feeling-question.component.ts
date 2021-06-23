import { Component, Input, OnInit } from "@angular/core";
import { DacadooQuestion } from "../../interfaces/dacadoo-question.interface";
import { GoogleAnalyticsService } from "../../services/google-analytics.service";
import { AnaliticEvents, GoogleEvent } from "../../enums/analitic-events";

export interface Analytics {
  id: string;
  description: string;
  googleEvent: GoogleEvent;
}

@Component({
  selector: "app-feeling-question",
  templateUrl: "./feeling-question.component.html",
  styleUrls: ["./feeling-question.component.scss"],
})
export class FeelingQuestionComponent implements OnInit {
  @Input() question: DacadooQuestion = {
    id: "",
    question: "",
    response: [{ min: 0, max: 10, default: 0 }],
  };

  analytic: Analytics = null;
  analyticRequiredList: Analytics[] = [
    {
      id: "q21",
      description: "ejercicio",
      googleEvent: AnaliticEvents.AN_HE_BTN,
    },
    {
      id: "q22",
      description: "vida sana",
      googleEvent: AnaliticEvents.AN_LVS_BTN,
    },
    {
      id: "q17",
      description: "estado salud",
      googleEvent: AnaliticEvents.AN_ESES_BTN,
    },
    {
      id: "q08",
      description: "ansiedad o estress",
      googleEvent: AnaliticEvents.AN_SAE_BTN,
    },
    {
      id: "q13",
      description: "como se siente hoy",
      googleEvent: AnaliticEvents.AN_CS_BTN,
    },
  ];

  constructor(private gaService: GoogleAnalyticsService) {}

  ngOnInit() {
    // Los valores llegan de 0 a 1 (0.1, 0.2, etc) se deben convertir a valores de 1 a 10
    this.question.response[0].min = 0;
    this.question.response[0].max = 10;

    // Se selecciona si requiere analitica
    this.analytic = this.analyticRequiredList.find(
      (x) => x.id === this.question.id
    );
  }

  async onChange() {
    if (!this.analytic) {
      return;
    }
    console.table(this.analytic);
    this.gaService.trackEvent(this.analytic.googleEvent, this.question.value);
  }
}
