import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "activityKcal",
})
export class ActivityKcalPipe implements PipeTransform {
  constructor() {}

  async transform(energy: number) {
    let value = energy / 4184;
    return value;
  }
}
