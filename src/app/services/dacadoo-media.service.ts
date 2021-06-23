import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import { MediaFormat } from "@app/interfaces/media.interface";
import { environment } from "@environments/environment";
import { Observable, of } from "rxjs";
import { map, shareReplay } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class DacadooMediaService {
  private bienestarUrlApi: string = environment.bienestarUrlApi;

  private _cache = {};

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  getMediaContent(id: string, mediaFormat: MediaFormat): Observable<SafeUrl> {
    const url = `${this.bienestarUrlApi}/bienestar/media/${id}?type=${mediaFormat.type}`;
    if (this._cache[url]) {
      return of(this._cache[url]);
    } else {
      return this.http.get(url, { responseType: "blob" }).pipe(
        map((blob) => {
          const safeUrl = this.sanitizer.bypassSecurityTrustUrl(
            window.URL.createObjectURL(blob)
          );
          this._cache[url] = safeUrl;
          return safeUrl;
        }),
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
  }
}
