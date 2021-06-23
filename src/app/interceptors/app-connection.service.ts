import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { BehaviorSubject, Observable } from "rxjs";
import { filter, switchMap, take, tap } from "rxjs/operators";
import { ComponentMessageService } from "../services/component-message.service";
import { ConnectionService } from "ng-connection-service";
import { AuthService } from "../services/auth.service";

import { JwtHelperService } from "@auth0/angular-jwt";
const helper = new JwtHelperService();

@Injectable({
  providedIn: "root",
})
export class AppConnectionService implements HttpInterceptor {
  isConnected: boolean;
  isRefreshing: boolean = false;
  refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _componentMessageService: ComponentMessageService,
    private _connectionService: ConnectionService,
    private _authService: AuthService
  ) {
    //se inicializa por primera vez el estado de la conexi\u00f3n..
    this.isConnected = window.navigator.onLine;
    //se suscribe al monitor que verifica el estado de la conexi\u00f3n..
    this._connectionService.monitor().subscribe((connectionState) => {
      this.isConnected = connectionState;
      console.log(`Estado conexi\u00f3n ${this.isConnected}`);
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!this.isConnected) {
      this.notConnected();
      return;
    }

    let token = localStorage.getItem("token-node");
    let isTokenExpired = false;

    if (token) {
      isTokenExpired = helper.isTokenExpired(
        localStorage.getItem("token-node")
        );
    }

    if (!this.isRefreshing && isTokenExpired) {
      return this.handledExpirationToken(request, next);
    }

    if (token) {
      request = this.addToken(request, token);
    }

    return next.handle(request).pipe(
      tap(
        (response) => {
          this._activatedRoute.queryParams
            .pipe(filter((params) => params.pathReturn))
            .subscribe(async (params) => {
              //se mandan los parametros de la pagina del Blog..
              await this._componentMessageService.sendObjectMessage(params);
            });
        },
        (error: HttpErrorResponse) => {
          console.log(error);
        }
      )
    );
  }

  addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  notConnected() {
    //si se esta generando el error desde una pagina de Blog..
    if (this._router.url.toString().includes("blog-details")) {
      this._router.navigate(["/not-connection"], {
        queryParams: { isBlogError: true },
      });
    } else if (this._router.url.toString().includes("terms")) {
      this._router.navigate(["/not-connection"], {
        queryParams: { isTermsError: true },
      });
    } else if (this._router.url.toString().includes("policies")) {
      this._router.navigate(["/not-connection"], {
        queryParams: { isPoliciesError: true },
      });
    } else if (this._router.url.toString().includes("home")) {
      this._router.navigate(["/not-connection"], {
        queryParams: { home: true },
      });
    } else {
      this._router.navigate(["/not-connection"])
    }
  }

  handledExpirationToken(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this._authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.isRefreshing = false;
          console.log("REFRESHED TOKEN", response?.body?.token);
          this.refreshTokenSubject.next(response?.body?.token);
          return next.handle( this.addToken(request, response?.body?.token) )
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }
}
