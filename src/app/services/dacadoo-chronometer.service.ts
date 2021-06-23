import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class DacadooChronometerService {
  constructor(private http: HttpClient) {}

  saveIntercalsActivity(data: any) {
    console.log(data);

    let url = `${environment.bienestarUrlApi}/bienestar/activity/addActivities`;
    return this.http.post(url, data);
  }
}
