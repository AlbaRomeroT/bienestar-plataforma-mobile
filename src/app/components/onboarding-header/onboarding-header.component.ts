import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-onboarding-header",
  templateUrl: "./onboarding-header.component.html",
  styleUrls: ["./onboarding-header.component.scss"],
})
export class OnboardingHeaderComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  async goToHome() {
    await this.router.navigate(["home"]);
  }
}
