import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BlogPost } from "../models/blog-post";
import { Observable, of } from "rxjs";
import { TERMS } from "@assets/profile-data/data/getTerms.const";
import { POLICIES } from "@assets/profile-data/data/getPolicies.const";

@Injectable({
  providedIn: "root",
})
export class BlogService {
  getTerm = TERMS;
  getPolicie = POLICIES;

  constructor(private http: HttpClient) {}
  getTerms(): Observable<BlogPost> {
    return of(this.getTerm); //this.http.get<BlogPost>(environment.blogApiTerms);
  }
  getPolicies(): Observable<BlogPost> {
    return of(this.getPolicie); //this.http.get<BlogPost>(environment.blogApiPolicies);
  }
  getBlog(id) : Observable<BlogPost>  {
    return this.http.get<BlogPost>(environment.blogUrl+"wp-json/wp/v2/posts/"+id+"?_embed");
  }
}
