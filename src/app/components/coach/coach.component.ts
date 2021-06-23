import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-coach",
  templateUrl: "./coach.component.html",
  styleUrls: ["./coach.component.scss"],
})
export class CoachComponent implements OnInit {
  @Input() title: string = "Recomendaciones";
  @Input() description: string = "Reciba apoyo para cumplir sus objetivos.";

  constructor() {}

  ngOnInit() {}
}
