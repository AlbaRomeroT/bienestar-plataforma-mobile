import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "secondsToHours",
})
export class SecondsToHoursPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    return Math.floor(value / 3600);
  }
}
