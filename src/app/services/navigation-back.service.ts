import { Injectable } from "@angular/core";
import { Router, Event, NavigationEnd } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class NavigationBackService {
  history: string[] = ["/home"];
  notHistoryPages: string[] = ["/not-connection"];

  constructor(private router: Router) {
    this.router.events?.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        console.log("history event => ", event.urlAfterRedirects);

        // Hide loading indicator
        if (event.urlAfterRedirects == "/home") {
          this.history = ["/home"];
        }

        if (this.notIncludePagesInHistory(event.urlAfterRedirects)) {
          this.history.push(event.urlAfterRedirects);
        }

        console.log("history => ", this.history);
      }
    });
  }

  initialize() {
    if(this.history.length <= 0){
      this.history = ["/home"];
    }
  }

  notIncludePagesInHistory(url: string): boolean {
    var lastPage = "";
    if (this.history.length > 0) {
      lastPage = this.history[this.history.length - 1];
    }

    lastPage = lastPage.split("?")[0];
    let baseUrl = url.split("?")[0];

    return baseUrl != lastPage && !this.notHistoryPages.includes(baseUrl);
  }

  back(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.router.navigateByUrl(this.history[this.history.length - 1]);
    } else {
      this.router.navigateByUrl("/");
    }
  }

  revertTo(path: string): void {
    var length = this.history.length - 1;
    for (var i = length; i >= 0; i--) {
      var lastPage = this.history[i].split("?")[0].split(";")[0];
      if (lastPage == path) {
        this.history.splice(i + 1);
        break;
      }
    }
    this.history.pop();
  }

  backNow(): void {
    if (this.history.length > 0) {
      this.router.navigateByUrl(this.history[this.history.length - 1]);
    } else {
      this.router.navigateByUrl("/");
    }
  }
}
