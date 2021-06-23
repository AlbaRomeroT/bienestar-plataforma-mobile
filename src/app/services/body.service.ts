import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { Body, BodyMeasureSave } from "@app/models/body";
import { map, catchError } from "rxjs/operators";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import {
  DacadooQuestionResponse,
  DacadooQuestions,
  DacadooQuestion,
} from "@app/interfaces/dacadoo-question.interface";
import { MessageEnum } from "@app/enums/message-enum";
import { ToastService } from "./toast.service";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class BodyService {
  private serviceUrlBody: string = `${environment.bienestarUrlApi}/bienestar/body`;
  private serviceUrlQuestions: string = `${environment.bienestarUrlApi}/bienestar/health/questions`;

  private ind_tsc = 38.6875;
  private ind_hdl = 38.75;
  private ind_ldl = 38.6666;
  private ind_tgl = 88.6666;
  private ind_fbg = 18;
  private ind_cbg = 18;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  getBody(): Observable<Body> {
    return this.http.get<AppHttpResponse<Body>>(this.serviceUrlBody).pipe(
      map((response: AppHttpResponse<Body>) => {
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
          return this.mapResponseBodyData(response);
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

  saveBody(body: Body): Observable<Body> {
    body.height = body.height ? body.height / 100 : body.height;
    body.waist = body.waist ? body.waist / 100 : body.waist;
    body.tsc = body.tsc ? body.tsc / this.ind_tsc : body.tsc;
    body.hdl = body.hdl ? body.hdl / this.ind_hdl : body.hdl;
    body.ldl = body.ldl ? body.ldl / this.ind_ldl : body.ldl;
    body.tgl = body.tgl ? body.tgl / this.ind_tgl : body.tgl;
    body.fbg = body.fbg ? body.fbg / this.ind_fbg : body.fbg;
    body.cbg = body.cbg ? body.cbg / this.ind_cbg : body.cbg;

    return this.http.post<null>(this.serviceUrlBody, body).pipe(
      map((response: AppHttpResponse<Body>) => {
        if (response.hasErrors) {
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          return null;
        } else {
          return this.mapResponseBodyData(response);
        }
      }),
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

  updateBodyMeasure(bodyMeasure: BodyMeasureSave) {
    var url = `${environment.bienestarUrlApi}/bienestar/healthindex/save`;
    return this.http.post<null>(url, bodyMeasure).pipe(
      map((response: AppHttpResponse<Body>) => {
        if (response.hasErrors) {
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          return null;
        }
        this.toastService.showMessage(MessageEnum.SUCCESS_SAVE);
        return response;
      }),
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

  updateBodyMeasureNoMessage(
    bodyMeasure: BodyMeasureSave
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/healthindex/save`;

    return this.http
      .post<null>(url, bodyMeasure)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  private handleHttpError(
    error: HttpErrorResponse
  ): Observable<TrackHttpError> {
    console.log("ERROR => ", error);
    let dataError = new TrackHttpError();
    dataError.friendlyMessage = "Un error a ocurrido obteniendo los datos.";
    return throwError(dataError);
  }

  mapResponseBodyData(response: AppHttpResponse<Body>): Body {
    response.body.height = response.body.height
      ? this.roundDecimal(response.body.height * 100, 2)
      : response.body.height; // meter to centimeters
    response.body.waist = response.body.waist
      ? this.roundDecimal(response.body.waist * 100, 2)
      : response.body.waist; // meter to centimeters
    response.body.tsc = response.body.tsc
      ? this.roundDecimal(response.body.tsc * this.ind_tsc, 2)
      : response.body.tsc; // Colesterol mmol/L to mg/dL
    response.body.hdl = response.body.hdl
      ? this.roundDecimal(response.body.hdl * this.ind_hdl, 2)
      : response.body.hdl; // Colesterol Bueno mmol/L to mg/dL
    response.body.ldl = response.body.ldl
      ? this.roundDecimal(response.body.ldl * this.ind_ldl, 2)
      : response.body.ldl; // Colesterol Malo mmol/L to mg/dL
    response.body.tgl = response.body.tgl
      ? this.roundDecimal(response.body.tgl * this.ind_tgl, 2)
      : response.body.tgl; // Trigliceridos mmol/L to mg/dL
    response.body.fbg = response.body.fbg
      ? this.roundDecimal(response.body.fbg * this.ind_fbg, 2)
      : response.body.fbg; // Glucosa ayunas mmol/L to mg/dL
    response.body.cbg = response.body.cbg
      ? this.roundDecimal(response.body.cbg * this.ind_cbg, 2)
      : response.body.cbg; // Glucosa continua mmol/L to mg/dL
    return response.body;
  }

  roundDecimal(num: any, decimals: number) {
    let numRegexp = new RegExp("\\d\\.(\\d){" + decimals + ",}"); // Expresion regular para numeros con un cierto numero de decimales o mas
    if (numRegexp.test(num)) {
      // Ya que el numero tiene el numero de decimales requeridos o mas, se realiza el redondeo
      return Number(num.toFixed(decimals));
    } else {
      return Number(num.toFixed(decimals)) === 0 ? 0 : num; // En valores muy bajos, se comprueba si el numero es 0 (con el redondeo deseado), si no lo es se devuelve el numero otra vez.
    }
  }

  getBodySurveyQuestions(): Observable<DacadooQuestions> {
    return this.http
      .get<AppHttpResponse<DacadooQuestionResponse>>(
        `${this.serviceUrlQuestions}/anamneses`
      )
      .pipe(
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
            if (
              response.body.questionList &&
              response.body.questionList.HIPERTENSION
            ) {
              response.body.questionList.HIPERTENSION.forEach((element) => {
                if (
                  element.id == "pht" &&
                  element.value !== "" &&
                  element.value !== undefined &&
                  element.value !== null
                ) {
                  element.value = isNaN(element.value)
                    ? element.value
                    : parseInt(element.value);
                }
              });
            }
            return response.body.questionList;
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

  saveBodySurveyQuestions(dacadooQuestions: DacadooQuestions): Observable<any> {
    let questions: DacadooQuestion[] = dacadooQuestions.HEART.concat(
      dacadooQuestions.HIPERTENSION
    )
      .concat(dacadooQuestions.RENAL)
      .concat(dacadooQuestions.DIABETES);

    let body: any = {};
    questions.forEach((question) => {
      if (
        question.id !== null &&
        question.id !== undefined &&
        question.id !== "" &&
        question.value !== null &&
        question.value !== undefined &&
        question.value !== ""
      ) {
        body[question.id] =
          question.value === "true"
            ? true
            : question.value === "false"
            ? false
            : question.value;
      }
    });

    return this.http
      .post(`${this.serviceUrlQuestions}/update/anamneses`, body)
      .pipe(
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
