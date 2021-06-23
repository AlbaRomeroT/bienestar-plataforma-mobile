import { Component, OnInit, Input, AfterViewInit } from "@angular/core";
import { BlogService } from "../../services/blog.service";
import { ActivatedRoute } from "@angular/router";
import { filter } from "rxjs/operators";
import { BlogPost } from "@app/models/blog-post";
@Component({
  selector: "app-blog-details",
  templateUrl: "./blog-details.page.html",
  styleUrls: ["./blog-details.page.scss"],
})
export class BlogDetailsPage implements OnInit, AfterViewInit {
  @Input()
  public pathReturn: string = "/";
  public htmlBlog: string;
  private idBlog: string;
  public titleBackButton: string;
  public title: string;
  private data: string;

  constructor(private blogService: BlogService, private route: ActivatedRoute) {
    this.titleBackButton = "Para mí";
  }
  ngAfterViewInit(): void {
    this.initApp();
  }

  ngOnInit() {
    this.initApp();
  }

  initApp(){
    this.getQueryParams();
    this.getIdBlog();
    this.getTitle();
    this.getBlog();
  }

  getQueryParams() {
    this.route.queryParams
      .pipe(filter((params) => params.pathReturn))
      .subscribe((params) => {
        this.pathReturn = params.pathReturn;
      });
  }

  getIdBlog() {
    this.route.queryParams
      .pipe(filter((params) => params.idBlog))
      .subscribe((params) => {
        this.idBlog = params.idBlog;
        this.getBlog();
      });
  }

  getTitle() {
    this.route.queryParams
      .pipe(filter((params) => params.title))
      .subscribe((params) => {
        this.title = params.title;
      });
  }

  getBlog() {
    this.route.queryParams
      .pipe(filter((params) => params.data))
      .subscribe((params) => {
        this.data = params.data;
      });
   // this.blogService.getBlog(this.idBlog).subscribe((response: BlogPost) => {
    //this.htmlBlog = response.content.rendered;
    this.htmlBlog = this.data;
    this.htmlBlog = this.replaceAll(
      this.htmlBlog,
      'src="https://s.w.org/images/core/emoji/12.0.0-1/svg/1f517.svg" alt="🔗"',
      ""
    );
    this.htmlBlog = this.replaceAll(
      this.htmlBlog,
      'src="https://s.w.org/images/core/emoji/11.2.0/svg/1f517.svg" alt="🔗"',
      ""
    );
    var patt = new RegExp('height="[0-9][0-9][0-9]"');
    this.htmlBlog = this.htmlBlog.split(patt).join('height="auto"');
    this.htmlBlog = this.htmlBlog.replace(
      'src="https://s.w.org/images/core/emoji/12.0.0-1/svg/1f49a.svg" alt="💚"',
      'src="https://s.w.org/images/core/emoji/12.0.0-1/svg/1f49a.svg" alt="💚" width="14"'
    );
    this.htmlBlog = this.htmlBlog.replace(
      'src="https://s.w.org/images/core/emoji/12.0.0-1/svg/1f4f2.svg" alt="📲"',
      'src="https://s.w.org/images/core/emoji/12.0.0-1/svg/1f4f2.svg" alt="📲" width="14"'
    );
    this.htmlBlog = this.htmlBlog.replace(
      'src="https://s.w.org/images/core/emoji/13.0.1/svg/1f49a.svg" alt="💚"',
      'src="https://s.w.org/images/core/emoji/13.0.1/svg/1f49a.svg" alt="💚" width="14"'
    );
    //var elemH2 = document.querySelector("h2");
    //elemH2.style.lineHeight = "2.2";
    //var elemH3 = document.querySelector("h3");
    //elemH3.style.lineHeight = "2.2";
    //var elemP = document.querySelector("p");
    //elemP.style.lineHeight = "2.2";
  //  });
  }

  replaceAll(str, find, replace) {
    var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    return str.replace(new RegExp(escapedFind, "g"), replace);
  }

  clean() {
    this.htmlBlog = "";
  }
}
