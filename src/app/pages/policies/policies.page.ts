import { Component, OnInit, Input } from "@angular/core";
import { BlogService } from "../../services/blog.service";
import { BlogPost } from "../../models/blog-post";
import { ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-policies",
  templateUrl: "./policies.page.html",
  styleUrls: ["./policies.page.scss"],
})
export class PoliciesPage implements OnInit {
  @Input()
  public pathReturn: string = "/";

  public htmlPolicies: string;

  constructor(
    private blogService: BlogService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.getPolicies();
    this.getQueryParams();
  }

  getQueryParams() {
    this.route.queryParams
      .pipe(filter((params) => params.pathReturn))
      .subscribe((params) => {
        this.pathReturn = params.pathReturn;
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
