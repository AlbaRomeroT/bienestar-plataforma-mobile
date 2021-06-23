import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "backgroundUriSanitizer",
})
export class BackgroundUriSanitizer implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(url: string): any {
    const domImg = `${url}`;

    return this.domSanitizer.bypassSecurityTrustStyle(domImg);
  }
}
