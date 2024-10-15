import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'date'
})
export class DatePipe implements PipeTransform {

  transform(value: any, ...args: string[]): string {
    let date = null;
    if(typeof(value) == 'string' || typeof(value) == 'number') {
      date = new Date(value);
    } else {
      date = value;
    }
    let month = date.getMonth() + 1;
    if(month < 10) {
      return date.getFullYear() + "-0" + month + "-" + (date.getDate() > 10 ? date.getDate() : "0" + date.getDate());
    } else {
      return date.getFullYear() + "-" + month + "-" + (date.getDate() > 10 ? date.getDate() : "0" + date.getDate());
    }

  }

}
