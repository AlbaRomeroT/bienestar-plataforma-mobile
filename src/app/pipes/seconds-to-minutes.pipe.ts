import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "secondsToMinutes",
})
export class SecondsToMinutesPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    var minutes = value / 60;
    return Math.floor(minutes % 60);
  }
}
