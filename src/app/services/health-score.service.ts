import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { HealthScore, HealthScoreResponse } from "@app/models/health-score";
import { AppHttpResponse } from "@app/interfaces/app-http-response.interface";
import { map, catchError, retry, take } from "rxjs/operators";
import { environment } from "@environments/environment";

@Injectable({
  providedIn: "root",
})
export class HealthScoreService {
  constructor(private http: HttpClient) {}

  getHealthScoreHistorical(): Observable<HealthScore[]> {
    var url = `${environment.bienestarUrlApi}/bienestar/healthindicator`;

    return this.http.get<AppHttpResponse<HealthScoreResponse>>(url).pipe(
      map((response: AppHttpResponse<HealthScoreResponse>) => {
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

  getHealthScore(): Observable<HealthScore[]> {
    var url = `${environment.bienestarUrlApi}/bienestar/healthindex`;

    return this.http.get<AppHttpResponse<HealthScore[]>>(url).pipe(
      map((response: AppHttpResponse<HealthScore[]>) => {
        if (response.hasErrors) {
          return [];
        } else {
          return response.body;
        }
      }),
      catchError((error) => {
        return of([]);
      })
    );
  }
}
