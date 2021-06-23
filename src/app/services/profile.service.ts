import { environment } from "src/environments/environment";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { catchError, map } from "rxjs/operators";

import { Profile } from "@app/interfaces/profile.interface";
import {
  AppHttpResponse,
  TrackHttpError,
} from "@app/interfaces/app-http-response.interface";
import {
  DacadooProfile,
  DacadooProfileResponse,
} from "@app/interfaces/dacadoo-profile.interface";
import { ToastService } from "./toast.service";
import { MessageEnum } from "@app/enums/message-enum";
import * as CryptoJS from "crypto-js";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private http: HttpClient, private toastService: ToastService) {}

  get(email: string): Observable<Profile | TrackHttpError> {
    const url = `${environment.bienestarUrlApi}/profile/personal/email/${email}`;
    return this.http
      .get<AppHttpResponse<Profile>>(url)
      .pipe(catchError((error) => this.handleHttpError(error)));
  }

  update(profile: Profile) {
    profile.name?.trim();
    profile.lastName?.trim();

    const url = `${environment.bienestarUrlApi}/profile/personal/update`;
    return this.http.post<AppHttpResponse<Profile>>(url, profile).pipe(
      map(
        (res: AppHttpResponse<Profile>) => {
          return res;
        },
        (error) => {
          console.log("Se chuletió el registro");
        }
      ),
      catchError((err) => this.handleHttpError(err))
    );
  }

  public getProfile(id: string): Observable<DacadooProfile> {
    return this.http
      .get<AppHttpResponse<DacadooProfileResponse>>(
        `${environment.bienestarUrlApi}/bienestar/social/getUserProfile/${id}`
      )
      .pipe(
        map((response: AppHttpResponse<DacadooProfileResponse>) => {
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
            return response.body &&
              response.body.data &&
              response.body.data.length > 0
              ? response.body.data[0]
              : null;
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

  validDocument(document: string, tipo_doc): Observable<any> {
    const url = `${environment.bienestarUrlApi}/profile/personal/document/${document}/${tipo_doc}`;
    return this.http.get(url).pipe(
      map(
        (res: any) => {
          if (res.body != null) {
            let response = this.decrypRSA(res?.body?.encryptedData);
            res.body = response;
            return res;
          }
          return res;
        },
        (error: HttpErrorResponse) => {
          console.log(error.error);
        }
      )
    );
  }

  decrypRSA(encryptedData: string) {
    var base64EncodedKeyFromJava = environment.base64EncodedKeyFromJava;
    var keyForCryptoJS = CryptoJS.enc.Base64.parse(base64EncodedKeyFromJava);
    var encryptString = encryptedData; //"EgMyaE6tYjPBJQLMu7PMv3kls5sWVQfz0DRHv7tUMMZNgCxesVy1utb9mh2HvCotH+f5XTjM/vLKdivQETGAX4Ja+OTFylHd/coaaSE8Uq12eJ4ow3ke0IHZ+qC1BRxQNAFAYuEFkCtPrOAlAAJoZEvu1f8kn+Pm+3r3fHpFqVfEtwSRZTMTR0ue1kol7UpH3H7DbRnc2qJwmUtpQyhX8pKulJU7G/OGOU4CfPzcXu+2JcaeFhHY7nmT15V6qdcPqwglgjD6prrkN+LgJuO2YuQoF79iCkMY8VwrDQk9PfL+coIQmfnS9jbPKSTBzG3ZsuxuqtB7f6DtjT/p9SpZLlfkfxjwzOyZ7//nL20dMND5LH/tKo39vySNvCLfTCbVNWryL6pA6DU/B7/dKxcuAQo4SXTf8CpTMSu03SXyK1uZfex5/iA6tHECOY4tsfz8ZVyIX8bRESvNK7TGvq5QFRMpP/Y+e8Ow59ZtURQdRgHgzFv38nf5atIYAFM9YhLr/ycIAz1ysrv94WgFs37Tn/w589xNodpTKHf9IyuBAHM00mMqtLpzPF/KNwAW7mM9s2vRlEA2OWKiE+qSiw/J6M5Iwh7TWkD6zZKaG/JfxZU=" /* will be decrypted to '안녕하세요' */
    var decodeBase64 = CryptoJS.enc.Base64.parse(encryptString);
    var decryptedData = CryptoJS.AES.decrypt(
      {
        ciphertext: decodeBase64,
      },
      keyForCryptoJS,
      {
        mode: CryptoJS.mode.ECB,
      }
    );
    var decryptedText = decryptedData.toString(CryptoJS.enc.Utf8);
    return JSON.parse(String(decryptedText));
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
