import { Injectable } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import { Subscription } from "rxjs";
@Injectable({
  providedIn: "root",
})
export class NavigatorRouteServiceService {
  private _backUrl: string;
  private _currentUrl: string;
  private _previusPageUrl: string;
  private _subscriptionRouter: Subscription;
  constructor(private _router: Router) {
    this._currentUrl = this._router.url;
    this._subscriptionRouter = _router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        if (
          this._backUrl !== "/not-connection" &&
          this._currentUrl !== "/not-connection" &&
          event.url !== this._backUrl
        ) {
          this._previusPageUrl = this._backUrl;
        }
        if (
          this._backUrl !== undefined &&
          this._backUrl !== "/not-connection" &&
          this._currentUrl !== "/not-connection" &&
          event.url !== this._backUrl &&
          !this._backUrl.includes("isBlogError") &&
          !this._backUrl.includes("blog-details")
        ) {
          this._previusPageUrl = this._backUrl;
        }
        if (!this._currentUrl.includes("/not-connection")) {
          this._backUrl = this._currentUrl;
        }

        this._currentUrl = event.url;
      }
    });
  }
  destroySubscriptions() {
    this._subscriptionRouter.unsubscribe();
  }
  public getCurrentUrl(): string {
    return this._currentUrl;
  }
  public getBackUrl(): string {
    if (
      (this._backUrl !== undefined &&
        this._backUrl.includes("not-connection")) ||
      this._backUrl === undefined
    ) {
      return "/home";
    }
    return this._backUrl;
  }

  public getPreviusPageUrl(): string {
    if (
      (this._previusPageUrl !== undefined &&
        this._previusPageUrl.includes("not-connection")) ||
      this._previusPageUrl === undefined
    ) {
      return "/home";
    }
    return this._previusPageUrl;
  }

  public setBackUrl(backUrl: string) {
    this._backUrl = backUrl;
  }
}
