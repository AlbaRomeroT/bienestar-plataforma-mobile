import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "startswithArrayField",
})
export class StartswithArrayFieldPipe implements PipeTransform {
  transform(items: any[], value: string, field: string): any {
    if (!value || !field) return items;
    return items.filter((item) =>
      (item[field] as string).toLowerCase().startsWith(value.toLowerCase())
    );
  }
}
