import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'moveCount'
})
export class MoveCountPipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    value = value % 2 == 0 ? value /2 : (value /2) + 1 ;
    return value.toString().split(".")[0]
  }

}
