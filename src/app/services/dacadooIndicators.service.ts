import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { environment } from "@environments/environment";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { HealthIndicators } from "../interfaces/health-indicators.interface";

@Injectable({
  providedIn: "root",
})
export class DacadooIndicatorsService {
  constructor(private http: HttpClient) {}

  getByEmail(email: string): Observable<HealthIndicators | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/summary`;
    return this.http
      .get<AppHttpResponse<HealthIndicators>>(url)
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
