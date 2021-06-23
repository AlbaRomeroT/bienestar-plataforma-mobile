import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  Route,
  UrlSegment,
} from "@angular/router";

import { AuthService } from "../services/auth.service";
import { CanLoad } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad, CanActivate {
  constructor(private authService: AuthService, public router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    var isLogged = await this.authService.isLogged();
    var profile = await this.authService.profile();
    var view_terms = Number(localStorage.getItem("view-terms"));

    if (view_terms == 1) {
      return;
    }

    if (!profile.documentType) {
      this.authService.logout();
      isLogged = false;
    }

    if (!isLogged) {
      this.router.navigate(["login"]);
      return false;
    }

    return true;
  }

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    var isLogged = await this.authService.isLogged();

    if (!isLogged) {
      this.router.navigate(["login"]);
      return false;
    }

    return true;
  }
}
