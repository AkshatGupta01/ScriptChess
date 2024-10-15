import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moveIndexMoveNumber'
})
export class MoveIndexMoveNumberPipe implements PipeTransform {

  transform(value: number): string {
    if(value == 0)
      return ""
    let num = value % 2 == 0 ? (value /2) + ".." : (Math.floor(value /2) + 1) + "." ;
    return num;
  }

}
