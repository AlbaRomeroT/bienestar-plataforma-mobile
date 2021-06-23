import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { ToastController, LoadingController, IonSlides } from "@ionic/angular";
import { HttpClient } from "@angular/common/http";
import { environment } from "@environments/environment";
import { Router } from "@angular/router";
import { AnaliticEvents } from "@app/enums/analitic-events";
import { GoogleAnalyticsService } from "@app/services/google-analytics.service";

@Component({
  selector: "app-blog",
  templateUrl: "./blog.component.html",
  styleUrls: ["./blog.component.scss"],
})
export class BlogComponent implements OnInit, AfterViewInit {
  @ViewChild("slides", { read: IonSlides }) slides: IonSlides;

  slideOpts = {
    initialSlide: 0,
    speed: 400,
    slidesPerView: 1,
    spaceBetween: 10,
    width: 260,
    autoplay: true,
  };

  //url = `${environment.blogUrl}/wp-json/bolivar-api/v2/bienestarbolivar/bienestar-bolivar`;
  url = `${environment.bienestarUrlApi}/bienestar/BlogAndTerms/getBienestarBlogPage`;
  bienestarUrlApi;
  items: any = [];
  page: any = 1;

  public titleHeaderBlog: string;
  public isProduction: boolean = false;

  constructor(
    public http: HttpClient,
    public toastCtrl: ToastController,
    public loadingController: LoadingController,
    private router: Router,
    private gaService: GoogleAnalyticsService
  ) {
    this.isProduction = environment.production;
    this.titleHeaderBlog = this.isProduction?"Para mí":"Artículos de Interés";
    this.loadPost(this.url, this.page, true);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.loadPost(this.url, this.page, true);
    }, 1000);
  }

  async loadPost(url: string, page: string, showLoading: any) {
    const route = this.url; //+ 'wp-json/wp/v2/posts?tags=54'
    if (!page) {
      page = "1";
    }
    return new Promise((resolve, reject) => {
      let concat: string;
      if (url.indexOf("?") > 0) {
        concat = "&";
      } else {
        concat = "?";
      }
      this.http.get(route).subscribe((data) => {
        this.items = data;
        this.items.forEach((value) => {
          if (value.featured_media && value.featured_media != 0) {
            this.loadImage(value);
          } else {
            value.urlImageResource =
              "https://prodsitesegurosbolivar.s3.amazonaws.com/blog/wp-content/uploads/2020/05/19153837/Covid-19-300x259.png";
          }
        });
      });
    });
  }

  loadImage(item: any) {
    this.http
      .get(this.url + "wp-json/wp/v2/media/" + item.featured_media)
      .subscribe((res: any) => {
        item.urlImageResource = res.media_details.sizes.medium.source_url;
      });
  }

  ngOnInit() {}

  goToBlogDetails(item) {
    this.gaService.trackEvent(AnaliticEvents.BI_CO_BTN);
    this.router.navigate(["blog-details"], {
      queryParams: {
        idBlog: item.id,
        pathReturn: "/home",
        title: item?.title,
        data: item?.content,
      },
    });
  }
}
