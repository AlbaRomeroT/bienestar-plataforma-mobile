import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ResponseDTO } from "@app/interfaces/response.interface";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class ActivityService {
  bienestarUrlApi: string = environment.bienestarUrlApi;

  constructor(private http: HttpClient) {}

  getHistoryUserActivities(): Observable<ResponseDTO> {
    return this.http
      .get<ResponseDTO>(`${this.bienestarUrlApi}/bienestar/activity/activities`)
      .pipe(
        map((response) => {
          if (!response.hasErrors) {
            return response;
          }
        }),
        catchError((e) => {
          if (e.error !== undefined) {
            e.error.errors.forEach((element) => {
              console.log(element.errorCode);
            });
          }
          return throwError(e);
        })
      );
  }
}
