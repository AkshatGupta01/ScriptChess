import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'showNumber'
})
export class ShowNumberPipe implements PipeTransform {

  transform(value: number): string {
    return value.toFixed(2);
  }

}
