import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'cdnImage'
})
export class CdnImagePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {    
    if(value && value.length > 0) {
      value = value.replace(environment.imagePath, environment.cdnImagePath);
      return value;
    }
    return null;
    //return value;
  }

}
