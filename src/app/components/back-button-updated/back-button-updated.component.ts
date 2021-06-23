import { Component, Input, OnInit } from "@angular/core";
import { NavigationBackService } from "@app/services/navigation-back.service";

@Component({
  selector: "app-back-button-updated",
  templateUrl: "./back-button-updated.component.html",
  styleUrls: ["./back-button-updated.component.scss"],
})
export class BackButtonUpdatedComponent implements OnInit {
  @Input() public segment: string = null;

  constructor(private navigationBackService: NavigationBackService) {}

  ngOnInit() {}

  back() {
    this.navigationBackService.back();
  }
}
