import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { TrackHttpError } from "@app/interfaces/app-http-response.interface";
import { environment } from "@environments/environment";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/internal/operators";
import { IHealthCard } from "../interfaces/health-card.interface";

@Injectable({
  providedIn: "root",
})
export class CarnetService {
  constructor(private http: HttpClient) {}

  get(
    documentType: string,
    document: string
  ): Observable<IHealthCard[] | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/comunes/carnet`;

    var data = {
      tipoDocumento: documentType,
      numeroDocumento: document,
    };

    return this.http
      .post<IHealthCard[]>(url, data)
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
