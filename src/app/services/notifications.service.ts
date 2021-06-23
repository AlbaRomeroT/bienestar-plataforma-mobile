import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ResponseDTO } from "@app/interfaces/response.interface";
import { environment } from "@environments/environment";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NotificationsService {
  bienestarUrlApi: string = environment.bienestarUrlApi;
  public hasNewNotification: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private route: Router) {
    this.hasNewNotification = new BehaviorSubject(false);
  }

  getHistoryUserNotifications(): Observable<ResponseDTO> {
    return this.http
      .get<ResponseDTO>(`${this.bienestarUrlApi}/bienestar/all-notifications`)
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

  private interval: any;
  checkNewNotifications() {
    this.interval = setInterval(async () => {
      this.http
        .get<any>(`${this.bienestarUrlApi}/bienestar/all-notifications`)
        .subscribe((response) => {
          if (response.body.data.length > 0) {
            var lastMessage = response.body.data[0];
            this.http
              .get<any>(
                `${this.bienestarUrlApi}/bienestar/all-notifications/check-message/${lastMessage.object.id}`
              )
              .subscribe((response) => {
                if (!response.body.seen) {
                  this.hasNewNotification.next(true);
                }
              });
          }
        });
    }, 60000);
  }

  public clearNewNotification() {
    this.hasNewNotification.next(false);
  }

  checkAllNotificationAsSeen() {
    let url = `${this.bienestarUrlApi}/bienestar/all-notifications/clean-messages`;
    return this.http.post(url, {});
  }
}
