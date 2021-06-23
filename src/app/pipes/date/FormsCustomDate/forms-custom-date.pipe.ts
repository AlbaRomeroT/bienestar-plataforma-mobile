import { Pipe, PipeTransform } from "@angular/core";
import { DatePipe } from "@angular/common";
import * as moment from "moment";

@Pipe({
  name: "formsCustomDate",
})
export class FormsCustomDatePipe extends DatePipe implements PipeTransform {
  transform(value: any, args?: any) {
    let date = moment(value);
    date.locale("es");

    let display = ` ${date.format("D \\d\\e MMMM, h:mm a")}`;
    return display;
  }
}
