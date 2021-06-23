import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "numberSign",
})
export class NumberSignPipe implements PipeTransform {
  transform(value: any, args?: any): string {
    let number = value as number;    
    if (typeof number !== "number") {
      return "";
    }
    
    if(args){
    if (number > 0) {
      return "+";
    } else if (number < 0) {
      return "-";
    }
    return "";
  }

    if (number > 0) {
      return "+" + number.toFixed(2);
    } else if (number < 0) {
      return "" + number.toFixed(2);
    }
    return "0";
  }
}
