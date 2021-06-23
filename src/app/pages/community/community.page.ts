import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-community",
  templateUrl: "./community.page.html",
  styleUrls: ["./community.page.scss"],
})
export class CommunityPage implements OnInit {
  reloading = false;
  public selectedTab: string = "friends";
  public title: string;

  constructor(private route: ActivatedRoute) {
    this.title = "Mi comunidad";
  }

  ngOnInit() {
    this.getQueryParams();
  }

  async ionViewDidEnter() {
    this.getQueryParams();
    this.reloading = true;
    setTimeout(() => {
      this.reloading = false;
    }, 1000);
  }

  getQueryParams() {
    this.route.queryParams.subscribe((params) => {
      if (params.segment) {
        this.selectedTab = params.segment;
        return;
      }
    });
  }
}
