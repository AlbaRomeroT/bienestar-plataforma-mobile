import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "inputSuffix",
})
export class InputSuffixPipe implements PipeTransform {
  transform(value: any, ...args: unknown[]): unknown {
    return isNaN(value) ? `0 ${args}` : `${value} ${args}`;
  }
}
