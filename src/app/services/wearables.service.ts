import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { environment } from "@environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class WearablesService {
  constructor(private http: HttpClient) {}

  get(): Observable<any | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/connection/get-connections`;
    return this.http
      .get<AppHttpResponse<any>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getConnected(): Observable<any | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/connection/get-connections-by-user`;
    return this.http
      .get<AppHttpResponse<any>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  disconect(idConnection): Observable<any | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/connection/deleteConnection/${idConnection}`;
    return this.http
      .delete<AppHttpResponse<any>>(url)
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

  //pantalla de conexi\u00f3n
  createConnection(connectionId: string): Observable<any | TrackHttpError> {
    let url = `${environment.bienestarUrlApi}/bienestar/connection/create-connection/${connectionId}?appName=bolivarconmigo&page=post`;
    return this.http
      .post<any>(url, { connectionId })
      .pipe(
        tap(
          (response: any) => {
            if (response.body?.hasErrors) {
              console.log("ERROR => ", response);
              return;
            }
          },
          (error) => {
            console.log("createConnection => ", error);
            catchError((error) => this.handleHttpError(error));
          }
        )
      );
  }
}
