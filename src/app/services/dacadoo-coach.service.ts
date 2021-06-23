import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import {
  CoachChatResponse,
  CoachChatSave,
} from "@app/interfaces/coach-chat.interface";
import { environment } from "@environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DacadooCoachService {
  constructor(private http: HttpClient) {}

  counter = 0;

  getChat(): Observable<CoachChatResponse[] | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/chatBot/messages`;

    return this.http
      .get<AppHttpResponse<CoachChatResponse[]>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  getHistoryChat(): Observable<CoachChatResponse[] | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/chatBot/history`;

    return this.http
      .get<AppHttpResponse<CoachChatResponse[]>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  save(data: CoachChatSave): Observable<void | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/chatBot/messages`;

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
