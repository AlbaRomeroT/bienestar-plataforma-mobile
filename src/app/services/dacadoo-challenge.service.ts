import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import { ChallengeResponse } from "@app/interfaces/challenge.interface";
import { environment } from "@environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { ChallengeRankingResponse } from "@app/interfaces/challenge-ranking";

@Injectable({
  providedIn: "root",
})
export class DacadooChallengeService {
  constructor(private http: HttpClient) {}

  getById(
    id: string
  ): Observable<AppHttpResponse<ChallengeResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/challenge/get-challenge-by-id/${id}`;

    return this.http
      .get<AppHttpResponse<ChallengeResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getByUser(): Observable<
    AppHttpResponse<ChallengeResponse[]> | TrackHttpError
  > {
    var url = `${environment.bienestarUrlApi}/bienestar/challenge/get-user-challenges`;
    return this.http
      .get<AppHttpResponse<ChallengeResponse[]>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getAll(): Observable<AppHttpResponse<ChallengeResponse[]> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/challenge/get-available-challenges`;

    return this.http
      .get<AppHttpResponse<ChallengeResponse[]>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  addToUser(
    challengeId: string
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/challenge/join-user-challenge/${challengeId}`;

    return this.http
      .post<null>(url, null)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  removeToUser(
    challengeId: string
  ): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/challenge/delete-challenge/${challengeId}`;

    return this.http
      .delete<null>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getRankingByChallenge(
    id: string
  ): Observable<AppHttpResponse<ChallengeRankingResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/challenge/get-ranking-by-challenge/${id}`;

    return this.http
      .get<AppHttpResponse<ChallengeRankingResponse>>(url)
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
