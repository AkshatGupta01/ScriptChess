import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moveComment'
})
export class MoveCommentPipe implements PipeTransform {

  transform(value: string, ...args: string[]): string {
    if(value && typeof(value) == "string") {
      value = value.split("null").join(" ")
      value = value.split("}").join("")
      value = value.split(")").join("")
      value = value.split("{").join("")
      value = value.split("(").join("")
      value = value.split("  ").join("")
      
    }
    return value;
  }

}
