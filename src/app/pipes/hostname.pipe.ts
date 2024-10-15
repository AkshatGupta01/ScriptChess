import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hostname'
})
export class HostnamePipe implements PipeTransform {

  transform(value: string): string {
    try {
      return new URL(value).hostname;
    } catch{
      return value;
    }
    
  }

}
