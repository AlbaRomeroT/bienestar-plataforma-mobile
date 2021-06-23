import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-purpose",
  templateUrl: "./purpose.component.html",
  styleUrls: ["./purpose.component.scss"],
})
export class PurposeComponent implements OnInit {
  @Input() title: string = "Mis propósitos";
  @Input() description: string =
    "Establezca nuevos objetivos. Le ayudarán a mejorar su salud y calidad de vida.";

  constructor() {}

  ngOnInit() {}
}
