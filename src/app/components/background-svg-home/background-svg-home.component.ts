import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-background-svg-home",
  templateUrl: "./background-svg-home.component.html",
  styleUrls: ["./background-svg-home.component.scss"],
})
export class BackgroundSvgHomeComponent implements OnInit {
  @Input("cssClass") cssClass: string;
  @Input("routeImage") routeImage: string =
    "assets/leitmotivs/leitmotiv-principal-page-wellness.svg";

  constructor() {}

  ngOnInit() {}
}
