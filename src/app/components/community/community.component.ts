import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-community",
  templateUrl: "./community.component.html",
  styleUrls: ["./community.component.scss"],
})
export class CommunityComponent implements OnInit {
  @Input() title: string = "Interactúe con amigos";
  @Input() description: string = "Comparta sus intereses y propósitos.";

  constructor() {}

  ngOnInit() {}
}
