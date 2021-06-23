import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanLoad,
  Route,
  UrlSegment,
} from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class IsLoggedGuard implements CanLoad {
  constructor(private authService: AuthService, public router: Router) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    var isLogged = await this.authService.isLogged();
    var method = await this.authService.loginMethod();

    //Es por que apenas se acabò de registrar y va ingresar datos adicionales
    if (isLogged && method === "register") {
      this.router.navigate(["addtional-data"]);
      return false;
    }

    if (isLogged) {
      this.router.navigate(["home"]);
      return false;
    }

    return true;
  }

  async canLoad(route: Route, segments: UrlSegment[]): Promise<boolean> {
    var isLogged = await this.authService.isLogged();

    if (isLogged) {
      this.router.navigate(["home"]);
      return false;
    }

    return true;
  }
}
