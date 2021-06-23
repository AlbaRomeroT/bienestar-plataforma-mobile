import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { Activity } from "@app/models/dacadoo/activity";
import { AppHttpResponse } from "@app/interfaces/app-http-response.interface";
import { catchError, map } from "rxjs/operators";
import { environment } from "@environments/environment";
import { ResponseDTO } from "../interfaces/response.interface";

@Injectable({
  providedIn: "root",
})
export class DacadooCatalogsService {
  bienestarUrlApi: string = environment.bienestarUrlApi;

  constructor(private http: HttpClient) {}

  getActivities(next?: string): Observable<Activity[]> {
    return this.http
      .get<AppHttpResponse<Activity[]>>(
        `${this.bienestarUrlApi}/bienestar/activity`
      )
      .pipe(
        map((response: ResponseDTO) => {
          if (response.hasErrors) {
            return [];
          } else {
            return response.body.data.sort((a, b) =>
              a.name > b.name ? 1 : -1
            );
          }
        }),
        catchError((error) => {
          console.log(error);
          return of([]);
        })
      );
  }
}
