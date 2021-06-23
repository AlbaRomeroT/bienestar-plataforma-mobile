import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "mapOptions",
})
export class MapOptionsPipe implements PipeTransform {
  transform(value, args: string[]): unknown {
    let keysObject = [];
    for (let object of value) {
      for (let key of Object.keys(object)) {
        console.log(`key ${key} - value ${object[key]}`);
        keysObject.push({ key: key, value: object[key] });
      }
    }
    return keysObject;
  }
}
