import { Component, Input, OnInit } from "@angular/core";
import { BlogPost } from "@app/models/blog-post";
import { BlogService } from "@app/services/blog.service";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "terms-page",
  templateUrl: "./terms.component.html",
  styleUrls: ["./terms.component.scss"],
})
export class TermsModal implements OnInit {
  @Input()
  public pathReturn: string = "/";
  public htmlTerms: string;
  constructor(
    private _modalCtrl: ModalController,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.getTerms();
  }

  dismiss() {
    this._modalCtrl.dismiss({
      dismissed: true,
    });
  }

  getTerms() {
    if (!this.htmlTerms) {
      this.blogService.getTerms().subscribe((response: BlogPost) => {
        this.htmlTerms = response.content.rendered;
      });
    }
  }
}
