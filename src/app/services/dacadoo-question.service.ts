import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { environment } from "@environments/environment";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

import { DacadooQuestionResponse } from "@app/interfaces/dacadoo-question.interface";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";

@Injectable({
  providedIn: "root",
})
export class DacadooQuestionService {
  constructor(private http: HttpClient) {}

  getByCategory(
    category: string
  ): Observable<DacadooQuestionResponse | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/health/questions/${category}`;

    return this.http
      .get<AppHttpResponse<DacadooQuestionResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  saveFeeling(
    category: string,
    questions: any
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/health/questions/update/${category}`;

    return this.http
      .post<null>(url, questions)
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
}
