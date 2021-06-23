import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';

import { TrackHttpError, AppHttpResponse } from '../interfaces/app-http-response.interface';
import { catchError } from 'rxjs/operators';
import { Sleepinfo } from '../interfaces/sleep.interfase';

@Injectable({
  providedIn: 'root'
})
export class SleepActivityService {

  constructor(private http: HttpClient) { }

  saveActivity(sleepInfo: Sleepinfo): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/activity/addSleeps`;
    console.log("RQ => ", sleepInfo);
    return this.http
      .post<null>(url, sleepInfo)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  private handleHttpError(
    error: HttpErrorResponse
  ): Observable<TrackHttpError> {
    console.log("ERROR => ", error);
    let dataError = new TrackHttpError();
    dataError.friendlyMessage = "Un error a ocurrido almacenando los datos.";
    return throwError(dataError);
  }
}
