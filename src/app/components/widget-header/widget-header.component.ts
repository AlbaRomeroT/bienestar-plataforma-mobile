import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-widget-header",
  templateUrl: "./widget-header.component.html",
  styleUrls: ["./widget-header.component.scss"],
})
export class WidgetHeaderComponent implements OnInit {
  @Input() title: string = "";
  @Input() cssClassTitle: string = "";
  @Input() cssClassContentTitle: string = "content-title";

  constructor() {}

  ngOnInit() {}
}
