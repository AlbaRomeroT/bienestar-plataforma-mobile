import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "@environments/environment";

@Component({
  selector: "app-history-widget-container",
  templateUrl: "./history-widget-container.page.html",
  styleUrls: ["./history-widget-container.page.scss"],
})
export class HistoryWidgetContainerPage implements OnInit {
  docNumber: string;
  env: string;
  showComponent = false;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.env = environment.qrenv;
    this.activatedRoute.params.subscribe(
      (params) => (this.docNumber = params["docNumber"])
    );
  }

  ionViewDidEnter() {
    this.showComponent = true;
  }

  ionViewDidLeave() {
    this.showComponent = false;
  }

  onHistoryWidgetEvent(evt: string): void {
    console.log("history event", evt);
    if (
      evt === "history-widget:return" ||
      evt === "history-widget:generate-qr"
    ) {
      this.router.navigate(["/"]);
    }
  }
}
