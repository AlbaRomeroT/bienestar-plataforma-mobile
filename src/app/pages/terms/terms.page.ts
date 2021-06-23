import { Component, OnInit, Input } from "@angular/core";
import { BlogService } from "../../services/blog.service";
import { BlogPost } from "../../models/blog-post";
import { ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-terms",
  templateUrl: "./terms.page.html",
  styleUrls: ["./terms.page.scss"],
})
export class TermsPage implements OnInit {
  @Input()
  public pathReturn: string = "/";

  public htmlTerms: string;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getTerms();
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParams
      .pipe(filter((params) => params.pathReturn))
      .subscribe((params) => {
        this.pathReturn = params.pathReturn;
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
