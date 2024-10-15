import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'urlSanitizer'
})
export class UrlSanitizerPipe implements PipeTransform {

  transform(value: string): string {
    return encodeURI(value.split("/").join("-"));
  }

}
