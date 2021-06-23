import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { Profile } from "@app/interfaces/profile.interface";
import { environment } from "@environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class ProfileDataService {
  constructor(private http: HttpClient) {}

  saveProfessional(
    family: any
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/professional/info`;

    return this.http
      .post<null>(url, family)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getProfessional(
    email: string
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/professional/info/${email}`;

    return this.http
      .get<AppHttpResponse<any>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  saveFamily(family: any): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/family/info`;

    return this.http
      .post<null>(url, family)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getFamily(email: string): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/family/info/${email}`;

    return this.http
      .get<AppHttpResponse<any>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  saveProfile(profile: any): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/personal/update`;

    return this.http
      .post<null>(url, profile)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getProfile(
    email: string
  ): Observable<AppHttpResponse<Profile> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/personal/email/${email}`;

    return this.http
      .get<AppHttpResponse<Profile>>(url)
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
