import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { AppHttpResponse } from "@app/interfaces/app-http-response.interface";
import { map, catchError } from "rxjs/operators";
import { Move } from "@app/models/dacadoo/move";
import { environment } from "@environments/environment";
import { ResponseDTO } from "../interfaces/response.interface";

@Injectable({
  providedIn: "root",
})
export class DacadooMovesService {
  bienestarUrlApi: string = environment.bienestarUrlApi;

  constructor(private http: HttpClient) {}

  getLastUserActivities(): Observable<Move[]> {
    return this.http
      .get<AppHttpResponse<Move[]>>(
        `${this.bienestarUrlApi}/bienestar/activity/getLastActivitiesByUser`
      )
      .pipe(
        map((response: ResponseDTO) => {
          if (response.hasErrors) {
            return [];
          } else {
            return response.body.data;
          }
        }),
        catchError((error) => {
          console.log(error);
          return of([]);
        })
      );
  }
}
