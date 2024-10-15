import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64'
})
export class Base64Pipe implements PipeTransform {

  transform(value: string): unknown {
    return btoa(value);
  }

}
