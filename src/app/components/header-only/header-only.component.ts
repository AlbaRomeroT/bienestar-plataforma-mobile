import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-header-only",
  templateUrl: "./header-only.component.html",
  styleUrls: ["./header-only.component.scss"],
})
export class HeaderOnlyComponent implements OnInit {
  @Input("cssClass")
  cssClass: string;

  constructor() {}

  ngOnInit() {}
}
