import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decimal'
})
export class DecimalPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    if(typeof(value) == "number") {
      return ((value * 100) | 0) / 100
    }
    return null;
  }

}
