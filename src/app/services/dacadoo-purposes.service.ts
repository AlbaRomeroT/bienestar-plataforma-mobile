import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { PurposeResponse } from "../interfaces/purpose.interface";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class DacadooPurposesService {
  constructor(private http: HttpClient) {}

  get(): Observable<AppHttpResponse<PurposeResponse[]> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/goals/getGoalsByUser`;

    return this.http
      .get<AppHttpResponse<PurposeResponse[]>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getByKey(
    key: string
  ): Observable<AppHttpResponse<PurposeResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/goals/getGoalById/${key}`;

    return this.http
      .get<AppHttpResponse<PurposeResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getAll(): Observable<AppHttpResponse<PurposeResponse[]> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/goals/allGoals`;

    return this.http
      .get<AppHttpResponse<PurposeResponse[]>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  addToUser(
    purposeKey: string
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/goals/addGoal/${purposeKey}`;

    return this.http
      .post<null>(url, null)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  removeToUser(
    purposeId: string
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/goals/deleteGoal/${purposeId}`;

    return this.http
      .delete<null>(url)
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
