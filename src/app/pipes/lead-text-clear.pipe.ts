import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "leadTextClear",
})
export class LeadTextClearPipe implements PipeTransform {
  transform(text: string, args?: any): string {
    if (!text) return null;
    return text.slice(text.lastIndexOf("]") + 1);
  }
}
