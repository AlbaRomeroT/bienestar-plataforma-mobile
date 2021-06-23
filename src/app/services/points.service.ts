import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AppHttpResponse, TrackHttpError } from '@app/interfaces/app-http-response.interface';
import { DacadooHistoryPointsResponse, PointsResponse } from '@app/interfaces/points.interface';
import { ToastService } from './toast.service';
import { MessageEnum } from '@app/enums/message-enum';


@Injectable({
  providedIn: 'root'
})
export class PointsService {

  constructor(private http: HttpClient, private toastService: ToastService) { }

  getTotalPoints(): Observable<PointsResponse[] | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/points/get-total-points`
    return this.http
    .get<AppHttpResponse<PointsResponse>>(url)
    .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getHistory(): Observable<AppHttpResponse<DacadooHistoryPointsResponse> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/points/get-points`;

    return this.http
      .get<AppHttpResponse<DacadooHistoryPointsResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getHistoryNext(next: string): Observable<AppHttpResponse<DacadooHistoryPointsResponse> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/points/next?${next}`;

    return this.http
      .get<AppHttpResponse<DacadooHistoryPointsResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getPointsByDate(date: string): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/points/get-total-points-by-date?date=${date}`;

    return this.http
      .get<AppHttpResponse<any>>(url)
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
