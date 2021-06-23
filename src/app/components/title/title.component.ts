import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-title",
  templateUrl: "./title.component.html",
  styleUrls: ["./title.component.scss"],
})
export class TitleComponent implements OnInit {
  @Input("cssClass") cssClass: string;
  @Input("text") text: string;

  constructor() {}

  ngOnInit() {
    this.cssClass = this.cssClass ? this.cssClass : "text";
  }
}
