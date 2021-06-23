import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import {
  PersonalInfo,
  ProfessionalInfo,
  FamiliyInfo,
} from "../../../interfaces/user/profile/user.interface";
import { ResponseDTO } from "@app/interfaces/response.interface";
import { environment } from "@environments/environment";
import { catchError, map } from "rxjs/operators";
import { LocalStorageService } from "@app/services/localStorage.service";
import { ProfileService } from "@app/services/profile.service";
import { DacadooUpdateNameDTO } from '@app/pages/user/profile/profile.interfaces';

@Injectable({
  providedIn: "root",
})
export class ProfileServiceUser {
  /*
    headers
  */
  private httpHeaders = new HttpHeaders({ "Content-Type": "application/json" });

  constructor(
    private http: HttpClient,
    private localStorage: LocalStorageService,
    private profileService: ProfileService
  ) {}

  /**
   * Retorna la informaci\u00f3n del usuario autenticado actualmente.
   **/
  private getUserFromLocalStorage(): string {
    let email = localStorage.getItem("email");
    return email?.toString().toLowerCase();
  }

  private getCompanyFromLocalStorage(): string {
    return localStorage.getItem("nombre-empresa");
  }

  /**
   * Obtiene la informaci\u00f3n personal del usuario de la sesi\u00f3n actual.
   */
  public getPersonalInfo(): Observable<ResponseDTO> {
    let userEmail = this.getUserFromLocalStorage();
    return this.http
      .get<ResponseDTO>(
        `${environment.bienestarUrlApi}/profile/personal/email/${userEmail}`
      )
      .pipe(
        map((res) => {
          let response = this.profileService.decrypRSA(
            res?.body?.encryptedData
          );
          res.body = response;
          if (res.body?.date === "") {
            res.body.date = null;
          }
          return res;
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

  /**
   * Actualiza la informaci\u00f3n de la pestania Info personal de (Mi Perfil)
   * @param personalInfo instancia ProfessionalInfo
   */
  public updatePersonalInfo(personalInfo: PersonalInfo): Observable<any> {
    console.log(`Updating: ${personalInfo}`);
    let url = `${environment.bienestarUrlApi}/profile/personal/update`;
    console.log(url);
    return this.http
      .post<ResponseDTO>(`${url}`, personalInfo, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
          if (e.error.mensaje !== undefined) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  /**
   * Actualiza la informaci\u00f3n de la pestania Info profesional de (Mi Perfil)
   * @param professionalInfo instancia ProfessionalInfo
   */
  public updateProfessionalInfo(
    professionalInfo: ProfessionalInfo
  ): Observable<any> {
    professionalInfo.email = this.getUserFromLocalStorage();
    console.log(`Updating: ${professionalInfo}`);
    return this.http
      .post<ResponseDTO>(`${environment.bienestarUrlApi}`, professionalInfo, {
        headers: this.httpHeaders,
      })
      .pipe(
        catchError((e) => {
          if (e.error.mensaje !== undefined) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }

  /**
   * Actualiza el nombre de la persona en Dacadoo
   * @param dacadooUpdateName
   * @returns Observable 
   */
  public updateNameDacadoo(dacadooUpdateName: DacadooUpdateNameDTO): Observable<any> {
    console.log(`Updating: ${dacadooUpdateName}`);
    let url = `${environment.bienestarUrlApi}/bienestar/auth/updateName`;
    console.log(url);
    return this.http
      .post<ResponseDTO>(`${url}`, dacadooUpdateName, { headers: this.httpHeaders })
      .pipe(
        catchError((e) => {
          if (e.error.mensaje !== undefined) {
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
  }
}
