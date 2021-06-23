import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-qrpass",
  templateUrl: "./qrpass.page.html",
  styleUrls: ["./qrpass.page.scss"],
})
export class QrpassPage implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  next(): void {
    this.router.navigate(["home"]);
  }
}
