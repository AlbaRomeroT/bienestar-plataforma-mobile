import { Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";

@Pipe({
  name: "backgroudStyleSanitizer",
})
export class BackgroudStyleSanitizerPipe implements PipeTransform {
  constructor(private domSanitizer: DomSanitizer) {}

  transform(url: string): any {
    const domImg = `background-image: url('${url}')`;

    return this.domSanitizer.bypassSecurityTrustStyle(domImg);
  }
}
