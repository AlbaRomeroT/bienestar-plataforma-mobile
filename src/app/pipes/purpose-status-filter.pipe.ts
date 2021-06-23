import { Pipe, PipeTransform } from "@angular/core";
import { Purpose } from "@app/interfaces/purpose.interface";

@Pipe({
  name: "purposeStatusFilter",
})
export class PurposeStatusFilterPipe implements PipeTransform {
  transform(purposes: Purpose[], status: string): any {
    if (!purposes) return purposes;

    //check if completed is undefined
    if (!status) return purposes;

    var completed = true;
    if (status == "actives") {
      completed = false;
    }

    return purposes.filter((x) => x.completed == completed);
  }
}
