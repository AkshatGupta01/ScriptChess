import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getKeys'
})
export class GetKeysPipe implements PipeTransform {

  transform(value: unknown): string[] {
    if(value) {
      return Object.keys(value)
    }
    return null;
  }

}
