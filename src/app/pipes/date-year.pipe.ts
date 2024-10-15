import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateYear'
})
export class DateYearPipe implements PipeTransform {

  transform(value: string): unknown {
    if(value)
      return new Date(value).getFullYear();
    else
      return "?"
  }

}
