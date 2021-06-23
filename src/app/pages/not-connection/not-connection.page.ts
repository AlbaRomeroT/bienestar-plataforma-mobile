import { Component, OnInit } from "@angular/core";
import { NavigationBackService } from "../../services/navigation-back.service";

@Component({
  selector: "app-not-connection",
  templateUrl: "./not-connection.page.html",
  styleUrls: ["./not-connection.page.scss"],
})
export class NotConnectionPage implements OnInit {
  selectedBackgroundTryAgain: boolean = true;
  selectedBackgroundBackUrl: boolean = true;
  busy: boolean = false;

  constructor(
    private navigationBackService: NavigationBackService
  ) {}

  ngOnInit(): void {
  }

  public tryAgain(): void {
    this.busy = true;
    this.navigationBackService.backNow();
    setTimeout(() => {
      this.busy = false
    }, 600);
  }

  public backPreviusPage(): void {
    this.busy = true;
    var isOnline = window.navigator.onLine;
    if(!isOnline) {
      setTimeout(() => {
        this.busy = false
      }, 800);
      return;
    }

    this.navigationBackService.back();
    setTimeout(() => {
      this.busy = false
    }, 800);
  }
}
