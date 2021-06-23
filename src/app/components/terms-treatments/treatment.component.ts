import { Component, Input, OnInit } from "@angular/core";
import { BlogPost } from "@app/models/blog-post";
import { BlogService } from "@app/services/blog.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "treatments-page",
  templateUrl: "./treatments.component.html",
  styleUrls: ["./treatments.component.scss"],
})
export class TreatmentsModal implements OnInit {
  @Input()
  public pathReturn: string = "/logi";
  public htmlPolicies: string;
  constructor(
    private _modalCtrl_d: ModalController,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.getPolicies();
  }

  dismiss() {
    this._modalCtrl_d.dismiss({
      dismissed: true,
    });
  }

  getPolicies() {
    if (!this.htmlPolicies) {
      this.blogService.getPolicies().subscribe((response: BlogPost) => {
        this.htmlPolicies = response.content.rendered;
      });
    }
  }
}
