import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MessageEnum } from "@app/enums/message-enum";
import {
  ActivityResponse,
  ActivityToSpanish,
} from "@app/interfaces/activity.interface";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import {
  DacadooProfile,
  DacadooProfileResponse,
} from "@app/interfaces/dacadoo-profile.interface";
import { ResponseData } from "@app/interfaces/response.interface";
import { UserActivityResponse } from "@app/interfaces/user-activity.interface";
import { FriendsResponse } from "@app/models/friendsResponse";
import { HealthScoreResponse } from "@app/models/health-score";
import { environment } from "@environments/environment";
import { Observable, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { ToastService } from "./toast.service";

@Injectable({
  providedIn: "root",
})
export class FriendService {
  bienestarUrlApi: string = environment.bienestarUrlApi;

  constructor(private http: HttpClient, private toastService: ToastService) {}

  public getFriendResquests(pageSize: number): Observable<FriendsResponse> {
    return this.http
      .get<AppHttpResponse<FriendsResponse>>(
        `${environment.bienestarUrlApi}/bienestar/friends/getFriendRequest/${pageSize}`
      )
      .pipe(
        map((response: AppHttpResponse<FriendsResponse>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return of(null);
        })
      );
  }

  public getFriendResquestsNext(next: string): Observable<FriendsResponse> {
    let body = {
      nextUrl: next.replace("https://", ""),
    };

    return this.http
      .post<AppHttpResponse<FriendsResponse>>(
        `${environment.bienestarUrlApi}/bienestar/friends/getNextFriendRequest`,
        body
      )
      .pipe(
        map((response: AppHttpResponse<FriendsResponse>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return of(null);
        })
      );
  }

  public getSendFriendResquests(): Observable<FriendsResponse> {
    return this.http
      .get<AppHttpResponse<FriendsResponse>>(
        `${environment.bienestarUrlApi}/bienestar/friends/getSendFriendRequest`
      )
      .pipe(
        map((response: AppHttpResponse<FriendsResponse>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          //this.toastService.showMessage(MessageEnum.ERROR_GET, null, null, 'top', 'danger');
          return of(null);
        })
      );
  }

  public getFriends(pageSize: number): Observable<FriendsResponse> {
    return this.http
      .get<AppHttpResponse<FriendsResponse>>(
        `${environment.bienestarUrlApi}/bienestar/friends/${pageSize}`
      )
      .pipe(
        map((response: AppHttpResponse<FriendsResponse>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return of(null);
        })
      );
  }

  public getFriendsNext(next: string): Observable<FriendsResponse> {
    let body = {
      nextUrl: next.replace("https://", ""),
    };

    return this.http
      .post<AppHttpResponse<FriendsResponse>>(
        `${environment.bienestarUrlApi}/bienestar/friends/next`,
        body
      )
      .pipe(
        map((response: AppHttpResponse<FriendsResponse>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return of(null);
        })
      );
  }

  public searchPeople(
    filterText: string,
    pageSize: number
  ): Observable<ResponseData<DacadooProfile[]>> {
    return this.http
      .get<AppHttpResponse<ResponseData<DacadooProfile[]>>>(
        `${environment.bienestarUrlApi}/bienestar/friends/search/${filterText}/${pageSize}`
      )
      .pipe(
        map((response: AppHttpResponse<ResponseData<DacadooProfile[]>>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return of(null);
        })
      );
  }

  public searchPeopleNext(
    next: string
  ): Observable<ResponseData<DacadooProfile[]>> {
    let body = {
      nextUrl: next.replace("https://", ""),
    };

    return this.http
      .post<AppHttpResponse<ResponseData<DacadooProfile[]>>>(
        `${environment.bienestarUrlApi}/bienestar/friends/searchNextFriend`,
        body
      )
      .pipe(
        map((response: AppHttpResponse<ResponseData<DacadooProfile[]>>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return of(null);
        })
      );
  }

  public sendFriendRequest(id: string): Observable<any> {
    return this.http
      .post<AppHttpResponse<ResponseData<any>>>(
        `${environment.bienestarUrlApi}/bienestar/friends/sendFriendRequest`,
        { id: id }
      )
      .pipe(
        map((response: AppHttpResponse<ResponseData<any>>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return false;
          } else {
            return true;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          return of(false);
        })
      );
  }

  public handlerFirendRequest(
    status: "accepted" | "rejected",
    relation: string
  ): Observable<any> {
    var requestRelation = relation.replace("https://", "");

    return this.http
      .post<AppHttpResponse<ResponseData<any>>>(
        `${environment.bienestarUrlApi}/bienestar/friends/handlerFirendRequest`,
        { status: status, relation: requestRelation }
      )
      .pipe(
        map((response: AppHttpResponse<ResponseData<any>>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return false;
          } else {
            return true;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_SAVE,
            null,
            null,
            "top",
            "danger"
          );
          return of(false);
        })
      );
  }

  public getNextUserActivities(
    nextUrl: string
  ): Observable<AppHttpResponse<UserActivityResponse> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/social/getActivities/next`;

    let body = {
      url: nextUrl.replace("https://", ""),
    };

    return this.http
      .post<null>(url, body)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public getActivitiesByUserId(
    id: string
  ): Observable<AppHttpResponse<UserActivityResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getActivities/${id}`;

    return this.http
      .get<AppHttpResponse<ActivityResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public getHealthScoreByUserId(
    id: string
  ): Observable<AppHttpResponse<HealthScoreResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getUserHealthScore/${id}`;

    return this.http
      .get<AppHttpResponse<HealthScoreResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public getProfileByUserId(
    id: string
  ): Observable<AppHttpResponse<DacadooProfileResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getUserProfile/${id}`;

    return this.http
      .get<AppHttpResponse<DacadooProfileResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public getNextActivities(
    nextUrl: string
  ): Observable<AppHttpResponse<ActivityResponse> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/social/getActivities/next`;

    let body = {
      url: nextUrl.replace("https://", ""),
    };

    return this.http
      .post<null>(url, body)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public getActivities(): Observable<
    AppHttpResponse<ActivityResponse> | TrackHttpError
  > {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getFriendsActivities`;

    return this.http
      .get<AppHttpResponse<ActivityResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public getTranslateActivities(): Observable<ActivityToSpanish[]> {
    return this.http.get<ActivityToSpanish[]>(
      "assets/activities/activities-translates.json"
    );
  }

  private handleHttpError(
    error: HttpErrorResponse
  ): Observable<TrackHttpError> {
    console.log("ERROR => ", error);
    let dataError = new TrackHttpError();
    dataError.friendlyMessage = "Un error a ocurrido obteniendo los datos.";
    return throwError(dataError);
  }

  public getCommentsAndLikes(
    id: string
  ): Observable<AppHttpResponse<DacadooProfileResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getCommentsAndLikes/${id}`;

    return this.http
      .get<AppHttpResponse<DacadooProfileResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public addLike(
    id: string
  ): Observable<AppHttpResponse<DacadooProfileResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/addLike`;

    return this.http
      .post<AppHttpResponse<FriendsResponse>>(url, { moveId: id })
      .pipe(
        map((response: AppHttpResponse<FriendsResponse>) => {
          if (response.hasErrors) {
            //this.toastService.showMessage(response.errors[0].errorDescription, null, null, 'top', 'danger');
            return null;
          } else {
            return response;
          }
        }),
        catchError((error) => {
          console.log(error);
          //this.toastService.showMessage(MessageEnum.ERROR_GET, null, null, 'top', 'danger');
          return of(null);
        })
      );
  }

  public getActivityLikes(
    id: string
  ): Observable<AppHttpResponse<DacadooProfileResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getActivityLikes/${id}`;

    return this.http
      .get<AppHttpResponse<DacadooProfileResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public getActivityComments(
    id: string
  ): Observable<AppHttpResponse<DacadooProfileResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getActivityComments/${id}`;

    return this.http
      .get<AppHttpResponse<DacadooProfileResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  public addComment(
    id: string,
    comment: string
  ): Observable<AppHttpResponse<DacadooProfileResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/addComment`;

    return this.http
      .post<AppHttpResponse<FriendsResponse>>(url, {
        moveId: id,
        comment: comment,
      })
      .pipe(
        map((response: AppHttpResponse<FriendsResponse>) => {
          if (response.hasErrors) {
            this.toastService.showMessage(
              response.errors[0].errorDescription,
              null,
              null,
              "top",
              "danger"
            );
            return null;
          } else {
            return response.body;
          }
        }),
        catchError((error) => {
          console.log(error);
          this.toastService.showMessage(
            MessageEnum.ERROR_GET,
            null,
            null,
            "top",
            "danger"
          );
          return of(null);
        })
      );
  }

  public isLike(
    id: string
  ): Observable<AppHttpResponse<DacadooProfileResponse> | TrackHttpError> {
    var url = `${environment.bienestarUrlApi}/bienestar/social/getTagMadeByUser/${id}`;

    return this.http
      .get<AppHttpResponse<DacadooProfileResponse>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  removeLike(id: string): Observable<AppHttpResponse<any> | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/bienestar/social/deleteTag/${id}`;

    return this.http
      .delete<null>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }
}
