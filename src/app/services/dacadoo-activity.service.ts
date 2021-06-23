import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DacadooSportActivityResponse, DacadooManualSportActivityToSave } from './../interfaces/dacadoo-sport-activity.interface';
import { AppHttpResponse, TrackHttpError } from './../interfaces/app-http-response.interface';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DacadooActivityService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<DacadooSportActivityResponse | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/activity`;

    return this.http
      .get<AppHttpResponse<DacadooSportActivityResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  saveManualActivity(data: DacadooManualSportActivityToSave): Observable<AppHttpResponse<any> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/activity/addActivities`;

    return this.http
      .post<null>(url, data)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  private handleHttpError(
    error: HttpErrorResponse
  ): Observable<TrackHttpError> {
    console.log("ERROR => ", error);
    let dataError = new TrackHttpError();
    dataError.friendlyMessage = "Se presentó un error.. Intente nuevamente.";
    return throwError(dataError);
  }

}
