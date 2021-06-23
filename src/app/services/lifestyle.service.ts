import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { AppHttpResponse } from "@app/interfaces/app-http-response.interface";
import {
  DacadooQuestionResponse,
  DacadooQuestions,
} from "@app/interfaces/dacadoo-question.interface";
import { MessageEnum } from "@app/enums/message-enum";
import { ToastService } from "./toast.service";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class LifestyleService {
  constructor(private http: HttpClient, private toastService: ToastService) {}

  getLifestyleSurveyQuestions(): Observable<DacadooQuestions> {
    var url = `${environment.bienestarUrlApi}/bienestar/health/questions/lifestyles`;
    return this.http.get<AppHttpResponse<DacadooQuestionResponse>>(url).pipe(
      map((response: AppHttpResponse<DacadooQuestionResponse>) => {
        if (response.hasErrors) {
          this.toastService.showMessage(
            response.errors[0].errorDescription,
            null,
            null,
            "top",
            "danger"
          );
          return null;
        } else {
          return response.body.questionList.exercise
            .concat(response.body.questionList.alcohol)
            .concat(response.body.questionList.coffee)
            .concat(response.body.questionList.smoke)
            .concat(response.body.questionList.food);
        }
      }),
      catchError((error) => {
        console.log(error);
        this.toastService.showMessage(
          MessageEnum.ERROR_GET,
          null,
          null,
          "top",
          "danger"
        );
        return of(null);
      })
    );
  }

  saveLifestyleSurveyQuestions(dacadooQuestions: any): Observable<any> {
    var url = `${environment.bienestarUrlApi}/bienestar/health/questions/update/lifestyles`;
    return this.http.post(url, JSON.parse(dacadooQuestions)).pipe(
      catchError((error) => {
        console.log(error);
        this.toastService.showMessage(
          MessageEnum.ERROR_SAVE,
          null,
          null,
          "top",
          "danger"
        );
        return of(null);
      })
    );
  }
}
