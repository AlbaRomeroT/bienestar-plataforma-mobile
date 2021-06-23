import { environment } from "./../../environments/environment";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";

import { JwtHelperService } from "@auth0/angular-jwt";
import { LocalStorageService } from "./localStorage.service";
import { Profile } from "../interfaces/profile.interface";
import { HttpClient } from "@angular/common/http";
import { tap } from "rxjs/operators";

const helper = new JwtHelperService();

const TOKEN_KEY = "token-node";
const LOGIN_METHOD = "login-method";
const EMAIL_KEY = "email";
const NAME = "name";
const PROFILE = "profile";
const CURRENT_ACTIVITY = "currentActivity";
const INIT_TIME_ACT = "initTime";
const KEY_ACTIVITY = "keyActivity";
const NORM_ACTIVITY = "normActivity";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  constructor(
    private storageService: LocalStorageService,
    private http: HttpClient,
    private router: Router
  ) {}

  async isLogged(): Promise<boolean> {
    var token = (await this.storageService.get(TOKEN_KEY)) || "";
    return token.length > 0;
  }

  async loginMethod(): Promise<string> {
    var method = (await this.storageService.get(LOGIN_METHOD)) || "";
    return method;
  }

  async email(): Promise<string> {
    var email = (await this.storageService.get(EMAIL_KEY)) || null;
    return email;
  }

  async token(): Promise<string> {
    var token = (await this.storageService.get(TOKEN_KEY)) || "";
    return token;
  }

  async names(): Promise<string> {
    var names = (await this.storageService.get(NAME)) || null;
    return names;
  }

  async profile(): Promise<Profile> {
    var data = (await this.storageService.get(PROFILE)) || null;

    var profile: Profile = {};
    if (data) {
      profile = JSON.parse(data);
    }
    return profile;
  }

  async saveProfile(profile: Profile): Promise<void> {
    await this.storageService.set(PROFILE, JSON.stringify(profile));
  }

  async isTokenExpired() {
    return helper.isTokenExpired(await this.token());
  }

  async getUid() {
    console.log(helper.decodeToken(await this.token()));
    return helper.decodeToken(await this.token()).uid;
  }

  refreshToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    let url = `${environment.bienestarUrlApi}/autenticacion/refresh`;

    return this.http.post<any>(url, { token })
      .pipe(tap((response: any) => {

        if (response?.hasErrors) {
          console.log("ERROR => ", response)
          return;
        }

        if (response.body?.token) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.setItem(TOKEN_KEY, response.body?.token)
        }

      }, error => {
        console.log("ERROR => ", error);
      }));
  }

  async logout(): Promise<void> {
    await this.storageService.remove(TOKEN_KEY);
    await this.storageService.remove(LOGIN_METHOD);
    await this.storageService.remove(EMAIL_KEY);
    await this.storageService.remove(TOKEN_KEY);
    await this.storageService.remove(NAME);
    await this.storageService.remove(PROFILE);
    await this.storageService.remove(CURRENT_ACTIVITY);
    await this.storageService.remove(INIT_TIME_ACT);
    await this.storageService.remove(KEY_ACTIVITY);
    await this.storageService.remove(NORM_ACTIVITY);

    this.router.navigate(["/login"]);
  }
}

localStorage.removeItem("currentActivity");
localStorage.removeItem("initTime");
