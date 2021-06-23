import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "@environments/environment";

@Component({
  selector: "app-update-widget-container",
  templateUrl: "./update-widget-container.page.html",
  styleUrls: ["./update-widget-container.page.scss"],
})
export class UpdateWidgetContainerPage implements OnInit {
  docNumber: string;
  env = environment.qrenv;
  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {}

  ionViewDidEnter() {
    this.activatedRoute.params.subscribe(
      (params) => (this.docNumber = params["docNumber"])
    );
  }

  onUpdateWidgetEvent(evt: string): void {
    switch (evt) {
      case "update:back":
      case "update:finished":
        this.router.navigate(["/"]);
        break;
    }
  }
}
