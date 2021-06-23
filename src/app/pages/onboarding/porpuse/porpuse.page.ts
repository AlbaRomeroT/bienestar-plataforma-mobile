import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-porpuse",
  templateUrl: "./porpuse.page.html",
  styleUrls: ["./porpuse.page.scss"],
})
export class PorpusePage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  next(): void {
    this.router.navigate(["onboarding/green-button"]);
  }
}
